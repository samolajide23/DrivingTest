export function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function optionsFor(question, bank) {
  const alternatives = [...new Set(bank.filter(item => item.type === question.type && item.answer !== question.answer && !item.note).map(item => item.answer))];
  return shuffled([question.answer, ...shuffled(alternatives).slice(0, 3)]);
}

export function recordAnswer(progress, id, correct) {
  const previous = progress[id] || { attempts: 0, streak: 0, correct: 0 };
  return { ...progress, [id]: { attempts: previous.attempts + 1, correct: previous.correct + Number(correct), streak: correct ? previous.streak + 1 : 0, lastCorrect: correct } };
}

export function selectQuestions(bank, mode, progress) {
  return bank.filter(item => mode !== 'review' || (progress[item.id]?.attempts > 0 && progress[item.id].streak < 2));
}

export function studyPlan(bank, progress, limit = 10) {
  const eligible = bank.filter(item => item.id !== 'sign-9');
  const priority = item => {
    const entry = progress[item.id];
    if (entry?.attempts && entry.streak < 2) return entry.lastCorrect === false || entry.streak === 0 ? 0 : 1;
    return entry?.streak >= 2 ? 3 : 2;
  };
  const ordered = eligible.map((item, index) => ({ item, index })).sort((first, second) => priority(first.item) - priority(second.item) || (priority(first.item) === 3 ? progress[first.item.id].attempts - progress[second.item.id].attempts : 0) || first.index - second.index).map(entry => entry.item);
  const pending = ordered.filter(item => priority(item) < 2);
  const fresh = ordered.filter(item => priority(item) === 2);
  const mixed = [];
  const byType = [fresh.filter(item => item.type === 'oral'), fresh.filter(item => item.type === 'sign')];
  while (byType.some(items => items.length)) {
    for (const items of byType) if (items.length) mixed.push(items.shift());
  }
  const reviewSlots = mixed.length ? Math.min(pending.length, Math.ceil(limit * 0.6)) : limit;
  const selected = [...pending.slice(0, reviewSlots), ...mixed.slice(0, limit - reviewSlots)];
  if (selected.length < limit) selected.push(...pending.slice(reviewSlots, reviewSlots + limit - selected.length));
  if (selected.length < limit) selected.push(...ordered.filter(item => priority(item) === 3).slice(0, limit - selected.length));
  return selected.slice(0, limit);
}

export function improvementSummary(bank, progress) {
  return [['sign', 'Road signs'], ['oral', 'Oral answers']].map(([type, label]) => {
    const items = bank.filter(item => item.type === type && item.id !== 'sign-9');
    return { type, label, total: items.length, learned: items.filter(item => progress[item.id]?.streak >= 2).length, review: items.filter(item => progress[item.id]?.attempts > 0 && progress[item.id].streak < 2).length };
  }).sort((first, second) => second.review - first.review);
}

export function retryQuestion(queue, position, correct) {
  const question = queue[position];
  if (correct || !question || queue.filter(item => item.id === question.id).length > 1) return queue;
  const result = [...queue];
  result.splice(Math.min(position + 4, result.length), 0, question);
  return result;
}