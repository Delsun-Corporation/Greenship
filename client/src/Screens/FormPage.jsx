import React, { useState, useEffect } from "react";
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
import SixthForm from "../components/project_forms/SixthForm";
import FormDrawer from "../components/FormDrawer"
import Footer from "../components/Footer.jsx";
import { isAuth } from "../helpers/auth";
import { PageOne } from "../model/pageOne.model";
import { PageFive } from "../model/pageFive.model";
import { PageFour } from "../model/PageFour.model";
import { PageThree } from "../model/pageThree.model";

function FormPage() {
  const { projectid, page } = useParams();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);

  const onFormSubmit = (data, nextPage) => {
    if (data.firstForm) {
      const model = new PageOne(data.firstForm, projectid)
      const entries = model.convertToFromData();
      axios({
        method: "put",
        url: `${process.env.REACT_APP_API_URL}/updatepageone`,
        data: entries,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
            setLoading(false)
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
            setLoading(false)
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
      console.log("submit page three: ", thirdFormData);

      const model = new PageThree(thirdFormData, projectid);
      const entries = model.convertToFormData();
      axios({
        method: "put",
        url: `${process.env.REACT_APP_API_URL}/updatepagethree`,
        data: entries,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
            setLoading(false)
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
      const model = new PageFour(fourthFormData, projectid)
      const entries = model.convertToFromData();
      axios({
        method: "put",
        url: `${process.env.REACT_APP_API_URL}/updatepagefour`,
        data: entries,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
            setLoading(false)
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
      const model = new PageFive(data.fifthForm, projectid);
      const entries = model.convertToFromData();
      axios({
        method: "put",
        url: `${process.env.REACT_APP_API_URL}/updatepagefive`,
        data: entries,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (nextPage) {
            redirectPage(nextPage);
            setLoading(false)
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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
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
    } else if (pageNumber === 6) {
      return <SixthForm
      projectId={projectid}
      onceSubmitted={(data, nextPage) => onFormSubmit(data, nextPage)}
      shouldRedirect={redirectPage}
    ></SixthForm>
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
          <Container maxWidth="xl" sx={{marginTop: 4, minHeight: "100vh"}}>
            {render()}
          </Container>
          <Footer />
        </Box>
      </Box>
    </div>
  );
}

export default FormPage;
