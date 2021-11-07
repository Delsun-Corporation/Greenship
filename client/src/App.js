import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Redirect, useHistory } from "react-router-dom";
import { isAuth, getUserId } from "./helpers/auth";
import { Button } from "@mui/material";
import ProjectCards from "./components/project_card/ProjectCards";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const history = useHistory();

  const [isProjectEmpty, setIsProjectEmpty] = useState(null);

  const createProject = () => {
    const userId = getUserId();

    axios
      .post(`${process.env.REACT_APP_API_URL}/createProject`, {
        id: userId,
      })
      .then((result) => {
        history.push(`/projects/create/${result.data.projectId}/${result.data.last_page}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again");
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center">
      <ToastContainer />
      {!isAuth() ? <Redirect to="/login" /> : 
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center mt-20">
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
                  style={{
                    backgroundColor: "#47919B",
                    color: "#FFFFFF",
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                  }}
                >
                  CREATE NEW PROJECT
                </Button>
              </div>
            </div>
            {isProjectEmpty ? (
              <div className="flex flex-col justify-center items-center">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/ina-website-326209.appspot.com/o/resource%2FEmpty_State_Background.svg?alt=media&token=89e118d7-ea2b-40de-9718-4922a3f38ec2"
                  alt="No Project"
                  className="w-1/2 h-48"
                />
                <h1 className="font-body font-bold text-lg text-coolGrey mt-6">
                  No projects yet, let's create a new one!
                </h1>
              </div>
            ) : <div className="h-full">
            <ProjectCards
              isProjectEmpty={isProjectEmpty}
              setIsProjectEmpty={setIsProjectEmpty}
            />
          </div>}
          </div>
        </div>
        </>
      }
    </div>
  );
}

export default App;
