# DAGI Frontend

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
