import {EnvConfig} from './env-config.interface';

const BaseConfig: EnvConfig = {
  ENV: '',
  API: '',
  AWS_REGION: '',
  COGNITO_USERPOOL: '',
  COGNITO_IDENTITYPOOL: '',
  COGNITO_CLIENT_ID: ''
};

export = BaseConfig;

