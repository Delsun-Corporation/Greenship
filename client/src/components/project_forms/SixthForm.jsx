import React, { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import {
  Box,
  Paper,
  Stack,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import {
  FormHeader,
  FormFooter,
  FormLayout,
  SkeletonSection
} from "../FormLayouts";
import { calcAccessPercentage, numberFormat } from "../../datas/FormLogic";
import { formChapters, visualComfort } from "../../datas/Datas";
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
  PieChart,
  Pie,
  Sector,
} from "recharts";
import axios from "axios";
import { toast } from "react-toastify";

const SixthForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({
    defaultValues: defaultFormValue(),
  });
  const { control, handleSubmit, setValue, reset, getValues } = methods;

  const [isLoading, setLoading] = useState(true);
  const [isFromNextButton, setIsFromNextButton] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    // onceSubmitted(data);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpagesix`, {
        params: {
            projectId: projectId,
        },
      })
      .then((res) => {
        setValue("firstForm", {
          ...res.data.firstForm,
        });
        setValue("thirdForm", {
            ...res.data.thirdForm,
        })
        const temp = res.data.fourthForm.d_d_illuminance
        var illuminanceArr = []
        temp.map((entry, index) => {
            const roomActivity = visualComfort.find((element) => {
                return element.locActivity === entry.room_activity.locActivity
            })
            const tempObject = {
                room_activity: roomActivity,
                  area: entry.area,
                  lamp_type: entry.lamp_type,
                  lamp_count: entry.lamp_count,
                  lamp_power: entry.lamp_power,
                  lamp_lumen: entry.lamp_lumen,
            }
            illuminanceArr.push(tempObject)
        })
        
        setValue("fourthForm", {
            ...res.data.fourthForm,
            d_d_illuminance: illuminanceArr
        })
        setValue("fifthForm", {
            ...res.data.fifthForm,
        })
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again");
      });
  }, [projectId]);

  const CHAPTER_NUMBER = "6";

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
            <NetZeroSection getValues={getValues} />
            <HealthyBuildingSection getValues={getValues} />
            <DesignRecommendationSection />
          </>
        )}
        <FormFooter
          chapter={CHAPTER_NUMBER}
          setFromNextButton={setIsFromNextButton}
          shouldRedirect={shouldRedirect}
        />
      </Stack>
    </form>
  );
};

export default SixthForm;

function defaultFormValue() {
  return {
    firstForm: {
      a_typology_eci: "300 kWh/m2 per year",
      a_typology_acoustic: "30-35 dBA",
      a_ach: 10,
    },
    thirdForm: {
      mv_flow_rate: 100,
      total_dec: {
        lighting: 50,
        ac: 100,
        appliances: 30,
        utility: 50,
        plug: 50,
      },
    },
    fourthForm: {
      d_b_velocity: 10,
      d_c_access_area: 5,
      d_d_illuminance: [defaultIlluminances()],
      d_e_temperature: 10,
      d_f_noise_level: 10,
      d_total_bhc: {
        vbz: 20,
        ach: 20,
        illuminance: [20],
      },
    },
    fifthForm: {
      e_result: {
        energy_percentage: 0,
      },
    },
  };
}

function defaultIlluminances() {
  return {
    room_activity: {
      locActivity: "Public entrance halls, foyers",
      e: "200-500",
    },
    area: 0,
    lamp_type: "",
    lamp_count: 0,
    lamp_power: 0,
    lamp_lumen: 0,
  };
}

/// SECTIONS ///

const NetZeroSection = ({ getValues }) => {
  const dec = getValues(`thirdForm.total_dec`);

  const ConsumptionEnergyIndexGraph = () => {
    const totalDec =
      dec.lighting + dec.ac + dec.appliances + dec.utility + dec.plug;

    const baselineEnergyConsumption = parseInt(
      getValues(`firstForm.a_typology_eci`)
    );

    const chartData = [
      { label: "Building Design Energy Consumption", value: totalDec },
      {
        label: "Baseline Energy Consumption Index",
        value: baselineEnergyConsumption,
      },
    ];

    const barColors = ["#47919b", "#7e84a3"];

    return (
      <Box>
        <ResponsiveContainer width="99%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 70,
              bottom: 5,
            }}
            barSize={70}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="value"
              domain={[0, "dataMax"]}
              tickFormatter={(tick) => `${numberFormat(tick)}°C`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)}/>
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

  const ConsumptionEnergyPercentagesGraph = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback(
      (_, index) => {
        setActiveIndex(index);
      },
      [setActiveIndex]
    );

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#e56273"];

    const data = [
      { name: "Lighting", value: dec.lighting },
      { name: "AC", value: dec.ac },
      { name: "Appliances", value: dec.appliances },
      { name: "Utility", value: dec.utility },
      { name: "Plug", value: dec.plug },
    ];

    return (
      <ResponsiveContainer width={600} height={400}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const MixEnergyConsumptionGraph = () => {
    const standard = 30;
    const calculate = getValues(`fifthForm.e_result.energy_percentage`);

    const chartData = [
      { label: "Subsidised energy mix", value: calculate },
      { label: "Target energy mix", value: standard },
    ];

    const barColors = ["#47919b", "#7e84a3"];

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
            <XAxis
              type="number"
              dataKey="value"
              tickFormatter={(tick) => `${numberFormat(tick)}%`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)}/>
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
    <Container maxWidth="xl" disableGutters>
      <Paper elevation={2}>
        <Box
          width="100%"
          sx={{
            backgroundColor: "#c09577",
            color: "white",
            borderRadius: 1,
            paddingX: 4,
            paddingY: 2,
          }}
        >
          <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
            Towards Net Zero Building
          </Box>
        </Box>

        <Stack direction="column" spacing={2} sx={{ padding: 4 }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={4}
          >
            <Stack direction="column" spacing={2} width="50%">
              <Box sx={{ fontSize: 20, fontWeight: "bold" }}>
                Consumption Energy Index
              </Box>
              <ConsumptionEnergyIndexGraph />
            </Stack>
            <Stack direction="column" spacing={2}>
              <Box sx={{ fontSize: 20, fontWeight: "bold" }}>
                Consumption Energy Percentages
              </Box>
              <ConsumptionEnergyPercentagesGraph />
            </Stack>
          </Stack>

          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>
            Mix Energy Consumption
          </Box>
          <MixEnergyConsumptionGraph />
        </Stack>
      </Paper>
    </Container>
  );
};

const HealthyBuildingSection = ({ getValues }) => {
  const VbzGraph = () => {
    const mvFlowRate = getValues(`thirdForm.mv_flow_rate`);
    const vbz = getValues(`fourthForm.d_total_bhc.vbz`);

    const chartData = [
      { label: "Vbz", value: vbz },
      { label: "MV flow rate", value: mvFlowRate },
    ];

    const barColors = ["#47919b", "#7e84a3"];

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
            <Tooltip formatter={(value) => numberFormat(value)}/>
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

  const AchGraph = () => {
    const achStandard = getValues(`firstForm.a_ach`);
    const achCalculate = getValues(`fourthForm.d_total_bhc.ach`);

    const chartData = [
      { label: "ACH Calculation", value: achCalculate },
      { label: "ACH Standard", value: achStandard },
    ];

    const barColors = ["#47919b", "#7e84a3"];

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
            <Tooltip formatter={(value) => numberFormat(value)}/>
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

  const AccessOutsideGraph = () => {
    const gfa = getValues(`firstForm.a_gfa`);
    const accessArea = getValues(`fourthForm.d_c_access_area`);

    const standard = 75;
    const calculate = calcAccessPercentage(accessArea, gfa);

    const chartData = [
      { label: "Calculated area", value: calculate },
      { label: "Greenship Standard", value: standard },
    ];

    const barColors = ["#47919b", "#7e84a3"];

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
            <XAxis
              type="number"
              dataKey="value"
              tickFormatter={(tick) => `${numberFormat(tick)}%`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)}/>
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

  const IlluminanceGraph = () => {
    const illuminanceArr = getValues(`fourthForm.d_d_illuminance`);
    const illuminanceRes = getValues(`fourthForm.d_total_bhc.illuminance`);

    const chartData = [];

    const barColors = ["#47919b", "#7e84a3", "#82ca9d"];

    illuminanceArr.map(function (value, index) {
      if (value.room_activity === null) return false;

      const standard = value.room_activity.e;
      var parsedStandard = standard
        .split(/[-]+/)
        .map((number) => parseInt(number));

      if (chartData.length <= index) {
        chartData.push({
          label: value.room_activity.locActivity,
          value: illuminanceRes[index],
          standardMin: parsedStandard[0],
          standardMax: parsedStandard[1],
        });
      } else {
        chartData[index] = {
          label: value.room_activity.locActivity,
          value: illuminanceRes[index],
          standardMin: parsedStandard[0],
          standardMax: parsedStandard[1],
        };
      }
    });

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
          <Tooltip formatter={(value) => numberFormat(value)}/>
          <Legend
            height={10}
            wrapperStyle={{ position: "relative", marginTop: "0px" }}
          />
          <Bar name="Calculated E" dataKey="value" fill={barColors[0]} />
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
  };

  const AcTempGraph = () => {
    const standard = 25;
    const calculate = getValues(`fourthForm.d_e_temperature`);

    const chartData = [
      { label: "Design temperature", value: calculate },
      { label: "Greenship Standard", value: standard },
    ];

    const barColors = ["#47919b", "#7e84a3"];

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
            <XAxis
              type="number"
              dataKey="value"
              tickFormatter={(tick) => `${numberFormat(tick)}°C`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)}/>
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

  const NoiseGraph = () => {
    const standard = getValues(`firstForm.a_typology_acoustic`);
    const parsedStandard = standard
      .split(/[-]+/)
      .map((number) => parseInt(number));
    const calculate = getValues(`fourthForm.d_f_noise_level`);

    const chartData = [
      { label: "Noise level in site", value: calculate, min: 0, max: 0 },
      {
        label: "Standard allowed noise",
        value: 0,
        min: parsedStandard[0],
        max: parsedStandard[1] - parsedStandard[0],
      },
    ];

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
              domain={[0, "dataMax + 20"]}
              tickCount={6}
              tickFormatter={(tick) => `${numberFormat(tick)} dBA`}
            />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => numberFormat(value)}/>
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
    <Container maxWidth="xl" disableGutters>
      <Paper elevation={2}>
        <Box
          width="100%"
          sx={{
            backgroundColor: "#c09577",
            color: "white",
            borderRadius: 1,
            paddingX: 4,
            paddingY: 2,
          }}
        >
          <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
            Towards Healthy Building
          </Box>
        </Box>

        <Stack direction="column" spacing={2} sx={{ padding: 4 }}>
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>
            Breathing Zone Outdoor Airflow (VBz)
          </Box>
          <VbzGraph />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>
            Air Change per Hour (ACH)
          </Box>
          <AchGraph />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>
            Access to Outside View
          </Box>
          <AccessOutsideGraph />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>Visual Comfort</Box>
          <IlluminanceGraph />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>Thermal Comfort</Box>
          <AcTempGraph />
          <Divider style={{ width: "100%" }} />
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>
            Acoustical Comfort
          </Box>
          <NoiseGraph />
        </Stack>
      </Paper>
    </Container>
  );
};

const DesignRecommendationSection = () => {
  return (
    <Container maxWidth="xl" disableGutters>
      <Paper elevation={2}>
        <Box
          width="100%"
          sx={{
            backgroundColor: "#c09577",
            color: "white",
            borderRadius: 1,
            paddingX: 4,
            paddingY: 2,
          }}
        >
          <Box sx={{ fontSize: 24, fontWeight: "bold" }}>
            Design Recommendation
          </Box>
        </Box>

        <FormLayout
          leftComponent={
            <Stack direction="column" spacing={2}>
              <Typography>
                • Installation of CO2 sensor, for any area with occupancy level
                under 2.56 person/m2
              </Typography>
              <Typography>
                • Cigarette smoke control: giving separated smoking area and
                installation of smoking signage in any public area
              </Typography>
              <Typography>
                • Management of chemical pollutants: low VOC and formaldehida
                for minimum of 75% ceiling, wall, floor, and furniture
                material-finishing, 100% non-asbestos materials.
              </Typography>
            </Stack>
          }
          rightComponent={
            <Stack direction="column" spacing={2}>
              <Typography>
                • Provide temperature checking area and tools.
              </Typography>
              <Typography>
                • Provide self-assessment system for all the users.
              </Typography>
              <Typography>• Provide public hand-washing area.</Typography>
              <Typography>• Provide signage of Mask Mandatory Area.</Typography>
              <Typography>
                • Provide signage of Social Distancing Alert.
              </Typography>
            </Stack>
          }
        />
      </Paper>
    </Container>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontWeight="bold"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={-14}
        fontSize={15}
        fontWeight="bold"
        textAnchor={textAnchor}
        fill="#333"
      >{`${numberFormat(value)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={0}
        fontSize={10}
        textAnchor={textAnchor}
        fill="#333"
      >{`kWh/m2 per year`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${numberFormat(percent * 100)}%)`}
      </text>
    </g>
  );
};
