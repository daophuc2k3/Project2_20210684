import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import { useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";

const Schema = yup.object({
  endTime: yup.mixed().nullable().required("End time required"),
});

const DialogEditEndTime = ({
  open = false,
  onClose = () => {},
  initialValues = { endTime: null },
  onSubmit = (values) => {},
  loading = false,
  minDate = null,
}) => {
  const [endTime, setEndTime] = useState(moment(initialValues?.endTime, "DD/MM/YYYY HH:mm"));

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: Schema,
    initialValues,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit({ ...values, endTime });
    },
  });

  const { errors, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    setFieldValue("endTime", time);
  };

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change End time</DialogTitle>

        <DialogContent>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <FormControl fullWidth margin="dense" required error={Boolean(errors.endTime)}>
              <TimePicker
                minTime={minDate}
                label="Time end"
                value={endTime}
                onChange={handleEndTimeChange}
              />

              {Boolean(errors.endTime) ? <FormHelperText>{errors.endTime}</FormHelperText> : null}
            </FormControl>
          </Form>
        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton loading={loading} type="submit" onClick={handleSubmit}>
            {"Save change"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogEditEndTime;
