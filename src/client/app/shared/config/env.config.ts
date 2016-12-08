// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
  API?: string;
  ENV?: string;
  AWS_REGION?: string;
  COGNITO_USERPOOL?: string;
  COGNITO_IDENTITYPOOL?: string;
  COGNITO_CLIENT_ID?: string;
}

export const Config: EnvConfig = JSON.parse('<%= ENV_CONFIG %>');

