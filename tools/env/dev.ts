import {EnvConfig} from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'https://d4el2racxe.execute-api.us-east-1.amazonaws.com/mock',
  AWS_REGION: 'us-east-1',
  COGNITO_USERPOOL: 'us-east-1_0UqEwkU0H',
  COGNITO_IDENTITYPOOL: 'us-east-1:38c1785e-4101-4eb4-b489-6fe8608406d0',
  COGNITO_CLIENT_ID: '3mj2tpe89ihqo412m9ckml6jk'
};

export = DevConfig;
