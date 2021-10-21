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

  const onSubmit = (data) => {
    onceSubmitted(data);
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
          b_window_area_p: pageTwoData.b_window_area[0],
          b_window_area_l: pageTwoData.b_window_area[1],
          b_wall_area_p: pageTwoData.b_wall_area[0],
          b_wall_area_l: pageTwoData.b_wall_area[1],
          ...res.data.page_two
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
        <FormFooter chapter={CHAPTER_NUMBER} />
      </Stack>
    </form>
  );
};

export default SecondForm;

const FirstSection = ({ control }) => {
  const sectionName = "secondForm.";

  function CountWWR() {
    const windowAreaP = useWatch({
      control,
      name: sectionName + "b_window_area_p",
    });
    const windowAreaL = useWatch({
      control,
      name: sectionName + "b_window_area_l",
    });
    const wallAreaP = useWatch({
      control,
      name: sectionName + "b_wall_area_p",
    });
    const wallAreaL = useWatch({
      control,
      name: sectionName + "b_wall_area_l",
    });
    if (windowAreaP && windowAreaL && wallAreaP && wallAreaL) {
      return calcWWR(windowAreaP, windowAreaL, wallAreaP, wallAreaL) + "%";
    }
    return null;
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

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Typography>
            Window Area (m2)
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-end" justifyContent="space-between">
            <BasicInputField
              name={sectionName + "b_window_area_p"}
              control={control}
              adornment={"m"}
            />
            <BasicInputField
              name={sectionName + "b_window_area_l"}
              control={control}
              adornment={"m"}
            />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Typography>
            Wall Area (m2)
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-end" justifyContent="space-between">
            <BasicInputField
              name={sectionName + "b_wall_area_p"}
              control={control}
              adornment={"m"}
            />
            <BasicInputField
              name={sectionName + "b_wall_area_l"}
              control={control}
              adornment={"m"}
            />
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
