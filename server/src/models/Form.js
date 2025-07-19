import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, enum: ['text', 'mcq'], default: 'text' },
  options: [String], // only for mcq
});

const formSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: [questionSchema],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

const Form = mongoose.model('Form', formSchema);
export default Form;
