const KEY = 'grammanual-progress-v1';

const getStars = (score) => {
  if (score >= 100) return 3;
  if (score >= 70)  return 2;
  if (score >= 40)  return 1;
  return 0;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

export const getProgress = () => {
  try {
    const p = JSON.parse(localStorage.getItem(KEY)) || {};
    if (!p.tests) p.tests = {};
    if (!p.streak) p.streak = { current: 0, longest: 0, lastActiveDate: null };
    return p;
  } catch {
    return { tests: {}, totalXP: 0, streak: { current: 0, longest: 0, lastActiveDate: null } };
  }
};

const recordActivity = (p) => {
  const today = todayStr();
  const streak = p.streak || { current: 0, longest: 0, lastActiveDate: null };

  if (streak.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak.current = streak.lastActiveDate === yesterday ? streak.current + 1 : 1;
    streak.longest = Math.max(streak.longest || 0, streak.current);
    streak.lastActiveDate = today;
  }
  p.streak = streak;
  return p;
};

export const saveTestResult = (moduleId, score) => {
  const p = getProgress();
  const prev = p.tests[moduleId];
  const isHighScore = !prev || score > prev.bestScore;
  p.tests[moduleId] = {
    bestScore: isHighScore ? score : prev.bestScore,
    lastScore: score,
    attempts: (prev?.attempts || 0) + 1,
    lastDate: new Date().toISOString(),
  };
  p.totalXP = Object.values(p.tests).reduce((acc, t) => acc + t.bestScore, 0);
  recordActivity(p);
  localStorage.setItem(KEY, JSON.stringify(p));
  return { isHighScore, prevBest: prev?.bestScore || 0 };
};

export const getModuleResult = (moduleId) => getProgress().tests?.[moduleId] || null;

export const getStreak = () => getProgress().streak;

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
