import React, { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { Stack, TextField, Typography, Box, Divider, Skeleton } from "@mui/material";
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
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, PieChart, Pie, Sector } from 'recharts';

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
      b_window_area_n: 0,
      b_window_area_s: 0,
      b_window_area_e: 0,
      b_window_area_w: 0,
      b_window_area_ne: 0,
      b_window_area_se: 0,
      b_window_area_nw: 0,
      b_window_area_sw: 0,
      b_wall_area_n: 0,
      b_wall_area_s: 0,
      b_wall_area_e: 0,
      b_wall_area_w: 0,
      b_wall_area_ne: 0,
      b_wall_area_se: 0,
      b_wall_area_nw: 0,
      b_wall_area_sw: 0,
      b_wall_area_r: 0,
    },
  };
}

const FirstSection = ({ control }) => {
  const sectionName = "secondForm.";

  var countedWWR = 0

  function CountWWR() {
    /// Window Area Watch
    const windowAreaN = useWatch({
      control,
      name: sectionName + "b_window_area_n",
      defaultValue: 0
    });
    const windowAreaS = useWatch({
      control,
      name: sectionName + "b_window_area_s",
      defaultValue: 0
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
    countedWWR = calcWWR(collectionWindowArea, collectionWallArea)
    return countedWWR + "%";
  }

  const OttvGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}.b_ottv`,
    });

    const calculated = watchValues
    const baseline = 45

    const chartData = [
      { label: "Calculated OTTV", value: calculated },
      { label: "Baseline", value: baseline }
    ]

    const barColors = ["#47919b", "#7e84a3"]

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

    const barColors = ["#47919b", "#7e84a3", "#82ca9d"];

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
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    const calculated = countedWWR
    const baseline = 30
    const allowed = 40

    const chartData = [
      { label: "Calculated WWR", value: calculated, min: 0, max: 0 },
      { label: "Baseline", value: 0, min: baseline, max: allowed - baseline }
    ]

    const barColors = ["#47919b", "#7e84a3", "#82ca9d"];

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
            title="OTTV (kWh/m2)"
            subtitle="OTTV Baseline: 45kWh/m2"
          />

          <SideInput
            name={`${sectionName}.b_shgc`}
            control={control}
            title="SHGC"
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
                  name={`${sectionName}b_window_area_n`}
                  control={control}
                  adornment={"N"}
                />
                <BasicInputField
                  name={`${sectionName}b_window_area_s`}
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
                  name={`${sectionName}b_window_area_e`}
                  control={control}
                  adornment={"E"}
                />
                <BasicInputField
                  name={`${sectionName}b_window_area_w`}
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
                  name={`${sectionName}b_window_area_ne`}
                  control={control}
                  adornment={"NE"}
                />
                <BasicInputField
                  name={`${sectionName}b_window_area_se`}
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
                  name={`${sectionName}b_window_area_nw`}
                  control={control}
                  adornment={"NW"}
                />
                <BasicInputField
                  name={`${sectionName}b_window_area_sw`}
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
                  name={`${sectionName}b_wall_area_n`}
                  control={control}
                  adornment={"N"}
                />
                <BasicInputField
                  name={`${sectionName}b_wall_area_s`}
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
          <InlineLabel title="WWR" subtitle="Baseline 30-40%" value={CountWWR()} />
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
