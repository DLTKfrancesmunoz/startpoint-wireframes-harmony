---
description: When building pattern pages from pattern markdown docs — every named item, component, label, and count in the Component Tree and Key Elements must appear in the built output exactly as specified. No simplification, no partial lists, no generic placeholders.
globs: ["src/patterns/**/*"]
alwaysApply: false
---

# Pattern page fidelity

When building a pattern page from a pattern markdown reference doc:

- **Shell is imported, not rebuilt.** Every pattern component imports the existing ShellLayout and renders its own instance with the props and slots configured for that pattern. Do not rebuild, reconvert, or duplicate the shell. One import, different configurations per pattern.
- **Named items are exact.** If the Component Tree or Key Elements lists specific items (e.g. "Board, Table, List, Calendar, Schedule, Gantt, Network graph"), every one of those items must appear in the built component with those exact labels. Do not use "Option 1, Option 2" or subset the list.
- **Counts are exact.** If the Component Tree shows 3 Dropdowns (Period, Project, Category), the output has 3 Dropdowns with those labels. Not 1 Dropdown labeled "Filter."
- **Required means required.** Every element marked Required = Yes in the Key Elements table must exist in the built component.
- **Components match the tree.** Every component listed in the Component Tree must have a corresponding element in the output.
- **Use design system components, not raw HTML.** If a component listed in the Component Tree exists in the Harmony library (`node_modules/@deltek/harmony-components/`), it must be converted and used — not a raw HTML substitute. If it's already converted in the project, import and use it. If it exists in Harmony but hasn't been converted yet, convert it now using `/convert-component` before building the pattern. Raw HTML styled with Harmony tokens is only acceptable when the component does not exist anywhere in the Harmony library.
- **Behaviors are wired.** If the pattern says "dismissible" chips, they have onRemove handlers. If it says "overflow handled by More (N) menu", there is conditional rendering for overflow. If it says "validates and saves; then closes", the dialog has validation and close-on-success logic.
- **No stubs, no placeholders, no simplified demos.** Use realistic demo data matching the pattern's domain.
- **Pre-flight is mandatory.** Before writing any code for a pattern, print the Component Tree contents, Required Key Elements, and named items. No code until pre-flight is output.
- **Verification is a hard gate.** After building a pattern page, you must produce a verification output block containing the results from both verifiers (layout-verifier and pattern-fidelity-verifier) before starting the next pattern. You cannot create the next pattern file until the current pattern's verification output block exists. No block = pattern is incomplete. Perform the verifier steps yourself using the instructions in `.cursor/agents/layout-verifier.md` and `.cursor/agents/pattern-fidelity-verifier.md`. Read each verifier file, follow its procedure, and write the output exactly as it specifies. Do not use MCP or MCP tools. "I cannot invoke another agent" is not a reason to skip — perform the steps yourself.
- **PASS requires proof.** A pattern can only be logged as PASS if the verification output block contains "PASS: zero deviations" from both verifiers. `npm run build` success is not verification. Code that "looks correct" is not verification.