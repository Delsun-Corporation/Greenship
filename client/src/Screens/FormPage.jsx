import React from "react";
import FirstForm from "../components/project_forms/FirstForm";
import Navbar from "../components/Navbar";
import { Container } from "@mui/material";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

function FormPage() {
  const { projectid } = useParams();

  const onFormSubmit = (data) => {
    if (data.firstForm) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/updatepageone`, {
          projectId: projectid,
          ...data.firstForm,
          a_typology: data.firstForm.a_typology.type,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Your project has successfully been saved as Draft.");
          }
        });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar isDashboard="true" />
      <Container maxWidth="xl">
        <FirstForm
          projectId={projectid}
          onceSubmitted={(data) => onFormSubmit(data)}
        />
      </Container>
    </div>
  );
}

export default FormPage;
