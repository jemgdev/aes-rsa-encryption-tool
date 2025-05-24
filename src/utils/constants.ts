interface Constants {
  port: string | undefined;
  environment: string | undefined;
}

export default {
  port: process.env.PORT,
  environment: process.env.ENVIRONMENT
} as Constants;