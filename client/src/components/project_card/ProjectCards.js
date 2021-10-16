import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { getUserId } from "../../helpers/auth";
import { Grid, CircularProgress } from '@material-ui/core';
import ProjectCard from "./ProjectCard";
import { ToastContainer, toast } from 'react-toastify';

function ProjectCards() {

    const [projects, setProjects] = useState(
        []
      );
    
      useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/getprojects`, {
            id: { getUserId },
          })
          .then((result) => {
            setProjects(result.data.projects)
          })
          .catch((err) => {
            console.log(err);
            toast.error('Something went wrong, please try again');
          });
      }, []);

    return (
        <div className="flex items-center justify-center">
            <ToastContainer/>
            {!projects.length ? <CircularProgress/> : 
              <Grid container alignItems="stretch" spacing={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                {projects.map((project) => (
                    <Grid item xs={2} sm={4} md={4} key={project._id}>
                        <ProjectCard project={project}/>
                    </Grid>
                ))}
              </Grid>
            }
        </div>
    )
}

export default ProjectCards
