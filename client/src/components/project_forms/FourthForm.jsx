import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Box,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  ThemeProvider,
} from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  SelectInput,
  BlockInput,
  InlineLabel,
  ToggleInput,
  SkeletonSection,
  ImageUpload,
} from "../FormLayouts";
import {
  formChapters,
  visualComfort,
  occupancyCategory,
} from "../../datas/Datas";
import {
  calcZonePopulation,
  calcVbz,
  calcACH,
  calcAccessPercentage,
  calcIlluminance,
  numberFormat,
} from "../../datas/FormLogic";
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
} from "recharts";
import axios from "axios";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { theme } from "../../assets/Theme";

const FourthForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({
    defaultValues: defaultFormValue(),
  });
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const [isLoading, setLoading] = useState(true);
  const [isFromNextButton, setIsFromNextButton] = useState(false);

  const onSubmit = (data) => {
    const newData = {
      fourthForm: data.fourthForm,
    };
    console.log(newData);
    if (isFromNextButton) {
      onceSubmitted(newData, "5");
    } else {
      onceSubmitted(newData);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpagefour`, {
        params: {
          projectId: projectId,
        },
      })
      .then((res) => {
        const pageThreeData = res.data.page_three;
        const pageFourData = res.data.page_four;
        const pageOneData = res.data.page_one;
        console.log(res.data);
        setValue("firstForm", {
          ...pageOneData,
        });
        setValue("thirdForm", {
          ...pageThreeData,
        });
        setValue("fourthForm", {
          ...pageFourData,
          d_d_illuminance:
            pageFourData.d_d_illuminance.items.length === 0
              ? [defaultIlluminances()]
              : pageFourData.d_d_illuminance.items,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again");
      });
  }, [projectId]);

  const CHAPTER_NUMBER = "4";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={4} sx={{ paddingY: 10 }}>
        <FormHeader
          title={formChapters.find((e) => e.chapter === CHAPTER_NUMBER).title}
          projectId={projectId}
          chapter={CHAPTER_NUMBER}
        />
        {isLoading && <SkeletonSection />}
        {!isLoading && (
          <>
            <OutdoorAirSection
              control={control}
              getValues={getValues}
              setValue={setValue}
              errors={errors}
            />
            <AchSection
              control={control}
              getValues={getValues}
              setValue={setValue}
              errors={errors}
            />
            <AccessOutsideSection
              control={control}
              getValues={getValues}
              errors={errors}
            />
            <VisualComfortSection
              control={control}
              getValues={getValues}
              setValue={setValue}
              errors={errors}
            />
            <ThermalComfortSection
              control={control}
              getValues={getValues}
              errors={errors}
            />
            <AcousticalComfortSection
              control={control}
              getValues={getValues}
              errors={errors}
            />
            <FormFooter
              chapter={CHAPTER_NUMBER}
              setFromNextButton={setIsFromNextButton}
              shouldRedirect={shouldRedirect}
            />
          </>
        )}
      </Stack>
    </form>
  );
};

export default FourthForm;

/// DEFAULT VALUES ///

function defaultFormValue() {
  return {
    firstForm: {
      a_gfa: 0,
      a_floor_count: 0,
      a_floor_height_avg: 0,
      a_occupancy_density: 0,
      a_ventilation_area: 0,
      a_ach: 0,
      a_typology_acoustic: "30-35 dBA",
    },
    thirdForm: {
      mv_flow_rate: 0,
      mv_amount: 0,
    },
    fourthForm: {
      d_a_is_potential: true,
      d_a_rp: 0,
      d_a_ra: 0,
      d_a_az: 0,
      d_b_velocity: 0,
      d_c_access_area: 0,
      d_d_illuminance: [defaultIlluminances()],
      d_e_temperature: 0,
      d_f_noise_level: 0,
      d_total_bhc: defaultTotalBhc(),
    },
  };
}

function defaultIlluminances() {
  return {
    room_activity: { locActivity: "Public entrance halls, foyers", e: "200" },
    area: 0,
    lamp_type: "",
    lamp_count: 0,
    lamp_power: 0,
    lamp_lumen: 0,
  };
}

function defaultTotalBhc() {
  return {
    vbz: 0,
    ach: 0,
    illuminance: [],
  };
}

/// SECTIONS ///

const OutdoorAirSection = ({ control, getValues, setValue, errors }) => {
  const sectionName = "fourthForm";

  const [isPotential, setPotential] = useState();

  const resultArr = {
    pz: 0,
    vbz: 0,
  };

  const ZonePopulation = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });
    const gfa = getValues("firstForm.a_gfa");
    const occupancyDensity = getValues("firstForm.a_occupancy_density");

    var result = 0;
    if (gfa && occupancyDensity) {
      result = calcZonePopulation(gfa, occupancyDensity);
      resultArr.pz = result;
    }

    return (
      <InlineLabel
        title="Zone Population (person)"
        value={numberFormat(result)}
      />
    );
  };

  const Vbz = () => {
    const rp = useWatch({
      control,
      name: `${sectionName}.d_a_rp`,
    });
    const ra = useWatch({
      control,
      name: `${sectionName}.d_a_ra`,
    });
    const az = useWatch({
      control,
      name: `${sectionName}.d_a_az`,
    });
    const pz = resultArr.pz;
    const mvAmount = getValues("thirdForm.mv_amount");

    var result = 0;
    console.log(rp, pz, ra, az, mvAmount);
    if (rp && pz && ra && az && mvAmount) {
      result = calcVbz(rp, pz, ra, az, mvAmount);
      resultArr.vbz = result;
    }
    useEffect(() => {
      setValue("fourthForm.d_total_bhc.vbz", result);
    });

    return (
      <Paper
        sx={{
          paddingX: 2,
          paddingY: 1,
          backgroundColor: "green",
          color: "white",
        }}
      >
        <InlineLabel
          title="Breathing zone outdoor airflow (Vbz)"
          value={`${numberFormat(result)} l/s`}
          bold
        />
      </Paper>
    );
  };

  const MvGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    const mvFlowRate = getValues(`thirdForm.mv_flow_rate`);
    const vbz = resultArr.vbz;

    const chartData = [
      { label: "Vbz", value: vbz },
      { label: "MV flow rate", value: mvFlowRate },
    ];

    const barColors = ["#47919b", ((mvFlowRate < vbz) ? "#ff392e" : "#7e84a3")];

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
            <XAxis type="number" dataKey="value" />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const HandleToggle = (event) => {
    setPotential(event.target.checked);
    setValue(`${sectionName}.d_a_is_potential`, event.target.checked);
  };

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
            Outdoor Air Introduction
          </Box>
          <ToggleInput
            control={control}
            name={`${sectionName}.d_a_is_potential`}
            title="Is there any outdoor air introduction potentials?"
            handleChange={(event) => HandleToggle(event)}
          />
          {isPotential && (
            <ImageUpload
              name={sectionName + ".d_a_attachment"}
              errors={errors}
              control={control}
              imageUrl={getValues(sectionName + ".d_a_attachment")}
              title="Attach proof of Outdoor Air Introduction Potential"
            />
          )}
          <Divider style={{ width: "100%" }} />
          <SideInput
            name={`${sectionName}.d_a_rp`}
            control={control}
            title="Outdoor airflow rate required per person (L/s*person)"
            subtitle="See right table for reference"
          />
          <ZonePopulation />

          <SideInput
            name={`${sectionName}.d_a_ra`}
            control={control}
            title="Outdoor airflow rate required per unit area (L/s*m2)"
            subtitle="See right table for reference"
          />
          <SideInput
            name={`${sectionName}.d_a_az`}
            control={control}
            title="Zone floor area (m2)"
          />
          <Divider style={{ width: "100%" }} />
          <Vbz />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontWeight: "bold" }}>Minimum Ventilation Rates</Box>
          <SelectInput
            name={"fourthForm.ventilation_option"}
            control={control}
            options={occupancyCategory}
            getOptionLabel="category"
            getOptionValue="category"
            placeholder="Select building type..."
          />
          <MinimumVentilationTable control={control} />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontWeight: "bold" }}>
            Graph: Breathing zone outdoor airflow vs MV flow rate
          </Box>
          <MvGraph />
        </Stack>
      }
    />
  );
};

const AchSection = ({ control, getValues, setValue }) => {
  const sectionName = "fourthForm";

  const resultArr = {
    volume: 0,
    ach: 0,
  };

  const Volume = () => {
    const gfa = getValues("firstForm.a_gfa");
    const floorCount = getValues("firstForm.a_floor_count");
    const floorHeightAvg = getValues("firstForm.a_floor_height_avg");

    var result = 0;

    if (gfa && floorCount && floorHeightAvg) {
      result = gfa * floorCount * floorHeightAvg;
      resultArr.volume = result;
    }

    return <InlineLabel title="Volume" value={numberFormat(result) + " m3"} />;
  };

  const ACHCalculate = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}.d_b_velocity`,
    });
    const velocity = watchValues;
    const ventilationArea = getValues("firstForm.a_ventilation_area");
    const volume = resultArr.volume;

    var result = 0;
    if (velocity && ventilationArea && volume) {
      result = calcACH(velocity, ventilationArea, volume);
      resultArr.ach = result;
    }
    useEffect(() => {
      setValue(`fourthForm.d_total_bhc.ach`, result);
    });

    return (
      <Paper
        sx={{
          paddingX: 2,
          paddingY: 1,
          backgroundColor: "green",
          color: "white",
        }}
      >
        <InlineLabel
          title="Air Changes per Hour (ACH) Calculation"
          value={numberFormat(result)}
        />
      </Paper>
    );
  };

  const AchGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    const achStandard = getValues(`firstForm.a_ach`);
    const achCalculate = resultArr.ach;

    const chartData = [
      { label: "ACH Calculation", value: achCalculate },
      { label: "ACH Standard", value: achStandard },
    ];

    const barColors = [
      achCalculate < achStandard ? "#ff392e" : "#47919b",
      "#7e84a3",
    ];

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
            <XAxis type="number" dataKey="value" />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
            Air Changes per Hour (ACH)
          </Box>

          <SideInput
            name={`${sectionName}.d_b_velocity`}
            control={control}
            title="Velocity (m/s)"
          />
          <InlineLabel
            title="Area of ventilation"
            value={
              numberFormat(getValues(`firstForm.a_ventilation_area`)) + " m2"
            }
          />
          <Volume />
          <Divider style={{ width: "100%" }} />
          <ACHCalculate />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontWeight: "bold" }}>
            Graph: Calculated ACH vs. Standard ACH
          </Box>
          <AchGraph />
        </Stack>
      }
    />
  );
};

const AccessOutsideSection = ({ control, getValues, setValue, errors }) => {
  const sectionName = "fourthForm";

  const resultArr = {
    accessPercentage: 0,
  };

  const AccessPercentage = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });
    const accessArea = watchValues.d_c_access_area;
    const gfa = getValues("firstForm.a_gfa");

    var result = 0;
    if (accessArea && gfa) {
      result = calcAccessPercentage(accessArea, gfa);
      resultArr.accessPercentage = result;
    }

    return (
      <Paper
        sx={{
          paddingX: 2,
          paddingY: 1,
          backgroundColor: "green",
          color: "white",
        }}
      >
        <InlineLabel
          title="Percentage of area with access to outside view"
          value={`${numberFormat(result)} %`}
        />
      </Paper>
    );
  };

  const AccessOutsideGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    const standard = 75;
    const calculate = resultArr.accessPercentage;

    const chartData = [
      { label: "Calculated area", value: calculate },
      { label: "Greenship Standard", value: standard },
    ];

    const barColors = [calculate < standard ? "#ff392e" : "#47919b", "#7e84a3"];

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
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <FormLayout
        leftComponent={
          <Stack direction="column" spacing={2}>
            <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
              Access to Outside View
            </Box>
            <ImageUpload
              name={sectionName + ".d_c_access_att"}
              errors={errors}
              control={control}
              imageUrl={getValues(sectionName + ".d_c_access_att")}
              title="Attach Planning for access to outside view"
            />

            <SideInput
              name={`${sectionName}.d_c_access_area`}
              control={control}
              title="Area with access to outside view (m2)"
            />
            <Divider style={{ width: "100%" }} />
            <AccessPercentage />
          </Stack>
        }
        rightComponent={
          <Stack direction="column" spacing={2}>
            <Box sx={{ fontWeight: "bold" }}>
              Graph: Calculated Area with access to outside view vs. Greenship
              standard
            </Box>
            <AccessOutsideGraph />
          </Stack>
        }
      />
    </ThemeProvider>
  );
};

const VisualComfortSection = ({ control, getValues, setValue, errors }) => {
  const sectionName = "fourthForm.d_d_illuminance";

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${sectionName}`,
  });

  const resultArr = {
    calculatedE: [],
    standardMin: [],
    standardMax: [],
  };

  const Illuminance = ({ index }) => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    const area = watchValues[index].area;
    const count = watchValues[index].lamp_count;
    const lumen = watchValues[index].lamp_lumen;
    const standard = watchValues[index].room_activity.e + "";
    var parsedStandard = standard
      .split(/[-]+/)
      .map((number) => parseInt(number));

    var result = 0;
    if (area && count && lumen) {
      result = calcIlluminance(area, count, lumen);

      if (resultArr.calculatedE.length < index) {
        resultArr.calculatedE.push(result);
        resultArr.standardMin.push(parsedStandard[0]);
        parsedStandard.length === 2
          ? resultArr.standardMax.push(parsedStandard[1])
          : resultArr.standardMax.push(0);
      } else {
        resultArr.calculatedE[index] = result;
        resultArr.standardMin[index] = parsedStandard[0];
        parsedStandard.length === 2
          ? (resultArr.standardMax[index] = parsedStandard[1])
          : (resultArr.standardMax[index] = 0);
      }
    }
    useEffect(() => {
      setValue(`fourthForm.d_total_bhc.illuminance`, resultArr.calculatedE);
    });

    return (
      <Paper
        sx={{
          paddingX: 2,
          paddingY: 1,
          backgroundColor: "green",
          color: "white",
        }}
      >
        <InlineLabel title="Calculated E" value={`${numberFormat(result)}`} />
      </Paper>
    );
  };

  const illuminanceCalculatedBarColor = (calculated = 0, allowed = 0, baseline = 0) => {
    console.log("Haha", calculated, allowed, baseline )
    if (allowed > 0) {
      if (calculated > baseline && calculated < allowed) return "#47919b";
      return "#ff392e";
    } else {
      if (calculated < baseline ) return "#ff392e";
      return "#47919b";
    }
  }

  const IlluminanceGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}`,
    });

    const chartData = [];
    const barColors = ["#47919b", "#7e84a3", "#82ca9d"];

    resultArr.calculatedE.map(function (value, index) {
      if (watchValues[index].room_activity === null) return false;

      if (chartData.length <= index) {
        chartData.push({
          label: watchValues[index].room_activity.locActivity,
          value: value,
          standardMin: resultArr.standardMin[index],
          standardMax: resultArr.standardMax[index],
        });
      } else {
        chartData[index] = {
          label: watchValues[index].room_activity.locActivity,
          value: value,
          standardMin: resultArr.standardMin[index],
          standardMax: resultArr.standardMax[index],
        };
      }
    });

    if (resultArr.calculatedE.length !== 0) {
      return (
        <ResponsiveContainer width="99%" height={200 + chartData.length * 60}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 30,
              bottom: 30,
            }}
            barSize={30}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <XAxis type="number" dataKey="value" />
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Legend
              height={10}
              wrapperStyle={{ position: "relative", marginTop: "0px" }}
            />
            <Bar name="Calculated E" dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={illuminanceCalculatedBarColor(chartData[index].value, chartData[index].standardMax, chartData[index].standardMin)} />
              ))}
            </Bar>
            <Bar
              name="Baseline standard E"
              dataKey="standardMin"
              fill={barColors[1]}
              stackId="a"
            />
            <Bar
              name="Upperline standard E"
              dataKey="standardMax"
              fill={barColors[2]}
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <Box paddingY={10} textAlign="center">
          No datas to show. Insert some datas to show graph.
        </Box>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <FormLayout
        leftComponent={
          <Stack direction="column" spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
                Visual Comfort
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  append(defaultIlluminances());
                }}
                sx={{
                  backgroundColor: "steelTeal",
                  ...{
                    "&:hover": {
                      backgroundColor: "steelTeal",
                    },
                  },
                }}
              >
                ADD ITEM
              </Button>
            </Stack>
            <ImageUpload
              name={sectionName + ".d_d_lighting_plan_att"}
              errors={errors}
              control={control}
              imageUrl={getValues("fourthForm.d_d_lighting_plan_att")}
              title="Lighting Plan"
            />
            <div>
              {fields.map((field, index) => {
                const multiInputName = `${sectionName}.${index}`;
                return (
                  <Accordion key={field.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={"panel" + (index + 1) + "bh-content"}
                      id={"panel" + (index + 1) + "bh-header"}
                    >
                      <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        direction="row"
                        width="100%"
                      >
                        <Box sx={{ fontSize: 16, fontWeight: "bold" }}>
                          {"Illuminance #" + (index + 1)}
                        </Box>

                        <Button
                          variant="contained"
                          onClick={() => remove(index)}
                          sx={{
                            backgroundColor: "candyPink",
                            ...{
                              "&:hover": {
                                backgroundColor: "candyPink",
                              },
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <SelectInput
                          name={`${multiInputName}.room_activity`}
                          control={control}
                          options={visualComfort}
                          getOptionLabel="locActivity"
                          getOptionValue="locActivity"
                          placeholder="Select location/activity type..."
                        />
                        <SideInput
                          name={`${multiInputName}.area`}
                          control={control}
                          title="Area (m2)"
                        />

                        <Divider style={{ width: "100%" }} />
                        <Box
                          sx={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "text.secondary",
                          }}
                        >
                          LIGHTING PLAN
                        </Box>
                        <BlockInput
                          name={`${multiInputName}.lamp_type`}
                          control={control}
                          title="Lamp's type"
                          placeholder="Input lamp's brand description and type"
                          rows={1}
                          maxLength={50}
                        />
                        <SideInput
                          name={`${multiInputName}.lamp_count`}
                          control={control}
                          title="Lamp's numbers"
                        />
                        <SideInput
                          name={`${multiInputName}.lamp_power`}
                          control={control}
                          title="Lamp's power (Watt)"
                        />
                        <SideInput
                          name={`${multiInputName}.lamp_lumen`}
                          control={control}
                          title="Lamp's lumen"
                        />
                        <Divider style={{ width: "100%" }} />
                        <Illuminance index={index} />
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          </Stack>
        }
        rightComponent={
          <Stack direction="column" spacing={2} maxWidth="sm">
            <Box sx={{ fontWeight: "bold" }}>
              Graph: Calculated Area with access to outside view vs. Greenship
              standard
            </Box>
            <IlluminanceGraph />
          </Stack>
        }
      />
    </ThemeProvider>
  );
};

const ThermalComfortSection = ({ control, getValues, setValue }) => {
  const sectionName = "fourthForm";

  const AcTempGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}.d_e_temperature`,
    });

    const standard = 25;
    const calculate = watchValues;

    const chartData = [
      { label: "Design temperature", value: calculate },
      { label: "Greenship Standard", value: standard },
    ];

    const barColors = [(calculate < standard ? "#ff392e" : "#47919b"), "#7e84a3"];

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
              tickFormatter={(tick) => `${tick}°C`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)} />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Thermal Comfort</Box>

          <SideInput
            name={`${sectionName}.d_e_temperature`}
            control={control}
            title="AC temperature setting design (°C)"
          />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontWeight: "bold" }}>
            Graph: Planned temperature setting vs. Greenship standard
          </Box>
          <AcTempGraph />
        </Stack>
      }
    />
  );
};

const acousticalCalculatedBarColor = (calculated = 0, allowed = 0, baseline = 0) => {
  console.log("Haha", calculated, allowed, baseline )
  if (allowed > 0) {
    if (calculated > baseline && calculated < allowed) return "#47919b";
    return "#ff392e";
  } else {
    if (calculated > baseline ) return "#ff392e";
    return "#47919b";
  }
}

const AcousticalComfortSection = ({ control, getValues, setValue, errors }) => {
  const sectionName = "fourthForm";

  var StandardNoiseArr = [];

  const StandardNoise = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}.d_f_noise_level`,
    });

    const standard = getValues(`firstForm.a_typology_acoustic`);
    StandardNoiseArr = standard.split(/[-]+/).map((number) => parseInt(number));

    return <InlineLabel title="Standard Noise Level" value={standard} />;
  };

  const NoiseGraph = () => {
    const watchValues = useWatch({
      control,
      name: `${sectionName}.d_f_noise_level`,
    });

    const calculate = watchValues;
    const allowed = StandardNoiseArr[1] - StandardNoiseArr[0] ;
    const standard = StandardNoiseArr[0];
    const chartData = [
      { label: "Noise level in site", value: calculate},
      {
        label: "Standard allowed noise",
        value: 0,
        min: StandardNoiseArr[0],
        max: StandardNoiseArr[1] - StandardNoiseArr[0],
      },
    ];

    const barColors = [acousticalCalculatedBarColor(calculate, allowed, standard), "#7e84a3", "#82ca9d"];

    return (
      <Box>
        <ResponsiveContainer width="90%" height={200}>
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
              domain={[0, "dataMax + 20"]}
              tickCount={6}
              tickFormatter={(tick) => `${tick} dBA`}
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
  };

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
            Acoustical Comfort
          </Box>
          <StandardNoise />

          <SideInput
            name={`${sectionName}.d_f_noise_level`}
            control={control}
            title="Noise level in existing condition (dBA)"
          />
          <ImageUpload
            name={sectionName + ".d_f_noise_control_att"}
            errors={errors}
            control={control}
            imageUrl={getValues(sectionName + ".d_f_noise_control_att")}
            title="Treatment for noise control"
          />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <Box sx={{ fontWeight: "bold" }}>
            Graph: Noise level in site vs. Standard allowed noise
          </Box>
          <NoiseGraph />
        </Stack>
      }
    />
  );
};

const MinimumVentilationTable = ({ control }) => {
  const type = useWatch({
    control,
    name: "fourthForm.ventilation_option.category",
  });

  function children() {
    if (type) {
      const temp = occupancyCategory.find((e) => e.category === type);
      return temp.children;
    }
  }

  if (type) {
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: "orange" }}>
            <TableRow>
              <TableCell rowSpan={2}>Occupancy Category</TableCell>
              <TableCell colSpan={2} align="center">
                People Outdoor Air Rate(Rp)
              </TableCell>
              <TableCell colSpan={2} align="center">
                Area Outdoor Air Rate(Rp)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Cfm/person</TableCell>
              <TableCell align="center">L/s person</TableCell>
              <TableCell align="center">Cfm/ft2</TableCell>
              <TableCell align="center">L/s m2</TableCell>
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
                <TableCell align="center">{row.rp_cfm}</TableCell>
                <TableCell align="center">{row.rp_ls}</TableCell>
                <TableCell align="center">{row.ra_cfm}</TableCell>
                <TableCell align="center">{row.ra_ls}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return <></>;
};
