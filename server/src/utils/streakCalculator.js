/**
 * Calculate user streaks and activity metrics from solved questions
 */
export const calculateStreaks = (dates = []) => {
  if (!dates || dates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      lastActiveDate: null,
    };
  }

  // Normalize dates to YYYY-MM-DD set of unique days
  const dateSet = new Set();
  dates.forEach((d) => {
    if (d) {
      const dateObj = new Date(d);
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        dateSet.add(`${year}-${month}-${day}`);
      }
    }
  });

  const sortedDays = Array.from(dateSet).sort();
  if (sortedDays.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      lastActiveDate: null,
    };
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (let i = 0; i < sortedDays.length; i++) {
    const currentDate = new Date(sortedDays[i]);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = currentDate - prevDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  // Calculate current streak
  const now = new Date();
  const formatDay = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDay(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = formatDay(yesterday);

  let currentStreak = 0;
  const lastActiveStr = sortedDays[sortedDays.length - 1];

  // If active today or yesterday, streak is currently active
  if (lastActiveStr === todayStr || lastActiveStr === yesterdayStr) {
    let checkDate = new Date(lastActiveStr);
    while (dateSet.has(formatDay(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalActiveDays: sortedDays.length,
    lastActiveDate: new Date(lastActiveStr),
  };
};

/**
 * Generate 7-day and 30-day activity datasets for Recharts
 */
export const generateActivityTimeline = (dates = []) => {
  const dailyCounts = {};

  dates.forEach((d) => {
    if (d) {
      const dateObj = new Date(d);
      if (!isNaN(dateObj.getTime())) {
        const key = dateObj.toISOString().split('T')[0];
        dailyCounts[key] = (dailyCounts[key] || 0) + 1;
      }
    }
  });

  // Last 7 days
  const weekly = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const key = day.toISOString().split('T')[0];
    const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
    weekly.push({
      date: key,
      day: dayName,
      count: dailyCounts[key] || 0,
    });
  }

  // Last 4 weeks / 30 days
  const monthly = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const key = day.toISOString().split('T')[0];
    const display = `${day.getMonth() + 1}/${day.getDate()}`;
    monthly.push({
      date: key,
      label: display,
      count: dailyCounts[key] || 0,
    });
  }

  return { weekly, monthly, dailyCounts };
};
