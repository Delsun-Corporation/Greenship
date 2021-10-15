import React from "react";
import Navbar from "./components/Navbar";
import { Redirect, Router, useHistory } from "react-router-dom";
import { isAuth } from "./helpers/auth";
import FormPage from "./Screens/FormPage";
import { Button } from '@mui/material';

function App() {
  const history = useHistory();

  return (
    <div className="bg-gray-400 min-h-screen">
      {!isAuth() ? <Redirect to="/login" /> : null }
      <Navbar isDashboard="true" />
        <Button variant="contained" onClick={() => history.push('/projects/create')}>
          New Project
        </Button>
    </div>
  );
}

export default App;
