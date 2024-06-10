import NumericFormatCustom from "@components/shared/NumericFormatCustom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

const productSchema = yup.object({
  name: yup.string().required("Football name required"),
  price: yup.number().min(1000).required("Football price required"),
  thumbNail: yup.mixed().nullable().required("Thumbnail required"),
  category: yup.string().required("Football category required"),
  number: yup.string().required("Football number required"),
  isActive: yup.bool().notRequired(),
  status: yup.string().notRequired(),
  images: yup.mixed().nullable().required("Images required"),
});

const DialogAddEditFootball = ({
  open = false,
  onClose = () => {},
  initialValues = {
    name: "",
    _id: "",
    price: "",
    category: "",
    thumbNail: null,
    isActive: true,
    status: "available",
    images: null,
    number: "",
  },
  onSubmit = (values) => {},
  loading = false,
  categories = [],
}) => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([...(initialValues.images || [])]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: productSchema,
    initialValues,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit(values);
    },
  });

  const { errors, touched, values, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDeleteImage = (index) => {
    const filesFilter = Array.from(files).filter((_, i) => i !== index);
    setFiles(filesFilter);
    setFieldValue("images", !filesFilter.length ? null : filesFilter);
  };

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{initialValues._id ? "Update Football" : "Add Football"} </DialogTitle>

        <DialogContent>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Football name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  {...getFieldProps("name")}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  id="price"
                  name="price"
                  label="Football price"
                  fullWidth
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                    endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                  }}
                  variant="outlined"
                  {...getFieldProps("price")}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormControl fullWidth margin="dense" required error={Boolean(errors.category)}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Category"
                    variant="outlined"
                    value={values.category}
                    onChange={async (e) => await setFieldValue("category", e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories?.map((item) => (
                      <MenuItem value={item?._id}>{item?.name}</MenuItem>
                    ))}
                  </Select>

                  {Boolean(errors.category) ? (
                    <FormHelperText>{errors.category}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  id="number"
                  name="number"
                  label="Football number"
                  fullWidth
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SportsSoccerIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  {...getFieldProps("number")}
                  error={touched.number && Boolean(errors.number)}
                  helperText={touched.number && errors.number}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormControl fullWidth margin="dense" error={Boolean(errors.status)}>
                  <InputLabel id="demo-simple-select-label">Football status</InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Football status"
                    variant="outlined"
                    value={values.status}
                    onChange={async (e) => await setFieldValue("status", e.target.value)}
                  >
                    <MenuItem value={"maintain"}>Maintain</MenuItem>
                    <MenuItem value={"available"}>Available</MenuItem>
                  </Select>

                  {Boolean(errors.status) ? <FormHelperText>{errors.status}</FormHelperText> : null}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth margin="dense" error={Boolean(errors.isActive)}>
                  <InputLabel id="demo-simple-select-label">Football Active</InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Football Active"
                    variant="outlined"
                    value={values.isActive}
                    onChange={async (e) => await setFieldValue("isActive", e.target.value)}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>

                  {Boolean(errors.isActive) ? (
                    <FormHelperText>{errors.isActive}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <InputLabel id="demo-simple-select-label">Thumbnail</InputLabel>
              <TextField
                required
                sx={{ my: 0.5 }}
                id="thumbNail"
                name="thumbNail"
                type="file"
                fullWidth
                variant="outlined"
                onChange={async (e) => {
                  const _file = e?.target?.files[0];
                  await setFieldValue("thumbNail", e?.target?.files[0]);
                  setFile(_file);
                }}
                error={touched.thumbNail && Boolean(errors.thumbNail)}
                helperText={touched.thumbNail && errors.thumbNail}
              />

              {file || initialValues.thumbNail ? (
                <Box
                  component="img"
                  src={file ? URL.createObjectURL(file) : initialValues.thumbNail}
                  sx={{ width: 100, height: 100, borderRadius: 3, objectFit: "cover" }}
                  loading="lazy"
                />
              ) : null}
            </Grid>

            <Grid item xs={12}>
              <InputLabel id="demo-simple-select-label">Images</InputLabel>

              <TextField
                required
                id="images"
                name="images"
                type="file"
                fullWidth
                variant="outlined"
                error={touched.images && Boolean(errors.images)}
                helperText={touched.images && errors.images}
                inputProps={{ multiple: true }}
                onChange={async (e) => {
                  const _files = e?.target?.files;
                  await setFieldValue("images", [...(values?.images || []), ..._files]);
                  setFiles((prev) => [...prev, ..._files]);
                }}
              />

              {files.length ? (
                <Stack mt={1} flexDirection={"row"} gap={1}>
                  {Array.from(files).map((item, index) => {
                    return (
                      <Box key={index} sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={typeof item === "object" ? URL.createObjectURL(item) : item}
                          sx={{ width: 100, height: 100, borderRadius: 3, objectFit: "cover" }}
                          loading="lazy"
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            zIndex: 10,
                            top: 1,
                            right: 1,
                            background: "rgba(255,255,255,0.85)",
                            borderRadius: "12px 12px",
                          }}
                        >
                          <IconButton onClick={() => handleDeleteImage(index)}>
                            <HighlightOffIcon color="error" />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              ) : null}
            </Grid>
          </Form>
        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton loading={loading} type="submit" onClick={handleSubmit}>
            {initialValues._id ? "Save change" : "Add"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogAddEditFootball;
