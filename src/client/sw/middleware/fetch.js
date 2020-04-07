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

// eslint-disable-next-line import/no-extraneous-dependencies
import { expiration, cacheRouter } from '@americanexpress/one-service-worker';

import {
  oneAppRegexp, moduleRegexp, langPackRegexp,
} from './utility';

export default function createFetchMiddleware() {
  return [
    {
      cacheName: 'one-app-cache',
      // eslint-disable-next-line no-useless-escape
      match: oneAppRegexp,
    },
    {
      cacheName: 'module-cache',
      // ends with .browser.js and matches the name
      match: moduleRegexp,
    },
    {
      cacheName: 'language-pack-cache',
      // any valid bcp 47 locale id
      match: langPackRegexp,
    },
  ].map(cacheRouter).concat([
    expiration(),
  ]);
}
