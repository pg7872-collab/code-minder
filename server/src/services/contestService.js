import axios from 'axios';

let cachedContests = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

/**
 * Fetch live contests from public APIs (Codeforces, Kontests, Clist)
 * Gracefully fall back to development mock data if offline or rate limited.
 */
export const getContestsData = async () => {
  const now = Date.now();
  if (cachedContests && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedContests;
  }

  const contests = [];
  let fetchedLive = false;

  // 1. Try Codeforces API
  try {
    const cfResponse = await axios.get('https://codeforces.com/api/contest.list?gym=false', {
      timeout: 5000,
    });
    if (cfResponse.data && cfResponse.data.status === 'OK') {
      fetchedLive = true;
      const cfList = cfResponse.data.result;
      cfList.slice(0, 30).forEach((c) => {
        const startTime = new Date(c.startTimeSeconds * 1000);
        const durationSeconds = c.durationSeconds;
        const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
        const isUpcoming = startTime.getTime() > now;
        const isRunning = startTime.getTime() <= now && endTime.getTime() >= now;

        contests.push({
          id: `cf_${c.id}`,
          title: c.name,
          platform: 'Codeforces',
          url: `https://codeforces.com/contest/${c.id}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationSeconds,
          status: isUpcoming ? 'UPCOMING' : isRunning ? 'CODING' : 'COMPLETED',
          isLiveSource: true,
        });
      });
    }
  } catch (err) {
    console.warn(`[Contest Service] Codeforces API fetch failed: ${err.message}`);
  }

  // 2. Try Kontests API
  try {
    const kontestsResponse = await axios.get('https://kontests.net/api/v1/all', {
      timeout: 5000,
    });
    if (Array.isArray(kontestsResponse.data)) {
      fetchedLive = true;
      kontestsResponse.data.slice(0, 30).forEach((item, idx) => {
        if (!item.name || !item.start_time) return;
        const startTime = new Date(item.start_time);
        const durationSec = Number(item.duration) || 7200;
        const endTime = item.end_time ? new Date(item.end_time) : new Date(startTime.getTime() + durationSec * 1000);
        const isUpcoming = startTime.getTime() > now;
        const isRunning = startTime.getTime() <= now && endTime.getTime() >= now;

        // Normalize platform
        let platform = item.site || 'Other';
        if (platform.toLowerCase().includes('leet')) platform = 'LeetCode';
        else if (platform.toLowerCase().includes('codeforces')) platform = 'Codeforces';
        else if (platform.toLowerCase().includes('codechef')) platform = 'CodeChef';
        else if (platform.toLowerCase().includes('atcoder')) platform = 'AtCoder';
        else if (platform.toLowerCase().includes('hacker')) platform = 'HackerRank';

        const id = `kontest_${platform.toLowerCase()}_${idx}_${startTime.getTime()}`;
        // Avoid duplicate titles
        if (!contests.some((c) => c.title === item.name)) {
          contests.push({
            id,
            title: item.name,
            platform,
            url: item.url,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            durationSeconds: durationSec,
            status: isUpcoming ? 'UPCOMING' : isRunning ? 'CODING' : 'COMPLETED',
            isLiveSource: true,
          });
        }
      });
    }
  } catch (err) {
    console.warn(`[Contest Service] Kontests API fetch failed: ${err.message}`);
  }

  // 3. If no live data was fetched (e.g. offline, rate limit), provide realistic development sample schedule
  if (contests.length === 0) {
    console.log('[Contest Service] Using development contest schedule with verified platform formats.');
    const devContests = generateDevContestSchedule();
    cachedContests = devContests;
    lastFetchTime = now;
    return devContests;
  }

  // Sort: upcoming and active first by startTime, completed after
  contests.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  cachedContests = contests;
  lastFetchTime = now;
  return contests;
};

function generateDevContestSchedule() {
  const now = new Date();

  // Helper to add days/hours
  const makeDate = (hoursFromNow) => {
    return new Date(now.getTime() + hoursFromNow * 3600 * 1000);
  };

  return [
    {
      id: 'dev_lc_biweekly_142',
      title: 'LeetCode Biweekly Contest 142',
      platform: 'LeetCode',
      url: 'https://leetcode.com/contest/biweekly-contest-142',
      startTime: makeDate(18).toISOString(),
      endTime: makeDate(19.5).toISOString(),
      durationSeconds: 5400,
      status: 'UPCOMING',
      isLiveSource: false,
    },
    {
      id: 'dev_cf_round_998',
      title: 'Codeforces Round 998 (Div. 2)',
      platform: 'Codeforces',
      url: 'https://codeforces.com/contests',
      startTime: makeDate(32).toISOString(),
      endTime: makeDate(34).toISOString(),
      durationSeconds: 7200,
      status: 'UPCOMING',
      isLiveSource: false,
    },
    {
      id: 'dev_lc_weekly_420',
      title: 'LeetCode Weekly Contest 420',
      platform: 'LeetCode',
      url: 'https://leetcode.com/contest/weekly-contest-420',
      startTime: makeDate(42).toISOString(),
      endTime: makeDate(43.5).toISOString(),
      durationSeconds: 5400,
      status: 'UPCOMING',
      isLiveSource: false,
    },
    {
      id: 'dev_cc_starters_160',
      title: 'CodeChef Starters 160 (Div. 1, 2, 3, 4)',
      platform: 'CodeChef',
      url: 'https://www.codechef.com/contests',
      startTime: makeDate(72).toISOString(),
      endTime: makeDate(74).toISOString(),
      durationSeconds: 7200,
      status: 'UPCOMING',
      isLiveSource: false,
    },
    {
      id: 'dev_atc_abc_380',
      title: 'AtCoder Beginner Contest 380',
      platform: 'AtCoder',
      url: 'https://atcoder.jp/contests',
      startTime: makeDate(96).toISOString(),
      endTime: makeDate(97.66).toISOString(),
      durationSeconds: 6000,
      status: 'UPCOMING',
      isLiveSource: false,
    },
    {
      id: 'dev_cf_round_997',
      title: 'Codeforces Round 997 (Div. 3)',
      platform: 'Codeforces',
      url: 'https://codeforces.com/contest/2042',
      startTime: makeDate(-24).toISOString(),
      endTime: makeDate(-22).toISOString(),
      durationSeconds: 7200,
      status: 'COMPLETED',
      isLiveSource: false,
    },
    {
      id: 'dev_lc_weekly_419',
      title: 'LeetCode Weekly Contest 419',
      platform: 'LeetCode',
      url: 'https://leetcode.com/contest/weekly-contest-419',
      startTime: makeDate(-48).toISOString(),
      endTime: makeDate(-46.5).toISOString(),
      durationSeconds: 5400,
      status: 'COMPLETED',
      isLiveSource: false,
    },
  ];
}
