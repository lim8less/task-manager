// Expo dynamic config to inject environment variables into the app at build time
// Ensure you have API_URL defined in your .env (not committed)
// Loads .env into process.env for this config file
// If using Expo CLI, also consider `EXPO_PUBLIC_API_URL` for runtime access

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

/* eslint-disable no-undef */
export default ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra || {}),
    apiUrl: process.env.API_URL,
  },
});


