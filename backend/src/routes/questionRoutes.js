import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';
import Question from '../models/Question.js';
import { asyncHandler } from '../Middleware/errorHandler.js';

const router = express.Router();

router.use(protect);

const mockQuestions = [
  {
    _id: '1',
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
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def twoSum(nums, target):\n    # Your code here',
    },
    hints: [
      'Use a hash map to store numbers and their indices',
      'Check if complement exists in the map'
    ],
    tags: ['array', 'hash-table'],
    companies: ['Google', 'Amazon', 'Facebook'],
    frequency: 5,
    acceptanceRate: 45.6,
    totalAttempts: 10000,
    totalSolved: 4560,
    averageTime: 15,
    likes: 1200,
    dislikes: 200,
  },
  {
    _id: '2',
    title: 'Reverse a Linked List',
    description: 'Reverse a singly linked list.',
    type: 'coding',
    category: 'coding',
    topic: 'linked_list',
    difficulty: 'medium',
    constraints: [
      'Do it in O(n) time and O(1) space'
    ],
    examples: [
      {
        input: '1->2->3->4->5->NULL',
        output: '5->4->3->2->1->NULL',
        explanation: 'The linked list is reversed'
      }
    ],
    starterCode: {
      javascript: 'function reverseList(head) {\n  // Your code here\n}',
      python: 'def reverseList(head):\n    # Your code here',
    },
    hints: [
      'Use three pointers: prev, current, next',
      'Iterate through the list and reverse pointers'
    ],
    tags: ['linked-list'],
    companies: ['Microsoft', 'Apple', 'Amazon'],
    frequency: 4,
    acceptanceRate: 60.2,
    totalAttempts: 8000,
    totalSolved: 4816,
    averageTime: 20,
    likes: 950,
    dislikes: 150,
  }
];

// Get questions with filters
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, difficulty, topic, type } = req.query;

    // For development, return mock data
    let filteredQuestions = [...mockQuestions];
    
    if (category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }
    if (topic) {
      filteredQuestions = filteredQuestions.filter(q => q.topic === topic);
    }
    if (type) {
      filteredQuestions = filteredQuestions.filter(q => q.type === type);
    }

    res.status(200).json({
      success: true,
      count: filteredQuestions.length,
      questions: filteredQuestions,
    });
  })
);

// Get question by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const question = mockQuestions.find(q => q._id === req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  })
);

// Get question hints
router.get(
  '/:id/hints',
  asyncHandler(async (req, res) => {
    const question = mockQuestions.find(q => q._id === req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      hints: question.hints,
    });
  })
);

// Get question solution
router.get(
  '/:id/solution',
  asyncHandler(async (req, res) => {
    const question = mockQuestions.find(q => q._id === req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Mock solution
    const solution = {
      approach: 'Use a hash map to store numbers and their indices. For each number, check if its complement exists in the map.',
      code: {
        javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}',
        python: 'def twoSum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i',
      },
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)'
    };

    res.status(200).json({
      success: true,
      solution,
    });
  })
);

export default router;