import React from "react";
import Select from "react-select";
import { useController, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  TextField,
  Stack,
  Typography,
  Paper,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  formChapters,
  occupancyCategory,
  buildingTypology,
  AchReference,
} from "../datas/Datas";
import axios from "axios";
import { toast } from "react-toastify";

export const FormLayout = ({ leftComponent, rightComponent }) => (
  <Container maxWidth="xl" disableGutters>
    <Paper elevation={2} sx={{ padding: 4 }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={4}
      >
        <Container maxWidth="md" disableGutters>
          {leftComponent}
        </Container>
        <Container maxWidth="md" disableGutters>
          {rightComponent}
        </Container>
      </Stack>
    </Paper>
  </Container>
);

const deleteProject = (id) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/deleteproject`, {
    data: {
      projectId: id,
    },
  });
};

export const FormHeader = ({ title, projectId, shouldRedirect }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Stack direction="column">
      <Box sx={{ fontWeight: "medium", fontSize: 18, color: "text.secondary" }}>
        CREATE NEW PROJECT
      </Box>
      <Box sx={{ fontWeight: "bold", fontSize: 32 }}>{title}</Box>
    </Stack>
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        onClick={(e) => {
          deleteProject(projectId)
            .then((res) => {
              if (res.status === 200) {
                if (res.data.message) {
                  toast.success(res.data.message);
                  shouldRedirect("/");
                }
              } else {
                if (res.data.message) {
                  toast.error(res.data.message);
                }
              }
            })
            .catch((err) => {
              toast.error("Something went wrong, please try again!");
            });
        }}
      >
        Delete
      </Button>
      <Button type="submit" variant="contained">
        Save Draft
      </Button>
    </Stack>
  </Stack>
);

export const FormFooter = ({ chapter, shouldRedirect, setFromNextButton }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    {chapter !== "1" && (
      <Button
        variant="contained"
        onClick={(e) => {
          shouldRedirect(`${parseInt(chapter) - 1}`);
        }}
      >
        PREV:{" "}
        {
          formChapters.find((e) => e.chapter === "" + (parseInt(chapter) - 1))
            .title
        }
      </Button>
    )}
    {chapter === "1" && <Box></Box>}
    {chapter !== "5" ? (
      <Button
        type="submit"
        variant="contained"
        onClick={(e) => {
          setFromNextButton(true);
        }}
      >
        NEXT:{" "}
        {
          formChapters.find((e) => e.chapter === "" + (parseInt(chapter) + 1))
            .title
        }
      </Button>
    ) : null}
  </Stack>
  /// Need logic for last page
);

export function SideInput({
  control,
  name,
  title,
  subtitle,
  defaultValue,
  isString,
  minimalInput,
}) {
  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
  });

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      minHeight={40}
    >
      <Stack direction="column">
        <Typography variant="body1">{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      <TextField
        {...inputProps}
        value={value || defaultValue}
        inputProps={{ min: minimalInput, style: { textAlign: "right" } }}
        variant="outlined"
        size="small"
        type={isString ? "text" : "number"}
        sx={{
          maxWidth: "40%",
        }}
      />
    </Stack>
  );
}

export function BlockInput({
  control,
  name,
  title,
  subtitle,
  maxLength,
  rows,
  maxRows,
}) {
  const styles = {
    helper: {
      textAlign: "right",
    },
  };

  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
  });

  return (
    <Stack
      direction="column"
      alignItems="left"
      justifyContent="space-between"
      spacing={2}
    >
      <Stack direction="column">
        <Typography variant="body1">{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      <TextField
        {...inputProps}
        autoFocus
        inputRef={ref}
        variant="outlined"
        fullWidth
        size="small"
        multiline
        rows={rows}
        maxRows={maxRows}
        helperText={
          (value ? value.length : "0") + "/" + (maxLength ? maxLength : "-")
        }
        FormHelperTextProps={{
          style: styles.helper,
        }}
        defaultValue={value}
      />
    </Stack>
  );
}

export function SelectInput({
  name,
  control,
  options,
  getOptionLabel,
  getOptionValue,
  placeholder,
  defaultValue,
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <Select
          value={value}
          onChange={onChange}
          options={options}
          getOptionLabel={(option) => eval("option." + getOptionLabel)}
          getOptionValue={(option) => eval("option." + getOptionValue)}
          placeholder={placeholder}
          isClearable
          isSearchable={false}
        />
      )}
    />
  );
}

export function InlineLabel({ title, subtitle, value, bold }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      minHeight={40}
    >
      <Stack direction="column">
        {bold && <Box sx={{ fontSize: 16, fontWeight: "bold" }}>{title}</Box>}
        {!bold && <Typography variant="body1">{title}</Typography>}
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      <Box sx={{ fontWeight: "bold", textAlign: "right" }}>
        {value ? value : "-"}
      </Box>
    </Stack>
  );
}

export function BasicInputField({ control, name, adornment }) {
  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: "",
  });
  return (
    <TextField
      {...inputProps}
      inputRef={ref}
      checked={value}
      value={value}
      inputProps={{ min: 0, style: { textAlign: "right" } }}
      variant="outlined"
      size="small"
      type="number"
      className="w-24"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ),
      }}
    />
  );
}
