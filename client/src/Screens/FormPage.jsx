import React, {useEffect} from "react";
import FirstForm from "../components/project_forms/FirstForm";
import Navbar from "../components/Navbar";
import { Container } from "@mui/material";
import { useParams } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router";
import { statusResponse } from "../helpers/response";
import SecondForm from "../components/project_forms/SecondForm";

function FormPage() {
  const { projectid, page } = useParams();
  const history = useHistory();

  const onFormSubmit = (data) => {
    if (data.firstForm) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/updatepageone`, {
          projectId: projectid,
          ...data.firstForm,
          a_typology: data.firstForm.a_typology.type,
        })
        .then((res) => {
          statusResponse(
            res.status,
            "Save draft failed, check your internet and try again",
            "Your project has successfully been saved as Draft."
          );
        })
        .catch((err) => {
          toast.error(`${process.env.BASE_CATCH_ERROR}`);
        });
    }
  };

  const redirectPage = (path) => {
    history.push(path);
  };

  function render() {
    const pageNumber = parseInt(page);
    if (pageNumber === 1) {
      return <FirstForm
          projectId={projectid}
          onceSubmitted={(data) => onFormSubmit(data)}
          shouldRedirect={redirectPage}
        />
    } else if (pageNumber === 2) {
      return <SecondForm></SecondForm>
    } else {
      return <SecondForm/>
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <Navbar />
      <Container maxWidth="xl">
        {
          render()
        }
      </Container>
    </div>
  );
}

export default FormPage;
