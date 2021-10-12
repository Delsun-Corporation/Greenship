import React from 'react';
import { useForm, } from "react-hook-form";
import { Stack } from '@mui/material';
import { FormLayout, SideInput, BlockInput } from './FormLayouts';

const FirstForm = ({ onceSubmitted }) => {
    const methods = useForm({});

    const onSubmit = (data) => {
        onceSubmitted(data);
    };

    const { control, handleSubmit, watch } = methods

    return (
        <>
            <Stack direction="column" spacing={4}>
                <FirstSection control={control} />
                <SecondSection control={control} />
            </Stack>
        </>
    );

}

export default FirstForm;

const FirstSection = ({ control }) => {

    const sectionName = "firstForm.firstSection"

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2}>

                    <BlockInput
                        name={sectionName + ".projectName"}
                        control={control}
                        title="Project Name"
                        rows={1}
                        maxLength={50}
                    />

                    <BlockInput
                        name={sectionName + ".projectDescription"}
                        control={control}
                        title="Project Description"
                        rows={3}
                        maxLength={400}
                    />
                </Stack>}

            rightComponent={
                <>
                Building Image
                </>}
        />
    )
}

const SecondSection = ({ control }) => {

    const sectionName = "firstForm.secondSection"

    // const getValue = useWatch({
    //     control,
    //     name: 'hello.first'
    // });

    return (
        <FormLayout
            leftComponent={
                <Stack direction="column" spacing={2}>
                    <SideInput name={sectionName + ".locationCity"} control={control} title="Location" />
                    <SideInput name={sectionName + ".gfa"} control={control} title="Grass Floor Area (m2)" />
                    <SideInput name={sectionName + ".floorNumber"} control={control} title="Total number of floors" />
                    <SideInput name={sectionName + ".avgFloorHeight"} control={control} title="Average Floor to Floor Height (m)" />
                    <SideInput name={sectionName + ".operationalHours"} control={control} title="Operational hours (hours in a day)" />
                    <SideInput name={sectionName + ".workingDays"} control={control} title="Total number of floors" />
                    <SideInput name={sectionName + ".holidays"} control={control} title="Holidays (days in a year)" />
                </Stack>}

            rightComponent={
                <Stack direction="column" spacing={2}>
                    <SideInput name={sectionName + ".occupancyDensity"} control={control} title="Occupancy Density (pax/m2)" subtitle="Refer to table below" />
                </Stack>}
        />
    )
}

