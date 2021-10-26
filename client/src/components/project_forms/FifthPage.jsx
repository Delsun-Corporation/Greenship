import React, { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { Stack, TextField, Typography } from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  InlineLabel,
  BasicInputField,
} from "../FormLayouts";
import { formChapters } from "../../datas/Datas";
import { calcWWR } from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";

const FifthForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({});
  const { control, handleSubmit, setValue } = methods;
  const [isFromNextButton, setIsFromNextButton] = useState(false);

  const onSubmit = (data) => {
    onceSubmitted(data);
  };

//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_API_URL}/getpagefive`, {
//         params: {
//           projectId: projectId,
//         },
//       })
//       .then((res) => {
//         const pageFiveData = res.data.page_five;
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error("Something went wrong, please try again");
//       });
//   }, [projectId]);

  const CHAPTER_NUMBER = "5";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={4} sx={{ paddingY: 10 }}>
        <FormHeader
          title={formChapters.find((e) => e.chapter === CHAPTER_NUMBER).title}
          projectId={projectId}
          shouldRedirect={shouldRedirect}
          chapter={CHAPTER_NUMBER}
        />
        <FirstSection control={control} />
        <FormFooter chapter={CHAPTER_NUMBER} shouldRedirect={shouldRedirect} setFromNextButton={setIsFromNextButton} />
      </Stack>
    </form>
  );
};

export default FifthForm;

const FirstSection = ({ control }) => {
  const sectionName = "fifthForm.";

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <SideInput
            name={sectionName + "b_ottv"}
            control={control}
            title="OTTV (kWh/m2)"
          />

          <SideInput
            name={sectionName + "b_shgc"}
            control={control}
            title="SHGC"
          />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            paddingTop={4}
            paddingBottom={4}
          >
            <Typography>Window Area (m2)</Typography>
            <Stack
              direction="column"
              spacing={2}
              alignItems="flex-end"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "b_window_area_n"}
                  control={control}
                  adornment={"N"}
                />
                <BasicInputField
                  name={sectionName + "b_window_area_s"}
                  control={control}
                  adornment={"S"}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "b_window_area_e"}
                  control={control}
                  adornment={"E"}
                />
                <BasicInputField
                  name={sectionName + "b_window_area_w"}
                  control={control}
                  adornment={"W"}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "b_window_area_ne"}
                  control={control}
                  adornment={"NE"}
                />
                <BasicInputField
                  name={sectionName + "b_window_area_se"}
                  control={control}
                  adornment={"SE"}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "b_window_area_nw"}
                  control={control}
                  adornment={"NW"}
                />
                <BasicInputField
                  name={sectionName + "b_window_area_sw"}
                  control={control}
                  adornment={"SW"}
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Wall Area (m2)</Typography>
            <Stack
              direction="column"
              spacing={2}
              alignItems="flex-end"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "b_wall_area_n"}
                  control={control}
                  adornment={"N"}
                />
                <BasicInputField
                  name={sectionName + "b_wall_area_s"}
                  control={control}
                  adornment={"S"}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "b_wall_area_e"}
                  control={control}
                  adornment={"E"}
                />
                <BasicInputField
                  name={sectionName + "b_wall_area_w"}
                  control={control}
                  adornment={"W"}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "b_wall_area_r"}
                  control={control}
                  adornment={"R"}
                />
              </Stack>
            </Stack>
          </Stack>
          <InlineLabel title="WWR" />
        </Stack>
      }
      rightComponent={
        <div className="font-body">
          <h1 className="text-xl font-black underline">Baseline Guidance:</h1>
          <h1 className="mt-6">
            <span className="font-regular">OTTV Baseline:</span>{" "}
            <span className="font-bold ml-2">45kWh/m2</span>
          </h1>
          <h1>
            <span className="font-regular">SHGC Baseline:</span>{" "}
            <span className="font-bold ml-2">0.6 - 0.7</span>
          </h1>
          <h1>
            <span className="font-regular">Window Area Baseline:</span>{" "}
            <span className="font-bold ml-2">45kWh/m2</span>
          </h1>
          <h1>
            <span className="font-regular">WWR:</span>{" "}
            <span className="font-bold ml-2">30 - 40%</span>
          </h1>
        </div>
      }
    />
  );
};
