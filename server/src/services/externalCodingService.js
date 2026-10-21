import axios from 'axios';

/**
 * Fetch Codeforces statistics via official API
 */
export const fetchCodeforcesStats = async (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Valid Codeforces handle required');
  }

  const cleanHandle = username.trim();
  const infoUrl = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanHandle)}`;

  try {
    const infoRes = await axios.get(infoUrl, { timeout: 6000 });
    if (infoRes.data && infoRes.data.status === 'OK' && infoRes.data.result.length > 0) {
      const user = infoRes.data.result[0];

      let solvedCount = 0;
      // Fetch solved questions count via official user.status
      try {
        const statusRes = await axios.get(
          `https://codeforces.com/api/user.status?handle=${encodeURIComponent(cleanHandle)}&from=1&count=1000`,
          { timeout: 6000 }
        );
        if (statusRes.data && statusRes.data.status === 'OK') {
          const solvedSet = new Set();
          statusRes.data.result.forEach((sub) => {
            if (sub.verdict === 'OK' && sub.problem) {
              solvedSet.add(`${sub.problem.contestId}_${sub.problem.index}`);
            }
          });
          solvedCount = solvedSet.size;
        }
      } catch (statusErr) {
        // Status fetch optional if rate limited
      }

      return {
        username: cleanHandle,
        rating: user.rating || 0,
        rank: user.rank || 'Unrated',
        solved: solvedCount,
        lastFetched: new Date(),
      };
    }
    throw new Error('User not found on Codeforces');
  } catch (err) {
    if (err.response && err.response.status === 400) {
      throw new Error(`Codeforces handle "${cleanHandle}" not found.`);
    }
    throw new Error(`Codeforces API error: ${err.message}`);
  }
};

/**
 * Fetch LeetCode statistics via official GraphQL query
 */
export const fetchLeetCodeStats = async (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Valid LeetCode username required');
  }

  const cleanUsername = username.trim();
  const graphqlUrl = 'https://leetcode.com/graphql';

  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      graphqlUrl,
      {
        query,
        variables: { username: cleanUsername },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CodeMinder-DSA-Platform/1.0',
        },
        timeout: 6000,
      }
    );

    const data = response.data?.data?.matchedUser;
    if (!data) {
      throw new Error(`LeetCode user "${cleanUsername}" not found.`);
    }

    const acStats = data.submitStatsGlobal?.acSubmissionNum || [];
    let totalSolved = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    acStats.forEach((stat) => {
      if (stat.difficulty === 'All') totalSolved = stat.count;
      if (stat.difficulty === 'Easy') easy = stat.count;
      if (stat.difficulty === 'Medium') medium = stat.count;
      if (stat.difficulty === 'Hard') hard = stat.count;
    });

    return {
      username: cleanUsername,
      solved: totalSolved,
      easy,
      medium,
      hard,
      ranking: data.profile?.ranking || 0,
      lastFetched: new Date(),
    };
  } catch (err) {
    throw new Error(`LeetCode fetch failed: ${err.message}`);
  }
};
