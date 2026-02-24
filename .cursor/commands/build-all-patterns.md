# /build-all-patterns

Build all pattern pages: one page per pattern, each an independent shell instance with that single pattern fully implemented. Content patterns render in the content slot; shell-modifying patterns (drawers, toasts, panels, toolbars) configure the relevant shell regions. Runs dual verification (layout + fidelity) on each. Checkpoints every 5 for user review.

## Instructions

1. **User input.** The user provides:
   - A **target framework** (e.g. React, Vue, Svelte, Angular).
   - Optional: `--dry-run` — list all patterns that would be built, the components each needs, and the output file structure. Do not build anything. Stop after that output.
   - Optional: `--category [name]` — build only patterns in that category (e.g. `--category forms`). Useful for doing one category at a time.
   - Optional: `--start-from [slug]` — resume from a specific pattern (skip all patterns before it in the list). Useful after a previous run was interrupted.

2. **Read the pattern registry.**
   - Run `python .cursor/skills/design-patterns/scripts/search_patterns.py --patterns-dir .cursor/skills/design-patterns/reference --list` to get all patterns.
   - Build a list of { slug, name, category, markdown path } for every pattern. Slug comes from the markdown filename without `.md`.
   - If `--category` is provided, filter to only that category.
   - Total expected: ~45 patterns (or subset if filtered).

3. **Check existing patterns.**
   - For each pattern in the build list, check whether the pattern file already exists in the output directory (e.g. `src/patterns/ActionsRelatedContentPanel.tsx` for React).
   - If the file exists: run the pattern-fidelity-verifier procedure (from `.cursor/agents/pattern-fidelity-verifier.md`) on it. Read the verifier file, follow its procedure with the pattern markdown and the existing built file, and check every item: Component Tree (correct Harmony components, not raw HTML), Key Elements (every required element present with correct descriptions), Anatomy (structural layout matches the ASCII diagram), named items (exact labels), counts (exact numbers), behaviors (handlers and state wired), AI Agent Checklist (every item satisfied), and design system component usage (converted Harmony components, not raw HTML substitutes).
     - If zero deviations: mark as SKIP — this pattern is correctly built.
     - If ANY deviations: delete the existing file and mark for REBUILD. The pattern will go through the full flow in step 7 (pre-flight, build from markdown with Harmony components, verify) as if it never existed.
   - If the file does not exist: mark for BUILD.
   - If ALL existing patterns pass verification with zero deviations and no patterns are missing, report "All pattern pages verified and passing for [framework]" and stop.

4. **Check prerequisites.**
   - The shell must be converted for the target framework. Check that ShellLayout exists. If not: "Shell not found. Run `/convert-shell [variant] [framework]` first."
   - The routing must be set up (react-router-dom, vue-router, etc.) with the index page. If not: "Routing not set up. Install router and create index page first, then rerun."
   - The index page and slug→component map must exist. If not, create them as part of step 6.
   - There is NO shared PatternPage wrapper. Each pattern component imports the existing ShellLayout and renders its own instance. See step 7b for details.

5. **Dry-run (if `--dry-run`).**
   Output:
   - Total patterns found: [N]
   - Already built (SKIP): [list]
   - Patterns to build: [list with slug, name, category]
   - For each pattern to build: components needed from Component Tree, required elements from Key Elements
   - Output file structure: list of files that will be created
   - Do not build anything. Stop here.

6. **Set up routing and index (if not already present).**
   - If no router is installed, install it (`react-router-dom`, `vue-router`, etc.).
   - If no index page exists, create it: a page listing all patterns as links grouped by category. Each link goes to `/patterns/{slug}`.
   - If no slug→component map exists, create it with entries for all patterns (imports will be added as each pattern is built).
   - Each route points directly to the pattern component. There is NO shared PatternPage wrapper — each pattern component renders its own ShellLayout instance with the shell configured for that pattern's needs.
   - If these already exist, do not modify them (except to add new pattern entries to the map as patterns are built).

7. **Build each pattern page (one at a time, in order).**
   For each pattern (ordered by category, then alphabetical within category):

   **a. Pre-flight (before writing any code for this pattern):**
   Print:
   1. Pattern name and slug.
   2. Pattern markdown path being read.
   3. Components listed in the Component Tree.
   4. **Component availability and conversion:** For each component in the Component Tree, check two places:
      - **Project** (`src/components/shell/`, `src/components/ui/`): Is there a converted component? If yes → use it.
      - **Harmony library** (`node_modules/@deltek/harmony-components/src/components/ui/`): Does the component exist in Harmony but isn't converted yet? If yes → **convert it now** by running the `/convert-component [Component] [framework]` flow (converter agent → harmony-verifier → zero deviations before done). Do not proceed with this pattern until the conversion is complete and verified. Do not use raw HTML as a substitute. After conversion, the component is now AVAILABLE.
      - **Neither**: Component does not exist in Harmony. Note this in the pre-flight as CUSTOM. Raw HTML styled with Harmony tokens is acceptable only in this case.
      List the status of each component: AVAILABLE (already converted or just converted), or CUSTOM (not in Harmony, will use HTML + tokens).
   5. Required elements from Key Elements table (with descriptions).
   6. Named items that must appear (e.g. "7 view options: Board, Table, List, Calendar, Schedule, Gantt, Network graph").
   7. What the output file will contain (brief).

   If you cannot fill these in, read the pattern markdown first. No implementation code until this pre-flight is output.

   **b. Build the page component:**
   - Read the pattern markdown: Anatomy, Component Tree, Key Elements, Usage Guidelines, Implementation section, AI Agent Checklist.
   - Create the page component file (e.g. `src/patterns/ActionsRelatedContentPanel.tsx`).
   - **Each pattern component imports the existing ShellLayout and renders its own instance.** The shell is already converted — do not rebuild or reconvert it. Each pattern page imports ShellLayout and renders it with the props and slots configured for what that pattern needs:
     - **Content patterns** (settings form, CRUD table, empty state, card grid, etc.): ShellLayout with the pattern content in the content slot, pageHeaderTitle set to the pattern name.
     - **Shell-modifying patterns** (toast notification, detail drawer, notification center, contextual toolbar, app switcher, bottom tab navigation, help panel, accessibility panel, etc.): ShellLayout with the relevant shell region configured — right panel open with panel content, footer modified, header dropdown configured, overlay/toast rendered, sidebar extended, etc.
     - The pattern's Anatomy diagram tells you which shell regions are involved. If the Anatomy shows a right-side panel alongside main content, the ShellLayout must have its right panel prop/slot configured with that panel content. If the Anatomy shows an overlay, the component must render the overlay on top of the shell.
   - **All Harmony components must be converted, not substituted with raw HTML.** Every component in the Component Tree that exists in the Harmony library must be a converted design system component before it is used in the pattern. The pre-flight step handles conversion of any missing components. By the time you start building the page, every Harmony component is AVAILABLE. Import and use them. Do not use `<table>` when `Table.tsx` exists. Do not use `<input>` when `Input.tsx` exists. Do not use `<select>` when `Dropdown.tsx` exists. Do not use `<dialog>` when `Dialog.tsx` exists.
   - Use every component listed in the Component Tree. Use every named item and label from the Component Tree and Key Elements. Reflect the structure from the Anatomy.
   - If a component is CUSTOM (does not exist in Harmony at all), implement using HTML elements styled with Harmony tokens. Do NOT skip the pattern or leave that section empty.
   - Use realistic demo data that matches the pattern's domain (e.g. project names for a project filter, task names for a task table). Do NOT use "Lorem ipsum", "Item 1", or generic placeholders.
   - Wire behaviors: dismissible chips must have onRemove handlers, dialogs must open/close, filters must affect displayed data, tabs must switch content. State can be local (useState/ref/signal) — no backend needed.

   **c. Add to routing:**
   - Add the import and entry to the slug→component map.
   - Verify the route resolves. Each route points directly to the pattern component (no shared wrapper).

   **d. VERIFICATION — mandatory, per pattern. Hard gate.**

   You cannot create the next pattern file, add the next route, or start the next pre-flight until this step is complete for the current pattern.

   **You must perform both verifier procedures yourself.** Perform the verifier steps using the instructions in `.cursor/agents/layout-verifier.md` and `.cursor/agents/pattern-fidelity-verifier.md`. Read each verifier file, follow its procedure, and write the output exactly as it specifies. Do not use MCP or MCP tools. "I cannot invoke another agent" is not a reason to skip — perform the steps yourself.

   **Step d.1 — Layout verification:**

   Perform the layout verification steps yourself using the instructions in `.cursor/agents/layout-verifier.md`. Read that file, follow its procedure, and write the output exactly as it specifies. "I cannot invoke another agent" is not a reason to skip — perform the steps yourself.

   Write the verifier output:
   ```
   LAYOUT VERIFIER — [Pattern Name] ([slug]):
   [Full deviation list. Or: "PASS: zero deviations."]
   ```

   If the procedure returns deviations: fix them in the built file. Repeat the procedure. Write:
   ```
   LAYOUT VERIFIER — Round 2:
   [Agent's deviation list or PASS]
   ```
   Max 3 rounds. After round 3, if deviations remain, mark as STUCK.

   **Step d.2 — Fidelity verification:**

   Perform the fidelity verification steps yourself using the instructions in `.cursor/agents/pattern-fidelity-verifier.md`. Read that file, follow its procedure with two inputs: the **pattern markdown** file path (e.g. `.cursor/skills/design-patterns/reference/actions-related-content-panel.md`) and the **built page component** file path (e.g. `src/patterns/ActionsRelatedContentPanel.tsx`). Write the output exactly as the procedure specifies. "I cannot invoke another agent" is not a reason to skip — perform the steps yourself.

   Write the verifier output:
   ```
   FIDELITY VERIFIER — [Pattern Name] ([slug]):
   Source: [pattern markdown path]
   Built: [built component path]
   [Full deviation list. Or: "PASS: zero deviations."]
   ```

   If the procedure returns deviations: fix them in the built file. Repeat the procedure with both file paths. Write:
   ```
   FIDELITY VERIFIER — Round 2:
   [Agent's deviation list or PASS]
   ```
   Max 3 rounds. After round 3, if deviations remain, mark as STUCK.

   **The verifier is a procedure defined in a markdown file.** Read it and execute it. There is no scenario where it cannot be run.

   **Step d.3 — Write the verification output block:**

   After both verifier procedures have been executed, write this block (this is the proof that verification happened):

   ```
   === VERIFICATION: [Pattern Name] ([slug]) ===
   Layout result: [PASS | STUCK (N deviations after 3 rounds)]
   Fidelity result: [PASS | STUCK (N deviations after 3 rounds)]
   PATTERN STATUS: [PASS | STUCK (layout) | STUCK (fidelity) | STUCK (both)]
   === END VERIFICATION: [Pattern Name] ===
   ```

   **This block must exist before you proceed to the next pattern.** No block = pattern is incomplete.

   **e. Log result (derived from the verification output above):**
   - PASS: both verifiers returned "PASS: zero deviations."
   - STUCK (layout): layout verifier has remaining deviations after 3 rounds.
   - STUCK (fidelity): fidelity verifier has remaining deviations after 3 rounds.
   - STUCK (both): both verifiers have remaining deviations.
   - ERROR: build failed before verification could run.
   - If no verification output block exists for this pattern: the pattern is INCOMPLETE and must be reprocessed.

   **f. Checkpoint (every 5 patterns):**
   After every 5 completed patterns, stop and output a summary table:

   | # | Pattern | Category | Layout | Fidelity | Status |
   |---|---------|----------|--------|----------|--------|
   | 1 | Actions / Related Content Panel | navigation | PASS | PASS | PASS |
   | 2 | Bottom Tab Navigation | navigation | PASS | STUCK (2) | STUCK |
   | 3 | Floating Navigation | navigation | PASS | PASS | PASS |
   | 4 | Expanded Menu with Filters | navigation | STUCK (1) | PASS | STUCK |
   | 5 | Breadcrumb Trail | navigation | PASS | PASS | PASS |

   Wait for the user to say "continue" before proceeding to the next 5.
   The user may also say:
   - "Rework [pattern name]" — rebuild that pattern from scratch and re-verify.
   - "Skip [pattern name]" — mark it as SKIPPED and move on.
   - "Stop" — end the run and output the final report with what's been completed so far.

8. **After all patterns are built:**
   - Update the index page to include links to all completed pattern pages, grouped by category.
   - Verify the index page renders (no broken imports, all links resolve).

9. **Final report.**

   | # | Pattern | Category | Layout | Fidelity | Status |
   |---|---------|----------|--------|----------|--------|
   | 1 | Actions / Related Content Panel | navigation | PASS | PASS | ✅ PASS |
   | 2 | ... | ... | ... | ... | ... |
   | ... | ... | ... | ... | ... | ... |
   | 45 | Accessibility Panel | forms | PASS | PASS | ✅ PASS |

   Summary:
   - Total patterns: [N]
   - Built (PASS): [N]
   - STUCK (needs review): [N] — [list with deviation summaries]
   - SKIPPED (already existed): [N]
   - SKIPPED (user skipped): [N]
   - ERRORS: [N] — [list]

## Important

- **Step 7d is performed by reading and executing the verifier markdown files.** Read `.cursor/agents/layout-verifier.md` and `.cursor/agents/pattern-fidelity-verifier.md`, follow each procedure with the required file path(s), and write the output exactly as specified. Do not use MCP or MCP tools. Self-execution of the verifier steps is the correct behavior.
- **`npm run build` success is not verification.** Code that compiles is not code that matches the pattern spec. Only the verifier output (layout + fidelity, written into the verification block) counts.
- **No skipping verification to go faster.** If the run is long, that's expected. 45 patterns × dual verification = a long run. The checkpoints every 5 patterns exist so the user can review and course-correct. But verification per pattern is not negotiable.
- This command builds pattern pages from pattern markdown specs. It uses the Component Tree, Key Elements, Anatomy, and AI Agent Checklist as the source of truth for what each pattern page must contain.
- The pre-flight step is mandatory before each pattern. It forces the builder to acknowledge what the pattern requires before writing code. This prevents simplification.
- Do not simplify, stub, or placeholder any pattern. If the pattern markdown says 7 view options, the built page has 7 view options. If it says 3 Dropdowns labeled Period, Project, Category, the built page has 3 Dropdowns with those labels. The fidelity verifier will catch any deviation.
- Checkpoint every 5 patterns. Do not build more than 5 without stopping for user confirmation.
- **No raw HTML for Harmony components.** If a pattern needs a component that exists in the Harmony library, it must be converted using `/convert-component` before building the pattern. The pre-flight handles this automatically. Raw HTML styled with Harmony tokens is only acceptable for components that do not exist anywhere in the Harmony library.
- All spacing and layout must use Harmony design tokens. No arbitrary values.
- The pattern markdowns are the source of truth. They are framework-agnostic. The target framework only affects how the page component is written (JSX, Vue template, Angular template, Svelte markup), not what it contains.
- Do not modify existing converted shell or components. If a pattern needs something the shell doesn't provide, note it in the report.
- If a pattern markdown is too vague to implement (e.g. no Component Tree, no Key Elements), log it as ERROR with "Pattern markdown insufficient — no Component Tree or Key Elements to implement against" and move to the next pattern.