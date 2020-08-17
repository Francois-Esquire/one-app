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

import { rootModuleSchema, childModuleSchema } from './module';

export function validateSchema(schema, validationTarget, options) {
  const { error, value, warning } = schema.validate(
    validationTarget,
    { ...options, abortEarly: false }
  );
  if (error) throw error;
  if (warning) {
    console.warn(warning);
  }
  return value;
}

export function validateRootModuleAppConfig(appConfig, context) {
  return validateSchema(rootModuleSchema, appConfig, { context });
}

export function validateChildModuleAppConfig(appConfig, context) {
  return validateSchema(childModuleSchema, appConfig, { context });
}
