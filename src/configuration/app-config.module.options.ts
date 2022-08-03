import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import dbConfig from './dbConfig';
import globalConfig from './globalConfig';

const configModuleOptions: ConfigModuleOptions = {
  load: [globalConfig, dbConfig],
  isGlobal: true,
  validationSchema: Joi.object({
    APP_ENV: Joi.string().required(),
    APP_PORT: Joi.number().default(3000),
    DATABASE_HOST: Joi.string(),
    DATABASE_PORT: Joi.number(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_SYNCHRONIZE: Joi.bool().default(false),
  }),
  envFilePath: `.env.${process.env.NODE_ENV}`,
};

export default configModuleOptions;
