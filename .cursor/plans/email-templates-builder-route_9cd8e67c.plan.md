---
name: email-templates-builder-route
overview:
  Add a new Templates route in the dashboard that lets users build HTML email templates with a
  visual block-based editor and an expert raw HTML/CSS editor, store them in the backend, preview
  the rendered email, and enforce strong security and multi-tenant isolation.
todos:
  - id: define-types
    content: Define shared TypeScript models for builder and raw_html email templates and blocks
    status: completed
  - id: backend-endpoints
    content:
      Add backend persistence and API endpoints for listing, fetching, creating, updating, and
      deleting email templates
    status: completed
  - id: rtk-query-integration
    content: Create RTK Query API slice and hooks for email templates and wire into the Redux store
    status: completed
  - id: templates-route-layout
    content:
      Add Next.js templates route and desktop/mobile TemplatesTemplate components with basic
      2-column layout
    status: completed
  - id: builder-ui
    content:
      Implement visual block-based builder UI (palette, canvas, block properties, local state, save
      flow)
    status: completed
  - id: raw-html-ui
    content: Implement raw HTML/CSS expert editor UI with basic linting and save flow
    status: completed
  - id: preview-component
    content:
      Build unified EmailTemplatePreview component supporting builder and raw_html templates, with
      desktop/mobile and theme toggles
    status: completed
  - id: render-utility
    content: Implement server-side renderEmailTemplate utility for future sending integration
    status: completed
  - id: ux-safeguards
    content:
      Add UX polish (unsaved changes protection, template duplication, auth scoping, inline help)
    status: completed
  - id: security-hardening
    content:
      Implement validation, sanitization, access control, and abuse protections for email templates
      and previews
    status: completed
isProject: false
---

### 1. High-level architecture

- **Goal**: Add a `templates` section in the authenticated dashboard where users can:
  - Create/update **builder-based templates** (JSON blocks rendered via React Email components).
  - Create/update **raw HTML/CSS templates** (expert mode with code editor).
  - See a **live preview** of the email on the right side while editing.
  - Save templates to the backend for future sending (actual delivery integration later).
- **Key idea**: Treat templates as **typed content models** (`builder` vs `raw_html`), so the UI,
  validation, and rendering logic remain clean and maintainable.

---

### 2. Data model & backend API (with security constraints)

- **2.1. Define TypeScript types (shared between frontend and backend)**
  - Create shared types file, e.g.
    `[src/redux/types/emailTemplates.ts](src/redux/types/emailTemplates.ts)` (or equivalent shared
    domain types location):
    - `EmailTemplateType = 'builder' | 'raw_html'`.
    - `EmailBlockType` enum (e.g. `hero`, `text`, `button`, `image`, `divider`, `spacer`,
      `two_column` etc.).
    - `EmailBlock` structure with `id`, `type`, `props`, optional `children`.
    - `EmailTemplateBase` with `id`, `name`, `subject`, `description?`, `createdAt`, `updatedAt`.
    - `BuilderEmailTemplate` extends base with `type: 'builder'` and `blocks: EmailBlock[]`.
    - `RawHtmlEmailTemplate` extends base with `type: 'raw_html'` and `html: string`,
      `css?: string`.
    - `EmailTemplate` union of `BuilderEmailTemplate | RawHtmlEmailTemplate`.
  - In Zod validators, enforce:
    - Max lengths for strings (names, subjects, text content) to prevent abuse.
    - Max number of blocks per template.
    - Whitelisted props and CSS-like keys for block styling.
- **2.2. Add backend persistence model**
  - In your backend (API, DB models), add a `templates` table/collection with fields matching the
    types above.
  - Use JSON column for `blocks` (builder templates) and text columns for `html`/`css` (raw
    templates).
  - Add indexes for `id`, `name`, and ownership fields (`userId`, `workspaceId`/`tenantId`) to
    support strict scoping.
- **2.3. Implement REST/GraphQL endpoints with access control and rate limits**
  - Endpoints (or similar GraphQL mutations/queries):
    - `GET /api/templates` – list templates with basic metadata.
    - `GET /api/templates/:id` – fetch full template data.
    - `POST /api/templates` – create new template (builder or raw_html).
    - `PUT /api/templates/:id` – update template.
    - `DELETE /api/templates/:id` – archive/delete template.
  - For all endpoints:
    - Require authentication and resolve current workspace/tenant.
    - Ensure `template.workspaceId === currentWorkspaceId` for every read/write.
    - Apply rate limiting on create/update/delete per workspace/user.
  - Add input validation (Zod in
    `[src/validators/emailTemplates.ts](src/validators/emailTemplates.ts)`):
    - `EmailBlockSchema` with allowed `props` shape.
    - `BuilderTemplateSchema` and `RawHtmlTemplateSchema` with size/length limits.
    - Top-level `EmailTemplateSchema` union, used on all public-facing endpoints.

---

### 3. Redux / RTK Query integration

- **3.1. Create API slice**
  - Add `emailTemplatesApi` under
    `[src/redux/APISlices/emailTemplatesApi.ts](src/redux/APISlices/emailTemplatesApi.ts)`.
  - Define endpoints: `useGetTemplatesQuery`, `useGetTemplateQuery`, `useCreateTemplateMutation`,
    `useUpdateTemplateMutation`, `useDeleteTemplateMutation`.
  - Use appropriate baseQuery per existing pattern in `src/lib`.
- **3.2. Add slice to store**
  - Register `emailTemplatesApi.reducerPath` and middleware in the root store.
- **3.3. Optional: local UI slice**
  - If needed, create `emailTemplatesUISlice` for unsaved state (selected block, layout mode, etc.).

---

### 4. Routing & layout (Next.js app router)

- **4.1. Add the `templates` route (authenticated only)**
  - Under authenticated group, create
    `[src/app/[locale]/(private)/templates/page.tsx](src/app/[locale]/(private)/templates/page.tsx)`.
  - Keep `page.tsx` thin: fetch initial template or mode from URL, enforce auth/workspace context,
    then render a new template component.
- **4.2. Create templates for desktop & mobile**
  - Add desktop template:
    `[src/templates/Desktop/Templates/TemplatesTemplate.tsx](src/templates/Desktop/Templates/TemplatesTemplate.tsx)`.
    - Responsible for layout (left editor, right preview) and orchestrating child components.
  - Add mobile template:
    `[src/templates/Mobile/Templates/TemplatesTemplate.tsx](src/templates/Mobile/Templates/TemplatesTemplate.tsx)`
    with stacked layout.
  - Wire both via responsive providers/routing conventions you already use.
- **4.3. Navigation integration**
  - Add `Templates` entry to dashboard navigation (where other sections like
    Overview/Requests/Settings are defined, e.g. `src/routes/routes.ts` or equivalent).

---

### 5. UI design for Templates page

- **5.1. Overall layout**
  - Use a 2-column layout (desktop):
    - **Left panel (editor)**: 40–50% width, scrollable.
    - **Right panel (preview)**: 50–60% width, fixed background with preview card.
  - Use existing `Card`, `Tabs`, `ScrollArea`, and `ResizablePanel` components if available in
    `src/components/ui`.
- **5.2. Header controls**
  - At the top of the page:
    - Template selector / breadcrumb.
    - `New template` button.
    - `Save` / `Save as` buttons (disabled while no changes).
    - Toggle for `Builder` vs `Raw HTML` view (based on template type).
- **5.3. Split views for types**
  - If `template.type === 'builder'`:
    - Show block-based editor (section 6) in left panel.
  - If `template.type === 'raw_html'`:
    - Show code editor (section 7) in left panel.

---

### 6. Visual block-based builder (builder templates)

- **6.1. Left panel layout**
  - Subdivide into:
    - **Template meta** section: name, subject line, description.
    - **Block palette**: list of available block types with drag or "Add" buttons.
    - **Canvas / block list**: vertical list of blocks representing the email body.
    - **Properties panel**: when a block is selected, show its editable properties.
- **6.2. Implement block model and palette**
  - Define allowed `EmailBlockType`s and their default `props` in a config file, e.g.
    `[src/templates/config/emailBlockPresets.ts](src/templates/config/emailBlockPresets.ts)`.
  - For each block type, specify:
    - `label`, `icon`, `defaultProps` (text, colors, padding, alignment, etc.).
  - Build a `BlockPalette` component in `src/components/custom-ui/templates/BlockPalette.tsx` that
    lists types and emits `onAddBlock(type)`.
- **6.3. Canvas & drag-and-drop**
  - Use `@dnd-kit` or similar to support:
    - Reordering existing blocks.
    - Optional: drag from palette into canvas.
  - `BuilderCanvas` component:
    - Receives `blocks: EmailBlock[]`, `selectedBlockId`, and callbacks: `onSelectBlock`,
      `onReorderBlocks`, `onUpdateBlock`, `onDeleteBlock`.
    - Renders simple structural representation (titles + truncated text) for each block.
- **6.4. Block properties editor**
  - `BlockPropertiesPanel` component:
    - Uses block type to render the right form fields.
    - Uses shadcn inputs, color pickers, sliders, select dropdowns, etc.
    - Includes **advanced style** section:
      - Whitelisted CSS-like props (e.g. text color, font size, padding, background color).
      - Optional `customInlineStyles` as key–value pairs with validation.
- **6.5. State management in builder**
  - Maintain current `EmailTemplate` in component state (initialized from server or blank).
  - On every change (meta fields, blocks, props), update local state and mark as "dirty".
  - Debounce updates to preview (e.g. 200–300 ms) to avoid lag.
- **6.6. Save flow**
  - `onSave` handler:
    - Run Zod validation on the current template.
    - If valid, call `useCreateTemplateMutation` or `useUpdateTemplateMutation`.
    - Handle loading state and error display via toasts or inline messages.

---

### 7. Expert raw HTML/CSS editor (raw_html templates)

- **7.1. Code editor integration**
  - Choose a code editor component (Monaco or CodeMirror) in
    `src/components/custom-ui/templates/CodeEditor.tsx`.
  - Provide two tabs: `HTML` and `CSS`.
- **7.2. Linting and warnings**
  - Add lightweight checks on save or on-demand:
    - Warn if `<style>` blocks are too large.
    - Warn for obviously unsupported CSS properties in email (based on a small ruleset).
    - Optionally, show links to external "Can I email" style docs.
- **7.3. State and save flow**
  - Mirror builder behavior: keep `html` and `css` in local state, mark as dirty.
  - Run Zod validation for `RawHtmlTemplateSchema` before calling `create`/`update` mutations.

---

### 8. Preview rendering (right panel)

- **8.1. Unified preview component**
  - Create `EmailTemplatePreview` in `src/components/custom-ui/templates/EmailTemplatePreview.tsx`.
  - Props:
    - `template: EmailTemplate`.
    - `mode: 'desktop' | 'mobile'`.
    - `theme: 'light' | 'dark'`.
    - `sampleData`: object with example variables for personalization.
  - Inside:
    - If `template.type === 'builder'`:
      - Render a React component tree built from blocks, using `@react-email/components`.
    - If `template.type === 'raw_html'`:
      - Safely inject combined `html` + `css` into an iframe or `dangerouslySetInnerHTML` container
        (with sanitization).
- **8.2. View mode controls**
  - Above the preview pane, add toggles:
    - Desktop vs mobile width (CSS changes container width).
    - Light vs dark theme styles.
  - Optionally add a dropdown for sample data scenarios (e.g. user with/without certain attributes).
- **8.3. Performance considerations**
  - Debounce rerenders from the editor.
  - Memoize React Email component composition from blocks.

---

### 9. Email rendering for future sending

- **9.1. Server-side rendering utility**
  - Implement a shared server utility (in
    `[src/lib/email/renderTemplate.ts](src/lib/email/renderTemplate.ts)`):
    - `renderEmailTemplate(template: EmailTemplate, data: Record<string, any>): { html: string; text: string }`.
    - For `builder` templates: build React components from blocks, render to static markup, and
      optionally generate plain-text version.
    - For `raw_html` templates: apply templating for variables (e.g. `{{firstName}}` → value) and
      build fallback plain-text.
- **9.2. Hook up later to provider**
  - When ready to integrate with Resend/SendGrid/etc., use `renderEmailTemplate` output in the send
    API without changing the builder UI.

---

### 10. UX polish & safeguards

- **10.1. Unsaved changes protection**
  - Add confirmation when navigating away with unsaved edits.
- **10.2. Template duplication**
  - Implement "Duplicate template" action for quick variants.
- **10.3. Access control**
  - Ensure templates are scoped by workspace/tenant and respect your existing auth patterns.
- **10.4. Documentation & onboarding**
  - Add a short help section or inline tips explaining:
    - The difference between Builder and Raw HTML.
    - Email client limitations (CSS support, images, etc.).
    - Recommended block patterns for consistent branding.

---

### 11. Optional enhancements (later)

- **11.1. Version history**
  - Keep previous versions of templates; allow compare/rollback.
- **11.2. A/B testing metadata**
  - Extend template metadata to support variants and experiment flags.
- **11.3. Test send**
  - Add "Send test email" action integrated with the future provider.
- **11.4. Snippets/partials**
  - Support reusable header/footer blocks shared across templates.

