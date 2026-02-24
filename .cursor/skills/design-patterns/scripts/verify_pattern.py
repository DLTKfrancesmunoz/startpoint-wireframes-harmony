#!/usr/bin/env python3
"""
Pattern Fidelity Verification Script

Mechanically checks a built page component against its pattern markdown.
Outputs failures the verifier agent includes verbatim — cannot be faked or skipped.

Usage:
    python verify_pattern.py --pattern .cursor/skills/design-patterns/reference/stepper-wizard.md \
                              --built src/patterns/StepperWizard.tsx \
                              --framework react

Frameworks: react (default), vue, svelte, angular
"""

import argparse
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Markdown parsing
# ---------------------------------------------------------------------------

# Words that appear in Component Trees but are not component names
NON_COMPONENTS = {
    'View', 'Board', 'Table', 'List', 'Calendar', 'Schedule', 'Gantt',
    'Network', 'Create', 'Assign', 'Back', 'Next', 'Submit', 'Cancel',
    'Save', 'Close', 'Yes', 'No', 'Step', 'Tab', 'Content', 'Data',
    'Default', 'Related', 'Main', 'Right', 'Left', 'Side', 'Top', 'Bottom',
    'Open', 'Close', 'Set', 'Add', 'Edit', 'Delete', 'Remove', 'Search',
    'Filter', 'Sort', 'Group', 'More', 'All', 'None', 'Current', 'New',
    'Upload', 'Import', 'Export', 'Share', 'Help', 'Info', 'Settings',
}

def parse_component_tree(content: str) -> dict:
    """
    Extract:
    - components: list of actual design system component names
    - or_groups: list of [A, B] meaning "A or B" (either satisfies)
    - named_items: comma-separated lists of 3+ specific labels (view options etc.)
    - counts: {ComponentName: N} explicit counts
    - raw: raw text
    """
    match = re.search(
        r'###\s+Component Tree\s*\n```[^\n]*\n(.*?)```',
        content, re.DOTALL
    )
    raw = match.group(1) if match else ""

    components = []
    or_groups = []
    seen = set()

    for line in raw.splitlines():
        clean = re.sub(r'^[│├└─\s]+', '', line).strip()
        if not clean:
            continue

        # Handle OR: "TabStrip or ButtonGroup"
        or_match = re.match(r'([A-Z][a-zA-Z0-9]+)\s+or\s+([A-Z][a-zA-Z0-9]+)', clean)
        if or_match:
            a, b = or_match.group(1), or_match.group(2)
            or_groups.append([a, b])
            # Don't add to required components list individually
            for t in [a, b]:
                seen.add(t)
            continue

        # Extract PascalCase tokens, skip non-components
        tokens = re.findall(r'\b([A-Z][a-zA-Z0-9]+)\b', clean)
        for token in tokens:
            if token not in NON_COMPONENTS and token not in seen and len(token) > 2:
                components.append(token)
                seen.add(token)

    # Named item lists (3+ comma-separated items after — or ( or :)
    # Only from explicit list notation, not inline component lists
    named_items = {}
    for m in re.finditer(
        r'(?:—|as\s+\(|:\s+\()([A-Z][a-zA-Z]+'
        r'(?:,\s*[A-Z][a-zA-Z /]+){2,})\)?',
        raw
    ):
        items = [i.strip().rstrip(')') for i in m.group(1).split(',') if i.strip()]
        if len(items) >= 3:
            key = items[0]
            named_items[key] = items

    # Explicit counts
    counts = {}
    for m in re.finditer(r'\b(\d+)\s+([A-Z][a-zA-Z]+)', raw):
        n = int(m.group(1))
        if n > 1:
            counts[m.group(2)] = n

    return {
        'components': components,
        'or_groups': or_groups,
        'named_items': named_items,
        'counts': counts,
        'raw': raw,
    }


def parse_key_elements(content: str) -> list:
    """Extract Required=Yes elements and their descriptions."""
    required = []
    table_match = re.search(
        r'###\s+Key Elements\s*\n(.*?)(?=\n##|\Z)',
        content, re.DOTALL
    )
    if not table_match:
        return required
    for line in table_match.group(1).splitlines():
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 3 and parts[1].lower() == 'yes':
            required.append({
                'element': parts[0],
                'description': parts[2] if len(parts) > 2 else ''
            })
    return required


def parse_named_labels(content: str) -> list:
    """Extract explicit named labels that must appear in the built file."""
    labels = set()

    tree_match = re.search(
        r'###\s+Component Tree\s*\n```[^\n]*\n(.*?)```',
        content, re.DOTALL
    )
    tree_raw = tree_match.group(1) if tree_match else ''

    # Named lists in parens after "as (" or after em-dash
    for m in re.finditer(
        r'(?:—|as\s+\(|:\s+\()([A-Z][a-zA-Z]+'
        r'(?:,\s*[A-Z][a-zA-Z /]+){1,})\)?',
        tree_raw
    ):
        for item in m.group(1).split(','):
            item = item.strip().rstrip(')')
            if item and len(item) > 1:
                labels.add(item)

    # From Key Elements descriptions — named lists of 3+ items
    key_match = re.search(
        r'###\s+Key Elements\s*\n(.*?)(?=\n##|\Z)',
        content, re.DOTALL
    )
    if key_match:
        for line in key_match.group(1).splitlines():
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) >= 3 and parts[1].lower() == 'yes':
                desc = parts[2]
                m = re.search(
                    r'([A-Z][a-zA-Z]+'
                    r'(?:,\s*[A-Z][a-zA-Z /]+){2,})',
                    desc
                )
                if m:
                    for item in m.group(1).split(','):
                        item = re.sub(r'\s*\(.*?\)', '', item).strip()
                        if item and item not in ('Yes', 'No', 'Required', 'Harmony'):
                            labels.add(item)

    # Standard action labels explicitly named
    for label in ['Back', 'Next', 'Submit', 'Cancel', 'Create', 'Assign', 'Close', 'Save']:
        if re.search(rf'\b{label}\b', content):
            labels.add(label)

    return sorted(labels)


# ---------------------------------------------------------------------------
# Built file checking
# ---------------------------------------------------------------------------

def _kebab(s):
    return re.sub(r"([A-Z])", r"-\1", s).lower().lstrip("-")

FRAMEWORK_COMPONENT_PATTERNS = {
    'react':   lambda c: [rf'<{c}[\s/>]', rf'<{c}>'],
    'vue':     lambda c: [
        rf'<{c}[\s/>]',
        r'<' + _kebab(c) + r'[\s/>]',
    ],
    'svelte':  lambda c: [rf'<{c}[\s/>]'],
    'angular': lambda c: [
        r'<' + _kebab(c) + r'[\s/>]',
        rf'<{c}[\s/>]',
    ],
}

RAW_HTML_MAP = {
    'Dialog':       ['<dialog', '<div role="dialog"'],
    'Input':        ['<input '],
    'Select':       ['<select '],
    'Dropdown':     ['<select '],
    'Table':        ['<table '],
    'Textarea':     ['<textarea '],
    'Checkbox':     ['<input type="checkbox"', "<input type='checkbox'"],
    'RadioButton':  ['<input type="radio"', "<input type='radio'"],
    'TabStrip':     ['<ul role="tablist"', '<div role="tablist"'],
}

# Key Element names that are descriptive phrases, not component names
# Map them to what to look for in the built file
ELEMENT_NAME_ALIASES = {
    'View options':   ['VIEW_OPTIONS', 'viewOptions', 'views', 'Board', 'TabStrip', 'ButtonGroup'],
    'Related chips':  ['Chip', 'related'],
    'Action buttons': ['Button', 'Create', 'Assign'],
    'Step content':   ['step', 'Step', 'content'],
    'Back':           ['Back'],
    'Next/Submit':    ['Next', 'Submit'],
}


def component_in_file(component: str, built: str, framework: str) -> bool:
    patterns = FRAMEWORK_COMPONENT_PATTERNS.get(framework, FRAMEWORK_COMPONENT_PATTERNS['react'])(component)
    return any(re.search(p, built) for p in patterns)


def raw_html_used(component: str, built: str) -> list:
    return [html for html in RAW_HTML_MAP.get(component, []) if html.lower() in built.lower()]


def label_in_file(label: str, built: str) -> bool:
    escaped = re.escape(label)
    return any(re.search(p, built) for p in [
        rf'"{escaped}"', rf"'{escaped}'", rf'>{escaped}<',
        rf'`{escaped}`', rf'\b{escaped}\b',
    ])


def element_in_file(el_name: str, desc: str, built: str, framework: str) -> bool:
    """Check if a Key Element (by name or aliases) is present in the built file."""
    # Direct component check
    if component_in_file(el_name, built, framework):
        return True
    # Direct label check
    if label_in_file(el_name, built):
        return True
    # Check aliases
    for alias in ELEMENT_NAME_ALIASES.get(el_name, []):
        if label_in_file(alias, built) or component_in_file(alias, built, framework):
            return True
    # Check description for a named component
    for token in re.findall(r'\b([A-Z][a-zA-Z0-9]+)\b', desc):
        if token not in NON_COMPONENTS and component_in_file(token, built, framework):
            return True
    return False


def count_component_occurrences(component: str, built: str, framework: str) -> int:
    patterns = FRAMEWORK_COMPONENT_PATTERNS.get(framework, FRAMEWORK_COMPONENT_PATTERNS['react'])(component)
    return sum(len(re.findall(p, built)) for p in patterns)


# ---------------------------------------------------------------------------
# Main verification
# ---------------------------------------------------------------------------

def verify(pattern_path: str, built_path: str, framework: str) -> tuple:
    failures = []
    warnings = []

    pattern_file = Path(pattern_path)
    built_file = Path(built_path)

    if not pattern_file.exists():
        failures.append(f"BLOCKED: Pattern file not found: {pattern_path}")
        return failures, warnings
    if not built_file.exists():
        failures.append(f"BLOCKED: Built file not found: {built_path}")
        return failures, warnings

    pattern_content = pattern_file.read_text(encoding='utf-8')
    built_content = built_file.read_text(encoding='utf-8')

    tree = parse_component_tree(pattern_content)
    required_elements = parse_key_elements(pattern_content)
    named_labels = parse_named_labels(pattern_content)

    # 1. Required components
    for component in tree['components']:
        if not component_in_file(component, built_content, framework):
            raw = raw_html_used(component, built_content)
            if raw:
                failures.append(
                    f"COMPONENT TREE: {component} — raw HTML substitute used ({', '.join(raw)}). "
                    f"Must use the design system component."
                )
            else:
                failures.append(
                    f"COMPONENT TREE: {component} — not found in built file"
                )

    # 2. OR groups (either satisfies, but one must be present)
    for group in tree['or_groups']:
        a, b = group
        a_found = component_in_file(a, built_content, framework)
        b_found = component_in_file(b, built_content, framework)
        if not a_found and not b_found:
            failures.append(
                f"COMPONENT TREE: {a} or {b} — neither found in built file (one is required)"
            )

    # 3. Exact counts
    for component, expected_count in tree['counts'].items():
        actual = count_component_occurrences(component, built_content, framework)
        if actual != expected_count:
            failures.append(
                f"COMPONENT TREE: {component} — expected exactly {expected_count}, found {actual}"
            )

    # 4. Named item lists (every item must appear)
    for key, items in tree['named_items'].items():
        missing = [item for item in items if not label_in_file(item, built_content)]
        if missing:
            found_count = len(items) - len(missing)
            failures.append(
                f"COMPONENT TREE: View options — {found_count}/{len(items)} present. "
                f"Missing: {', '.join(missing)}"
            )

    # 5. Named labels
    for label in named_labels:
        if not label_in_file(label, built_content):
            failures.append(
                f"NAMED LABEL: '{label}' — not found in built file"
            )

    # 6. Required Key Elements
    for el in required_elements:
        el_name = el['element']
        desc = el['description']

        if not element_in_file(el_name, desc, built_content, framework):
            failures.append(
                f"KEY ELEMENTS: '{el_name}' is Required — not found. Description: {desc}"
            )
        else:
            # Check description named lists
            m = re.search(
                r'([A-Z][a-zA-Z]+'
                r'(?:,\s*[A-Z][a-zA-Z /]+){2,})',
                desc
            )
            if m:
                desc_items = [
                    re.sub(r'\s*\(.*?\)', '', i).strip()
                    for i in m.group(1).split(',')
                    if i.strip() not in ('Yes', 'No', 'Harmony', '')
                ]
                missing = [i for i in desc_items if not label_in_file(i, built_content)]
                if missing:
                    failures.append(
                        f"KEY ELEMENTS: '{el_name}' present but missing required items from description: "
                        f"{', '.join(missing)}"
                    )

    # 7. Shell integration check
    if 'ShellPanel' in tree['raw'] or 'ShellLayout' in tree['raw']:
        if 'ShellLayout' not in built_content and 'ShellPanel' not in built_content:
            failures.append(
                "ANATOMY: Pattern requires ShellPanel/ShellLayout — neither imported in built file"
            )

    return failures, warnings


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description='Verify built pattern component against pattern markdown')
    parser.add_argument('--pattern', required=True, help='Path to pattern markdown file')
    parser.add_argument('--built', required=True, help='Path to built component file')
    parser.add_argument('--framework', default='react',
                        choices=['react', 'vue', 'svelte', 'angular'],
                        help='Target framework (default: react)')
    args = parser.parse_args()

    failures, warnings = verify(args.pattern, args.built, args.framework)

    print(f"\nPATTERN FIDELITY CHECK")
    print(f"  Pattern : {args.pattern}")
    print(f"  Built   : {args.built}")
    print(f"  Framework: {args.framework}")
    print(f"{'─' * 60}")

    if warnings:
        for w in warnings:
            print(f"  ⚠  {w}")

    if not failures:
        print("\nRESULT: PASS — zero mechanical deviations.")
        print("  Note: structural layout, behavior wiring, and anatomy")
        print("  still require agent verification.")
        return 0
    else:
        print(f"\nRESULT: {len(failures)} FAILURE(S)\n")
        for i, f in enumerate(failures, 1):
            print(f"  {i}. {f}")
        print()
        return 1


if __name__ == '__main__':
    sys.exit(main())
