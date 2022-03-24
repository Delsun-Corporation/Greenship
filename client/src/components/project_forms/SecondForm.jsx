import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Stack, Typography, Box, Divider } from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  InlineLabel,
  BasicInputField,
  SkeletonSection
} from "../FormLayouts";
import { formChapters } from "../../datas/Datas";
import { calcWWR, numberFormat } from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SecondForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({
    defaultValues: defaultFormValue()
  });
  const { control, handleSubmit, setValue } = methods;
  const [isFromNextButton, setIsFromNextButton] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const onSubmit = (data) => {
    console.log("Second Form data:", data)
    if (isFromNextButton) {
      onceSubmitted(data, "3");
    } else {
      onceSubmitted(data);
    }
  };

  function isNull(object) {
    for (const [key, value] of Object.entries(object)) {
      if (typeof (value) === "object" && value !== null) {
        isNull(value)
      } else if (!value) {
        object[key] = 0
      }
    }
    return object
  }

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpagetwo`, {
        params: {
          projectId: projectId,
        },
      })
      .then((res) => {
        console.log("Second Form data get:", res.data.page_two);
        setValue("secondForm", {
          b_wall_area: isNull(res.data.page_two.b_wall_area),
          b_window_area: isNull(res.data.page_two.b_window_area),
          ...res.data.page_two,
        });
        setLoading(false);
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
        {isLoading && <SkeletonSection />}
        {!isLoading && (
          <>
            <FirstSection control={control} />
            <FormFooter
              chapter={CHAPTER_NUMBER}
              shouldRedirect={shouldRedirect}
              setFromNextButton={setIsFromNextButton}
            />
          </>
        )}
      </Stack>
    </form>
  );
};

export default SecondForm;

function defaultFormValue() {
  return {
    secondForm: {
      b_ottv: 0,
      b_shgc: 0,
      b_window_area: [0, 0, 0, 0, 0, 0, 0, 0],
      b_wall_area: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
  };
}

const FirstSection = ({ control }) => {
  const sectionName = "secondForm.";

  var countedWWR = 0

  function CountWWR() {
    const watchValues = useWatch({
      control,
      name: sectionName,
    });
    const collectionWindowArea = [
      watchValues.b_window_area[0],
      watchValues.b_window_area[1],
      watchValues.b_window_area[2],
      watchValues.b_window_area[3],
      watchValues.b_window_area[4],
      watchValues.b_window_area[5],
      watchValues.b_window_area[6],
      watchValues.b_window_area[7],
    ];
    const collectionWallArea = [
      watchValues.b_wall_area[0],
      watchValues.b_wall_area[1],
      watchValues.b_wall_area[2],
      watchValues.b_wall_area[3],
      watchValues.b_wall_area[4],
      watchValues.b_wall_area[5],
      watchValues.b_wall_area[6],
      watchValues.b_wall_area[7],
    ];

    countedWWR = calcWWR(collectionWindowArea, collectionWallArea)
    return countedWWR + "%";
  }

  const OttvGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}b_ottv`,
    });

    const calculated = watchValues
    const baseline = 45

    const chartData = [
      { label: "Calculated OTTV", value: calculated },
      { label: "Baseline", value: baseline }
    ]

    const barColors = [ ( calculated > baseline ? "#ff392e" : "#47919b"), "#7e84a3"]

    return (
      <Box>
        <ResponsiveContainer width="99%" height={200}>
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
            <XAxis type="number" dataKey="value" tickFormatter={(tick) => `${numberFormat(tick)}kWh/m2`} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Bar dataKey="value" fill="#8884d8" >
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
                ))
              }
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </Box>

    )
  }

  const ShgcGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}.b_shgc`,
    });

    const calculated = watchValues
    const baseline = 0.6
    const allowed = 0.7

    const chartData = [
      { label: "Calculated SHGC", value: calculated, min: 0, max: 0 },
      { label: "Baseline", value: 0, min: baseline, max: allowed - baseline }
    ]
    
    const barColors = [((calculated > baseline || calculated < allowed - baseline) ? "#ff392e" : "#47919b"), "#7e84a3", "#82ca9d"];

    return (
      <Box>
        <ResponsiveContainer width="99%" height={200}>
          <BarChart
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
              domain={[0, "dataMax + 0.5"]}
              tickCount={6}
              tickFormatter={(tick) => `${numberFormat(tick)}`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Legend />
            <Bar
              name="Calculated"
              dataKey="value"
              stackId="a"
              fill={barColors[0]}
            />
            <Bar
              name="Baseline standard"
              dataKey="min"
              stackId="a"
              fill={barColors[1]}
            />
            <Bar
              name="Allowed standard"
              dataKey="max"
              stackId="a"
              fill={barColors[2]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  const WwrGraph = () => {
    const calculated = countedWWR
    const baseline = 30
    const allowed = 40

    const chartData = [
      { label: "Calculated WWR", value: calculated, min: 0, max: 0 },
      { label: "Baseline", value: 0, min: baseline, max: allowed - baseline }
    ]

    const barColors = [((calculated > baseline || calculated < allowed - baseline) ? "#ff392e" : "#47919b"), "#7e84a3", "#82ca9d"];

    return (
      <Box>
        <ResponsiveContainer width="99%" height={200}>
          <BarChart
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
              domain={[0, "dataMax + 0.2"]}
              tickCount={6}
              tickFormatter={(tick) => `${numberFormat(tick)}%`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Legend />
            <Bar
              name="Calculated"
              dataKey="value"
              stackId="a"
              fill={barColors[0]}
            />
            <Bar
              name="Baseline standard"
              dataKey="min"
              stackId="a"
              fill={barColors[1]}
            />
            <Bar
              name="Allowed standard"
              dataKey="max"
              stackId="a"
              fill={barColors[2]}
            />
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
            name={`${sectionName}.b_ottv`}
            control={control}
            title="Overall Thermal Transfer Value (kWh/m2)"
            subtitle="OTTV Baseline: 45kWh/m2"
          />

          <SideInput
            name={`${sectionName}.b_shgc`}
            control={control}
            title="Solar Heat Gain Coefficient"
            subtitle="SHGC Baseline: 0.6 - 0.7"
          />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            paddingTop={4}
            paddingBottom={4}
          >
            <Stack direction="column">
              <Typography>Window Area (m2)</Typography>
              <Typography variant="caption" color="text.secondary">Window Area Baseline: 45kWh/m2</Typography>
            </Stack>

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
                  required={false}
                  name={`${sectionName}b_window_area[0]`}
                  control={control}
                  adornment={"N"}
                />
                <BasicInputField
                  required={false}
                  name={`${sectionName}b_window_area[1]`}
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
                  required={false}
                  name={`${sectionName}b_window_area[2]`}
                  control={control}
                  adornment={"E"}
                />
                <BasicInputField
                  required={false}
                  name={`${sectionName}b_window_area[3]`}
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
                  required={false}
                  name={`${sectionName}b_window_area[4]`}
                  control={control}
                  adornment={"NE"}
                />
                <BasicInputField
                  required={false}
                  name={`${sectionName}b_window_area[5]`}
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
                  required={false}
                  name={`${sectionName}b_window_area[6]`}
                  control={control}
                  adornment={"NW"}
                />
                <BasicInputField
                  required={false}
                  name={`${sectionName}b_window_area[7]`}
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
                  required={false}
                  name={`${sectionName}b_wall_area[0]`}
                  control={control}
                  adornment={"N"}
                />
                <BasicInputField
                  required={false}
                  name={`${sectionName}b_wall_area[1]`}
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
                  required={false}
                  name={sectionName + "b_wall_area[2]"}
                  control={control}
                  adornment={"E"}
                />
                <BasicInputField
                  required={false}
                  name={sectionName + "b_wall_area[3]"}
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
                  required={false}
                  name={sectionName + "b_wall_area[4]"}
                  control={control}
                  adornment={"NE"}
                />
                <BasicInputField
                  required={false}
                  name={sectionName + "b_wall_area[5]"}
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
                  required={false}
                  name={sectionName + "b_wall_area[6]"}
                  control={control}
                  adornment={"NW"}
                />
                <BasicInputField
                  required={false}
                  name={sectionName + "b_wall_area[7]"}
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
                  required={false}
                  name={sectionName + "b_wall_area[8]"}
                  control={control}
                  adornment={"R"}
                />
              </Stack>
            </Stack>
          </Stack>
          <InlineLabel title="Window to Wall Ratio" subtitle="WWR Baseline 30-40%" value={CountWWR()} />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2} sx={{}}>
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>Graph: Calculated OTTV vs Baseline</Box>
          <OttvGraph />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>Graph: Calculated SHGC vs Baseline</Box>
          <ShgcGraph />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>Graph: Calculated WWR vs Baseline</Box>
          <WwrGraph />
        </Stack>
      }
    />
  );
};
