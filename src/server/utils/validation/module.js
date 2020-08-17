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

import { appCompatibilityExtension, provideStateConfigExtension } from './extensions';
import { validateStateConfigSchema } from './stateConfig';
import { safeRequestSchema } from './safeRequest';
import { corsOriginsSchema } from './cors';
import { cspSchema } from './csp';
import { pwaSchema } from './pwa';

export const rootModuleSchema = Joi.object().keys({
  providedExternals: Joi.any(),
  appCompatibility: appCompatibilityExtension.semver().valid(),
  provideStateConfig: provideStateConfigExtension.stateConfig(),
  csp: cspSchema,
  corsOrigins: corsOriginsSchema,
  eventLoopDelayThreshold: Joi.number().allow(Infinity),
  extendSafeRequestRestrictedAttributes: safeRequestSchema,
  pwa: pwaSchema,
  configureRequestLog: Joi.function(),
  createSsrFetch: Joi.function(),
});

export const childModuleSchema = Joi.object().keys({
  requiredExternals: Joi.any(),
  providedExternals: Joi.any().custom((value, helpers) => helpers.warn('any.exists')).messages({
    'any.exists': 'Module {{$moduleName}} attempted to provide externals. Only the root module can provide externals.',
  }),
  validateStateConfig: validateStateConfigSchema,
  requiredSafeRequestRestrictedAttributes: safeRequestSchema,
  appCompatibility: appCompatibilityExtension.semver().valid(),
});
