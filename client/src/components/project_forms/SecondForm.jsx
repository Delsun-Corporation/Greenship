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

const SecondForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({});
  const { control, handleSubmit, setValue } = methods;
  const [isFromNextButton, setIsFromNextButton] = useState(false);

  const onSubmit = (data) => {
    if (isFromNextButton) {
      onceSubmitted(data, "3");
    } else {
      onceSubmitted(data);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpagetwo`, {
        params: {
          projectId: projectId,
        },
      })
      .then((res) => {
        const pageTwoData = res.data.page_two;
        setValue("secondForm", {
          b_window_area_n: pageTwoData.b_window_area[0],
          b_window_area_s: pageTwoData.b_window_area[1],
          b_window_area_e: pageTwoData.b_window_area[2],
          b_window_area_w: pageTwoData.b_window_area[3],
          b_window_area_ne: pageTwoData.b_window_area[4],
          b_window_area_se: pageTwoData.b_window_area[5],
          b_window_area_nw: pageTwoData.b_window_area[6],
          b_window_area_sw: pageTwoData.b_window_area[7],
          b_wall_area_n: pageTwoData.b_wall_area[0],
          b_wall_area_s: pageTwoData.b_wall_area[1],
          b_wall_area_e: pageTwoData.b_wall_area[2],
          b_wall_area_w: pageTwoData.b_wall_area[3],
          b_wall_area_ne: pageTwoData.b_wall_area[4],
          b_wall_area_se: pageTwoData.b_wall_area[5],
          b_wall_area_nw: pageTwoData.b_wall_area[6],
          b_wall_area_sw: pageTwoData.b_wall_area[7],
          b_wall_area_r: pageTwoData.b_wall_area[8],
          ...res.data.page_two,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again");
      });
  }, [projectId]);

  const CHAPTER_NUMBER = "2";

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
        <FormFooter
          chapter={CHAPTER_NUMBER}
          shouldRedirect={shouldRedirect}
          setFromNextButton={setIsFromNextButton}
        />
      </Stack>
    </form>
  );
};

export default SecondForm;

const FirstSection = ({ control }) => {
  const sectionName = "secondForm.";

  function CountWWR() {
    /// Window Area Watch
    const windowAreaN = useWatch({
      control,
      name: sectionName + "b_window_area_n",
    });
    const windowAreaS = useWatch({
      control,
      name: sectionName + "b_window_area_s",
    });
    const windowAreaE = useWatch({
      control,
      name: sectionName + "b_window_area_e",
    });
    const windowAreaW = useWatch({
      control,
      name: sectionName + "b_window_area_w",
    });
    const windowAreaNE = useWatch({
      control,
      name: sectionName + "b_window_area_ne",
    });
    const windowAreaSE = useWatch({
      control,
      name: sectionName + "b_window_area_se",
    });
    const windowAreaNW = useWatch({
      control,
      name: sectionName + "b_window_area_nw",
    });
    const windowAreaSW = useWatch({
      control,
      name: sectionName + "b_window_area_sw",
    });

    /// Wall Area Watch
    const wallAreaN = useWatch({
      control,
      name: sectionName + "b_wall_area_n",
    });
    const wallAreaS = useWatch({
      control,
      name: sectionName + "b_wall_area_s",
    });
    const wallAreaE = useWatch({
      control,
      name: sectionName + "b_wall_area_e",
    });
    const wallAreaW = useWatch({
      control,
      name: sectionName + "b_wall_area_w",
    });
    const wallAreaNE = useWatch({
      control,
      name: sectionName + "b_wall_area_ne",
    });
    const wallAreaSE = useWatch({
      control,
      name: sectionName + "b_wall_area_se",
    });
    const wallAreaNW = useWatch({
      control,
      name: sectionName + "b_wall_area_nw",
    });
    const wallAreaSW = useWatch({
      control,
      name: sectionName + "b_wall_area_sw",
    });
      const collectionWindowArea = [
        windowAreaE,
        windowAreaN,
        windowAreaNE,
        windowAreaNW,
        windowAreaS,
        windowAreaSE,
        windowAreaSW,
        windowAreaW,
      ];
      const collectionWallArea = [
        wallAreaE,
        wallAreaN,
        wallAreaS,
        wallAreaW,
        wallAreaSW,
        wallAreaNW,
        wallAreaSE,
        wallAreaNE,
      ];
      return calcWWR(collectionWindowArea, collectionWallArea) + "%";
  }

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
                  name={sectionName + "b_wall_area_ne"}
                  control={control}
                  adornment={"NE"}
                />
                <BasicInputField
                  name={sectionName + "b_wall_area_se"}
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
                  name={sectionName + "b_wall_area_nw"}
                  control={control}
                  adornment={"NW"}
                />
                <BasicInputField
                  name={sectionName + "b_wall_area_sw"}
                  control={control}
                  adornment={"SW"}
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
          <InlineLabel title="WWR" value={CountWWR()} />
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
