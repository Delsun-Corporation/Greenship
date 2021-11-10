import React, { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { Box, Stack, TextField, Typography } from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  InlineLabel,
  BasicInputField,
  SideButtonInput,
} from "../FormLayouts";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { formChapters } from "../../datas/Datas";
import { calcPercentageElectrical, calcPotentialPV, calcPredictionElectical } from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";

const FifthForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({
    defaultValues: defaultFormValue()
  });
  const { control, handleSubmit, setValue, getValues } = methods;
  const [isFromNextButton, setIsFromNextButton] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const onSubmit = (data) => {
    const newData = {
      fifthForm: data.fifthForm
    }
    console.log(newData)
    if (isFromNextButton) {
      onceSubmitted(newData, '6');
    } else {
      onceSubmitted(newData);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpagefive`, {
        params: {
          projectId: projectId,
        },
      })
      .then((res) => {
        console.log(res)
        const pageFiveData = res.data.page_five;
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
        <FirstSection control={control} setValue={setValue} getValues={getValues} />
        <FormFooter chapter={CHAPTER_NUMBER} shouldRedirect={shouldRedirect} setFromNextButton={setIsFromNextButton} />
      </Stack>
    </form>
  );
};

export default FifthForm;

function defaultFormValue() {
  return {
    fifthForm: {
      total_dec: 200000,
      e_facade_area: 0,
      e_pv_spec_wpeak: 0,
      e_pv_spec_dimension: [0, 0, 0],
      e_result: {
        energy_percentage: 0
      }
    },
  };
}

const FirstSection = ({ control, setValue, getValues }) => {
  const sectionName = "fifthForm.";

  var resultArr = {
    potentialPV: 0,
    predictionElectrical: 0,
    percentageEnergyMix: 0,
  }

  const PotentialPVLabel = () => {

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

    var result = 0

    if (facadeArea && dimensionL && dimensionW) {
      result = calcPotentialPV(facadeArea, dimensionL, dimensionW);
    }

    resultArr.potentialPV = result

    if (isNaN(result)) {
      return <InlineLabel title="Potential PV numbers to be installed" value={'-'} />
    } else {
      return <InlineLabel title="Potential PV numbers to be installed" value={result} />
    }
  }

  const PredictionElectricalLabel = () => {
    const watchValue = useWatch({
      control,
      name: sectionName,
    });

    const pv = resultArr.potentialPV
    const wpeakValue = watchValue.e_pv_spec_wpeak

    var result = 0
    if (wpeakValue) {
      result = calcPredictionElectical(pv, wpeakValue);
    }

    resultArr.predictionElectrical = result

    if (isNaN(result)) {
      return <InlineLabel title="Prediction of Electrical energy" value={"- kWh/m2 per year"} />
    } else {
      return <InlineLabel title="Prediction of Electrical energy" value={(result) + " kWh/m2 per year"} />
    }
  }

  const PercentageElectricalLabel = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    var predictionElectrical = resultArr.predictionElectrical;
    const total_dec = getValues("fifthForm.total_dec")

    var result = 0
    if (predictionElectrical) {
      result = calcPercentageElectrical(parseInt(predictionElectrical), parseFloat(total_dec))
    }

    resultArr.percentageEnergyMix = result
    setValue("fifthValue.e_result.energy_percentage", result)

    if (isNaN(result)) {
      return <InlineLabel title="Percentage of electrical energy mix" value={"-%"} />
    } else {
      return <InlineLabel title="Percentage of electrical energy mix" value={result + "%"} />
    }
  }

  const SubsidyGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    const standard = 30;
    const calculate = resultArr.percentageEnergyMix;

    const chartData = [
      { label: "Subsidised energy mix", value: calculate },
      { label: "Target energy mix", value: standard },
    ];

    const barColors = ["#47919b", "#7e84a3"];

    return (
      <Box>
        <ResponsiveContainer width="90%" height={200}>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 30,
              bottom: 5,
            }}
            barSize={50}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="value"
              tickFormatter={(tick) => `${tick}%`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
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

          {/* <SideButtonInput
            name={sectionName + "e_pv_install_att"}
            control={control}
            title="PV Installation Planning"
          /> */}

          <Typography variant="subtitle2" fontWeight="bold" paddingTop={4}>
            PV Specification
          </Typography>

          {/* <SideButtonInput
            name={sectionName + "e_pv_solar_att"}
            control={control}
            title="Solar Panels Spesification"
          /> */}

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
          <PotentialPVLabel />
          <PredictionElectricalLabel />
          <PercentageElectricalLabel />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontWeight: "bold" }}>
            Graph: Subsidised electrical energy from renewable energy vs. government energy mix target
          </Box>
          <SubsidyGraph />
        </Stack>
      }
    />
  );
};
