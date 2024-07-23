
// executing envsubst in the dockerfule replaces ${} with the value of the environment variable
export const environment = {
  production: true,
  BACKEND_PORT: '${BACKEND_PORT}',
  BACKEND_IP: '${BACKEND_IP}',
};
