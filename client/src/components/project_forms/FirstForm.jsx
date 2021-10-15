import React from 'react';
import Select from "react-select";
import { useForm, useController, Controller, useWatch } from "react-hook-form";
import { withStyles, Stack, MenuItem, TextField, Autocomplete, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormLayout, SideInput, BlockInput } from '../FormLayouts';
import { occupancyCategory } from '../../datas/Datas'

const FirstForm = ({ onceSubmitted }) => {
    const methods = useForm({});

    const onSubmit = (data) => {
        onceSubmitted(data);
    };

    const { control, handleSubmit, watch } = methods

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" spacing={4}>
                <FirstSection control={control} />
                <SecondSection control={control} />
            </Stack>

        </form>
    );

}

export default FirstForm;

const FirstSection = ({ control }) => {

    const sectionName = ""

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
                    <input type="submit" />
                </>}
        />
    )
}

const SecondSection = ({ control }) => {

    const sectionName = "firstForm"

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
                    <SelectInput control={control} options={occupancyCategory} getOptionLabel= "category" getOptionValue= "category"/>
                    <OccupancyTable control={ control }/>
                </Stack>}
        />
    )
}



function SelectInput({ control, onChange, options, getOptionLabel, getOptionValue }) {
    return (
        <Controller
            name="iceCreamType"
            control={control}
            render={({ field }) => <Select
                {...field}
                options={ options }
                getOptionLabel= {(option) => eval('option.' + getOptionLabel)}
                getOptionValue= {(option) => eval('option.' + getOptionValue)}
            />}
        />
    )
}

const OccupancyTable = ({ control }) => {

    const category = useWatch({
        control,
        name: "iceCreamType.category"
    });

    function children() {
        if (category) {
            const temp = occupancyCategory.find(e => e.category === category)
            return temp.children
        }
    }  

    if (category) {
        return ( 
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: "orange" }}>
                  <TableRow>
                    <TableCell>Occupancy Category</TableCell>
                    <TableCell align="right">Occupancy Density (#/100m2)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {children().map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.subcategory}
                      </TableCell>
                      <TableCell align="right">{row.density}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );

    }
    return <></>
  }