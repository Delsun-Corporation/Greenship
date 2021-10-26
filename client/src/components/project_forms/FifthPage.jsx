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
  SideButtonInput,
} from "../FormLayouts";
import { formChapters } from "../../datas/Datas";
import { calcPercentageElectrical, calcPotentialPV, calcPredictionElectical } from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";

const FifthForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({});
  const { control, handleSubmit, setValue } = methods;

  const onSubmit = (data) => {
    onceSubmitted(data);
  };

    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/getpagefive`, {
          params: {
            projectId: projectId,
          },
        })
        .then((res) => {
          const pageFiveData = res.data.page_five;
          console.log(pageFiveData);
          setValue("fifthForm", {
            ...pageFiveData
          })
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong, please try again");
        });
    }, [projectId]);

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
        <FormFooter chapter={CHAPTER_NUMBER} shouldRedirect={shouldRedirect} />
      </Stack>
    </form>
  );
};

export default FifthForm;

const FirstSection = ({ control }) => {
  const sectionName = "fifthForm.";

  const CountPotentialPV = () => {
    const facadeArea = useWatch({
      control,
      name: sectionName + "e_facade_area",
    });

    const dimensionL = useWatch({
      control,
      name: sectionName + "e_pv_spec_l",
    });

    const dimensionW = useWatch({
      control,
      name: sectionName + "e_pv_spec_w",
    });

    if (facadeArea && dimensionL && dimensionW) {
    return calcPotentialPV(parseInt(facadeArea), parseInt(dimensionL), parseInt(dimensionW));
  }
  return NaN;
  }

  const CountPercentageElectrical = () => {
    const predictionElectrical = CountPredictionElectrical();

    if (predictionElectrical) {
    return calcPercentageElectrical(parseInt(predictionElectrical));
  }
  return NaN;
  }

  const CountPredictionElectrical = () => {

    const wpeakValue = useWatch({
      control,
      name: sectionName + "e_pv_spec_wpeak",
    });

    const potentialPV = CountPotentialPV()

    if (wpeakValue) {
    return calcPredictionElectical(potentialPV, wpeakValue);
  }
  return NaN;
  }

  const PotentialPVLabel = () => {
    const result = CountPotentialPV()

    if (isNaN(result)) {
      return <InlineLabel title="Potential PV numbers to be installed" value={'-'} />
    } else {
      return <InlineLabel title="Potential PV numbers to be installed" value={result} />
    }
  }

  const PredictionElectricalLabel = () => {
    const result = CountPredictionElectrical()

    if (isNaN(result)) {
      return <InlineLabel title="Prediction of Electrical energy" value={"- kWh/m2 per year"} />
    } else {
      return <InlineLabel title="Prediction of Electrical energy" value={(result) + " kWh/m2 per year"} />
    }
  }

  const PercentageElectricalLabel = () => {
    const result = CountPercentageElectrical()

    if (isNaN(result)) {
      return <InlineLabel title="Percentage of electrical energy mix" value={"-%"}/>
    } else {
      return <InlineLabel title="Percentage of electrical energy mix" value={ result + "%"}/>
    }
  }
  

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <SideInput
            name={sectionName + "e_facade_area"}
            control={control}
            title="Potential facade area (m2)"
            minimalInput={0}
          />

          <SideButtonInput
            name={sectionName + "e_pv_install_att"}
            control={control}
            title="PV Installation Planning"
          />

          <Typography variant="subtitle2" fontWeight="bold" paddingTop={4}>
            PV Specification
          </Typography>

          <SideButtonInput
            name={sectionName + "e_pv_solar_att"}
            control={control}
            title="Solar Panels Spesification"
          />

          <SideInput
            name={sectionName + "e_pv_spec_wpeak"}
            control={control}
            title="Wpeak (Wp)"
            minimalInput={0}
          />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Solar Panel Dimension (mm)</Typography>
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
                  name={sectionName + "e_pv_spec_l"}
                  control={control}
                  adornment={"l"}
                />
                <BasicInputField
                  name={sectionName + "e_pv_spec_w"}
                  control={control}
                  adornment={"w"}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <BasicInputField
                  name={sectionName + "e_pv_spec_h"}
                  control={control}
                  adornment={"h"}
                />
              </Stack>
            </Stack>
          </Stack>
          <PotentialPVLabel/>
          <PredictionElectricalLabel/>
          <PercentageElectricalLabel/>
        </Stack>
      }
      rightComponent={
        <div className="font-body">
          
        </div>
      }
    />
  );
};
