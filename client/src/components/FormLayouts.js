import React, { useCallback, useState, useEffect, Component } from "react";
import Select from "react-select";
import { useController, Controller, useFormContext } from "react-hook-form";
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
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Modal
} from "@mui/material";
import {
  formChapters,
} from "../datas/Datas";
import axios from "axios";
import { toast } from "react-toastify";
import { theme } from "../assets/Theme";
import { Upload, Download } from "@mui/icons-material";
import Image from 'material-ui-image'
import { Page, PDFDownloadLink } from 'react-pdf'
import { Document } from 'react-pdf/dist/esm/entry.webpack';
import LogoPDF from "../assets/pdf.png";
import Base64Downloader from 'react-base64-downloader';


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
    rules: { required: true },
  });
  return (
    <TextField
      {...inputProps}
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

// export const DropzoneField = ({
//   name,
//   multiple,
//   ...rest
// }) => {

//   const { control } = useFormContext()

//   return (
//     <>
//     <Controller
//       render={({ onChange }) => (
//         <Dropzone
//           multiple={multiple}
//           onChange={e =>
//             onChange(multiple ? e.target.files : e.target.files[0])
//           }
//           {...rest}
//         />
//       )}
//       name={name}
//       control={control}
//       defaultValue=''
//     />
//     </>
//   )
// }

// const Dropzone = ({
//   multiple,
//   onChange,
//   ...rest
// }) => {

//   const {
//     getRootProps,
//     getInputProps,
//   } = useDropzone({
//     multiple,
//     ...rest,
//   })

//   return (
//     <div {...getRootProps()}>
//       <input {...getInputProps({ onChange })} />
//     </div>
//   )
// }

// export function FileInput({ control, name, ...props }) {
//   // : { name, onBlur, onChange, ref, value }
//   const { field } = useController({
//     name,
//     control,
//     defaultValue: null,
//   })

//   const { getRootProps, getInputProps, open, rootRef, isDragActive } = useDropzone({
//     accept: 'image/*',
//     multiple: false,
//     noKeyboard: true,
//     onDrop: ([acceptedFile]) => {
//       field.onChange(acceptedFile)
//     }
//   });

//   field.ref.current = rootRef.current
//   const file = field.value

//   return (
//     <Container>
//     <div {...getRootProps({className: 'dropzone'})}>
//       <input {...getInputProps({ name: field.name, onBlur: field.onBlur })} />

//       {
//         isDragActive ?
//           <p>Drop the files here ...</p> :
//           <p>Drag 'n' drop some files here, or click to select files</p>
//       }
//     </div>
//     </Container>
//   );
// }

export const FileInput = ({ control, name }) => {
  const { field } = useController({ control, name });
  const [value, setValue] = React.useState("");
  return (
    <input
      type="file"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        field.onChange(e.target.files);
      }}
    />
  );
};


export function DropzoneAreaExample({ control, name, ...props }) {
  // const { field } = useController({
  //   name,
  //   control,
  //   defaultValue: null,
  // })
  // handleChange(files){
  //   this.setState({
  //     files: files
  //   });
  // }

  //   return (
  //     <DropzoneArea
  //       onChange={this.handleChange.bind(this)}
  //       />
  //   )
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function base64FileHeaderMapper(fileBase64) {

  let fileHeader = new Map();

  //get the first 3 char of base64
  fileHeader.set("/9j", "JPG")
  fileHeader.set("iVB", "PNG")
  fileHeader.set("Qk0", "BMP")
  fileHeader.set("SUk", "TIFF")
  fileHeader.set("JVB", "PDF")
  fileHeader.set("UEs", "OFD")

  let res = ""

  fileHeader.forEach((v, k) => {
    if (k == fileBase64.substr(0, 3)) {
      res = v
    }
  })

  //if file is not supported
  if (res == "") {
    res = "unknown file"
  }

  //return map value
  return res;
}

const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    }
  });
}

export function ImageUpload({ name, errors, control, title = "Upload Image", subtitle = "Click the image to view", imageUrl }) {
  const { field } = useController({ name, control });
  const [image, setImage] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [load, setLoad] = useState(true);

  if (!image && imageUrl) {
    getBase64FromUrl(imageUrl).then((base) => {
      setImage(base);
      setLoad(true)
    })
  }

  const onAvatarChange = useCallback(async (event) => {
    if (event.target.files?.[0]) {
      const base64 = await getBase64(event.target.files[0]);

      setImage(base64);
      field.onChange(event.target.files);
    }
  }, []);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',
    height: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const PreviewModal = ({ image }) => {
    const aspectRatio = image.width / image.height;

    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Base64Downloader base64={image} >
            <Button variant="contained" startIcon={<Download />}>Download</Button>
          </Base64Downloader>

          <Image
            src={image}
            imageStyle={{ objectFit: "contain" }}
            style={{ width: '76vw', height: '80vh' }}
            aspectRatio={aspectRatio}
            onClickCapture={handleOpen} />
        </Box>
      </Modal>
    )
  }

  const PreviewPDF = ({ image }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
      setPageNumber(1);
    }

    function changePage(offset) {
      setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
      changePage(-1);
    }

    function nextPage() {
      changePage(1);
    }

    return (
      <>
        <Document
          file={image}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <Stack direction= "horizontal" alignItems="center"
        justifyContent="space-between">
          <Stack direction= "horizontal"alignItems="center">
            <Button
              disabled={pageNumber <= 1}
              onClick={previousPage}
              variant="contained"
            >
              Previous
            </Button>
            <Box paddingX={10}>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </Box>
            <Button
              variant="contained"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Next
            </Button>
          </Stack>
          <Button variant="contained" startIcon={<Download />}>Download</Button>
        </Stack>
        
      </>
    );
  }

  const PreviewPDFModal = ({ image }) => {
    const aspectRatio = image.width / image.height;

    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <PreviewPDF image={image} />
        </Box>
      </Modal>
    )
  }

  const ImageComponent = ({ image }) => {
    const type = image.match(/[^:/]\w+(?=;|,)/)[0]
    const aspectRatio = image.width / image.height;

    if (type === "pdf") {
      return (
        <>
          <Image
            src={LogoPDF}
            cover
            style={{ height: 100 }}
            imageStyle={{ objectFit: "contain" }}
            aspectRatio={aspectRatio}
            onClickCapture={handleOpen}
          />
          <PreviewPDFModal image={image} />
        </>
      )
    }

    return (
      <>
        <Image
          src={image}
          cover
          style={{ height: 200 }}
          imageStyle={{ objectFit: "contain" }}
          aspectRatio={aspectRatio}
          onClickCapture={handleOpen}
        />
        <PreviewModal image={image} />
      </>
    )
  }

  const UploadButton = () => {
    return (
      <ThemeProvider theme={theme}>
        <Button variant="contained" component="label" startIcon={<Upload />} sx={{ backgroundColor: "steelTeal" }}>

          Upload (png, jpeg, pdf)
          <input type="file" onChange={onAvatarChange} accept="image/jpeg, image/png, image/jpg, application/pdf" hidden />
        </Button>
      </ThemeProvider>
    )
  }

  return (
    <Stack
      direction="column" spacing={2}>
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
        <UploadButton />

      </Stack>

      {image && load && <ImageComponent image={image} />}

      <p>{errors[name]?.message}</p>
    </Stack>
  );
}
