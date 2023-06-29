import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const DEV_CONFIG = '../env/dev.yaml';
const TEST_CONFIG = '../env/test.yaml';
const PRO_CONFIG = '../env/pro.yaml';

const configs = {
  development: DEV_CONFIG,
  test: TEST_CONFIG,
  production: PRO_CONFIG,
};

const env = process.env.NODE_ENV || 'development';

export default () => yaml.load(readFileSync(join(__dirname, configs[env]), 'utf8')) as Record<string, any>;
