import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';
import Form from '../models/Form.js';
import Response from '../models/Response.js';

// @desc   Create new feedback form (3-5 questions)
// @route  POST /api/forms
// @access Private (admin)
export const createForm = asyncHandler(async (req, res) => {
  const { title, questions } = req.body;
  if (!title || !questions || questions.length < 3 || questions.length > 5) {
    res.status(400);
    throw new Error('Title and 3-5 questions are required');
  }
  const slug = nanoid(10);
  const form = await Form.create({
    title,
    questions,
    owner: req.user._id,
    slug,
  });
  res.status(201).json(form);
});

// @desc   Get all forms for admin
// @route  GET /api/forms
// @access Private
export const getForms = asyncHandler(async (req, res) => {
  const forms = await Form.find({ owner: req.user._id });
  res.json(forms);
});

// @desc   Get single form (+responses?) by id (admin)
// @route  GET /api/forms/:id
// @access Private
export const getForm = asyncHandler(async (req, res) => {
  const form = await Form.findOne({ _id: req.params.id, owner: req.user._id });
  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }
  res.json(form);
});

// @desc   Get public form by slug (no auth)
// @route  GET /api/public/:slug
export const getFormBySlug = asyncHandler(async (req, res) => {
  const form = await Form.findOne({ slug: req.params.slug }).select('-owner');
  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }
  res.json(form);
});

// @desc   Submit response to a form (public)
// @route  POST /api/public/:slug/submit
export const submitResponse = asyncHandler(async (req, res) => {
  const form = await Form.findOne({ slug: req.params.slug });
  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }
  const { answers } = req.body; // array of {questionId, value}
  if (!answers || answers.length !== form.questions.length) {
    res.status(400);
    throw new Error('Answers count mismatch');
  }
  const response = await Response.create({ form: form._id, answers });
  res.status(201).json({ message: 'Submitted', id: response._id });
});

// @desc   Get responses for a form (admin)
// @route  GET /api/forms/:id/responses
// @access Private
export const getResponses = asyncHandler(async (req, res) => {
  const form = await Form.findOne({ _id: req.params.id, owner: req.user._id });
  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }
  const responses = await Response.find({ form: form._id });
  res.json(responses);
});

// @desc   Get basic summary per question
// @route  GET /api/forms/:id/summary
// @access Private
export const getSummary = asyncHandler(async (req, res) => {
  const form = await Form.findOne({ _id: req.params.id, owner: req.user._id });
  if (!form) {
    res.status(404);
    throw new Error('Form not found');
  }
  const responses = await Response.find({ form: form._id });
  // simple summary: for each question list array of answers / counts for mcq
  const summary = form.questions.map((q) => {
    const answersArr = responses.map((r) => r.answers.find((a) => a.questionId.toString() === q._id.toString())?.value || null);
    if (q.type === 'mcq') {
      const counts = {};
      q.options.forEach((opt) => (counts[opt] = 0));
      answersArr.forEach((val) => {
        if (val in counts) counts[val]++;
      });
      return { question: q.label, counts };
    }
    return { question: q.label, answers: answersArr };
  });
  res.json(summary);
});
