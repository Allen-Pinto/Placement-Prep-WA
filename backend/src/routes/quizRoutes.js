import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

const mockAttempts = [
  {
    _id: 'attempt_1',
    quiz: {
      _id: '1',
      title: 'JavaScript Fundamentals',
      type: 'coding',
      difficulty: 'easy'
    },
    score: 85,
    percentage: 85,
    status: 'completed',
    createdAt: new Date().toISOString(),
    totalTimeSpent: 1200,
    user: 'user123'
  },
  {
    _id: 'attempt_2',
    quiz: {
      _id: '2',
      title: 'Data Structures & Algorithms',
      type: 'coding',
      difficulty: 'medium'
    },
    score: 65,
    percentage: 65,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    totalTimeSpent: 1800,
    user: 'user123'
  }
];

const mockQuizzes = [
  {
    _id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and ES6 features.',
    type: 'coding',
    difficulty: 'easy',
    category: ['javascript', 'fundamentals'],
    questionCount: 3,
    timeLimit: 1800, // 30 minutes
    totalMarks: 100,
    totalAttempts: 1500,
    averageScore: 72,
    highestScore: 100,
    lowestScore: 25,
    questions: [
      {
        _id: 'q1',
        title: 'Two Sum',
        description: 'Given an array of integers and a target, return indices of the two numbers that add up to the target.',
        type: 'coding',
        category: 'coding',
        topic: 'arrays_hashing',
        difficulty: 'easy',
        constraints: [
          'Each input has exactly one solution',
          'Cannot use the same element twice'
        ],
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          }
        ],
        starterCode: {
          javascript: 'function twoSum(nums, target) {\n  // Your code here\n  return [];\n}',
          python: 'def twoSum(nums, target):\n    # Your code here\n    return []',
        },
        hints: [
          'Use a hash map to store numbers and their indices',
          'Check if complement exists in the map'
        ],
        tags: ['array', 'hash-table'],
        companies: ['Google', 'Amazon', 'Facebook'],
      },
      {
        _id: 'q2',
        title: 'Reverse a String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters.',
        type: 'coding',
        category: 'coding',
        topic: 'two_pointers',
        difficulty: 'easy',
        constraints: [
          'Do not allocate extra space for another array',
          'Modify the input array in-place with O(1) extra memory'
        ],
        examples: [
          {
            input: '["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
            explanation: 'The string is reversed in place'
          }
        ],
        starterCode: {
          javascript: 'function reverseString(s) {\n  // Your code here\n}',
          python: 'def reverseString(s):\n    # Your code here\n    pass',
        },
        hints: [
          'Use two pointers approach',
          'Swap characters from start and end'
        ],
        tags: ['string', 'two-pointers'],
        companies: ['Microsoft', 'Apple'],
      },
      {
        _id: 'q3',
        title: 'Valid Parentheses',
        description: 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
        type: 'coding',
        category: 'coding',
        topic: 'stack',
        difficulty: 'easy',
        constraints: [
          '1 <= s.length <= 10^4',
          'String consists of parentheses only "()[]{}"'
        ],
        examples: [
          {
            input: '"()"',
            output: 'true',
            explanation: 'Valid parentheses'
          },
          {
            input: '"([)]"',
            output: 'false',
            explanation: 'Invalid parentheses'
          }
        ],
        starterCode: {
          javascript: 'function isValid(s) {\n  // Your code here\n  return false;\n}',
          python: 'def isValid(s):\n    # Your code here\n    return False',
        },
        hints: [
          'Use a stack to keep track of opening brackets',
          'When you see a closing bracket, check if it matches the top of the stack'
        ],
        tags: ['string', 'stack'],
        companies: ['Amazon', 'Google', 'Bloomberg'],
      }
    ],
  },
  {
    _id: '2',
    title: 'Data Structures & Algorithms',
    description: 'Advanced problems on arrays, linked lists, trees, and algorithms.',
    type: 'coding',
    difficulty: 'medium',
    category: ['data-structures', 'algorithms'],
    questionCount: 2,
    timeLimit: 3600, // 60 minutes
    totalMarks: 150,
    totalAttempts: 800,
    averageScore: 58,
    highestScore: 95,
    lowestScore: 15,
    questions: [
      {
        _id: 'q4',
        title: 'Binary Search',
        description: 'Given a sorted array of integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
        type: 'coding',
        category: 'coding',
        topic: 'binary_search',
        difficulty: 'medium',
        constraints: [
          'Array contains distinct values sorted in ascending order',
          'Algorithm should run in O(log n) time'
        ],
        examples: [
          {
            input: 'nums = [1,3,5,6], target = 5',
            output: '2',
            explanation: 'Target found at index 2'
          },
          {
            input: 'nums = [1,3,5,6], target = 2',
            output: '1',
            explanation: 'Target would be inserted at index 1'
          }
        ],
        starterCode: {
          javascript: 'function searchInsert(nums, target) {\n  // Your code here\n  return 0;\n}',
          python: 'def searchInsert(nums, target):\n    # Your code here\n    return 0',
        },
        hints: [
          'Use binary search algorithm',
          'Handle the case when target is not found'
        ],
        tags: ['array', 'binary-search'],
        companies: ['Facebook', 'Microsoft'],
      }
    ],
  }
];

// FIXED: Get user attempts - This route was missing!
router.get('/user/attempts', async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;
    
    console.log('📥 Fetching user attempts with limit:', limit);
    
    // Filter attempts for current user (in real app, query database)
    const userAttempts = mockAttempts
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: userAttempts.length,
      attempts: userAttempts,
    });
  } catch (error) {
    console.error('Error in /user/attempts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attempts',
    });
  }
});

// Get all quizzes with filters
router.get('/', async (req, res) => {
  const { type, difficulty, category } = req.query;
  
  let filteredQuizzes = [...mockQuizzes];
  
  if (type) {
    filteredQuizzes = filteredQuizzes.filter(q => q.type === type);
  }
  if (difficulty) {
    filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === difficulty);
  }
  if (category) {
    filteredQuizzes = filteredQuizzes.filter(q => 
      q.category.includes(category)
    );
  }

  res.status(200).json({
    success: true,
    count: filteredQuizzes.length,
    quizzes: filteredQuizzes,
  });
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  const quiz = mockQuizzes.find(q => q._id === req.params.id);
  
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found',
    });
  }

  res.status(200).json({
    success: true,
    quiz,
  });
});

// Start quiz
router.post('/:id/start', async (req, res) => {
  const quiz = mockQuizzes.find(q => q._id === req.params.id);
  
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found',
    });
  }

  // Mock attempt
  const attempt = {
    _id: `attempt_${Date.now()}`,
    quiz: {
      _id: quiz._id,
      title: quiz.title,
      type: quiz.type,
      difficulty: quiz.difficulty
    },
    startTime: new Date().toISOString(),
    status: 'in_progress'
  };

  res.status(200).json({
    success: true,
    attempt,
    quiz,
  });
});

// Submit answer for a question
router.post('/attempts/:attemptId/answer', async (req, res) => {
  const { questionId, answer, timeSpent } = req.body;
  
  // Mock implementation - in real app, save to database
  console.log('Answer submitted:', { attemptId: req.params.attemptId, questionId, answer, timeSpent });
  
  res.status(200).json({
    success: true,
    message: 'Answer saved successfully',
  });
});

// Submit entire quiz
router.post('/attempts/:attemptId/submit', async (req, res) => {
  const { answers } = req.body;
  
  console.log('Quiz submitted:', { attemptId: req.params.attemptId, answers });
  
  // Mock results
  const results = {
    _id: req.params.attemptId,
    score: 85,
    percentage: 85,
    correctAnswers: 2,
    incorrectAnswers: 1,
    skippedQuestions: 0,
    totalQuestions: 3,
    isPassed: true,
    totalTimeSpent: 1200, // 20 minutes
    topicWiseScore: [
      { topic: 'arrays_hashing', correct: 1, total: 1, percentage: 100 },
      { topic: 'two_pointers', correct: 1, total: 1, percentage: 100 },
      { topic: 'stack', correct: 0, total: 1, percentage: 0 }
    ],
    difficultyWiseScore: {
      easy: { correct: 2, total: 3 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    }
  };

  res.status(200).json({
    success: true,
    message: 'Quiz submitted successfully',
    results,
  });
});

// Get quiz results
router.get('/attempts/:attemptId/results', async (req, res) => {
  // Mock results
  const results = {
    _id: req.params.attemptId,
    score: 85,
    percentage: 85,
    correctAnswers: 2,
    incorrectAnswers: 1,
    skippedQuestions: 0,
    totalQuestions: 3,
    isPassed: true,
    totalTimeSpent: 1200,
    topicWiseScore: [
      { topic: 'arrays_hashing', correct: 1, total: 1, percentage: 100 },
      { topic: 'two_pointers', correct: 1, total: 1, percentage: 100 },
      { topic: 'stack', correct: 0, total: 1, percentage: 0 }
    ],
    difficultyWiseScore: {
      easy: { correct: 2, total: 3 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    },
    answers: [
      {
        question: {
          _id: 'q1',
          title: 'Two Sum',
          solution: {
            approach: 'Use a hash map to store numbers and their indices. For each number, check if its complement exists in the map.',
            code: {
              javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}'
            }
          }
        },
        answer: 'function twoSum(nums, target) {\n  // User code\n}',
        isCorrect: true,
        timeSpent: 300
      },
      {
        question: {
          _id: 'q2',
          title: 'Reverse a String',
          solution: {
            approach: 'Use two pointers to swap characters from start and end.',
            code: {
              javascript: 'function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n}'
            }
          }
        },
        answer: 'function reverseString(s) {\n  // User code\n}',
        isCorrect: true,
        timeSpent: 200
      },
      {
        question: {
          _id: 'q3',
          title: 'Valid Parentheses',
          solution: {
            approach: 'Use a stack to track opening brackets and pop when matching closing bracket is found.',
            code: {
              javascript: 'function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  \n  for (let char of s) {\n    if (!map[char]) {\n      stack.push(char);\n    } else if (stack.pop() !== map[char]) {\n      return false;\n    }\n  }\n  return stack.length === 0;\n}'
            }
          }
        },
        answer: 'function isValid(s) {\n  // User code\n}',
        isCorrect: false,
        timeSpent: 400
      }
    ],
    quiz: {
      _id: '1',
      title: 'JavaScript Fundamentals',
      passingScore: 60
    }
  };

  res.status(200).json({
    success: true,
    results,
  });
});

export default router;