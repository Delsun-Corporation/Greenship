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
      console.log(data);
      axios
        .put(`${process.env.REACT_APP_API_URL}/updatepageone`, {
          projectId: projectid,
          project_name: data.firstForm.projectName,
          project_desc: data.firstForm.projectDescription,
          a_working_days: data.firstForm.workingDays,
          a_typology: data.firstForm.buildingTypology.type,
          a_location_province: "",
          a_location_city: data.firstForm.location,
          a_location_image: "",
          a_gfa: data.firstForm.gfa,
          a_floor_count: data.firstForm.floorNumber,
          a_floor_height_avg: data.firstForm.avgFloorHeight,
          a_occupancy_hours: data.firstForm.occupancyDensity,
          a_operational_hours: data.firstForm.operationalHours,
          a_holidays: data.firstForm.holidays,
          a_ventilation_area: data.firstForm.areaOfVentilation,
          a_orientation_image: [""],
          a_micro_noise_image: "",
          a_energy_place_image: "",
          a_ach: 0,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Success Save Page One Draft");
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
