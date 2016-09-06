import {EnvConfig} from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: 'https://kd32ih1imd.execute-api.us-east-1.amazonaws.com/dev'
};

export = ProdConfig;
