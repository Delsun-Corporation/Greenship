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
  Switch,
  Skeleton,
  ThemeProvider,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import {
  formChapters,
} from "../datas/Datas";
import axios from "axios";
import { toast } from "react-toastify";
import { theme } from "../assets/Theme";

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



export const FormHeader = ({ title, projectId, shouldRedirect }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteProject = (id) => {
    return axios.delete(`${process.env.REACT_APP_API_URL}/deleteproject`, {
      data: {
        projectId: id,
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
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
            color="error"
            sx={{ backgroundColor: "candyPink" }}
            onClick={handleClickOpen}
          >
            Delete
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Project"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this project? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained"
              color="error"
                sx={{ backgroundColor: "candyPink" }} onClick={
                  (e) => {
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
                        setOpen(false)
                      })
                      .catch((err) => {
                        toast.error("Something went wrong, please try again!");
                      });
                  }} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "steelTeal" }}>
            Save Draft
          </Button>
        </Stack>
      </Stack>
    </ThemeProvider>
  )
};

export const FormFooter = ({ chapter, shouldRedirect, setFromNextButton }) => {
  return (
    <ThemeProvider theme={theme}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {chapter !== "1" && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "steelTeal" }}
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
        {chapter !== "6" ? (
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "steelTeal" }}
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
    </ThemeProvider>
  )
};

export const SkeletonSection = () => {

  const SkeletonBlockInput = () => {
    return (
      <Stack
        direction="column"
        spacing={0}
      >
        <Typography variant="h5" width="50%">
          <Skeleton variant="text" />
        </Typography>
        <Typography variant="h2" width="100%">
          <Skeleton variant="text" />
        </Typography>
      </Stack>
    )
  }

  const SkeletonSideInput = () => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack direction="column" width="50%">
          <Typography variant="h5">
            <Skeleton variant="text" />
          </Typography>
          <Skeleton variant="text" width="40%" />

        </Stack>
        <Typography variant="h2" width="30%">
          <Skeleton variant="text" />
        </Typography>
      </Stack>
    )
  }

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <SkeletonBlockInput />
          <SkeletonSideInput />
          <SkeletonSideInput />
          <SkeletonSideInput />
          <SkeletonBlockInput />
          <SkeletonSideInput />
          <SkeletonSideInput />
          <SkeletonSideInput />
          <SkeletonBlockInput />
          <SkeletonSideInput />
          <SkeletonSideInput />
          <SkeletonSideInput />
        </Stack>
      }
      rightComponent={
        <Stack direction="column" spacing={2}>
          <SkeletonSideInput />
          <Typography variant="h1" width="100%">
            <Skeleton variant="text" />
          </Typography>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Stack>
      } />
  );
}

export function SideInput({
  control,
  name,
  title,
  subtitle,
  defaultValue = 0,
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

  const handleKey = (e) => {
    //... rest of your code
    e.preventDefault()
   }

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
        inputMode="numeric"
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
  placeholder
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
        placeholder={placeholder}
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

export function ToggleInput({ control, name, title, subtitle }) {
  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control
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
      <Switch {...inputProps}
        value={value} />
    </Stack>
  )
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
  });
  return (
    <TextField
      {...inputProps}
      value={parseInt(value) || 0}
      inputProps={{ min: 0, style: { textAlign: "right" } }}
      variant="outlined"
      size="small"
      type="number"
      className="w-24"
      type="number"
      defaultValue={0}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ),
      }}
    />
  );
}

export function SideButtonInput({
  control,
  name,
  title,
  subtitle,
  defaultValue,
}) {
  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
  });

  const { useStyles } = require('./FormLayouts.styles');

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
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="raised" component="span" className={useStyles().button}>
          Upload
        </Button>
      </label>
    </Stack>
  );
}
