import React, { useEffect, useState } from 'react';
import {
    useForm,
    useFieldArray,
    Controller,
    useWatch,
    FormProvider
} from "react-hook-form";
import {
    Box,
    Button,
    Accordion, AccordionSummary, AccordionDetails,
    TextField,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
} from '@mui/material';
import {
    FormLayout,
    FormHeader,
    FormFooter,
    SideInput,
    BlockInput,
    SelectInput,
    InlineLabel,
} from "../FormLayouts";
import {
    formChapters,
    lpdReference,
    heatLoad
} from "../../datas/Datas";
import {
    calcNonDaylightArea,
    calcLeDuringOperationalDay,
    calcLeDuringOperationalNonDay,
    calcLeDuringNonOperational,
    calcPSL,
    calcPLL,
    calcBSL,
    calcLSL,
    calcCFM1,
    calcCFM2,
    convertCoolingLoad
} from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ThirdForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
    const methods = useForm({
        defaultValues: defaultFormValue()
    });
    const { control, handleSubmit, setValue, reset, getValues } = methods
    const [isLoading, setLoading] = useState(true);

    const onSubmit = (data) => {
        console.log(data)
        // onceSubmitted(data);
    };

    const CHAPTER_NUMBER = "3";

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" spacing={4} sx={{ paddingY: 10 }}>
                <FormHeader
                    title={formChapters.find((e) => e.chapter === CHAPTER_NUMBER).title}
                    projectId={projectId}
                    shouldRedirect={shouldRedirect}
                    chapter={CHAPTER_NUMBER}
                />
                <LightingSection control={control} getValues={getValues} />
                <ACSection control={control} getValues={getValues} />

                <Button type="submit" variant="contained">
                    Submit
                </Button>
            </Stack>

        </form>
    );
}

export default ThirdForm;

/// DEFAULT VALUES ///

function defaultFormValue() {
    return (
        {
            firstForm: {
                a_gfa: 100,
                a_operational_hours: 10,
                a_working_days: 10,
                a_holidays: 10,
                a_occupancy_density: 10,
                a_ach: 50,
                a_floor_count: 5,
                a_floor_height_avg: 2
            },
            secondForm: {
                b_window_area: [1, 2, 3, 4, 5, 6, 7, 8],
                b_wall_area: [1, 2, 3, 4, 5]
            },
            thirdForm: {
                c_lighting: [defaultLightingValue()],
                c_ac: defaultACValue(),
            }
        }
    )
}

function defaultLightingValue() {
    return ({
        name: "",
        daylight_area: 10,
        lpd_operate: 10,
        lpd_nonoperate: 10
    })
}

function defaultACValue() {
    return ({
        to_ti: 10
    })
}

/// SECTIONS ///

const LightingSection = ({ control, getValues }) => {
    const sectionName = "thirdForm.c_lighting"

    const { fields, append, remove } = useFieldArray({
        control, name: `${sectionName}`
    });

    // CALCULATED COMPONENTS

    const NonDaylightArea = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })
        const gfa = getValues(`firstForm.a_gfa`)
        const daylightArea = watchValues[index].daylight_area
        var result = NaN
        if (gfa && daylightArea) {
            result = calcNonDaylightArea(gfa, daylightArea)
        }
        return <InlineLabel
            title="Non-daylight area"
            value={result}
        />
    }

    const LeDuringOperationalDay = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })
        const daylightArea = watchValues[index].daylight_area
        const lpdOperational = watchValues[index].lpd_operate
        const operationalHours = getValues("firstForm.a_operational_hours")
        var result = NaN
        if (daylightArea && lpdOperational && operationalHours) {
            result = calcLeDuringOperationalDay(daylightArea, lpdOperational, operationalHours)
        }

        return <InlineLabel
            title="LE during operational hours daylight area"
            value={result}
        />
    }

    const LeDuringOperationalNonDay = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })
        const gfa = getValues("firstForm.a_gfa")
        const daylightArea = watchValues[index].daylight_area
        const lpdOperational = watchValues[index].lpd_operate
        const operationalHours = getValues("firstForm.a_operational_hours")
        var result = NaN
        if (gfa && daylightArea && lpdOperational && operationalHours) {
            result = calcLeDuringOperationalNonDay(gfa, daylightArea, lpdOperational, operationalHours)
        }
        return <InlineLabel
            title="LE during operational hours non-daylight area"
            value={result}
        />
    }

    const LeDuringNonOperational = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })
        const gfa = getValues("firstForm.a_gfa")
        const operationalHours = getValues("firstForm.a_operational_hours")
        const workingDays = getValues("firstForm.a_working_days")
        const holidays = getValues("firstForm.a_holidays")
        const lpdNonOperational = watchValues[index].lpd_nonoperate

        var result = NaN
        if (gfa && operationalHours && workingDays && holidays && lpdNonOperational) {
            result = calcLeDuringNonOperational(gfa, operationalHours, workingDays, holidays, lpdNonOperational)
        }

        return <InlineLabel
            title="LE during non-operational hours"
            value={result}
        />
    }

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2}>
                    <Stack direction="row" justifyContent="space-between" >
                        <Box sx={{ fontSize: 24, fontWeight: "bold" }}>LIGHTING</Box>
                        <Button variant="contained" onClick={() => {
                            append(defaultLightingValue())
                        }}>
                            ADD ITEM
                        </Button>
                    </Stack>

                    <div>
                        {fields.map((field, index) => {
                            const multiInputName = `${sectionName}.${index}`
                            return (
                                <Accordion key={field.id}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={"panel" + (index + 1) + "bh-content"}
                                        id={"panel" + (index + 1) + "bh-header"}
                                    >
                                        <Stack justifyContent="space-between" alignItems="center"
                                            spacing={2} direction="row" width='100%'>
                                            <Controller
                                                control={control}
                                                name={`${multiInputName}.name`}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <TextField
                                                        onChange={onChange}
                                                        value={value} variant="outlined" size="small"
                                                        label={"Item #" + (index + 1) + " name"}
                                                        bgcolor="white"
                                                    />
                                                )}
                                            />
                                            <Button variant="contained" onClick={() => remove(index)} color="warning">Delete</Button>
                                        </Stack>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            <SideInput
                                                name={`${multiInputName}.daylight_area`}
                                                control={control}
                                                title="Daylight area"
                                                subtitle="1/3 room depth from effective opening"
                                            />
                                            <NonDaylightArea index={index} />
                                            <SideInput
                                                name={`${multiInputName}.lpd_operate`}
                                                control={control}
                                                title="LPD during operational hours"
                                                subtitle="See table for reference"
                                            />
                                            <SideInput
                                                name={`${multiInputName}.lpd_nonoperate`}
                                                control={control}
                                                title="LPD during non-operational hours"
                                                subtitle="See table for reference"
                                            />
                                            <LeDuringOperationalDay index={index} />
                                            <LeDuringOperationalNonDay index={index} />
                                            <LeDuringNonOperational index={index} />
                                        </Stack>

                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </div>
                </Stack>

            }
            rightComponent={
                <Stack direction="column" spacing={2}>
                    <Box sx={{ fontWeight: "bold" }}>LPD Reference Table</Box>
                    <SelectInput
                        name={"thirdForm.lpd_option"}
                        control={control}
                        options={lpdReference}
                        getOptionLabel="type"
                        getOptionValue="type"
                        placeholder="Select building type..."
                    />
                    <LpdReferenceTable control= {control} />
                </Stack>
            }
        />
    );
};

const ACSection = ({ control, getValues }) => {
    const sectionName = "thirdForm.c_ac"

    var components = {
        BSL: 0,
        PSL: 0,
        PLL: 0,
        LSL: 0,
        CFM1: 0,
        CFM2: 0
    }

    var total = 0

    const BSL = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        const windowAreas = getValues("secondForm.b_window_area")
        const wallAreas = getValues("secondForm.b_wall_area")
        const windowHeatLoad = heatLoad.find((e) => {
            return e.type === "Window"
        }).load
        const wallHeatLoad = heatLoad.find((e) => {
            return e.type === "Wall"
        }).load
        const toTi = watchValues.to_ti

        var result = NaN
        if (windowAreas && wallAreas && toTi && windowAreas.length === 8 && wallAreas.length === 5) {
            result = calcBSL(windowAreas, wallAreas, windowHeatLoad, wallHeatLoad, toTi)
        }

        components.BSL = result

        return <InlineLabel
            title="BSL"
            subtitle="Building Sensible Load"
            value={result}
            bold
        />
    }

    const PSL = () => {
        const gfa = getValues("firstForm.a_gfa")
        const occupancyDensity = getValues("firstForm.a_occupancy_density")
        var result = NaN
        if (gfa && occupancyDensity) {
            result = calcPSL(gfa, occupancyDensity)
        }

        components.PSL = result

        return <InlineLabel
            title="PSL"
            subtitle="People Sensible Load"
            value={result}
            bold
        />
    }

    const PLL = () => {
        const gfa = getValues("firstForm.a_gfa")
        const occupancyDensity = getValues("firstForm.a_occupancy_density")
        var result = NaN
        if (gfa && occupancyDensity) {
            result = calcPLL(gfa, occupancyDensity)
        }

        components.PLL = result

        return <InlineLabel
            title="PLL"
            subtitle="People Latent Load"
            value={result}
            bold
        />
    }

    const LSL = () => {
        const watchValues = useWatch({
            control,
            name: `thirdForm.c_lighting`,
        })
        const gfa = getValues("firstForm.a_gfa")
        const totalLpdOperational = watchValues.reduce(function (total, item) {
            return total + item.lpd_operate
        }, 0)
        const totalLpdNonOperational = watchValues.reduce(function (total, item) {
            return total + item.lpd_nonoperate
        }, 0)

        var result = NaN
        if (gfa && totalLpdOperational && totalLpdNonOperational) {
            result = calcLSL(gfa, totalLpdOperational, totalLpdNonOperational)
        }

        components.LSL = result

        return <InlineLabel
            title="LSL"
            subtitle="Lighting Sensible Load"
            value={result}
            bold
        />
    }

    const CFM1 = () => {
        const ach = getValues("firstForm.a_ach")
        const gfa = getValues("firstForm.a_gfa")
        const floorCount = getValues("firstForm.a_floor_count")
        const floorHeightAvg = getValues("firstForm.a_floor_height_avg")
        console.log(ach, gfa, floorCount, floorHeightAvg)
        var result = NaN
        if (ach && gfa && floorCount && floorHeightAvg) {
            result = calcCFM1(ach, gfa, floorCount, floorHeightAvg)
        }

        components.CFM1 = result

        return <InlineLabel
            title="CFM1"
            subtitle="Infiltration Load"
            value={result}
            bold
        />
    }

    const CFM2 = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        const ach = getValues("firstForm.a_ach")
        const gfa = getValues("firstForm.a_gfa")
        const floorCount = getValues("firstForm.a_floor_count")
        const floorHeightAvg = getValues("firstForm.a_floor_height_avg")
        const toTi = watchValues.to_ti
        var result = NaN
        if (toTi && ach && gfa && floorCount && floorHeightAvg) {
            result = calcCFM2(toTi, ach, gfa, floorCount, floorHeightAvg)
        }

        components.CFM2 = result

        return <InlineLabel
            title="CFM2"
            subtitle="Ventilation Load"
            value={result}
            bold
        />
    }

    const CoolingLoad = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        const gfa = getValues("firstForm.a_gfa")
        const workingDays = getValues("firstForm.a_working_days")
        const operationalHours = getValues("firstForm.a_operational_hours")
        var result = components.BSL + components.CFM1 + components.CFM2 + components.LSL + components.PLL + components.PSL
        var converted = NaN
        if (result && operationalHours && workingDays && gfa) {
            converted = convertCoolingLoad(result, operationalHours, workingDays, gfa)
        }

        return <InlineLabel
            title="Cooling Load"
            subtitle="BSL + PSL + PLL + LSL + CFM1 + CFM2"
            value={`${result} BTU | ${converted} kWh/m2 per year`}
            bold
        />
    }

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2}>
                    <Box sx={{ fontSize: 24, fontWeight: "bold" }}>AC</Box>
                    <SideInput
                        name={`${sectionName}.to_ti`}
                        control={control}
                        title="Outdoor and Indoor temperature difference (to-ti)"
                        subtitle="Baseline to-ti for Indonesia 5-8°C; refer to climate data from Building Data"
                    />
                    <BSL />
                    <PSL />
                    <PLL />
                    <LSL />
                    <CFM1 />
                    <CFM2 />
                    <Divider style={{ width: "100%" }} />
                    <CoolingLoad />
                </Stack>
            }
            rightComponent={
                <Stack direction="column" spacing={2}>
                    <Box sx={{ fontSize: 16, fontWeight: "bold" }}>BSL Heat Load Table</Box>
                    <HeatLoadTable />
                </Stack>

            }
        />
    )
}

const LpdReferenceTable = ({ control }) => {
    const type = useWatch({
        control,
        name: "thirdForm.lpd_option.type",
    });

function children() {
    if (type) {
      const temp = lpdReference.find((e) => e.type === type);
      return temp.children;
    }
  }

  if (type) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{ backgroundColor: "orange" }}>
            <TableRow>
              <TableCell>Room Function</TableCell>
              <TableCell align="right">Maximum Lighting Power (W/m2)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children().map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.room}
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return <></>;

}

const HeatLoadTable = () => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: "orange" }}>
                    <TableRow>
                        <TableCell>Window</TableCell>
                        <TableCell>Heat Load</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(heatLoad[0].load).map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.orientation}
                            </TableCell>
                            <TableCell>{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableHead sx={{ backgroundColor: "orange" }}>
                    <TableRow>
                        <TableCell>Wall</TableCell>
                        <TableCell>Heat Load</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(heatLoad[1].load).map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.orientation}
                            </TableCell>
                            <TableCell>{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
