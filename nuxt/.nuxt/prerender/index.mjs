import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { t as trapUnhandledNodeErrors, u as useNitroApp } from './chunks/_/nitro.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/h3@1.15.1/node_modules/h3/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/destr@2.0.5/node_modules/destr/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/hookable@5.5.3/node_modules/hookable/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/ofetch@1.4.1/node_modules/ofetch/dist/node.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/node-mock-http@1.0.0/node_modules/node-mock-http/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/ufo@1.6.1/node_modules/ufo/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/unstorage@1.15.0_db0@0.3.1_ioredis@5.6.1/node_modules/unstorage/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/unstorage@1.15.0_db0@0.3.1_ioredis@5.6.1/node_modules/unstorage/drivers/fs.mjs';
import 'file:///D:/mastu_rip/nuxt/node_modules/.pnpm/nuxt@3.16.2_@parcel+watcher_cb76c59551638f3e97ed2870735c7154/node_modules/nuxt/dist/core/runtime/nitro/utils/cache-driver.js';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/unstorage@1.15.0_db0@0.3.1_ioredis@5.6.1/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/klona@2.0.6/node_modules/klona/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/defu@6.1.4/node_modules/defu/dist/defu.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/scule@1.3.0/node_modules/scule/dist/index.mjs';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/radix3@1.1.2/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://D:/mastu_rip/nuxt/node_modules/.pnpm/pathe@2.0.3/node_modules/pathe/dist/index.mjs';

const nitroApp = useNitroApp();
const localFetch = nitroApp.localFetch;
const closePrerenderer = () => nitroApp.hooks.callHook("close");
trapUnhandledNodeErrors();

export { closePrerenderer, localFetch };
//# sourceMappingURL=index.mjs.map
