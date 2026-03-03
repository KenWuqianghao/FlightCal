## 2026-03-03 - [ARIA Validation for Buttons]
**Learning:** `aria-required` is not a valid attribute for the `button` role according to WAI-ARIA standards. It should be used on input-like elements where a value is expected, not on action-triggering buttons.
**Action:** Always verify ARIA attribute compatibility with roles before implementation. Use `aria-label` or `aria-labelledby` for button identification and `aria-pressed` for toggle states.

## 2026-03-03 - [Repository Hygiene and Constraints]
**Learning:** In projects with strict line-limit constraints (e.g., < 50 lines), committing a large auto-generated lockfile (like `pnpm-lock.yaml`) can violate the constraint and obscure the core UX changes.
**Action:** Avoid committing large auto-generated artifacts unless explicitly required for the task. Ensure local logs (like `dev_server.log`) are deleted before submission.
