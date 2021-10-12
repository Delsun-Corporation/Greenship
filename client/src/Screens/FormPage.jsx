import React from "react";
import FirstForm from "../components/FirstForm";
import { Container } from '@mui/material';

function FormPage() {
  const onFormSubmit = (data) => {
    console.log(data);
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <Container maxWidth="xl">
        <FirstForm onceSubmitted={(data) => onFormSubmit(data)} />
      </Container>
    </div>
  );
}

export default FormPage;