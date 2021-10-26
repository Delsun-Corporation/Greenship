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
    Divider
} from '@mui/material';
import {
    FormLayout,
    FormHeader,
    FormFooter,
    SideInput,
    SelectInput,
    InlineLabel,
} from "../FormLayouts";
import {
    formChapters,
    lpdReference,
    heatLoad,
    powerFactor
} from "../../datas/Datas";
import {
    calcLightingEnergyConsumption,
    calcNonDaylightArea,
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
    calcPlugConsumption
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
    const [isFromNextButton, setIsFromNextButton] = useState(false);

    const onSubmit = (data) => {
        const newData = {
            thirdForm: data.thirdForm
        }
        console.log("DATA", data)
        if (isFromNextButton) {
            onceSubmitted(newData, '4');
        } else {
            onceSubmitted(newData);
        }
    };

    useEffect(() => {
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
            console.log(pageThreeData);
            console.log(pageTwoData);
            console.log(pageOneData);
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
                {!isLoading && (<>
                <LightingSection control={control} getValues={getValues} setValue={setValue} />
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
                b_wall_area: [0, 0, 0, 0, 0]
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

const LightingSection = ({ control, getValues, setValue }) => {
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

    const NonDaylightArea = ({ index }) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })
        const gfa = getValues(`firstForm.a_gfa`)
        const daylightArea = watchValues[index].daylight_area
        var result = 0
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
        var result = 0
        if (daylightArea && lpdOperational && operationalHours) {
            result = calcLeDuringOperationalDay(daylightArea, lpdOperational, operationalHours)
        }

        if (totalLeArr.leOperationalDay.length < index) {
            totalLeArr.leOperationalDay.push(result)
        } else {
            totalLeArr.leOperationalDay[index] = result
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
        var result = 0
        if (gfa && daylightArea && lpdOperational && operationalHours) {
            result = calcLeDuringOperationalNonDay(gfa, daylightArea, lpdOperational, operationalHours)
        }

        if (totalLeArr.leOperationalNonDay.length < index) {
            totalLeArr.leOperationalNonDay.push(result)
        } else {
            totalLeArr.leOperationalNonDay[index] = result
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
            value={result}
        />
    }

    const LightingEnergyConsumption = ({index}) => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })
        const name = watchValues[index].name
        const gfa = getValues("firstForm.a_gfa")
        const leOperationalDay = totalLeArr.leOperationalDay[index]
        const leOperationalNonDay = totalLeArr.leOperationalNonDay[index]
        const leNonOperational = totalLeArr.leNonOperational[index]
        
        var result = calcLightingEnergyConsumption(leOperationalDay, leOperationalNonDay, leNonOperational, gfa)

        if (totalLeArr.energyConsumption.length < index) {
            totalLeArr.energyConsumption.push(result)
        } else {
            totalLeArr.energyConsumption[index] = result
        }


        return (
            <InlineLabel
                title={`${name} Energy Consumption`}
                value={`${isNaN(result) ? "-" : result} kWh/m2 per year`}
                bold
            />
        )
    }

    const TotalLightingEnergyConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })

        const gfa = getValues("firstForm.a_gfa")

        var result =
            totalLeArr.energyConsumption.reduce(function (sum, item) {
                return sum + item;
            }, 0)
        

        setValue("thirdForm.total_dec.lighting", result)

        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Total Lighting Energy Consumption"
                value={`${isNaN(result) ? "-" : result} kWh/m2 per year`}
                bold
            />
        </Paper>
        )
    }

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2}>
                    <Stack direction="row" justifyContent="space-between" >
                        <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Lighting</Box>
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
                                            <Divider sx={{ maxWidth: "100%"}} />
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
        var result = 0
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
        var result = 0
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

        var result = 0
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
        var result = 0
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
        var result = 0
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
        var result = components.BSL + components.CFM1 + components.CFM2 + components.LSL + components.PLL + components.PSL

        return <InlineLabel
            title="Cooling Load"
            subtitle="BSL + PSL + PLL + LSL + CFM1 + CFM2"
            value={`${isNaN(result) ? "-" : result} BTU`}
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
        if (result && operationalHours && workingDays && gfa) {
            result = convertCoolingLoad(result, operationalHours, workingDays, gfa)
            setValue("thirdForm.total_dec.ac", result)
        }

        return (
            <Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
                <InlineLabel
                    title="Total AC Energy Consumption"
                    value={`${isNaN(result) ? "-" : result} kWh/m2 per year`}
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
            defaultValue: fields
        })

        const amount = watchValues[index].amount
        const watt = watchValues[index].watt
        const operationalHours = getValues("firstForm.a_operational_hours")

        var result = 0
        if (amount && watt && operationalHours) {
            result = calcApplianceConsumption(amount, watt, operationalHours)
        }

        if (totalAppliances.length < index) {
            totalAppliances.push(result)
        } else {
            totalAppliances[index] = result
        }

        return <InlineLabel
            title="Energy Consumption"
            value={isNaN(result) ? "-" : result + " kWh/m2 per year"}
        />
    }

    const TotalApplianceConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`,
            defaultValue: fields
        })

        var result =
            totalAppliances.reduce(function (sum, item) {
                return sum + item;
            }, 0)

        setValue("thirdForm.total_dec.appliances", result)

        return (
            <Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
                <InlineLabel
                    title="Total Appliance Energy Consumption"
                    value={(isNaN(result) ? "-" : result) + " kWh/m2 per year"}
                />
            </Paper>
        )
    }

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2}>
                    <Stack direction="row" justifyContent="space-between" >
                        <Box sx={{ fontSize: 24, fontWeight: "bold" }}>Appliances</Box>
                        <Button variant="contained" onClick={() => {
                            append(defaultAppliancesValue())
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
            value={(isNaN(result) ? "-" : result) + " kWh/m2 per year"}
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
            value={(isNaN(result) ? "-" : result) + " kWh/m2 per year"}
            bold
        />
    }

    const TotalUtilityEnergyConsumption = () => {
        const watchValues = useWatch({
            control,
            name: `${sectionName}`
        })

        var result = "-"
        result = totalUtilityConsumptionArr.reduce((a, v) => a + v)
        setValue("thirdForm.total_dec.utility", result)

        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Total Utility Energy Consumption"
                value={result + " kWh/m2 per year"}
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
                    <Box sx={{ fontSize: 16, fontWeight: "bold" }}>Pump and STP</Box>

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
                                        title="Power Density"
                                    />
                                </Box>
                            </Stack>
                            <Divider style={{ width: "100%" }} />
                            <UtilityComponentsConsumption index={2} />
                        </Stack>
                    </Paper>
                    <Paper variant="outlined" sx={{ padding: 2 }}>
                        <Stack spacing={1} direction="column">
                            <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>STP</Box>
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
                                        title="Power Density"
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
                                        title="MV power"
                                        subtitle="MV power baseline is 5 W/m2"
                                    />
                                </Box>
                                <Box width="50%">
                                    <SideInput
                                        name={`${sectionName}.4.mv_flow_rate`}
                                        control={control}
                                        title="MV flow rate"
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
            value={result + " kWh/year"}
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
            value={result + " kWh/year"}
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

        var result = 0
        if (gfa && plugEnergyAC && plugEnergyNonAC) {
            result = calcPlugConsumption(gfa, plugEnergyAC, plugEnergyNonAC)
        }

        setValue("thirdForm.total_dec.plug", result)

        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Total Plug Energy Consumption"
                value={result + " kWh/m2 per year"}
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
                        title="Plug power density during operating hours"
                    />
                    <SideInput
                        name={`${sectionName}.nonoperating_power`}
                        control={control}
                        title="Plug power density during non-operating hours"
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

    const DesignEnergyConsumption = () => {
        var result = watchValues.lighting + watchValues.ac + watchValues.appliances + watchValues.utility + watchValues.plug

        return (<Paper sx={{ paddingX: 2, paddingY: 1, backgroundColor: "green", color: "white" }}>
            <InlineLabel
                title="Design Energy Consumption"
                value={(isNaN(result) ? "-" : result) + " kWh/m2 per year"}
            />
        </Paper>)
    }

    var totalLighting = 0
    if (!isNaN(watchValues.lighting) ) {totalLighting = watchValues.lighting}

    return (
        <FormLayout
        leftComponent= {
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={4} justifyContent="center"
                >
                    <Stack direction="column" spacing={0} alignItems="center">
                        <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>LIGHTING</Box>
                        <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{isNaN(watchValues.lighting) ? 0 : watchValues.lighting}</Box>
                    </Stack>
                    <Stack direction="column" spacing={0} alignItems="center">
                        <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>AC</Box>
                        <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{isNaN(watchValues.ac) ? 0 : watchValues.ac}</Box>
                    </Stack>
                    <Stack direction="column" spacing={0} alignItems="center">
                        <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>APPLIANCES</Box>
                        <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{watchValues.appliances}</Box>
                    </Stack>
                    <Stack direction="column" spacing={0} alignItems="center">
                        <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>UTILITY</Box>
                        <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{watchValues.utility}</Box>
                    </Stack>
                    <Stack direction="column" spacing={0} alignItems="center">
                        <Box sx={{ fontSize: 14, fontWeight: "bold", color: "text.secondary" }}>PLUG</Box>
                        <Box sx={{ fontSize: 20, fontWeight: "bold" }}>{watchValues.plug}</Box>
                    </Stack>
                </Stack>
        } rightComponent= {
            <DesignEnergyConsumption />
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
                            <TableRow
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
                            <TableRow
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
