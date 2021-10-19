import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { getUserId } from "../../helpers/auth";
import { Grid, CircularProgress } from '@mui/material';
import ProjectCard from "./ProjectCard";
import { toast } from 'react-toastify';

function ProjectCards() {

    const [projects, setProjects] = useState(
        []
      );
    
      useEffect(() => {
        const userId = getUserId()
        axios
          .get(`${process.env.REACT_APP_API_URL}/getprojects`, {
            params: {
              id: userId
            }
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
            {!projects.length ? <CircularProgress/> : 
              <Grid container alignItems="stretch" spacing={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                {projects.map((project) => (
                    <Grid item xs={2} sm={4} md={4} key={project._id}>
                        <ProjectCard project={project} projectId={project._id}/>
                    </Grid>
                ))}
              </Grid>
            }
        </div>
    )
}

export default ProjectCards
