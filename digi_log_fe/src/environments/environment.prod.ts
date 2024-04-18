export const environment = {
  production: true,
  // $ENV is defined in src/typings.d.ts, var gotten from custom-webpack.config.js
  BACKEND_PORT: $ENV.BACKEND_PORT,
  BACKEND_IP: $ENV.BACKEND_IP
};
