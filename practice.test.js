import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { oral, signs, questions, signTips } from './data.js';
import { recordAnswer, optionsFor, selectQuestions, shuffled, studyPlan, quickStudyPlan, improvementSummary, retryQuestion } from './practice.js';

test('all source questions and numbered signs are present', () => {
  assert.equal(oral.length, 28);
  assert.equal(signs.length, 140);
  assert.equal(new Set(questions.map(item => item.id)).size, 168);
  assert.equal(signs.some(item => item.number === 69), false);
  for (const item of questions) assert.ok(item.question && item.answer);
});
test('every numbered sign has an extracted image', async () => {
  await Promise.all(signs.map(item => access(new URL(`./public${item.image}`, import.meta.url))));
});
test('recognition tips have unique titles and valid source examples', () => {
  assert.equal(new Set(signTips.map(tip => tip.title)).size, signTips.length);
  for (const tip of signTips) {
    assert.ok(tip.title && tip.cue && tip.text);
    assert.ok(Array.isArray(tip.examples));
    for (const number of tip.examples) assert.ok(signs.some(sign => sign.number === number), `${tip.title}: ${number}`);
  }
});
test('all sign crops are lossless, nonblank and padded', async () => {
  for (const item of signs) {
    const image = sharp(fileURLToPath(new URL(`./public${item.image}`, import.meta.url)));
    const metadata = await image.metadata();
    assert.equal(metadata.format, 'png', item.id);
    assert.ok(metadata.width >= 20 && metadata.height >= 20, item.id);
    const { data, info } = await image.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let coloured = 0;
    for (let row = 0; row < info.height; row++) {
      for (let column = 0; column < info.width; column++) {
        const offset = (row * info.width + column) * info.channels;
        const pixel = data.subarray(offset, offset + info.channels);
        if (row < 3 || column < 3 || row >= info.height - 3 || column >= info.width - 3) assert.ok(pixel.every(channel => channel === 255), item.id);
        if (pixel.some(channel => channel < 225)) coloured++;
      }
    }
    assert.ok(coloured > 100, item.id);
  }
});
test('multiple-choice options are unique and contain the correct answer', () => {
  for (const item of signs) {
    const options = optionsFor(item, signs);
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4);
    assert.ok(options.includes(item.answer));
  }
});
test('review retains missed items until two consecutive correct answers', () => {
  let progress = recordAnswer({}, 'oral-1', false);
  assert.equal(selectQuestions(oral, 'review', progress).length, 1);
  progress = recordAnswer(progress, 'oral-1', true);
  assert.equal(selectQuestions(oral, 'review', progress).length, 1);
  progress = recordAnswer(progress, 'oral-1', true);
  assert.equal(selectQuestions(oral, 'review', progress).length, 0);
  progress = recordAnswer(progress, 'oral-1', false);
  assert.equal(progress['oral-1'].streak, 0);
  assert.equal(progress['oral-1'].attempts, 4);
});
test('shuffle does not mutate its input', () => {
  const original = [1, 2, 3];
  assert.deepEqual([...shuffled(original)].sort(), original);
  assert.deepEqual(original, [1, 2, 3]);
});
test('guided sessions prioritise mistakes and mix new oral and sign questions', () => {
  const progress = { 'sign-70': { attempts: 2, streak: 0, correct: 1, lastCorrect: false } };
  const plan = studyPlan(questions, progress);
  assert.equal(plan.length, 10);
  assert.equal(plan[0].id, 'sign-70');
  assert.ok(plan.some(item => item.type === 'oral'));
  assert.ok(plan.some(item => item.type === 'sign'));
  assert.equal(new Set(plan.map(item => item.id)).size, 10);
  assert.ok(!studyPlan(questions, {}, 200).some(item => item.id === 'sign-9'));
  assert.equal(improvementSummary(questions, progress)[0].review, 1);
});
test('guided sessions still introduce new questions with a large review backlog', () => {
  const progress = Object.fromEntries(signs.slice(10, 30).map(item => [item.id, { attempts: 1, streak: 0, correct: 0 }]));
  const plan = studyPlan(questions, progress);
  assert.equal(plan.filter(item => progress[item.id]).length, 6);
  assert.equal(plan.filter(item => !progress[item.id]).length, 4);
  const learned = Object.fromEntries(questions.map(item => [item.id, { attempts: 2, streak: 2, correct: 2 }]));
  assert.equal(studyPlan(questions, learned).length, 10);
  learned['oral-1'].attempts = 20;
  assert.ok(!studyPlan(questions, learned).some(item => item.id === 'oral-1'));
  assert.deepEqual(studyPlan([], {}), []);
});
test('missed answers get one later retry without mutating the queue', () => {
  const queue = studyPlan(questions, {});
  const retried = retryQuestion(queue, 0, false);
  assert.equal(queue.length, 10);
  assert.equal(retried.length, 11);
  assert.equal(retried[4].id, queue[0].id);
  assert.equal(retryQuestion(retried, 4, false).length, 11);
  assert.equal(retryQuestion(queue, 0, true), queue);
});
test('quick study covers fresh material with one review slot per five-item group', () => {
  const progress = Object.fromEntries(signs.slice(10, 30).map(item => [item.id, { attempts: 1, streak: 0, correct: 0 }]));
  const plan = quickStudyPlan(questions, progress);
  assert.equal(plan.length, 5);
  assert.equal(plan.filter(item => progress[item.id]).length, 1);
  assert.ok(plan.some(item => item.type === 'oral'));
  assert.ok(plan.some(item => item.type === 'sign'));
  assert.equal(new Set(plan.map(item => item.id)).size, 5);
  assert.ok(!quickStudyPlan(questions, {}, 200).some(item => item.id === 'sign-9'));
  assert.deepEqual(quickStudyPlan([], {}), []);
});