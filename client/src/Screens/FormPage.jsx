import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

import { Container, Typography, Stack, Box } from "@mui/material";
import { Redirect, useParams } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router";
import { statusResponse } from "../helpers/response";
import { updatePage } from "../helpers/PageService";
import { PageTwo } from "../model/pageTwo.model";
import FormPageNotFound from "../components/project_forms/FormPageNotFound";

import FirstForm from "../components/project_forms/FirstForm";
import SecondForm from "../components/project_forms/SecondForm";
import ThirdForm from "../components/project_forms/ThirdForm";
import FourthForm from "../components/project_forms/FourthForm";
import FifthForm from "../components/project_forms/FifthPage";
import FormDrawer from "../components/FormDrawer"
import Footer from "../components/Footer.jsx";
import { isAuth } from "../helpers/auth";

function FormPage() {
  const { projectid, page } = useParams();
  const history = useHistory();

  const onFormSubmit = (data, nextPage) => {
    if (data.firstForm) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/updatepageone`, {
          projectId: projectid,
          ...data.firstForm,
          a_typology: data.firstForm.a_typology.type,
        })
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
          } else {
            statusResponse(
              res.status,
              "Save draft failed, check your internet and try again",
              "Your project has successfully been saved as Draft."
            );
          }
        })
        .catch((err) => {
          toast.error(
            "Something went wrong, check your internet and try again"
          );
        });
    } else if (data.secondForm) {
      const secondFormData = data.secondForm;
      const pageTwo = new PageTwo(secondFormData);
      const body = {
        ...pageTwo.getSaveDraftModel(),
        b_ottv: secondFormData.b_ottv,
        b_shgc: secondFormData.b_shgc,
      };

      updatePage("updatepagetwo", body, projectid)
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
          } else {
            statusResponse(
              res.status,
              "Save draft failed, check your internet and try again",
              "Your project has successfully been saved as Draft."
            );
          }
        })
        .catch((err) => {
          console.log("Error", err)
          toast.error(
            "Something went wrong, check your internet and try again"
          );
        });
    } else if (data.thirdForm) {
      const thirdFormData = data.thirdForm;

      updatePage("updatepagethree", thirdFormData, projectid)
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
          } else {
            statusResponse(
              res.status,
              "Save draft failed, check your internet and try again",
              "Your project has successfully been saved as Draft."
            );
          }
        })
        .catch((err) => {
          console.log("Error", err)
          toast.error(
            "Something went wrong, check your internet and try again"
          );
        });
    } else if (data.fourthForm) {
      const fourthFormData = data.fourthForm;

      updatePage("updatepagefour", fourthFormData, projectid)
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
          } else {
            statusResponse(
              res.status,
              "Save draft failed, check your internet and try again",
              "Your project has successfully been saved as Draft."
            );
          }
        })
        .catch((err) => {
          console.log("Error", err)
          toast.error(
            "Something went wrong, check your internet and try again"
          );
        });
    } else if (data.fifthForm) {
      const pageFiveData = data.fifthForm;

      updatePage("updatepagefive", pageFiveData, projectid)
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
          } else {
            statusResponse(
              res.status,
              "Save draft failed, check your internet and try again",
              "Your project has successfully been saved as Draft."
            );
          }
        })
        .catch((err) => {
          toast.error(
            "Something went wrong, check your internet and try again"
          );
        });

    }
  };

  const redirectPage = (path) => {
    history.push(path);
  };

  function render() {
    const pageNumber = parseInt(page);
    if (pageNumber === 1) {
      return (
        <FirstForm
          projectId={projectid}
          onceSubmitted={(data, nextPage) => onFormSubmit(data, nextPage)}
          shouldRedirect={redirectPage}
        />
      );
    } else if (pageNumber === 2) {
      return (
        <SecondForm
          projectId={projectid}
          onceSubmitted={(data, nextPage) => onFormSubmit(data, nextPage)}
          shouldRedirect={redirectPage}
        ></SecondForm>
      );
    } else if (pageNumber === 3) {
      return (
        <ThirdForm
          projectId={projectid}
          onceSubmitted={(data, nextPage) => onFormSubmit(data, nextPage)}
          shouldRedirect={redirectPage}
        ></ThirdForm>
      );
    } else if (pageNumber === 4) {
      return (
      <FourthForm
        projectId={projectid}
        onceSubmitted={(data, nextPage) => onFormSubmit(data, nextPage)}
        shouldRedirect={redirectPage}
      ></FourthForm>
      )
    } else if (pageNumber === 5) {
      return <FifthForm
        projectId={projectid}
        onceSubmitted={(data, nextPage) => onFormSubmit(data, nextPage)}
        shouldRedirect={redirectPage}
      ></FifthForm>
    } else {
      return <FormPageNotFound />;
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {!isAuth() ? <Redirect to="/login" /> : null}
      <ToastContainer />
      <Box sx={{ display: 'flex' }}>
        <FormDrawer activeChapter={parseInt(page)} redirect={(path) => redirectPage(path)}/>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container maxWidth="xl" sx={{marginTop: 4}}>
            {render()}
          </Container>
          <Footer />
        </Box>
      </Box>
    </div>
  );
}

export default FormPage;
