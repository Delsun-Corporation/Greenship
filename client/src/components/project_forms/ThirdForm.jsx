import React, { useEffect, useState } from 'react';
import {
    useForm,
    useFieldArray,
    Controller,
    useWatch
} from "react-hook-form";
import {
    Box, Container, Paper, Stack,
    Accordion, AccordionSummary, AccordionDetails,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button,
    TextField,
    Divider,
    ToggleButton,
    ToggleButtonGroup, Fade
} from '@mui/material';
import {
    FormLayout,
    FormHeader,
    FormFooter,
    SideInput,
    SelectInput,
    InlineLabel,
    SkeletonSection,
    ImageUpload
} from "../FormLayouts";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Label,
    LabelList
} from "recharts";
import {
    formChapters,
    lpdReference,
    heatLoad,
    powerFactor
} from "../../datas/Datas";
import {
    calcLightingEnergyConsumption,
    calcLeDuringOperationalDay,
    calcLeDuringOperationalNonDay,
    calcLeDuringNonOperational,
    calcPSL, calcPLL, calcBSL, calcLSL, calcCFM1, calcCFM2,
    convertCoolingLoad,
    calcApplianceConsumption,
    calcLiftConsumption,
    calcUtilityConsumption,
    calcPlugEnergyAC,
    calcPlugEnergyNonAC,
    calcPlugConsumption,
    numberFormat
} from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { theme } from "../../assets/Theme";
import { ThemeProvider } from '@mui/material';

const ThirdForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
    const methods = useForm({
        defaultValues: defaultFormValue(),
    });
    const { control, handleSubmit, setValue, reset, getValues, formState: { errors } } = methods
    const [isLoading, setLoading] = useState(true);
    const [isFromNextButton, setIsFromNextButton] = useState(false);

    const onSubmit = (data) => {
        const newData = {
            thirdForm: data.thirdForm
        }
        console.log("new data", newData)
        if (isFromNextButton) {
            onceSubmitted(newData, '4');
        } else {
            onceSubmitted(newData);
        }
    };

    useEffect(() => {
        console.log("GOT CALLED")
        axios
            .get(`${process.env.REACT_APP_API_URL}/getpagethree`, {
                params: {
                    projectId: projectId,
                },
            })
            .then((res) => {
                const pageThreeData = res.data.page_three;
                const pageTwoData = res.data.page_two;
                const pageOneData = res.data.page_one;
                console.log("thirdform", pageThreeData, pageTwoData, pageOneData)
                setValue("firstForm", {
                    ...pageOneData
                })
                setValue("secondForm", {
                    ...pageTwoData
                })
                setValue("thirdForm", {
                    ...pageThreeData,
                    c_lighting: (pageThreeData.c_lighting.items.length === 0 ? [defaultLightingValue()] : pageThreeData.c_lighting.items),
                    c_appliances: (pageThreeData.c_appliances.items.length === 0 ? [defaultAppliancesValue()] : pageThreeData.c_appliances.items),
                    c_utility: (pageThreeData.c_utility.items.length === 0 ? defaultUtilityValue() : pageThreeData.c_utility.items),
                })
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Something went wrong, please try again");
            });
    }, [projectId]);

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
                {isLoading && <SkeletonSection />}
                {!isLoading && (<>
                    <LightingSection control={control} getValues={getValues} setValue={setValue} errors={errors} />
                    <ACSection control={control} getValues={getValues} setValue={setValue} />
                    <AppliancesSection control={control} getValues={getValues} setValue={setValue} />
                    <UtilitySection control={control} getValues={getValues} setValue={setValue} />
                    <PlugSection control={control} getValues={getValues} setValue={setValue} />
                    <TotalSection control={control} />
                    <FormFooter chapter={CHAPTER_NUMBER} setFromNextButton={setIsFromNextButton} shouldRedirect={shouldRedirect} />
                </>
                )}
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
                a_gfa: 0,
                a_operational_hours: 0,
                a_working_days: 0,
                a_holidays: 0,
                a_occupancy_density: 0,
                a_ach: 0,
                a_floor_count: 0,
                a_floor_height_avg: 0
            },
            secondForm: {
                b_window_area: [0, 0, 0, 0, 0, 0, 0, 0],
                b_wall_area: [0, 0, 0, 0, 0, 0, 0, 0]
            },
            thirdForm: {
                c_lighting: [defaultLightingValue()],
                c_ac: defaultACValue(),
                c_appliances: [defaultAppliancesValue()],
                c_utility: defaultUtilityValue(),
                c_plug: defaultPlugValue(),
                total_dec: defaultTotalEnergyConsumption()
            }
        }
    )
}

function defaultLightingValue() {
    return ({
        name: "",
        daylight_area: 0,
        nondaylight_area: 0,
        lpd_operate: 0,
        lpd_nonoperate: 0
    })
}

function defaultACValue() {
    return ({
        to_ti: 0
    })
}

function defaultAppliancesValue() {
    return ({
        name: "",
        amount: 0,
        watt: 0
    })
}

function defaultUtilityValue() {
    return ([{
        name: "Lift",
        amount: 0,
        watt: 0,
        util_type: "lift",
        lift_capacity: 0,
        lift_velocity: 0
    },
    {
        name: "Escalator",
        amount: 0,
        watt: 0,
        util_type: "escalator"
    },
    {
        name: "Pump",
        amount: 0,
        watt: 0,
        util_type: "pump"
    },
    {
        name: "STP",
        amount: 0,
        watt: 0,
        util_type: "stp"
    },
    {
        name: "Mechanical Ventilation",
        amount: 0,
        watt: 0,
        util_type: "mv",
        mv_flow_rate: 0
    }])
}

function defaultPlugValue() {
    return ({
        operating_power: 0,
        nonoperating_power: 0
    })
}

function defaultTotalEnergyConsumption() {
    return ({
        lighting: 0,
        ac: 0,
        appliances: 0,
        utility: 0,
        plug: 0
    })
}

/// SECTIONS ///

const LightingSection = ({ control, getValues, setValue, errors }) => {
    const sectionName = "thirdForm.c_lighting"

    const { fields, append, remove } = useFieldArray({
        control, name: `${sectionName}`
    });

    var totalLeArr = {
        leOperationalDay: [],
        leOperationalNonDay: [],
        leNonOperational: [],
        energyConsumption: []
    }

    // CALCULATED COMPONENTS

    const LeDuringOperationalDay = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        const daylightArea = watchValues[index].daylight_area
        const lpdOperational = watchValues[index].lpd_operate
        const workingDays = getValues("firstForm.a_working_days")
        const operationalHours = getValues("firstForm.a_operational_hours")
        var result = 0
        if (daylightArea && lpdOperational && operationalHours) {
            result = calcLeDuringOperationalDay(daylightArea, lpdOperational, operationalHours, workingDays)
        }

        if (totalLeArr.leOperationalDay.length < index) {
            totalLeArr.leOperationalDay.push(result)
        } else {
            totalLeArr.leOperationalDay[index] = result
        }

        return <InlineLabel
            title="LE during operational hours daylight area"
            value={numberFormat(result)}
        />
    }

    const LeDuringOperationalNonDay = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        const nondaylightArea = watchValues[index].nondaylight_area
        const lpdOperational = watchValues[index].lpd_operate
        const operationalHours = getValues("firstForm.a_operational_hours")
        const workingDays = getValues("firstForm.a_working_days")
        var result = 0
        if (nondaylightArea && lpdOperational && operationalHours) {
            result = calcLeDuringOperationalNonDay(nondaylightArea, lpdOperational, operationalHours, workingDays)
        }

        if (totalLeArr.leOperationalNonDay.length < index) {
            totalLeArr.leOperationalNonDay.push(result)
        } else {
            totalLeArr.leOperationalNonDay[index] = result
        }

        return <InlineLabel
            title="LE during operational hours non-daylight area"
            value={numberFormat(result)}
        />
    }

    const LeDuringNonOperational = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        const gfa = getValues("firstForm.a_gfa")
        const operationalHours = getValues("firstForm.a_operational_hours")
        const workingDays = getValues("firstForm.a_working_days")
        const holidays = getValues("firstForm.a_holidays")
        const lpdNonOperational = watchValues[index].lpd_nonoperate

        var result = 0
        if (gfa && operationalHours && workingDays && holidays && lpdNonOperational) {
            result = calcLeDuringNonOperational(gfa, operationalHours, workingDays, holidays, lpdNonOperational)
        }

        if (totalLeArr.leNonOperational.length < index) {
            totalLeArr.leNonOperational.push(result)
        } else {
            totalLeArr.leNonOperational[index] = result
        }

        return <InlineLabel
            title="LE during non-operational hours"
            value={numberFormat(result)}
        />
    }

    const LightingEnergyConsumption = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })
        const name = watchValues[index].name
        const gfa = getValues("firstForm.a_gfa")
        const leOperationalDay = totalLeArr.leOperationalDay[index]
        const leOperationalNonDay = totalLeArr.leOperationalNonDay[index]
        const leNonOperational = totalLeArr.leNonOperational[index]

        var result = 0
        if (gfa && leOperationalDay && leOperationalNonDay && leNonOperational) {
            result = calcLightingEnergyConsumption(leOperationalDay, leOperationalNonDay, leNonOperational, gfa)
        }

        if (totalLeArr.energyConsumption.length < index) {
            totalLeArr.energyConsumption.push(result)
        } else {
            totalLeArr.energyConsumption[index] = result
        }
        console.log(watchValues)
        console.log("Lightingg", result, gfa, leOperationalDay, leOperationalNonDay, leNonOperational)

        return (
            <InlineLabel
                title={`${name} Energy Consumption`}
                value={`${isNaN(result) ? "-" : numberFormat(result)} kWh/m2 per year`}
                bold
            />
        )
    }

    const TotalLightingEnergyConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })

        var result =
            totalLeArr.energyConsumption.reduce(function (sum, item) {
                return sum + item;
            }, 0)

        useEffect(() => {
            setValue("thirdForm.total_dec.lighting", result)
        })
        

        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Total Lighting Energy Consumption"
                value={`${isNaN(result) ? "-" : numberFormat(result)} kWh/m2 per year`}
                bold
            />
        </Paper>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <FormLayout
                leftComponent={
                    <Stack direction="column" spacing={2}>
                        <Stack direction="row" justifyContent="space-between" >
                            <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Lighting</Box>
                            <Button variant="contained" onClick={() => {
                                append(defaultLightingValue())
                            }}
                                sx={{
                                    backgroundColor: "steelTeal",
                                    ...({
                                        "&:hover": {
                                            backgroundColor: ("steelTeal"),
                                        }
                                    })
                                }}
                            >
                                ADD Room
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
                                                            label={"Room #" + (index + 1) + " name"}
                                                            bgcolor="white"
                                                        />
                                                    )}
                                                />
                                                <Button variant="contained"
                                                    onClick={() => remove(index)}
                                                    sx={{
                                                        backgroundColor: "candyPink",
                                                        ...({
                                                            "&:hover": {
                                                                backgroundColor: ("candyPink"),
                                                            }
                                                        })
                                                    }}>
                                                    Delete
                                                </Button>
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
                                                <ImageUpload
                                                    name={`${multiInputName}.daylight_area_attach`}
                                                    errors={errors}
                                                    control={control}
                                                    imageUrl={getValues(`${multiInputName}.daylight_area_attach`)}
                                                    title="Floor Plan schematics for Daylight Area"
                                                /> 
                                                <SideInput
                                                    name={`${multiInputName}.nondaylight_area`}
                                                    control={control}
                                                    title="Non-Daylight area"
                                                    tooltip="Total floor area for the measured room, minus daylight area."
                                                />
                                                <SideInput
                                                    name={`${multiInputName}.lpd_operate`}
                                                    control={control}
                                                    title="LPD during operational hours"
                                                    subtitle="See table for reference"
                                                    tooltip="Total lighting energy consumption per m2 space, represents the load of any lighting equipment in any defined area, during operational hours."
                                                />
                                                <ImageUpload
                                                    name={`${multiInputName}.lpd_operate_attach`}
                                                    errors={errors}
                                                    control={control}
                                                    imageUrl={getValues(`${multiInputName}.lpd_operate_attach`)}
                                                    title="Lighting Plan"
                                                /> 
                                                <SideInput
                                                    name={`${multiInputName}.lpd_nonoperate`}
                                                    control={control}
                                                    title="LPD during non-operational hours"
                                                    subtitle="See table for reference"
                                                    tooltip="Total lighting energy consumption per m2 space, represents the load of any lighting equipment in any defined area, during non-operational hours."
                                                />
                                                <ImageUpload
                                                    name={`${multiInputName}.lpd_nonoperate_attach`}
                                                    errors={errors}
                                                    control={control}
                                                    imageUrl={getValues(`${multiInputName}.lpd_nonoperate_attach`)}
                                                    title="Lighting Plan"
                                                /> 
                                                <LeDuringOperationalDay index={index} />
                                                <LeDuringOperationalNonDay index={index} />
                                                <LeDuringNonOperational index={index} />
                                                <Divider sx={{ maxWidth: "100%" }} />
                                                <LightingEnergyConsumption index={index} />
                                            </Stack>

                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </div>
 
                    </Stack>

                }
                rightComponent={
                    <Stack direction="column" spacing={2} justifyContent="space-between">
                        <Box sx={{ fontWeight: "bold" }}>LPD Reference Table</Box>
                        <SelectInput
                            name={"thirdForm.lpd_option"}
                            control={control}
                            options={lpdReference}
                            getOptionLabel="type"
                            getOptionValue="type"
                            placeholder="Select building type..."
                        />
                        <LpdReferenceTable control={control} />
                        <TotalLightingEnergyConsumption />
                    </Stack>
                }
            />
        </ThemeProvider>
    );
};

const ACSection = ({ control, getValues, setValue }) => {
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

        var result = 0
        if (windowAreas && wallAreas && toTi && windowAreas.length === 8 && wallAreas.length === 9) {
            result = calcBSL(windowAreas, wallAreas, windowHeatLoad, wallHeatLoad, toTi)
        }

        components.BSL = result

        return <InlineLabel
            title="BSL"
            subtitle="Building Sensible Load"
            tooltip="The sensible heat that is owned by the building, where the heat is kept in the wall and is influenced by the four cardinal directions which are west, north, east, and south. The heat load is different for each wall and depends on the direction it faces."
            value={numberFormat(result)}
            bold
        />
    }

    const PSL = () => {
        const gfa = getValues("firstForm.a_gfa")
        const occupancyDensity = getValues("firstForm.a_occupancy_density")
        var result = 0
        if (gfa && occupancyDensity) {
            result = calcPSL(gfa, occupancyDensity)
        }

        components.PSL = result

        return <InlineLabel
            title="PSL"
            subtitle="People Sensible Load"
            tooltip="Internal heat load that comes from the human inside the room, represents the heat that can be measured by a thermometer and felt by our skin."
            value={numberFormat(result)}
            bold
        />
    }

    const PLL = () => {
        const gfa = getValues("firstForm.a_gfa")
        const occupancyDensity = getValues("firstForm.a_occupancy_density")
        var result = 0
        if (gfa && occupancyDensity) {
            result = calcPLL(gfa, occupancyDensity)
        }

        components.PLL = result

        return <InlineLabel
            title="PLL"
            subtitle="People Latent Load"
            tooltip="Internal heat load that comes from the human inside the room, represents the heat released or absorbed, by a body or a thermodynamic system, during a constant-temperature process."
            value={numberFormat(result)}
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

        var result = 0
        if (gfa && totalLpdOperational && totalLpdNonOperational) {
            result = calcLSL(gfa, totalLpdOperational, totalLpdNonOperational)
        }

        components.LSL = result

        return <InlineLabel
            title="LSL"
            subtitle="Lighting Sensible Load"
            tooltip="Internal heat load that comes from the lighting equipment inside the room, represents the heat that can be measured by a thermometer."
            value={numberFormat(result)}
            bold
        />
    }

    const CFM1 = () => {
        const ach = getValues("firstForm.a_ach")
        const gfa = getValues("firstForm.a_gfa")
        const floorCount = getValues("firstForm.a_floor_count")
        const floorHeightAvg = getValues("firstForm.a_floor_height_avg")
        var result = 0
        if (ach && gfa && floorCount && floorHeightAvg) {
            result = calcCFM1(ach, gfa, floorCount, floorHeightAvg)
        }

        components.CFM1 = result

        return <InlineLabel
            title="CFM1"
            subtitle="Infiltration Load"
            tooltip="The load generated by one cubic foot per minute of fresh air brought from the weather to space-neutral conditions over the course of one year through un-designated opening."
            value={numberFormat(result)}
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
        var result = 0
        if (toTi && ach && gfa && floorCount && floorHeightAvg) {
            result = calcCFM2(toTi, ach, gfa, floorCount, floorHeightAvg)
        }

        components.CFM2 = result

        return <InlineLabel
            title="CFM2"
            subtitle="Ventilation Load"
            tooltip="The load generated by one cubic foot per minute of fresh air brought from the weather to space-neutral conditions over the course of one year through designated opening."
            value={numberFormat(result)}
            bold
        />
    }

    const CoolingLoad = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        var result = components.BSL + components.CFM1 + components.CFM2 + components.LSL + components.PLL + components.PSL

        return <InlineLabel
            title="Cooling Load"
            subtitle="BSL + PSL + PLL + LSL + CFM1 + CFM2"
            value={`${isNaN(result) ? "-" : numberFormat(result)} BTU`}
            bold
        />
    }

    const TotalACEnergyConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })
        const gfa = getValues("firstForm.a_gfa")
        const workingDays = getValues("firstForm.a_working_days")
        const operationalHours = getValues("firstForm.a_operational_hours")
        var result = components.BSL + components.CFM1 + components.CFM2 + components.LSL + components.PLL + components.PSL
        
        var finalResult = 0
        if (result && operationalHours && workingDays && gfa) {
            finalResult = convertCoolingLoad(result, operationalHours, workingDays, gfa)
        } 

        useEffect(() => {
        setValue("thirdForm.total_dec.ac", finalResult)
        })

        return (
            <Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
                <InlineLabel
                    title="Total AC Energy Consumption"
                    value={`${isNaN(finalResult) ? "-" : numberFormat(finalResult)} kWh/m2 per year`}
                />
            </Paper>
        )
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
                        tooltip="Baseline to-ti for Indonesia 5-8°C; refer to climate data from Building Data."
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
                    <TotalACEnergyConsumption />
                </Stack>

            }
        />
    )
}

const AppliancesSection = ({ control, getValues, setValue }) => {
    const sectionName = "thirdForm.c_appliances"

    const { fields, append, remove } = useFieldArray({
        control, name: `${sectionName}`
    });

    var totalAppliances = []

    // CALCULATED COMPONENTS

    const ApplianceConsumption = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            
        })

        const gfa = getValues("firstForm.a_gfa")
        const amount = watchValues[index].amount
        const watt = watchValues[index].watt
        const operationalHours = getValues("firstForm.a_operational_hours")

        var result = 0
        if (amount && watt && operationalHours && gfa) {
            result = calcApplianceConsumption(amount, watt, operationalHours, gfa)
        }

        if (totalAppliances.length < index) {
            totalAppliances.push(result)
        } else {
            totalAppliances[index] = result
        }

        return <InlineLabel
            title="Energy Consumption"
            value={isNaN(result) ? "-" : numberFormat(result) + " kWh/m2 per year"}
        />
    }

    const TotalApplianceConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
        })

        var result =
            totalAppliances.reduce(function (sum, item) {
                return sum + item;
            }, 0)

        useEffect(() => {
            setValue("thirdForm.total_dec.appliances", result)
        });
        

        return (
            <Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
                <InlineLabel
                    title="Total Appliance Energy Consumption"
                    value={(isNaN(result) ? "-" : numberFormat(result)) + " kWh/m2 per year"}
                />
            </Paper>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <FormLayout
                leftComponent={
                    <Stack direction="column" spacing={2}>
                        <Stack direction="row" justifyContent="space-between" >
                            <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Appliances</Box>
                            <Button variant="contained" onClick={() => {
                                append(defaultAppliancesValue())
                            }}
                                sx={{
                                    backgroundColor: "steelTeal",
                                    ...({
                                        "&:hover": {
                                            backgroundColor: ("steelTeal"),
                                        }
                                    })
                                }}
                            >
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
                                                <Button variant="contained"
                                                    onClick={() => remove(index)}
                                                    sx={{
                                                        backgroundColor: "candyPink",
                                                        ...({
                                                            "&:hover": {
                                                                backgroundColor: ("candyPink"),
                                                            }
                                                        })
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={2}>
                                                <SideInput
                                                    name={`${multiInputName}.amount`}
                                                    control={control}
                                                    title="Number of Appliances"
                                                />
                                                <SideInput
                                                    name={`${multiInputName}.watt`}
                                                    control={control}
                                                    title="Watt"
                                                />
                                                <ApplianceConsumption index={index} />
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
                        <TotalApplianceConsumption />
                    </Stack>
                }
            />
        </ThemeProvider>
    );
}

const UtilitySection = ({ control, getValues, setValue }) => {
    const sectionName = "thirdForm.c_utility"

    var totalUtilityConsumptionArr = [0, 0, 0, 0, 0]

    const LiftEscalatorConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })
        const gfa = getValues("firstForm.a_gfa")
        const operationalHours = getValues("firstForm.a_operational_hours")
        const watt = watchValues[0].watt
        const amount = watchValues[0].amount
        const capacity = watchValues[0].lift_capacity
        const velocity = watchValues[0].lift_velocity
        var result = 0

        if (gfa && operationalHours && watt && amount && capacity && velocity) {
            result = calcLiftConsumption(gfa, operationalHours, watt, amount, capacity, velocity)
            totalUtilityConsumptionArr[0] = result
        }

        return <InlineLabel
            title="Energy Consumption"
            value={(isNaN(result) ? "-" : numberFormat(result)) + " kWh/m2 per year"}
            bold
        />
    }

    const UtilityComponentsConsumption = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })
        const gfa = getValues("firstForm.a_gfa")
        const operationalHours = getValues("firstForm.a_operational_hours")
        const watt = watchValues[index].watt
        const amount = watchValues[index].amount
        var result = 0

        if (gfa && operationalHours && watt && amount) {
            result = calcUtilityConsumption(gfa, operationalHours, watt, amount)
            totalUtilityConsumptionArr[index] = result
        }

        return <InlineLabel
            title="Energy Consumption"
            value={(isNaN(result) ? "-" : numberFormat(result)) + " kWh/m2 per year"}
            bold
        />
    }

    const TotalUtilityEnergyConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })

        var result = 0
        result = (totalUtilityConsumptionArr.reduce((a, v) => a + v));
        useEffect(() => {
            setValue("thirdForm.total_dec.utility", result)
        })

        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Total Utility Energy Consumption"
                value={numberFormat(result) + " kWh/m2 per year"}
            />
        </Paper>)
    }

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2} >
                    <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Utility</Box>
                    <Box sx={{ fontSize: 16, fontWeight: "bold" }}>Lift and Escalator</Box>
                    <Paper variant="outlined" sx={{ padding: 2 }}>
                        <Stack spacing={1} direction="column">
                            <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>LIFT</Box>

                            <Stack spacing={2} direction="row">
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.0.amount`}
                                        control={control}
                                        title="Numbers of Lift"
                                    />
                                </Box>
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.0.watt`}
                                        control={control}
                                        title="Power Factor"
                                        subtitle="Refer to table below"
                                    />
                                </Box>
                            </Stack>
                            <Stack spacing={2} direction="row">
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.0.lift_capacity`}
                                        control={control}
                                        title="Lift Capacity"
                                        tooltip="The capacity lift measured in lbs."
                                    />
                                </Box>
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.0.lift_velocity`}
                                        control={control}
                                        title="Lift Velocity"
                                    />
                                </Box>
                            </Stack>
                            <Divider style={{ width: "100%" }} />

                            <LiftEscalatorConsumption />
                        </Stack>
                    </Paper>

                    <Paper variant="outlined" sx={{ padding: 2 }}>
                        <Stack spacing={1} direction="column">
                            <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>ESCALATOR</Box>
                            <Stack spacing={2} direction="row">
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.1.amount`}
                                        control={control}
                                        title="Amount"
                                    />
                                </Box>
                                <Box width="50%">

                                    <SideInput
                                        name={`${sectionName}.1.watt`}
                                        control={control}
                                        title="Power"
                                    />
                                </Box>
                            </Stack>
                            <Divider style={{ width: "100%" }} />
                            <UtilityComponentsConsumption index={1} />
                        </Stack>
                    </Paper>

                    <Divider style={{ width: "100%" }} />

                    <Box sx={{ fontSize: 16, fontWeight: "bold" }}>Lift Power Factor Reference Table</Box>
                    <PowerFactorTable />
                </Stack>
            }
            rightComponent={
                <Stack direction="column" spacing={2}>
                    <Box sx={{ fontSize: 16, fontWeight: "bold" }}>Pump and Sewage Treatment Plant (STP)</Box>

                    <Paper variant="outlined" sx={{ padding: 2 }}>
                        <Stack spacing={1} direction="column">
                            <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>PUMP</Box>
                            <Stack spacing={2} direction="row">
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.2.amount`}
                                        control={control}
                                        title="Amount"
                                    />
                                </Box>
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.2.watt`}
                                        control={control}
                                        title="Power Density (watt)"
                                    />
                                </Box>
                            </Stack>
                            <Divider style={{ width: "100%" }} />
                            <UtilityComponentsConsumption index={2} />
                        </Stack>
                    </Paper>
                    <Paper variant="outlined" sx={{ padding: 2 }}>
                        <Stack spacing={1} direction="column">
                            <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>Sewage Treatment Plant (STP)</Box>
                            <Stack spacing={2} direction="row">
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.3.amount`}
                                        control={control}
                                        title="Amount"
                                    />
                                </Box>
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.3.watt`}
                                        control={control}
                                        title="Power Density (watt)"
                                    />
                                </Box>
                            </Stack>
                            <Divider style={{ width: "100%" }} />
                            <UtilityComponentsConsumption index={3} />
                        </Stack>
                    </Paper>

                    <Divider style={{ width: "100%" }} />

                    <Box sx={{ fontSize: 16, fontWeight: "bold" }}>Mechanical Ventilation</Box>

                    <Paper variant="outlined" sx={{ padding: 2 }}>
                        <Stack spacing={1} direction="column">
                            <SideInput
                                name={`${sectionName}.4.amount`}
                                control={control}
                                title="Amount"
                            />
                            <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>MV SPECIFICATION</Box>
                            <Stack spacing={2} direction="row" >
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.4.watt`}
                                        control={control}
                                        title="MV power (W/m2)"
                                        subtitle="MV power baseline is 5 W/m2"
                                    />
                                </Box>
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.4.mv_flow_rate`}
                                        control={control}
                                        title="MV flow rate (l/s)"
                                    />
                                </Box>
                            </Stack>
                            <Divider style={{ width: "100%" }} />
                            <UtilityComponentsConsumption index={4} />
                        </Stack>
                    </Paper>
                    <TotalUtilityEnergyConsumption />

                </Stack>
            }
        />
    )
}

const PlugSection = ({ control, getValues, setValue }) => {
    const sectionName = "thirdForm.c_plug"

    var totalPlugEnergy = { acHours: 0, nonAcHours: 0 }

    const PlugEnergyAC = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })
        const gfa = getValues("firstForm.a_gfa")
        const operationalHours = getValues("firstForm.a_operational_hours")
        const operatingPower = watchValues.operating_power

        var result = 0
        if (gfa && operationalHours && operatingPower) {
            result = calcPlugEnergyAC(gfa, operationalHours, operatingPower)
            totalPlugEnergy.acHours = result
        }

        return <InlineLabel
            title="Plug energy during AC hours"
            value={numberFormat(result) + " kWh/year"}
        />
    }

    const PlugEnergyNonAC = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })
        const gfa = getValues("firstForm.a_gfa")
        const operationalHours = getValues("firstForm.a_operational_hours")
        const nonOperatingPower = watchValues.nonoperating_power

        var result = 0
        if (gfa && operationalHours && nonOperatingPower) {
            result = calcPlugEnergyNonAC(gfa, operationalHours, nonOperatingPower)
            totalPlugEnergy.nonAcHours = result
        }

        return <InlineLabel
            title="Plug energy during non-AC hours"
            value={numberFormat(result) + " kWh/year"}
        />
    }

    const TotalPlugEnergyConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })
        const gfa = getValues("firstForm.a_gfa")
        const plugEnergyAC = totalPlugEnergy.acHours
        const plugEnergyNonAC = totalPlugEnergy.nonAcHours
        const operationalHours = getValues("firstForm.a_operational_hours")
        const operatingPower = watchValues.operating_power
        const nonOperatingPower = watchValues.nonoperating_power

        var resultAC = 0
        if (gfa && operationalHours && operatingPower) {
            resultAC = calcPlugEnergyAC(gfa, operationalHours, operatingPower)
            totalPlugEnergy.acHours = result
        }

        var resultNonAC = 0
        if (gfa && operationalHours && nonOperatingPower) {
            resultNonAC = calcPlugEnergyNonAC(gfa, operationalHours, nonOperatingPower)
            totalPlugEnergy.nonAcHours = result
        }

        var result = 0
        if (gfa && resultAC && resultNonAC) {
            result = calcPlugConsumption(gfa, resultAC, resultNonAC)
        }
        useEffect(() => {
            setValue("thirdForm.total_dec.plug", result)
        })

        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Total Plug Energy Consumption"
                value={numberFormat(result) + " kWh/m2 per year"}
            />
        </Paper>)
    }

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2}>
                    <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Plug</Box>
                    <SideInput
                        name={`${sectionName}.operating_power`}
                        control={control}
                        title="Plug power density during operating hours (W/m2)"
                        subtitle="Baseline 10 W/m2"
                    />
                    <SideInput
                        name={`${sectionName}.nonoperating_power`}
                        control={control}
                        title="Plug power density during non-operating hours (W/m2)"
                        subtitle="Baseline 1 W/m2"
                    />
                    <PlugEnergyAC />
                    <PlugEnergyNonAC />
                </Stack>
            }
            rightComponent={
                <Stack direction="column" spacing={2}>
                    <TotalPlugEnergyConsumption />
                </Stack>
            }
        />
    )
}

const TotalSection = ({ control }) => {

    const watchValues = useWatch({
        control,
        name: `thirdForm.total_dec`
    })

    var result = watchValues.lighting + watchValues.ac + watchValues.appliances + watchValues.utility + watchValues.plug

    const DesignEnergyConsumption = () => {
        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Design Energy Consumption"
                value={(isNaN(result) ? "-" : numberFormat(result)) + " kWh/m2 per year"}
            />
        </Paper>)
    }

    const TotalEnergyGraph = () => {

        const data = [
            {
                name: "Design Energy Consumption",
                lighting: watchValues.lighting,
                ac: watchValues.ac,
                appliances: watchValues.appliances,
                utility: watchValues.utility,
                plug: watchValues.plug,
            }
        ];

        const RenderPercentLabel = (props) => {
            const { value, ...rest } = props.props
            const percentage = (parseFloat(value) / parseFloat(result)) * 100
            return <Label {...rest} value={`${numberFormat(percentage)}%`} fontSize="20" fill="#FFFFFF"
                fontWeight="Bold" offset={20} />
        }

        const RenderTitleLabel = ({ props, label }) => {
            return <Label {...props} value={label} fontSize="14" fill="#FFFFFF" opacity={0.7} fontWeight="bold" offset={20} position="insideTop" />
        }

        const RenderAmountLabel = ({ props, label }) => {
            return <Label {...props} value={numberFormat(label)} fontSize="14" fill="#FFFFFF" opacity={0.7} fontWeight="bold" offset={20} position="insideBottom" />
        }

        const renderLightingLabel = (props) => {
            const { content, ...rest } = props;
            return <>
                <RenderPercentLabel props={rest} />
                <RenderTitleLabel props={rest} label="LIGHTING" />
                <RenderAmountLabel props={rest} label={data[0].lighting} />
            </>;
        };

        const renderAcLabel = (props) => {
            const { content, ...rest } = props;
            return <>
                <RenderPercentLabel props={rest} />
                <RenderTitleLabel props={rest} label="AC" />
                <RenderAmountLabel props={rest} label={data[0].ac} />
            </>;
        };

        const renderAppliancesLabel = (props) => {
            const { content, ...rest } = props;
            return <>
                <RenderPercentLabel props={rest} />
                <RenderTitleLabel props={rest} label="APPLIANCES" />
                <RenderAmountLabel props={rest} label={data[0].appliances} />
            </>;
        };

        const renderUtilityLabel = (props) => {
            const { content, ...rest } = props;
            return <>
                <RenderPercentLabel props={rest} />
                <RenderTitleLabel props={rest} label="UTILITY" />
                <RenderAmountLabel props={rest} label={data[0].utility} />
            </>;
        };

        const renderPlugLabel = (props) => {
            const { content, ...rest } = props;
            return <>
                <RenderPercentLabel props={rest} />
                <RenderTitleLabel props={rest} label="PLUG" />
                <RenderAmountLabel props={rest} label={data[0].plug} />
            </>;
        };

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#e56273'];

        return (
            <Paper elevation={2} sx={{ marginX: 0 }}>
                <ResponsiveContainer height={100} width={"100%"}>
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={0}
                        padding={0}
                        width={300}
                        barCategoryGap={0}
                        stackOffset="expand"
                    >
                        <XAxis hide type="number" />
                        <YAxis hide
                            dataKey="name"
                            type="category"
                            axisLine={false}
                        />
                        <Bar dataKey="lighting" fill={COLORS[0]} stackId="a" isAnimationActive={false} >
                            <LabelList
                                dataKey="lighting"
                                position="center"
                                content={renderLightingLabel}
                            />
                        </Bar>
                        <Bar dataKey="ac" fill={COLORS[1]} stackId="a" isAnimationActive={false}>
                            <LabelList
                                dataKey="ac"
                                position="center"
                                content={renderAcLabel}
                            />
                        </Bar>
                        <Bar dataKey="appliances" fill={COLORS[2]} stackId="a" isAnimationActive={false}>
                            <LabelList
                                dataKey="appliances"
                                position="center"
                                content={renderAppliancesLabel}
                            />
                        </Bar>
                        <Bar dataKey="utility" fill={COLORS[3]} stackId="a" isAnimationActive={false}>
                            <LabelList
                                dataKey="utility"
                                position="center"
                                content={renderUtilityLabel}
                            />
                        </Bar>
                        <Bar dataKey="plug" fill={COLORS[4]} stackId="a" isAnimationActive={false}>
                            <LabelList
                                dataKey="plug"
                                position="center"
                                content={renderPlugLabel}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        );
    }

    const TotalDEC = () => {
        return <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={4} justifyContent="center" height={100}
        >
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
                <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>LIGHTING</Box>
                <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{isNaN(watchValues.lighting) ? 0 : numberFormat(watchValues.lighting)}</Box>
            </Stack>
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
                <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>AC</Box>
                <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{isNaN(watchValues.ac) ? 0 : numberFormat(watchValues.ac)}</Box>
            </Stack>
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
                <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>APPLIANCES</Box>
                <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{numberFormat(watchValues.appliances)}</Box>
            </Stack>
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
                <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>UTILITY</Box>
                <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{numberFormat(watchValues.utility)}</Box>
            </Stack>
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
                <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>PLUG</Box>
                <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{numberFormat(watchValues.plug)}</Box>
            </Stack>
        </Stack>
    }

    const [display, setDisplay] = React.useState(true);

    const handleDisplayChange = (event, newDisplay) => {
        if (newDisplay !== null) {
            setDisplay(newDisplay);
        }
    };

    const ToggleView = () => {

        return (
            <ToggleButtonGroup
                color="primary"
                value={display}
                exclusive
                onChange={handleDisplayChange}
            >
                <ToggleButton value={true}>Graph View</ToggleButton>
                <ToggleButton value={false}>Number View</ToggleButton>
            </ToggleButtonGroup>
        );
    }

    return (
        <Container maxWidth="xl" disableGutters>
            <Paper elevation={2} >
                <Stack direction="column" spacing={2} sx={{ padding: 4 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Summary of Active Design Strategy</Box>
                        <ToggleView />
                    </Stack>

                    <Box position="relative" sx={{ height: 100 }}>
                        <Fade in={display}><Box position="absolute" height={100} width="100%" sx={{ zIndex: 9 }}><TotalEnergyGraph /></Box></Fade>
                        <Fade in={!display}><Box position="absolute" height={100} width="100%" sx={{ zIndex: 10 }}><TotalDEC /></Box></Fade>
                    </Box>

                    {/* {(display === 'graph') && <TotalEnergyGraph />}
                {(display === 'number') && <TotalDEC />} */}
                    <DesignEnergyConsumption />
                </Stack>

            </Paper>
        </Container>
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
                <Table size="small" aria-label="a dense table">
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
            <Table size="small" aria-label="a dense table">
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

const PowerFactorTable = () => {
    return (
        <Stack direction="row" spacing={2}>
            <TableContainer component={Paper} >
                <Table size="small" aria-label="a dense table">
                    <TableHead sx={{ backgroundColor: "orange" }}>
                        <TableRow>
                            <TableCell>Lift Number</TableCell>
                            <TableCell align="right">Power Factor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(5)].map((element, i) => (
                            <TableRow key={i}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {powerFactor[i].number}
                                </TableCell>
                                <TableCell align="right">{powerFactor[i].power}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </TableContainer>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead sx={{ backgroundColor: "orange" }}>
                        <TableRow>
                            <TableCell>Lift Number</TableCell>
                            <TableCell align="right">Power Factor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(5)].map((element, i) => (
                            <TableRow key={i}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {powerFactor[i + 5].number}
                                </TableCell>
                                <TableCell align="right">{powerFactor[i + 5].power}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>

    );
};
