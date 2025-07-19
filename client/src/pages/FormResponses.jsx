import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Paper,
  Box,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import AdminAppBar from '../components/AdminAppBar.jsx';

const FormResponses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [f, r, s] = await Promise.all([
      api.get(`/forms/${id}`),
      api.get(`/forms/${id}/responses`),
      api.get(`/forms/${id}/summary`),
    ]);
    setForm(f.data);
    setResponses(r.data);
    setSummary(s.data);
    setLoading(false);
  };

  const exportCSV = () => {
    const headers = form.questions.map((q) => q.label);
    const rows = responses.map((resp) =>
      resp.answers.map((a) => a.value.replace(/,/g, ';')).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${form.title}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <>
      <AdminAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {form.title} - Responses
        </Typography>
        <Button variant="outlined" onClick={exportCSV} sx={{ mb: 2 }}>
          Export CSV
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              {form.questions.map((q) => (
                <TableCell key={q._id}>{q.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.map((resp) => (
              <TableRow key={resp._id}>
                {resp.answers.map((a, idx) => (
                  <TableCell key={idx}>{a.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }} fontWeight={600}>
          Summary
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {summary.map((s, idx) => (
            <Paper key={idx} elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Q{idx + 1}. {s.question}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {s.counts ? (
                Object.entries(s.counts).map(([opt, cnt]) => (
                  <Typography key={opt} variant="body2" sx={{ ml: 1 }}>
                    • {opt}: {cnt}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', ml: 1 }}>
                  {s.answers.join(', ')}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default FormResponses;
