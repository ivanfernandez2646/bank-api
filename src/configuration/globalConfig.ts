export default () => ({
  appEnv: process.env.APP_ENV,
  port: Number(process.env.APP_PORT) || 3000,
});
