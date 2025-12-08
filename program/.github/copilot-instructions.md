# Copilot Instructions for DAGI Frontend

## Project Overview
This is a React-based frontend project using Vite and Tailwind CSS. The codebase is organized by feature and responsibility, with clear separation between UI components, hooks, services, and utility functions.

## Architecture & Key Patterns
- **Entry Point:** `src/main.jsx` bootstraps the app, rendering `App.jsx`.
- **Component Structure:**
  - UI primitives in `src/components/ui/` (e.g., `button.jsx`, `card.jsx`).
  - Shared feature components in `src/components/shared/` (e.g., `ExcelImport.jsx`, `ProfileSettings.jsx`).
  - Dashboard-specific components in `src/components/dashboard/`.
- **Layouts:** `src/layouts/DashboardLayout.jsx` manages dashboard page structure.
- **Hooks:** Custom hooks live in `src/hooks/` (e.g., `useRealtimeSalesData.js` for live updates).
- **Services:** API and business logic are in `src/services/` (e.g., `auth.service.js`, `manager.service.js`).
- **API Layer:** REST API calls are abstracted in `src/api/` (e.g., `apiClient.js`, `auth.api.js`).
- **State Management:** Local state is managed with hooks and context; global state (e.g., signup) in `src/store/signupStore.js`.
- **Utilities:** Helper functions in `src/utils/` and `src/lib/utils.js`.

## Developer Workflows
- **Build:** Use Vite (`vite.config.js`). Run with `npm run dev` for development, `npm run build` for production.
- **Styling:** Tailwind CSS is configured via `tailwind.config.js` and `postcss.config.js`.
- **HTML Entry:** `program/index.html` is the main HTML template.
- **Debugging:** Use browser dev tools and React DevTools. No custom debug scripts.

## Conventions & Patterns
- **File Naming:** Use PascalCase for React components, camelCase for hooks and utilities.
- **Component Props:** Prefer destructuring props at the top of components.
- **API Calls:** Use the API client in `src/api/apiClient.js` for all HTTP requests.
- **Service Layer:** Business logic and API integration are separated in `src/services/`.
- **Import Paths:** Use relative imports; avoid deep nesting.
- **Styling:** Use Tailwind utility classes directly in JSX.

## Integration Points
- **External APIs:** All backend communication is via REST endpoints defined in `src/api/` and consumed by services.
- **Excel Import:** `ExcelImport.jsx` handles file uploads and parsing.
- **Live Data:** `useRealtimeSalesData.js` manages live sales updates for dashboards.

## Examples
- To add a new dashboard widget, create a component in `src/components/dashboard/` and update `LiveSalesDashboard.jsx`.
- For a new API endpoint, add a method in `src/api/` and corresponding logic in `src/services/`.

## References
- Entry: `src/main.jsx`, `src/App.jsx`
- UI: `src/components/ui/`
- API: `src/api/`
- Services: `src/services/`
- State: `src/store/`
- Layout: `src/layouts/`

---
_If any section is unclear or missing important project-specific details, please provide feedback to improve these instructions._
