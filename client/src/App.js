import React, {useState, useEffect} from "react";
import Navbar from "./components/Navbar";
import { Redirect, useHistory } from "react-router-dom";
import { isAuth, getUserId } from "./helpers/auth";
import { Button } from "@mui/material";
import ProjectCards from "./components/project_card/ProjectCards";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const history = useHistory();

  const createProject = (() => {
    const userId = getUserId()

    axios
      .post(`${process.env.REACT_APP_API_URL}/createProject`, {
        id: userId,
      })
      .then((result) => {
        history.push(`/projects/create/${result.data.projectId}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong, please try again');
      });
  });

  return (
    <div className="bg-gray-400 min-h-screen flex flex-col justify-center">
      <ToastContainer/>
      {!isAuth() ? <Redirect to="/login" /> : null}
      <Navbar isDashboard="true" />
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl bg-transparant flex flex-1 mt-10 flex-col">
          <div className="h-1/6 flex justify-end">
            <div className="flex w-1/2 justify-start h-full flex-col">
              <h4 className="font-body font-medium text-coolGrey text-lg">
                DASHBOARD
              </h4>
              <h1 className="font-body font-bold text-charcoal text-3xl">
                My Projects
              </h1>
            </div>
            <div className="flex w-1/2 justify-end">
              <Button
                variant="contained"
                onClick={createProject}
                className="h-12 w-1/3 font-body font-bold"
                style={{ backgroundColor: "#47919B", color: "#FFFFFF", fontFamily: 'Poppins', fontWeight: 'bold' }}
              >
                CREATE NEW PROJECT
              </Button>
            </div>
          </div>
          <div className="h-full">
            <ProjectCards/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
