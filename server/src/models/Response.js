import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  value: String,
});

const responseSchema = new mongoose.Schema(
  {
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: [answerSchema],
  },
  { timestamps: true }
);

const Response = mongoose.model('Response', responseSchema);
export default Response;
