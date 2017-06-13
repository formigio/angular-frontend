import {EnvConfig} from './env-config.interface';

const ProdConfig: EnvConfig = {
  BASE_URL: 'https://alpha.formigio.com/',
  ENV: 'PROD',
  API: 'https://ne8nefmm61.execute-api.us-east-1.amazonaws.com/v1',
  AWS_REGION: 'us-east-1',
  COGNITO_USERPOOL: 'us-east-1_0UqEwkU0H',
  COGNITO_IDENTITYPOOL: 'us-east-1:38c1785e-4101-4eb4-b489-6fe8608406d0',
  COGNITO_CLIENT_ID: '1nupbfn12bgmra4ueie0dqagnv',
  GOOGLE_CLIENT_ID: '733735566798-5ob9fijml9fsf43tfvi26iong72r954u.apps.googleusercontent.com',
  NOTIFICATION_WS: 'wss://messaging.alpha.formig.io'
};

export = ProdConfig;
