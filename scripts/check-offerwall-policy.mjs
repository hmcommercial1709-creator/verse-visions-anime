import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, existsSync } from 'node:fs';
import { OFFERWALL_POLICY_SCRIPT } from '../src/lib/offerwall-policy.ts';

const queue = [];
const googlefc = { callbackQueue: queue, consentMarker: 'untouched' };
const sandbox = { window: { googlefc } };
vm.runInNewContext(OFFERWALL_POLICY_SCRIPT, sandbox);
assert.equal(sandbox.window.googlefc, googlefc);
assert.equal(googlefc.callbackQueue, queue);
assert.equal(googlefc.consentMarker, 'untouched');

// Google supplies the enum after our initial-head script has registered.
googlefc.MessageTypeEnum = { OFFERWALL: 7, AD_BLOCKING: 8 };
let calls = [];
googlefc.controlledMessagingFunction({ proceed: (...args) => calls.push(args) });
assert.equal(calls.length, 1);
assert.equal(JSON.stringify(calls[0]), JSON.stringify([false, [7]]));

delete googlefc.MessageTypeEnum;
calls = [];
googlefc.controlledMessagingFunction({ proceed: (...args) => calls.push(args) });
assert.deepEqual(calls, [[true]]);

const fresh = { window: {} };
vm.runInNewContext(OFFERWALL_POLICY_SCRIPT, fresh);
assert.equal(typeof fresh.window.googlefc.controlledMessagingFunction, 'function');
const root = readFileSync(new URL('../src/routes/__root.tsx', import.meta.url), 'utf8');
assert.ok(root.indexOf('id="gamecastle-offerwall-policy"') < root.indexOf('<HeadContent />'));
console.log('Offerwall-only suppression, consent preservation and early registration: passed.');
assert.doesNotMatch(root, /monetag|PropellerConversion/i);
assert.equal(existsSync(new URL('../src/lib/monetag.ts', import.meta.url)), false);
assert.equal(existsSync(new URL('../src/components/propeller-conversion.tsx', import.meta.url)), false);
const tags = readFileSync(new URL('../src/components/deferred-scripts.tsx', import.meta.url), 'utf8');
assert.match(tags, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/);
assert.doesNotMatch(tags, /monetag|propellerads/i);
assert.match(readFileSync(new URL('../public/ads.txt', import.meta.url), 'utf8'), /google\.com, pub-6422431093727588, DIRECT/);
console.log('Removed ad network stays disconnected; AdSense remains configured: passed.');
