import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useForm,
  useController,
  Controller,
  watch,
  useWatch,
} from "react-hook-form";
import {
  withStyles,
  Box,
  Stack,
  MenuItem,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  BlockInput,
  SelectInput,
  InlineLabel,
} from "../FormLayouts";
import {
  formChapters,
  occupancyCategory,
  buildingTypology,
  AchReference,
} from "../../datas/Datas";
import {
  calcOperatingHoursPerYear,
  calcNonOperatingHoursPerYear,
  calcOccupancy,
  calcRoomVolumePerPerson,
} from "../../datas/FormLogic";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const FirstForm = ({ onceSubmitted, projectId }) => {
  const methods = useForm({});

  console.log(projectId);

  const onSubmit = (data) => {
    onceSubmitted(data);
  };

  const [pageOne, setPageOne] = useState({
    project_name: "",
    project_desc: "",
    project_status: "",
    project_image: "",
    project_date: new Date(),
    a_typology: "",
    a_location_province: "",
    a_location_city: "",
    a_location_image: "",
    a_gfa: 0,
    a_floor_count: 0,
    a_floor_height_avg: 0,
    a_occupancy_hours: 0,
    a_operational_hours: 0,
    a_working_days: 0,
    a_holidays: 0,
    a_ventilation_area: 0,
    a_orientation_image: [""],
    a_micro_noise_image: "",
    a_energy_place_image: "",
    a_ach: 0,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpageone`, {
        params: {
          id: projectId
        }
      })
      .then((res) => {
        setPageOne({
          ...res.data.page_one
        })
        console.log(pageOne);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again");
      });
  }, [projectId]);

  const { control, handleSubmit, watch } = methods;

  const CHAPTER_NUMBER = "1";

  console.log("" + (parseInt(CHAPTER_NUMBER) + 1));

  const FirstSection = ({ control }) => {
    const sectionName = "firstForm.";

    return (
      <FormLayout
        leftComponent={
          <Stack direction="column" spacing={2}>
            <BlockInput
              name={sectionName + "projectName"}
              control={control}
              title="Project Name"
              rows={1}
              maxLength={50}
              defaultValue={pageOne.project_name}
            />

            <BlockInput
              name={sectionName + "projectDescription"}
              control={control}
              title="Project Description"
              rows={3}
              maxLength={400}
              defaultValue={pageOne.project_desc}
            />
          </Stack>
        }
        rightComponent={<>Building Image</>}
      />
    );
  };

  const SecondSection = ({ control }) => {
    const sectionName = "firstForm.";

    function OperatingHoursPerYear() {
      const operationalHours = useWatch({
        control,
        name: sectionName + "operationalHours",
      });
      const workingDays = useWatch({
        control,
        name: sectionName + "workingDays",
      });
      if (operationalHours && workingDays) {
        return (
          calcOperatingHoursPerYear(operationalHours, workingDays) + " hours"
        );
      }
      return NaN;
    }

    function NonOperatingHoursPerYear() {
      const operationalHours = useWatch({
        control,
        name: sectionName + "operationalHours",
      });
      const workingDays = useWatch({
        control,
        name: sectionName + "workingDays",
      });
      const holidays = useWatch({ control, name: sectionName + "holidays" });
      if (operationalHours && workingDays && holidays) {
        return (
          calcNonOperatingHoursPerYear(
            operationalHours,
            workingDays,
            holidays
          ) + " hours"
        );
      }
      return NaN;
    }

    function Occupancy() {
      const gfa = useWatch({ control, name: sectionName + "gfa" });
      const occupancyDensity = useWatch({
        control,
        name: sectionName + "occupancyDensity",
      });
      if (occupancyDensity && gfa) {
        return calcOccupancy(gfa, occupancyDensity) + " pax";
      }
      return NaN;
    }

    return (
      <FormLayout
        leftComponent={
          <Stack direction="column" spacing={2}>
            <BlockInput
              name={sectionName + "location"}
              control={control}
              title="Location"
              rows={1}
              maxLength={50}
              defaultValue={pageOne.a_location_city}
            />
            <SideInput
              name={sectionName + "gfa"}
              control={control}
              title="Grass Floor Area (m2)"
              defaultValue={pageOne.a_gfa}
            />
            <SideInput
              name={sectionName + "floorNumber"}
              control={control}
              title="Total number of floors"
              defaultValue={pageOne.a_floor_count}
            />
            <SideInput
              name={sectionName + "avgFloorHeight"}
              control={control}
              title="Average Floor to Floor Height (m)"
              defaultValue={pageOne.a_floor_height_avg}
            />
            <SideInput
              name={sectionName + "operationalHours"}
              control={control}
              title="Operational hours (in a day)"
              defaultValue={pageOne.a_operational_hours}
            />
            <SideInput
              name={sectionName + "workingDays"}
              control={control}
              title="Working days (in a year)"
              defaultValue={pageOne.a_working_days}
            />
            <SideInput
              name={sectionName + "holidays"}
              control={control}
              title="Holidays (days in a year)"
              defaultValue={pageOne.a_holidays}
            />
            <InlineLabel
              title="Operating hours in a year"
              value={OperatingHoursPerYear()}
            />
            <InlineLabel
              title="Non-operating hours in a year"
              value={NonOperatingHoursPerYear()}
            />
            <SideInput
              name={sectionName + "areaOfVentilation"}
              control={control}
              title="Area of Ventilation (m2)"
              defaultValue={pageOne.a_ventilation_area}
            />
          </Stack>
        }
        rightComponent={
          <Stack direction="column" spacing={2}>
            <SideInput
              name={sectionName + "occupancyDensity"}
              control={control}
              title="Occupancy Density (pax/m2)"
              subtitle="Refer to table below"
              defaultValue={pageOne.a_occupancy_hours}
            />
            <InlineLabel title="Occupancy" value={Occupancy()} />
            <Divider style={{ width: "100%" }} />
            <Box sx={{ fontWeight: "bold" }}>Occupancy Density Table</Box>
            <SelectInput
              name={sectionName + "occupancyCategory"}
              control={control}
              options={occupancyCategory}
              getOptionLabel="category"
              getOptionValue="category"
              placeholder="Select category..."
            />
            <OccupancyTable control={control} />
          </Stack>
        }
      />
    );
  };

  const ThirdSection = ({ control }) => {
    const sectionName = "firstForm.";

    function EciBaseline() {
      const eci = useWatch({
        control,
        name: sectionName + "buildingTypology.eci",
      });
      return eci;
    }

    function VisualComfort() {
      const vis = useWatch({
        control,
        name: sectionName + "buildingTypology.visual",
      });
      return vis;
    }

    function AcousticalComfort() {
      const acoustic = useWatch({
        control,
        name: sectionName + "buildingTypology.acoustic",
      });
      return acoustic;
    }

    function RoomVolumePerPerson() {
      const floorNumber = useWatch({
        control,
        name: sectionName + "floorNumber",
      });
      const avgFloorHeight = useWatch({
        control,
        name: sectionName + "avgFloorHeight",
      });
      const occupancyDensity = useWatch({
        control,
        name: sectionName + "occupancyDensity",
      });
      if (floorNumber && avgFloorHeight && occupancyDensity) {
        return (
          calcRoomVolumePerPerson(
            floorNumber,
            avgFloorHeight,
            occupancyDensity
          ) + " m3"
        );
      }
      return NaN;
    }

    return (
      <FormLayout
        leftComponent={
          <Stack direction="column" spacing={2}>
            <Box sx={{ fontWeight: "bold" }}>Building Typology</Box>
            <SelectInput
              name={sectionName + "buildingTypology"}
              control={control}
              options={buildingTypology}
              getOptionLabel="type"
              getOptionValue="type"
              placeholder="Select typology..."
              defaultValue={pageOne.a_typology}
            />
            <InlineLabel
              title="Baseline Energy Consumption Index"
              value={EciBaseline()}
            />
            <Divider style={{ width: "100%" }} />
            <Box sx={{ fontWeight: "bold" }}>Building Health Indexes:</Box>

            <SideInput
              name={sectionName + "ach"}
              control={control}
              title="Air Change per Hour (ACH)"
              subtitle="See next table for reference"
              defaultValue={pageOne.a_ach}
            />
            <InlineLabel title="Access to Outside View" value="minimum 75%" />
            <InlineLabel title="Visual Comfort" value={VisualComfort()} />
            <InlineLabel title="Thermal Comfort" value="maximum 25°C" />
            <InlineLabel
              title="Acoustical Comfort"
              value={AcousticalComfort()}
            />
          </Stack>
        }
        rightComponent={
          <Stack direction="column" spacing={2}>
            <InlineLabel
              title="Room Volume per Person (m3)"
              value={RoomVolumePerPerson()}
            />
            <Box sx={{ fontWeight: "bold" }}>
              Air Change per Hour Reference Table
            </Box>
            <AchTable />
          </Stack>
        }
      />
    );
  };

  const OccupancyTable = ({ control }) => {
    const category = useWatch({
      control,
      name: "firstForm.occupancyCategory.category",
    });

    function children() {
      if (category) {
        const temp = occupancyCategory.find((e) => e.category === category);
        return temp.children;
      }
    }

    if (category) {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead sx={{ backgroundColor: "orange" }}>
              <TableRow>
                <TableCell>Occupancy Category</TableCell>
                <TableCell align="right">Occupancy Density (#/100m2)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children().map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.subcategory}
                  </TableCell>
                  <TableCell align="right">{row.density}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return <></>;
  };

  const AchTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: "orange" }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Then fresh air supply rate per person</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>If room volume per person (m3)</TableCell>
              <TableCell>Minimum</TableCell>
              <TableCell>Recommended</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {AchReference.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.volumePerPerson}
                </TableCell>
                <TableCell>{row.minFreshAirPerPerson}</TableCell>
                <TableCell>{row.recFreshAirPerPerson}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer/>
      <Stack direction="column" spacing={4} sx={{ paddingY: 10 }}>
        <FormHeader
          title={formChapters.find((e) => e.chapter === CHAPTER_NUMBER).title}
        />
        <FirstSection control={control} />
        <SecondSection control={control} />
        <ThirdSection control={control} />
        <FormFooter chapter={CHAPTER_NUMBER} />
      </Stack>
    </form>
  );
};

export default FirstForm;
