import test from 'node:test';
import assert from 'node:assert/strict';
import { getReply, getFallbackReply } from './utils.js';

/**
 * API Tests - Comprehensive endpoint testing
 * Tests for chat processing, history, and fallback responses
 */

test('Chat utility - getReply returns a string', async () => {
  const result = await getReply('hello');
  assert.strictEqual(typeof result, 'string');
  assert.ok(result.length > 0);
});

test('Chat utility - getReply handles long messages', async () => {
  const longMessage = 'a'.repeat(5000);
  const result = await getReply(longMessage);
  assert.strictEqual(typeof result, 'string');
});

test('Fallback responses - handles greeting', () => {
  const reply = getFallbackReply('hello there');
  assert.match(reply, /hello|Hello/i);
});

test('Fallback responses - handles help request', () => {
  const reply = getFallbackReply('help me please');
  assert.match(reply, /help|Help/i);
});

test('Fallback responses - handles summarize request', () => {
  const reply = getFallbackReply('can you summarize this text');
  assert.match(reply, /summarize|summary/i);
});

test('Fallback responses - handles email request', () => {
  const reply = getFallbackReply('help me write an email');
  assert.match(reply, /email|professional/i);
});

test('Fallback responses - handles time request', () => {
  const reply = getFallbackReply('what time is it');
  assert.ok(reply.includes(':'));
});

test('Fallback responses - handles date request', () => {
  const reply = getFallbackReply('what is today date');
  assert.ok(reply.length > 5);
});

test('Fallback responses - handles empty message', () => {
  const reply = getFallbackReply('');
  assert.strictEqual(reply, 'Please say something so I can help.');
});

test('Fallback responses - handles generic message', () => {
  const reply = getFallbackReply('random message');
  assert.match(reply, /help|question/i);
});

test('Utility - trimming whitespace', () => {
  const reply = getFallbackReply('  hello  ');
  assert.match(reply, /hello|Hello/i);
});

test('Utility - case insensitive matching', () => {
  const reply1 = getFallbackReply('HELLO');
  const reply2 = getFallbackReply('Hello');
  const reply3 = getFallbackReply('hello');
  assert.match(reply1, /hello|Hello/i);
  assert.match(reply2, /hello|Hello/i);
  assert.match(reply3, /hello|Hello/i);
});
