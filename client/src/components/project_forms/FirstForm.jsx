import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  BlockInput,
  SelectInput,
  InlineLabel,
  SkeletonSection,
  ImageUpload
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
  numberFormat
} from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";

const FirstForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({defaultValues: defaultFormValue()});
  const { control, formState: { errors }, handleSubmit, setValue, getValues } = methods;
  const [isLoading, setLoading] = useState(true);
  const [isFromNextButton, setIsFromNextButton] = useState(false);

  const onSubmit = (data) => {
    console.log(data)

    if (isFromNextButton) {
      onceSubmitted(data, "2");
    } else {
      onceSubmitted(data);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpageone`, {
        params: {
          id: projectId,
        },
      })
      .then((res) => {
        console.log(res.data.page_one)
        setValue("firstForm", {
          ...res.data.page_one,
          a_typology: buildingTypology.find(
            (e) => e.type === res.data.page_one.a_typology
          ),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again");
      });
  }, [projectId]);

  const CHAPTER_NUMBER = "1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <Stack direction="column" spacing={4} sx={{ paddingY: 10 }}>
        <FormHeader
          title={formChapters.find((e) => e.chapter === CHAPTER_NUMBER).title}
          projectId={projectId}
          shouldRedirect={shouldRedirect}
          chapter={CHAPTER_NUMBER}
        />
        {isLoading && <SkeletonSection />}
        {!isLoading && (
          <>
            <FirstSection control={control} errors={errors} getValues={getValues} />
            <SecondSection control={control} errors={errors} getValues={getValues} />
            <ThirdSection control={control} errors={errors} getValues={getValues} />
            <FourthSection control={control} errors={errors} getValues={getValues} />
          </>
        )}
        <FormFooter chapter={CHAPTER_NUMBER} setFromNextButton={setIsFromNextButton} />
      </Stack>
    </form>
  );
};

export default FirstForm;

function defaultFormValue() {
  return (
      {
          firstForm: {
              a_gfa: 0,
              a_operational_hours: 0,
              a_working_days: 0,
              a_holidays: 0,
              a_occupancy_density: 0,
              a_ach: 0,
              a_floor_count: 0,
              a_floor_height_avg: 0,
              a_typology: {
                type: "Homes",
                eci: "240 kWh/m2 per year", 
                visual: "200-300 lux", 
                acoustic: "30-35 dBA"
            }
          }
      }
  )
}

/// SECTIONS ///

const FirstSection = ({ control, errors, getValues }) => {
  const sectionName = "firstForm.";

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <BlockInput
            name={sectionName + "project_name"}
            control={control}
            title="Project Name"
            rows={1}
            maxLength={50}
          />
          <BlockInput
            name={sectionName + "project_desc"}
            control={control}
            title="Project Description"
            rows={3}
            maxLength={400}
          />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <ImageUpload
            name={sectionName + "a_project_image"}
            errors={errors}
            control={control}
            imageUrl={getValues(sectionName + "project_image")}
            title="Building Image"
          />
        </Stack>
      }
    />
  );
};

const SecondSection = ({ control, errors, getValues }) => {
  const sectionName = "firstForm.";

  function OperatingHoursPerYear() {
    const operationalHours = useWatch({
      control,
      name: sectionName + "a_operational_hours",
    });
    const workingDays = useWatch({
      control,
      name: sectionName + "a_working_days",
    });
    if (operationalHours && workingDays) {
      return (
        numberFormat(calcOperatingHoursPerYear(operationalHours, workingDays)) + " hours"
      );
    }
    return NaN;
  }

  function NonOperatingHoursPerYear() {
    const operationalHours = useWatch({
      control,
      name: sectionName + "a_operational_hours",
    });
    const workingDays = useWatch({
      control,
      name: sectionName + "a_working_days",
    });
    const holidays = useWatch({ control, name: sectionName + "a_holidays" });
    if (operationalHours && workingDays && holidays) {
      return (
        numberFormat(calcNonOperatingHoursPerYear(operationalHours, workingDays, holidays)) +
        " hours"
      );
    }
    return NaN;
  }

  function Occupancy() {
    const gfa = useWatch({ control, name: sectionName + "a_gfa" });
    const occupancyDensity = useWatch({
      control,
      name: sectionName + "a_occupancy_density",
    });
    if (occupancyDensity && gfa) {
      return calcOccupancy(gfa, occupancyDensity).toFixed() + " person";
    }
    return NaN;
  }

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontWeight: "bold" }}>Location</Box>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Box width="50%">
              <BlockInput
                name={sectionName + "a_location_province"}
                control={control}
                title="Province"
                rows={1}
                maxLength={50}
              />
            </Box>
            <Box width="50%">
              <BlockInput
                name={sectionName + "a_location_city"}
                control={control}
                title="City"
                rows={1}
                maxLength={50}
              />
            </Box>
          </Stack>
          <ImageUpload
                name={sectionName + "a_location_image"}
                errors={errors}
                control={control}
                imageUrl={getValues(sectionName + "a_location_image")}
                title="Climate data attachment"
              />
          <Divider style={{ width: "100%" }} />

          <SideInput
            name={sectionName + "a_gfa"}
            control={control}
            title="Gross Floor Area (m2)"
          />
          <SideInput
            name={sectionName + "a_floor_count"}
            control={control}
            title="Total number of floors"
          />
          <SideInput
            name={sectionName + "a_floor_height_avg"}
            control={control}
            title="Average Floor to Floor Height (m)"
          />
          <SideInput
            name={sectionName + "a_operational_hours"}
            control={control}
            title="Operational hours (in a day)"
          />
          <SideInput
            name={sectionName + "a_working_days"}
            control={control}
            title="Working days (in a year)"
          />
          <SideInput
            name={sectionName + "a_holidays"}
            control={control}
            title="Holidays (days in a year)"
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
            name={sectionName + "a_ventilation_area"}
            control={control}
            title="Area of Ventilation (m2)"
          />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <SideInput
            name={sectionName + "a_occupancy_density"}
            control={control}
            title="Occupancy Density (person/100m2)"
            subtitle="Refer to table below"
          />
          <InlineLabel title="Occupancy" value={Occupancy()} />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontWeight: "bold" }}>Occupancy Density Table</Box>
          <SelectInput
            name={sectionName + "a_occupancy_category"}
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

  const typology = useWatch({
    control,
    name: sectionName + "a_typology",
  });

  function EciBaseline() {
    const typology = useWatch({
      control,
      name: sectionName + "a_typology",
    });
    if (typology) {
      return typology.eci;
    }
  }

  function VisualComfort() {
    const typology = useWatch({
      control,
      name: sectionName + "a_typology",
    });
    if (typology) {
      return typology.visual;
    }
  }

  function AcousticalComfort() {
    const typology = useWatch({
      control,
      name: sectionName + "a_typology",
    });
    if (typology) {
      return typology.acoustic;
    }
  }

  function RoomVolumePerPerson() {
    const gfa = useWatch({
      control,
      name: sectionName + "a_gfa",
    });
    const floorNumber = useWatch({
      control,
      name: sectionName + "a_floor_count",
    });
    const avgFloorHeight = useWatch({
      control,
      name: sectionName + "a_floor_height_avg",
    });
    const occupancyDensity = useWatch({
      control,
      name: sectionName + "a_occupancy_density",
    });
    if (gfa && floorNumber && avgFloorHeight && occupancyDensity) {
      return (
        numberFormat(calcRoomVolumePerPerson(gfa, floorNumber, avgFloorHeight, occupancyDensity)) +
        " m3"
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
            name={sectionName + "a_typology"}
            control={control}
            options={buildingTypology}
            getOptionLabel="type"
            getOptionValue="type"
            placeholder="Select typology..."
          />

          <InlineLabel
            title="Baseline Energy Consumption Index"
            value={EciBaseline()}
          />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontWeight: "bold" }}>Building Health Indexes:</Box>

          <SideInput
            name={sectionName + "a_ach"}
            control={control}
            title="Air Change per Hour (ACH)"
            subtitle="See next table for reference"
          />
          <InlineLabel title="Access to Outside View" value="minimum 75%" />
          <InlineLabel title="Visual Comfort" value={VisualComfort()} />
          <InlineLabel title="Thermal Comfort" value="maximum 25°C" />
          <InlineLabel title="Acoustical Comfort" value={AcousticalComfort()} />
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

const FourthSection = ({ control, errors, getValues }) => {
  const sectionName = "firstForm.";
  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <ImageUpload
            name={sectionName + "a_orientation_image"}
            errors={errors}
            control={control}
            imageUrl={getValues(sectionName + "a_orientation_image")}
            title="Building Plan Orientation (length, width, and orientation)"
            subtitle="Attach planning image"
          />
          <ImageUpload
            name={sectionName + "a_micro_noise_image"}
            errors={errors}
            control={control}
            imageUrl={getValues(sectionName + "a_micro_noise_image")}
            title="Planning of Micro Climate and Noise Control"
            subtitle="Attach site development: landscape closure, green area percentage"
          />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <ImageUpload
            name={sectionName + "a_energy_place_image"}
            errors={errors}
            control={control}
            imageUrl={getValues(sectionName + "a_energy_place_image")}
            title="On-site Renewable Energy Planning"
            subtitle="Attach document: proof of renewable energy potential on site"
          />
        </Stack>
      }
    />
  );

}

/// COMPONENTS ///

const OccupancyTable = ({ control }) => {
  const category = useWatch({
    control,
    name: "firstForm.a_occupancy_category.category",
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
