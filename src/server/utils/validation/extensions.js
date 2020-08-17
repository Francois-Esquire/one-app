/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import Joi from 'joi';
import semver from 'semver';

import { setStateConfig, getClientStateConfig, getServerStateConfig } from '../stateConfig';

import { webManifestSchema } from './webManifest';
import { provideStateConfigSchema } from './stateConfig';

const checkAppVersion = (appVersion, compatVersion) => semver
  .satisfies(appVersion, compatVersion, { includePrerelease: true });

export const appCompatibilityExtension = Joi.extend({
  type: 'semver',
  base: Joi.string(),
  messages: {
    'semver.app': '{{$moduleName}}@{{$moduleVersion}} is not compatible with this version of one-app ({{$appVersion}}), it requires "{{#value}}"',
  },
  validate(value, helpers) {
    if (helpers.state.path.includes('appCompatibility') && !checkAppVersion(helpers.prefs.context.appVersion, value)) {
      return {
        value,
        errors: helpers.error('semver.app'),
      };
    }
    return { value };
  },
});

export const webManifestExtension = Joi.extend({
  type: 'manifest',
  base: webManifestSchema,
  coerce(value, helpers) {
    if (typeof value === 'function') {
      return { value: value(helpers.prefs.context.clientStateConfig) };
    }
    return { value };
  },
});

export const provideStateConfigExtension = Joi.extend({
  type: 'stateConfig',
  base: provideStateConfigSchema,
  validate(value, helpers) {
    setStateConfig(value);
    // eslint-disable-next-line no-param-reassign
    helpers.prefs.context.clientStateConfig = getClientStateConfig();
    // eslint-disable-next-line no-param-reassign
    helpers.prefs.context.serverStateConfig = getServerStateConfig();
    return { value };
  },
});
