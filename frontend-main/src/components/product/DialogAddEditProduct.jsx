import NumericFormatCustom from "@components/shared/NumericFormatCustom";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import Box from "@mui/material/Box";
import { useState } from "react";

const productSchema = yup.object({
  name: yup.string().required("Product name required"),
  price: yup.number().min(1000).required("Price name required"),
  image: yup.mixed().nullable().required("Image required"),
  type: yup.string().required("Product type required"),
});

const DialogAddEditProduct = ({
  open = false,
  onClose = () => {},
  initialValues = { name: "", _id: "", price: "", type: "", image: null },
  onSubmit = (values) => {},
  loading = false,
}) => {
  const [file, setFile] = useState(null);

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

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{initialValues._id ? "Update Product" : "Add Product"} </DialogTitle>

        <DialogContent>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Product name"
              type="text"
              fullWidth
              variant="outlined"
              {...getFieldProps("name")}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              required
              margin="dense"
              id="price"
              name="price"
              label="Product price"
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

            <FormControl fullWidth margin="dense" required error={Boolean(errors.type)}>
              <InputLabel id="demo-simple-select-label">Product Type</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Product Type"
                variant="outlined"
                value={values.type}
                onChange={async (e) => await setFieldValue("type", e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"shoe"}>Shoe</MenuItem>
                <MenuItem value={"beverage"}>Beverage</MenuItem>
                <MenuItem value={"others"}>Others</MenuItem>
              </Select>

              {Boolean(errors.type) ? <FormHelperText>{errors.type}</FormHelperText> : null}
            </FormControl>

            <TextField
              required
              margin="dense"
              id="image"
              name="image"
              // label="Product thumbnail"
              type="file"
              fullWidth
              variant="outlined"
              onChange={async (e) => {
                const _file = e?.target?.files[0];
                await setFieldValue("image", e?.target?.files[0]);
                setFile(_file);
              }}
              error={touched.image && Boolean(errors.image)}
              helperText={touched.image && errors.image}
            />

            {file || initialValues.image ? (
              <Box
                component="img"
                src={file ? URL.createObjectURL(file) : initialValues.image}
                sx={{ width: 100, height: 100, borderRadius: 3 }}
                loading="lazy"
              />
            ) : null}
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

export default DialogAddEditProduct;
