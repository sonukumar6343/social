import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserDisplay from './component/userDisplay';
import AdminLogin from './component/AdminLogin';
import UserSubmission from './component/userSubmissionform';
import PrivateRoute from './component/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<UserSubmission/>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserDisplay />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

