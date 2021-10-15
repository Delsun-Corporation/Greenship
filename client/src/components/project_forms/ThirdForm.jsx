import React from 'react';
import { useForm, useFieldArray, Controller, useWatch, FormProvider } from "react-hook-form";
import { Button, Accordion, AccordionSummary, AccordionDetails, TextField, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ThirdForm = ({ onceSubmitted }) => {

    const methods = useForm({});

    const onSubmit = (data) => {
        onceSubmitted(data);
    };

    const { register, control, handleSubmit, reset, watch } = methods

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "lighting"
    });

    // if you want to control your fields with watch
    // const watchResult = watch("test");
    // console.log(watchResult);

    // console.log(useWatch({ name: "test", control }));

    return (
        <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack direction="row" justifyContent="space-between" >
                    <Typography variant="h5" color="initial">
                        A. Lighting
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => {
                            append({});
                        }}
                    >
                        ADD ITEM
                    </Button>

                </Stack>
                <div>
                    {fields.map((field, index) => {
                        return (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={"panel" + (index + 1) + "bh-content"}
                                    id={"panel" + (index + 1) + "bh-header"}
                                >
                                    <Stack justifyContent="space-between" alignItems="center"
                                        spacing={2} direction="row" width='100%'>
                                        <Controller
                                            key={field.id}
                                            control={control}
                                            name={`lighting.${index}.itemName`}
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
                                    <Stack direction="row" alignItems="center" justifyContent="space-between"
                                        spacing={2}>
                                        <Stack direction="column">
                                            <Typography variant="body1">Daylight Area
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                (1/3 kedalaman ruang dari bukaan efektif)
                                            </Typography>
                                        </Stack>
                                        <Controller
                                            key={field.id}
                                            control={control}
                                            name={`lighting.${index}.daylightArea`}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField onChange={onChange} value={value} variant="outlined" size="small" />
                                            )}
                                        />
                                    </Stack>
                                    {/* <InputSideLabel
                                    name= {`test.${index}.a`}
                                    title= "Gross Floor Area (m2)"
                                    control= {control}
                                     /> */}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}

                </div>
                <input type="submit" />
            </form>
        </FormProvider>
    );
}




export default ThirdForm;


const InputSideLabel = ({ name, title, subtitle, control, required }) => (
    <>
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
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <TextField onChange={onChange} value={value} variant="outlined" size="small" />
                )}
            />
        </Stack>
    </>
)

