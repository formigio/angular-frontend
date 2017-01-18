import {EnvConfig} from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'http://local.dev:8080',
  AWS_REGION: 'us-east-1',
  COGNITO_USERPOOL: 'us-east-1_0UqEwkU0H',
  COGNITO_IDENTITYPOOL: 'us-east-1:38c1785e-4101-4eb4-b489-6fe8608406d0',
  COGNITO_CLIENT_ID: '1nupbfn12bgmra4ueie0dqagnv'
};

export = DevConfig;
