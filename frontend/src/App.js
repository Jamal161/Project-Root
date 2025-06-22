import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Search from './pages/Search';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/create-event" element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          } />
          
          <Route path="/edit-event/:id" element={
            <PrivateRoute>
              <EditEvent />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;