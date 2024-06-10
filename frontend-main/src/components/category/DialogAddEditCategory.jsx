import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";

const categorySchema = yup.object({
  name: yup.string().required("Category required"),
  quantity: yup.number().min(8).required("Quantity people required"),
});

const DialogAddEditCategory = ({
  open = false,
  onClose = () => {},
  initialValues = { name: "", quantity: 0, _id: "" },
  onSubmit = (values) => {},
  loading = false,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: categorySchema,
    initialValues,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{initialValues._id ? "Update Category" : "Add Category"} </DialogTitle>

        <DialogContent>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Category name"
              type="text"
              fullWidth
              variant="standard"
              {...getFieldProps("name")}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              required
              margin="dense"
              id="quantity"
              name="quantity"
              label="Quantity people"
              type="number"
              fullWidth
              variant="standard"
              {...getFieldProps("quantity")}
              error={touched.quantity && Boolean(errors.quantity)}
              helperText={touched.quantity && errors.quantity}
            />
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

export default DialogAddEditCategory;
