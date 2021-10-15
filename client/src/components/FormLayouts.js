import React from 'react';
import { useController, useWatch } from "react-hook-form";
import { Container, TextField, Stack, Typography, Paper, Divider } from '@mui/material';

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

export function SideInput({ control, name, title, subtitle, defaultValue }) {
    const {
        field: { ref, ...inputProps },
        fieldState: { invalid, isTouched, isDirty },
        formState: { touchedFields, dirtyFields }
    } = useController({
        name,
        control,
        rules: { required: true },
        defaultValue: defaultValue,
    });

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between"
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
            <TextField {...inputProps} inputRef={ref} required variant="outlined" size="small" />
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
        rules: { required: true },
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
                required
                helperText={(getValue ? getValue.length : "0") + "/" + (maxLength ? maxLength : "-")}
                FormHelperTextProps={{
                    style: styles.helper
                }} />
        </Stack>

    );
}