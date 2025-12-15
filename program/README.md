# Frontend

## Application Overview

This is a React-based frontend application built with Vite, designed for managing pharmacy-related operations in the PharmaCare system. It provides a dashboard for users to view and interact with pharmacy data, including inventory, prescriptions, and patient records.

### Architecture

- **Framework**: Built using React with TypeScript for type safety.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Routing**: React Router for client-side navigation between pages like dashboard, inventory, and user profiles.
- **State Management**: Uses React Context or Redux for global state, handling user sessions, API data, and UI states.
- **Styling**: Styled with CSS modules or a library like Tailwind CSS for responsive design.
- **API Integration**: Communicates with the backend via RESTful APIs using Axios or Fetch. Environment variables control API endpoints and keys.
- **Authentication**: Implements JWT-based auth; users log in via a form that calls the auth API, storing tokens in local storage for session persistence.
- **Key Components**:
  - **Dashboard**: Main landing page displaying key metrics, recent activities, and quick actions.
  - **Inventory Module**: Lists products, allows CRUD operations via API calls.
  - **Prescription Management**: Handles prescription creation, approval, and tracking.
  - **User Management**: Admin features for managing roles and permissions.
- **Workflow**: On load, the app checks for auth tokens; if valid, fetches user data and renders the dashboard. API calls are made asynchronously, with loading states and error handling. Data is cached locally for performance.

### Development Workflow

- Run `npm install` to install dependencies.
- Use `npm run dev` for development server.
- Build for production with `npm run build`.
- Test with `npm run test` (assuming Jest or similar is set up).

## Environment Configuration

This project supports multiple environments (development, staging, production) using Vite environment variables.

### Setup

- `.env` — base config
- `.env.development` — development overrides
- `.env.staging` — staging overrides
- `.env.production` — production overrides

**API endpoints and keys are set via these files.**

### Usage

- Vite automatically loads the correct `.env.*` file based on the mode:
  - `npm run dev` uses `.env.development`
  - `npm run build` uses `.env.production`
  - For staging: `vite --mode staging`

### Safety

- The app prevents use of production API keys in non-production environments.
- The current environment is shown in the UI (banner at top of dashboard).

### Example

```env
VITE_API_BASE_URL=https://dev-api.example.com
VITE_API_KEY=dev-key
VITE_ENV=development
```

### Changing Environment

Edit the relevant `.env.*` file or run Vite with the desired mode.

---

For more details, see [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html).
