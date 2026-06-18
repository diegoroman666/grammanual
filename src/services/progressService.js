const KEY = 'grammanual-progress-v1';

const getStars = (score) => {
  if (score >= 100) return 3;
  if (score >= 70)  return 2;
  if (score >= 40)  return 1;
  return 0;
};

export const getProgress = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { tests: {}, totalXP: 0 }; }
  catch { return { tests: {}, totalXP: 0 }; }
};

export const saveTestResult = (moduleId, score) => {
  const p = getProgress();
  if (!p.tests) p.tests = {};
  const prev = p.tests[moduleId];
  const isHighScore = !prev || score > prev.bestScore;
  p.tests[moduleId] = {
    bestScore: isHighScore ? score : prev.bestScore,
    lastScore: score,
    attempts: (prev?.attempts || 0) + 1,
    lastDate: new Date().toISOString(),
  };
  p.totalXP = Object.values(p.tests).reduce((acc, t) => acc + t.bestScore, 0);
  localStorage.setItem(KEY, JSON.stringify(p));
  return { isHighScore, prevBest: prev?.bestScore || 0 };
};

export const getModuleResult = (moduleId) => getProgress().tests?.[moduleId] || null;

export const isLevelUnlocked = (level) => {
  if (level === 'beginner') return true;
  const p = getProgress();
  if (level === 'intermediate') {
    const passed = ['b1','b2','b3','b4','b5'].filter(id => getStars(p.tests?.[id]?.bestScore || 0) >= 1).length;
    return passed >= 3;
  }
  if (level === 'expert') {
    const passed = ['i1','i2','i3','i4','i5'].filter(id => getStars(p.tests?.[id]?.bestScore || 0) >= 1).length;
    return passed >= 3;
  }
  return false;
};

export const clearProgress = () => localStorage.removeItem(KEY);
