const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');
const { log } = require('console');

// Define CORS options
const corsOptions = {
  origin: 'https://leatcode.vercel.app', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true, // Enable if your API requires credentials
};

// Apply CORS middleware with the defined options
app.use(cors(corsOptions));

// LeetCode GraphQL API URL
const LEETCODE_API_URL = 'https://leetcode.com/graphql/';

// Helper function to make GraphQL requests
const makeGraphQLRequest = async (query, variables) => {
  try {
    const response = await axios.post(LEETCODE_API_URL, {
      query,
      variables,
    });
    return response.data;
  } catch (error) {
    console.error('Error making GraphQL request:', error.message);
    throw error;
  }
};

// Check if username is valid by attempting to fetch user profile
const isValidUsername = async (username) => {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
      }
    }
  `;
  try {
    const response = await makeGraphQLRequest(query, { username });
    // If matchedUser is null, the username is invalid
    if (!response.data || !response.data.matchedUser) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

app.get('/', (req, res) => {
  res.send('pani chusko ra pulka!!');
});

app.get('/:username', async (req, res) => {
  const username = req.params.username; 
  console.log('Fetching data for user:', username);

  // Step 1: Check if the username is valid
  const validUser = await isValidUsername(username);  
  if (!validUser) {
    return res.status(404).json({ message: 'User Not Found' });
  }

  const queries = [
    {
      query: `query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          contestBadge {
            name
            expired
            hoverText
            icon
          }
          username
          githubUrl
          twitterUrl
          linkedinUrl
          profile {
            ranking
            userAvatar
            realName
            aboutMe
            school
            websites
            countryName
            company
            jobTitle
            skillTags
            postViewCount
            postViewCountDiff
            reputation
            reputationDiff
            solutionCount
            solutionCountDiff
            categoryDiscussCount
            categoryDiscussCountDiff
          }
        }
      }`,
      variables: { username },
    },
    {
      query: `query languageStats($username: String!) {
        matchedUser(username: $username) {
          languageProblemCount {
            languageName
            problemsSolved
          }
        }
      }`,
      variables: { username },
    },
    {
      query: `query skillStats($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
        }
      }`,
      variables: { username },
    },
    {
      query: `query userProfileUserQuestionProgressV2($userSlug: String!) {
        userProfileUserQuestionProgressV2(userSlug: $userSlug) {
          numAcceptedQuestions {
            count
            difficulty
          }
          numFailedQuestions {
            count
            difficulty
          }
          numUntouchedQuestions {
            count
            difficulty
          }
          userSessionBeatsPercentage {
            difficulty
            percentage
          }
          totalQuestionBeatsPercentage
        }
      }`,
      variables: { userSlug: username },
    },
    {
      query: `query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          contributions {
            points
          }
          profile {
            reputation
            ranking
          }
          submissionCalendar
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
        recentSubmissionList(username: $username) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
          __typename
        }
        matchedUserStats: matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
              __typename
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
              __typename
            }
            __typename
          }
        }
      }`,
      variables: { username },
    },
    {
      query: `query userBadges($username: String!) {
        matchedUser(username: $username) {
          badges {
            id
            name
            shortName
            displayName
            icon
            hoverText
            medal {
              slug
              config {
                iconGif
                iconGifBackground
              }
            }
            creationDate
            category
          }
          upcomingBadges {
            name
            icon
            progress
          }
        }
      }`,
      variables: { username },
    },
    {
      query: `query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
      }`,
      variables: { username },
    },
    {
      query: `query getStreakCounter {
        streakCounter {
          streakCount
          daysSkipped
          currentDayCompleted
        }
      }`,
      variables: {},
    },
  ];

  try {
    // Run all queries in parallel
    const responses = await Promise.all(
      queries.map((queryObj) => makeGraphQLRequest(queryObj.query, queryObj.variables))
    );

    // Send combined response
    res.json(responses);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
