import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Checkbox,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/public/${slug}`);
        setForm(data);
        setLoading(false);
      } catch (err) {
        setError('Form not found');
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleChange = (qid, value, multi = false) => {
    if (multi) {
      const current = answers[qid] || [];
      const exists = current.includes(value);
      const updated = exists ? current.filter((v) => v !== value) : [...current, value];
      setAnswers({ ...answers, [qid]: updated });
    } else {
      setAnswers({ ...answers, [qid]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/public/${slug}/submit`, {
        answers: form.questions.map((q) => {
          const val = answers[q._id];
          return { questionId: q._id, value: Array.isArray(val) ? val.join(', ') : (val || '') };
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (submitted) return <Typography sx={{ mt: 4 }}>Thank you for your feedback!</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {form.title}
      </Typography>
      {form.questions.map((q) => (
        <Box key={q._id} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">{q.label}</Typography>
          {q.type === 'text' ? (
            <TextField
              fullWidth
              value={answers[q._id] || ''}
              onChange={(e) => handleChange(q._id, e.target.value)}
              sx={{ '& .MuiInputBase-root': { height: 48 } }}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {q.options.map((opt) => (
                <FormControlLabel
                  key={opt}
                  control={
                    <Checkbox
                      checked={(answers[q._id] || []).includes(opt)}
                      onChange={() => handleChange(q._id, opt, true)}
                    />
                  }
                  label={opt}
                />
              ))}
            </Box>
          )}
        </Box>
      ))}
      <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ maxWidth: { sm: 200 } }}>
        Submit
      </Button>
    </Container>
  );
};

export default PublicForm;
