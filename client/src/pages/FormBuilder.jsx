import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios.js';
import AdminAppBar from '../components/AdminAppBar.jsx';
import { useNavigate } from 'react-router-dom';

const FormBuilder = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({ label: '', type: 'text', options: '' });
  const [error, setError] = useState('');

  const addQuestion = () => {
    if (!newQ.label) return;
    const q = { ...newQ };
    if (q.type === 'mcq') q.options = q.options.split(',').map((o) => o.trim());
    else delete q.options;
    setQuestions([...questions, q]);
    setNewQ({ label: '', type: 'text', options: '' });
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/forms', {
        title,
        questions,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating form');
    }
  };

  return (
    <>
      <AdminAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Feedback Form
        </Typography>

        <TextField fullWidth label="Form Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Question"
            value={newQ.label}
            onChange={(e) => setNewQ({ ...newQ, label: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Type"
            value={newQ.type}
            onChange={(e) => setNewQ({ ...newQ, type: e.target.value })}
            sx={{ width: 120 }}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="mcq">MCQ</MenuItem>
          </TextField>
          {newQ.type === 'mcq' && (
            <TextField
              label="Options (comma)"
              value={newQ.options}
              onChange={(e) => setNewQ({ ...newQ, options: e.target.value })}
              fullWidth
            />
          )}
          <Button variant="outlined" onClick={addQuestion}>
            Add
          </Button>
        </Box>

        <List>
          {questions.map((q, idx) => (
            <ListItem key={idx} secondaryAction={<IconButton onClick={() => removeQuestion(idx)}><DeleteIcon /></IconButton>}>
              <ListItemText
                primary={`${idx + 1}. ${q.label} (${q.type}${q.type === 'mcq' ? ', options: ' + q.options.join(', ') : ''})`}
              />
            </ListItem>
          ))}
        </List>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button variant="contained" onClick={handleSubmit} disabled={questions.length < 3 || questions.length > 5 || !title}>
          Save Form
        </Button>
      </Container>
    </>
  );
};

export default FormBuilder;
