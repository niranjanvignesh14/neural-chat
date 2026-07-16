import test from 'node:test';
import assert from 'node:assert/strict';
import { getFallbackReply } from './utils.js';

/**
 * Utility Tests - Fallback response generation
 */

test('returns a friendly greeting for hello messages', () => {
  assert.match(getFallbackReply('hello there'), /hello/i);
});

test('offers help for support questions', () => {
  const reply = getFallbackReply('help me');
  assert.match(reply, /help/i);
});

test('handles hi greeting variant', () => {
  assert.match(getFallbackReply('hi'), /hello/i);
});

test('handles hey greeting variant', () => {
  assert.match(getFallbackReply('hey'), /hello/i);
});

test('suggests summarization capability', () => {
  const reply = getFallbackReply('summarize this article');
  assert.match(reply, /summarize|summary/i);
});

test('provides email writing assistance', () => {
  const reply = getFallbackReply('help me with email');
  assert.match(reply, /email|professional/i);
});

test('shows current time', () => {
  const reply = getFallbackReply('what time');
  assert.ok(reply.includes('time') || reply.includes(':'));
});

test('shows current date', () => {
  const reply = getFallbackReply('what date');
  assert.ok(reply.length > 10);
});

test('handles case insensitivity', () => {
  const upper = getFallbackReply('HELLO');
  const lower = getFallbackReply('hello');
  assert.match(upper, /hello|Hello/i);
  assert.match(lower, /hello|Hello/i);
});

test('handles whitespace trimming', () => {
  const reply = getFallbackReply('   hello   ');
  assert.match(reply, /hello|Hello/i);
});

test('returns generic help for unknown input', () => {
  const reply = getFallbackReply('xyz unknown topic');
  assert.ok(reply.length > 0);
  assert.match(reply, /help|communication|question/i);
});

test('handles empty input appropriately', () => {
  const reply = getFallbackReply('');
  assert.strictEqual(reply, 'Please say something so I can help.');
});

test('handles only whitespace input', () => {
  const reply = getFallbackReply('   ');
  assert.strictEqual(reply, 'Please say something so I can help.');
});

