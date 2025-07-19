import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api/axios.js';
import AdminAppBar from '../components/AdminAppBar.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    const { data } = await api.get('/forms');
    setForms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <>
      <AdminAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Button component={RouterLink} to="/forms/new" variant="contained" sx={{ mr: 2 }}>
          Create Form
        </Button>
        <Button onClick={logout} variant="outlined">
          Logout
        </Button>

        {loading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 1 }}>
            {forms.map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f._id}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {f.title}
                    </Typography>
                    <Link component={RouterLink} to={`/f/${f.slug}`} underline="hover">
                      {window.location.origin}/f/{f.slug}
                    </Link>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={RouterLink} to={`/forms/${f._id}`}>Responses</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
