import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FormBuilder from './pages/FormBuilder.jsx';
import FormResponses from './pages/FormResponses.jsx';
import PublicForm from './pages/PublicForm.jsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.pathname} classNames="slide" timeout={300}>
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/forms/new"
            element={
              <PrivateRoute>
                <FormBuilder />
              </PrivateRoute>
            }
          />
          <Route
            path="/forms/:id"
            element={
              <PrivateRoute>
                <FormResponses />
              </PrivateRoute>
            }
          />

          <Route path="/f/:slug" element={<PublicForm />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
