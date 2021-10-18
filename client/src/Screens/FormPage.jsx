import React, { useEffect } from "react";
import FirstForm from "../components/project_forms/FirstForm";
import Navbar from "../components/Navbar";
import { Container } from '@mui/material';
import { useParams } from 'react-router';

function FormPage() {
  const onFormSubmit = (data) => {
    console.log(data);
  }

  const { projectid } = useParams();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar isDashboard="true" />
      <Container maxWidth="xl">
        <FirstForm projectId={projectid} onceSubmitted={(data) => onFormSubmit(data)} />
      </Container>
    </div>
  );
}

export default FormPage;