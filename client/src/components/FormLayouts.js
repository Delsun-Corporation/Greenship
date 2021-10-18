import React from 'react';
import Select from "react-select";
import { useController, useWatch, Controller } from "react-hook-form";
import { Box, Button, Container, TextField, Stack, Typography, Paper, Divider } from '@mui/material';
import { formChapters, occupancyCategory, buildingTypology, AchReference } from '../datas/Datas'

export const FormLayout = ({ leftComponent, rightComponent }) => (
    <>
        <Container maxWidth="xl" disableGutters>
            <Paper elevation={2} sx={{ padding: 4 }}>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={4}>
                    <Container maxWidth="md" disableGutters>
                        {leftComponent}
                    </Container>
                    <Container maxWidth="md" disableGutters>
                        {rightComponent}
                    </Container>
                </Stack>
            </Paper>
        </Container>
    </>
)

export const FormHeader = ({ title }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="column">
            <Box sx={{ fontWeight: "medium", fontSize: 18, color: "text.secondary" }}>
                CREATE NEW PROJECT
            </Box>
            <Box sx={{ fontWeight: "bold", fontSize: 32 }}>
                {title}
            </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
            <Button variant="contained">
                Delete
            </Button>
            <Button type="submit" variant="contained">
                Save Draft
            </Button>
        </Stack>
    </Stack>
)

export const FormFooter = ({ chapter }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        { chapter !== "1" && 
            <Button variant="contained">
                PREV: {formChapters.find(e => e.chapter === ('' + (parseInt(chapter)-1))).title}
            </Button>
        }
        { chapter === "1" && <Box></Box>}
        <Button type="submit" variant="contained">
            NEXT: {formChapters.find(e => e.chapter === ('' + (parseInt(chapter)+1))).title}
        </Button>
    </Stack>
    /// Need logic for last page
)

export function SideInput({ control, name, title, subtitle, defaultValue }) {
    const {
        field: { ref, value, ...inputProps },
        fieldState: { invalid, isTouched, isDirty },
        formState: { touchedFields, dirtyFields }
    } = useController({
        name,
        control,
        defaultValue: defaultValue,
    });

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between"
            spacing={2} minHeight={40}>
            <Stack direction="column">
                <Typography variant="body1">
                    {title}
                </Typography>
                {subtitle &&
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                }
            </Stack>
            <TextField {...inputProps}
                value={value || defaultValue}
                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                variant="outlined"
                size="small"
                type="number"
                freeSolo 
                defaultValue={defaultValue}
                />
        </Stack>

    );
}

export function BlockInput({ control, name, title, subtitle, defaultValue, maxLength, rows, maxRows }) {
    const getValue = useWatch({
        control,
        name: name
    });

    const styles = {
        helper: {
            textAlign: "right"
        }
    }

    const {
        field: { ref, value, ...inputProps },
        fieldState: { invalid, isTouched, isDirty },
        formState: { touchedFields, dirtyFields }
    } = useController({
        name,
        control,
        defaultValue: defaultValue,
    });

    return (
        <Stack direction="column" alignItems="left" justifyContent="space-between"
            spacing={2}>
            <Stack direction="column">
                <Typography variant="body1">
                    {title}
                </Typography>
                {subtitle &&
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                }
            </Stack>
            <TextField
                {...inputProps}
                inputRef={ref}
                variant="outlined"
                fullWidth
                size="small"
                multiline
                rows={rows}
                maxRows={maxRows}
                helperText={(getValue ? getValue.length : "0") + "/" + (maxLength ? maxLength : "-")}
                FormHelperTextProps={{
                    style: styles.helper
                }}
                defaultValue={defaultValue} 
                />
        </Stack>

    );
}

export function SelectInput({ name, control, options, getOptionLabel, getOptionValue, placeholder, defaultValue }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => 
            <Select
                {...field}
                options={options}
                getOptionLabel={(option) => eval('option.' + getOptionLabel)}
                getOptionValue={(option) => eval('option.' + getOptionValue)}
                placeholder={placeholder}
                defaultInputValue={defaultValue}
            />}
        />
    )
}

export function InlineLabel({ title, subtitle, value }) {

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between"
            spacing={2} minHeight={40}>
            <Stack direction="column">
                <Typography variant="body1">
                    {title}
                </Typography>
                {subtitle &&
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                }
            </Stack>
            <Box sx={{ fontWeight: "bold" }}>
                {value ? value : "-"}
            </Box>
        </Stack>
    );
}