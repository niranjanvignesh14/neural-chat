import test from 'node:test';
import assert from 'node:assert/strict';
import { getFallbackReply } from './utils.js';

test('returns a friendly greeting for hello messages', () => {
  assert.match(getFallbackReply('hello there'), /hello/i);
});

test('offers help for support questions', () => {
  const reply = getFallbackReply('help me');
  assert.match(reply, /help/i);
});
