---
name: templates-page-full-functionality
overview: Implement a fully functional email templates page that supports a rich block-based builder and raw HTML editor, with persistence, preview, and integration into the email sending flow.
todos:
  - id: email-templates-validators
    content: Add Zod schemas and DTO types for email templates and blocks, with size and styling constraints
    status: completed
  - id: email-templates-backend
    content: Implement backend persistence, CRUD endpoints, and test-send endpoint for email templates
    status: completed
  - id: email-templates-rtk-query
    content: Extend EmailTemplatesAPISlice and optional UI slice for listing, selecting, editing, saving, and test-sending templates
    status: completed
  - id: templates-desktop-state-flow
    content: Rework Desktop TemplatesTemplate to use a selected template + draftTemplate model with full create/edit/save flows
    status: completed
  - id: templates-mobile-state-flow
    content: Mirror TemplatesTemplate logic on mobile with a mobile-optimized layout
    status: completed
  - id: blocks-and-styling
    content: Expand block presets, per-block schemas, and BlockPropertiesPanel to support advanced styling and more block types
    status: completed
  - id: templates-preview-implementation
    content: Implement real preview rendering using React Email for builder templates and sanitized HTML for raw templates with desktop/mobile toggles
    status: completed
  - id: templates-render-and-send
    content: Enhance renderEmailTemplate and integrate with email provider for test send flow
    status: completed
  - id: templates-security-and-ux
    content: Harden security (sanitization, access control, limits) and polish UX (unsaved changes, warnings, empty states) for the templates experience
    status: completed
isProject: false
---

### 1. Goals and constraints

- **Goal**: Turn the existing `Templates` page into a **fully functional email template builder**
that:
  - Lets users **create, edit, and delete** templates (builder + raw HTML).
  - Provides a **rich block-based editor** with advanced styling controls.
  - Provides a **raw HTML/CSS editor** for expert users.
  - Shows a **realistic live preview** for both modes.
  - **Persists** templates via the backend and **plugs into the email sending flow** (at least as a
  test-send capability).
- **Constraints**:
  - Respect existing project structure: routes in `src/app/[locale]/(private)/`**, page templates in
  `src/templates/`**, RTK Query under `src/redux/APISlices/\*\*`.
  - Keep email rendering secure: sanitize HTML, restrict CSS, validate links, and avoid XSS.

---

### 2. Firm up domain model & validators

- **2.1. Confirm and extend TypeScript models**
- Ensure `src/redux/@types/EmailTemplates.d.ts` has:
  - `EmailTemplateType`, `EmailBlockType`, `EmailBlock`, `EmailTemplateBase`,
  `BuilderEmailTemplate`, `RawHtmlEmailTemplate`, `EmailTemplate`.
  - Optional fields for **metadata** used by the UI and sending:
    - `isDefault` flag, `category` (e.g. transactional, marketing), `lastSentAt?`.
- **2.2. Add Zod validators**
- In `[src/validators/emailTemplates.ts](src/validators/emailTemplates.ts)` (new file):
  - `EmailBlockSchema` with strict shape per block type (using discriminated union on `type`).
  - `BuilderTemplateSchema` and `RawHtmlTemplateSchema` with:
    - Length limits (titles, subjects, content, HTML/CSS).
    - Max block count.
    - Allowed styling props (whitelist).
  - `EmailTemplateSchema` union.
  - Export **request DTO schemas** for create/update: `CreateEmailTemplateBody`,
  `UpdateEmailTemplateBody`.

---

### 3. Backend API & persistence

_(Assuming a REST API similar to existing `/transactions` and `/budget-_` routes.)

- **3.1. Database & model**
  - Add a `templates` table/collection with fields:
    - `id`, `workspaceId`, `name`, `subject`, `type`, `description`, `blocks` (JSON), `html`, `css`,
    timestamps, metadata.
  - Ensure **multi-tenant scoping** by `workspaceId` or equivalent.
- **3.2. HTTP endpoints**
  - Implement or extend API routes behind `apiRoute.emailTemplates` and `apiRoute.emailTemplate(id)`
  defined in `[src/routes/routes.ts](src/routes/routes.ts)`:
    - `GET /email-templates` → list templates (with filters: `type`, `search`, `category`).
    - `GET /email-templates/:id` → get one template.
    - `POST /email-templates` → create template.
    - `PUT /email-templates/:id` → update template.
    - `DELETE /email-templates/:id` → soft-delete/archive.
  - Apply Zod validation (`EmailTemplateSchema` and DTOs) on all write operations.
  - Enforce **auth + workspace scoping + rate limits**.
- **3.3. Test-send endpoint**
  - Add `POST /email-templates/:id/test-send`:
    - Body: `{ to: string; sampleData?: Record<string, any> }`.
    - Loads template, calls `renderEmailTemplate`, and invokes email provider.

---

### 4. RTK Query & client data layer

- **4.1. Extend `EmailTemplatesAPISlice`** in
`[src/redux/APISlices/EmailTemplatesAPISlice.ts](src/redux/APISlices/EmailTemplatesAPISlice.ts)`:
  - Ensure strong typing with `EmailTemplate` and DTOs.
  - Endpoints:
    - `emailTemplatesList` (optionally accept query params).
    - `getEmailTemplateById`.
    - `createEmailTemplate`.
    - `updateEmailTemplate`.
    - `deleteEmailTemplate`.
    - `sendEmailTemplateTest` hitting `/email-templates/:id/test-send`.
- **4.2. Optional UI slice**
  - Add `emailTemplatesUISlice` to manage:
    - `activeTemplateId`, `draftTemplate` (unsaved edits), `hasUnsavedChanges`.
    - `builderOrRawMode` and view preferences (desktop/mobile, theme, sample data preset).

---

### 5. Rework TemplatesTemplate state flow (desktop)

- **5.1. Decide source of truth**
  - Use **RTK Query + local draft** pattern:
    - RTK Query stores persisted templates.
    - Local state holds the **currently edited draft** of the selected template.
- **5.2. Loading & selecting templates**
  - In `src/templates/Desktop/Templates/TemplatesTemplate.tsx`:
    - Use `useEmailTemplatesListQuery` to fetch templates.
    - Add a **template selector** (dropdown or list) to pick the active template.
    - On selection:
      - Load full template via `useGetEmailTemplateByIdQuery` (or from list if fully hydrated).
      - Initialize `draftTemplate` state (deep clone).
- **5.3. New template flow**
  - Wire "New template" button to:
    - Ask user which type: `builder` or `raw_html` (modal or segmented control).
    - Initialize a new `draftTemplate` with defaults (name stub, subject stub, empty blocks or basic
    HTML skeleton).
    - **Option A**: Create optimistically in backend and edit.
    - **Option B**: Keep purely client-side until first explicit Save.
- **5.4. Editing & save flow**
  - For builder templates:
    - `BlockPalette` → `handleAddBlock` should **always operate on `draftTemplate`**, creating it if
    needed.
    - `BuilderCanvas` selection should update `selectedBlockId` so `BlockPropertiesPanel` gets
    non-null `block`.
    - `BlockPropertiesPanel` updates should mutate `draftTemplate.blocks` and mark
    `hasUnsavedChanges = true`.
  - For raw HTML templates:
    - HTML/CSS editors should **always edit `draftTemplate`** if type is `raw_html`; if no template
    exists, create a new raw template on first keystroke.
  - Save button:
    - Disabled if no changes.
    - On click, validate draft with Zod, then call `createEmailTemplate` or `updateEmailTemplate`.
    - Update RTK Query cache on success and clear `hasUnsavedChanges`.

---

### 6. Mobile TemplatesTemplate behavior

- Mirror the desktop state logic in
`[src/templates/Mobile/Templates/TemplatesTemplate.tsx](src/templates/Mobile/Templates/TemplatesTemplate.tsx)`,
but with a mobile-optimized layout:
  - Use stacked panels and maybe a bottom sheet for block properties.
  - Reuse the same hooks and helpers for drafts and saving.

---

### 7. Block system & advanced styling

- **7.1. Block presets**
  - Expand `[src/templates/config/emailBlockPresets.ts](src/templates/config/emailBlockPresets.ts)`:
    - Add more block types (e.g. `heading`, `list`, `quote`, `social_icons`, `footer`).
    - Include sensible `defaultProps` for each.
- **7.2. Block-level schema and UI**
  - Make `EmailBlockSchema` discriminated on `type` and map each type to a shape of `props`.
  - Extend `BlockPropertiesPanel` to support advanced styling per block:
    - Alignment, background color, text color.
    - Padding/margins (within safe email limits).
    - Optional advanced style map, but validated via Zod.
- **7.3. Reordering support**
  - Add drag-and-drop or up/down controls in `BuilderCanvas` to reorder blocks.
  - Update `draftTemplate.blocks` accordingly and mark as dirty.

---

### 8. Preview implementation (builder + raw)

- **8.1. Builder preview with React Email**
  - Integrate `@react-email/components` and create a `renderBuilderTemplateToReact` helper (or
  similar):
    - Map `EmailBlock` → React Email primitives (e.g. `Section`, `Text`, `Button`, `Img`).
    - Compose a `BuilderTemplateEmail` React component.
  - Update `EmailTemplatePreview` in
  `[src/components/custom-ui/templates/EmailTemplatePreview.tsx](src/components/custom-ui/templates/EmailTemplatePreview.tsx)`
  to:
    - Render the React Email component tree for builder templates.
    - Support desktop vs mobile widths (CSS-based container resize).
- **8.2. Raw HTML preview with sanitization**
  - Use the HTML returned from `renderEmailTemplate` or a client-side mirror function.
  - Render inside a **sandboxed iframe** or a container using `dangerouslySetInnerHTML` **only after
  sanitization**.
  - Ensure no JS executes and only safe URLs are allowed.
- **8.3. View mode toggles**
  - Add simple controls for:
    - Desktop/mobile width.
    - Light/dark theme simulation (if your email styling supports it).
    - Sample data presets (e.g. fake `firstName`, etc.).

---

### 9. Email rendering & sending integration

- **9.1. Enhance `renderEmailTemplate`** in
`[src/lib/email/renderTemplate.ts](src/lib/email/renderTemplate.ts)`:
  - For builder templates, use React Email to render to static markup and derive a plain-text
  version.
  - For raw HTML templates:
    - Apply interpolation (`{{key}}`) safely.
    - Sanitize HTML and generate a basic plain-text fallback.
- **9.2. Provider integration**
  - Implement a mailer service (e.g. Resend, SendGrid, SES) that accepts
  `{ to, subject, html, text }`.
  - Wire `POST /email-templates/:id/test-send` to use this service and `renderEmailTemplate`.
  - On the frontend, use the RTK Query mutation and expose a **“Send test”** button in the UI.

---

### 10. Security & abuse protection

- **10.1. HTML/CSS sanitization**
  - Centralize sanitization for:
    - Raw HTML templates (both at save time and before preview/send).
    - Links and images (strip `javascript:`, allow only safe protocols & whitelisted domains).
  - Consider using a robust server-side sanitizer in addition to the current light client-side
  version.
- **10.2. Access control & limits**
  - Ensure all API operations check `workspaceId` and user auth/roles.
  - Add limits:
    - Max templates per workspace.
    - Max template size (blocks, HTML length, CSS length).
- **10.3. UX safeguards**
  - Unsaved changes dialog when navigating away.
  - Clear labeling of **Builder (safe)** vs **Raw HTML (expert, may not render in all clients)**.
  - Warning banners when HTML/CSS contain risky patterns (e.g. large `<style>` blocks, unsupported
  CSS).

---

### 11. Polishing & testing

- **11.1. UX polish**
  - Make the template selector easy to use (search, filters, recent templates).
  - Add inline empty states ("No templates yet", "No blocks added").
- **11.2. Testing**
  - Add unit tests for:
    - `renderEmailTemplate` (builder + raw) with different data.
    - Zod validators rejecting bad input.
  - Add smoke tests for the Templates page behavior:
    - Creating, editing, saving, reloading a template.
    - Switching between builder and raw HTML modes.
    - Preview reflecting edits.
- **11.3. Performance**
  - Debounce preview updates during typing.
  - Memoize expensive React Email render operations if needed.

