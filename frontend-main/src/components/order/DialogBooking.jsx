import { DayNames, MonthNames } from "@constant/month";
import { BookingTypes } from "@constant/order";
import { fetchFilterDatesByTime } from "@features/order/orderThunk";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  filterDatesBeforeToday,
  findDayOfWeekInMonth,
  remainingDaysInWeek,
  remainingMonthsInYear,
} from "@utils/common";
import { formatPrice } from "@utils/format";
import { Form, FormikProvider, useFormik } from "formik";
import { isEmpty } from "lodash";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import * as yup from "yup";

export const PHONE_REGEX = /((0[1|2|3|4|5|6|7|8|9])+([0-9]{8})\b)/g;

const FORMAT_DATE_FILTER = "YYYY-MM-DD";

const Schema = yup.object({
  user: yup.string().required("User required"),
  phoneNumber: yup
    .string()
    .matches(PHONE_REGEX, "Phone number invalid.")
    .required("Phone number required"),
  type: yup.string().required("Booking type required"),
});

const DialogBooking = ({
  open = false,
  onClose = () => {},
  initialValues = { user: "", phoneNumber: "", type: "" },
  onSubmit = (values) => {},
  loading = false,
  item = { name: "Sân 5", number: "1" },
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const dispatch = useDispatch();

  const currentDate = new Date();
  const maxYear = currentDate.getFullYear();

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: Schema,
    initialValues,
    onSubmit: (values) => {
      if (!onSubmit) return;

      if (!startTime) {
        toast.error("Start time required");
        return;
      }

      if (!endTime) {
        toast.error("Start time required");
        return;
      }

      if (values.type === BookingTypes.day && !selectedDate) {
        toast.error("Date required");
        return;
      }

      if (values.type !== BookingTypes.day && !selectedDates.length) {
        toast.error("Month and Date required");
        return;
      }

      onSubmit({ ...values, selectedDates, football: item._id, selectedDate, startTime, endTime });
    },
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (!values.type) return;

    filterDates({
      startTime,
      endTime,
      date: date,
      type: values.type,
    });
  };

  const handleChangeSelectedMoths = (e) => {
    setSelectedMonths(e.target.value);

    let datesFilter = [];

    if (e.target.value?.length && selectedDay !== "") {
      const result = [...e.target.value]
        .map((t) => findDayOfWeekInMonth(selectedDay, t + 1, maxYear))
        .reduce((t, v) => (t = [...t, ...v]), [])
        .sort((a, b) => moment(a, "DD/MM/YYYY").toDate() - moment(b, "DD/MM/YYYY").toDate());

      datesFilter = filterDatesBeforeToday(result);
    }

    setSelectedDates(datesFilter);

    if (!values.type) return;

    datesFilter = datesFilter.map((t) => moment(t, "DD/MM/YYYY"));

    filterDates({
      startTime,
      endTime,
      date: datesFilter,
      type: values.type,
    });
  };

  const handleChangeSelectedDay = (e) => {
    setSelectedDay(e.target.value);

    let datesFilter = [];

    if (e.target.value !== "" && selectedMonths.length) {
      const result = [...selectedMonths]
        .map((t) => findDayOfWeekInMonth(e.target.value, t + 1, maxYear))
        .reduce((t, v) => (t = [...t, ...v]), [])
        .sort((a, b) => moment(a, "DD/MM/YYYY").toDate() - moment(b, "DD/MM/YYYY").toDate());

      datesFilter = filterDatesBeforeToday(result);
    }

    setSelectedDates(datesFilter);

    if (!values.type) return;

    datesFilter = datesFilter.map((t) => moment(t, "DD/MM/YYYY"));

    filterDates({
      startTime,
      endTime,
      date: datesFilter,
      type: values.type,
    });
  };

  const handleStartTimeChange = (time, options) => {
    setStartTime(time);

    if (!values.type) return;

    filterDates({
      startTime: time,
      endTime,
      date: values.type === BookingTypes.day ? selectedDate : selectedDates,
      type: values.type,
    });
  };

  const filterDates = ({ startTime, endTime, date, type }) => {
    if (!startTime || !endTime || !type) return;

    const fStartTime = startTime.format("HH:mm");
    const fEndTime = endTime.format("HH:mm");

    if (type === BookingTypes.day) {
      if (!date) return;

      const fDate = date.format(FORMAT_DATE_FILTER);

      dispatch(
        fetchFilterDatesByTime({
          date: fDate,
          startTime: fStartTime,
          endTime: fEndTime,
          footballId: item._id,
        })
      ).then(({ payload }) => {
        if (!isEmpty(payload.error)) return;

        // console.log(`payload OnDate `, payload);

        if (!payload?.metadata?.length) {
          setSelectedDate(null);
          toast.error(
            `The day ${fDate} has ended at the time frame from ${fStartTime} - ${fEndTime}`
          );
          return;
        }
      });

      return;
    }

    if (Array.isArray(date) && !date.length) return;

    const coloneSelectedDates = [...date].map((t) => t.format(FORMAT_DATE_FILTER)).join(",");

    dispatch(
      fetchFilterDatesByTime({
        date: coloneSelectedDates,
        startTime: fStartTime,
        endTime: fEndTime,
        footballId: item._id,
      })
    ).then(({ payload }) => {
      if (!isEmpty(payload.error)) return;

      // console.log(`payload Many dates`, payload);

      selectedDates(payload.metadata);
    });
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);

    if (!values.type) return;

    filterDates({
      startTime,
      endTime: time,
      date: values.type === BookingTypes.day ? selectedDate : selectedDates,
      type: values.type,
    });
  };

  const { errors, touched, values, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{`Booking \`${item.name}\` (số ${item.number}) - Total people: ${
          item.category.quantity
        } - Price by hour: ${formatPrice(item.price)}`}</DialogTitle>

        <DialogContent>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Customer booking"
                  type="text"
                  fullWidth
                  variant="outlined"
                  {...getFieldProps("user")}
                  disabled
                  sx={{
                    "& input": {
                      fontSize: 14,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,

                      color: (theme) => theme.palette.success.main,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone number"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <ContactPhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  autoComplete="off"
                  {...getFieldProps("phoneNumber")}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth margin="dense" required>
                  <TimePicker
                    label="Time start"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth margin="dense" required>
                  <TimePicker
                    minTime={moment(startTime).add("hours", 1)}
                    label="Time end"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth margin="dense" required error={Boolean(errors.type)}>
                  <InputLabel id="demo-simple-select-label">Booking type</InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Booking type"
                    variant="outlined"
                    value={values.type}
                    onChange={async (e) => await setFieldValue("type", e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={BookingTypes.day}>Booking for day</MenuItem>
                    <MenuItem value={BookingTypes.month}>Booking for month</MenuItem>
                    <MenuItem value={BookingTypes.year}>Booking for year</MenuItem>
                  </Select>

                  {Boolean(errors.type) ? <FormHelperText>{errors.type}</FormHelperText> : null}
                </FormControl>
              </Grid>

              {values.type === BookingTypes.day ? (
                <Grid item xs={12}>
                  <FormControl fullWidth margin="dense" required>
                    <DatePicker
                      minDate={moment()}
                      maxDate={moment(new Date(maxYear, 11, 31))}
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </FormControl>
                </Grid>
              ) : null}

              {values.type && values.type !== BookingTypes.day ? (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="dense" required>
                      <InputLabel id="demo-simple-select-label">Months</InputLabel>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Months"
                        variant="outlined"
                        value={selectedMonths}
                        multiple
                        onChange={handleChangeSelectedMoths}
                      >
                        {remainingMonthsInYear().map((month) => (
                          <MenuItem key={month} value={month}>{`${MonthNames[month]}`}</MenuItem>
                        ))}
                      </Select>

                      {Boolean(errors.type) ? <FormHelperText>{errors.type}</FormHelperText> : null}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth margin="dense" required>
                      <InputLabel id="demo-simple-select-label">Day</InputLabel>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Day"
                        variant="outlined"
                        value={selectedDay}
                        onChange={handleChangeSelectedDay}
                      >
                        {remainingDaysInWeek().map((day) => (
                          <MenuItem key={day} value={day}>{`${DayNames[day]}`}</MenuItem>
                        ))}
                      </Select>

                      {Boolean(errors.type) ? <FormHelperText>{errors.type}</FormHelperText> : null}
                    </FormControl>
                  </Grid>

                  {selectedDates.length ? (
                    <Grid item xs={12}>
                      <Typography
                        fontWeight={700}
                      >{`Total ${selectedDates.length} dates`}</Typography>
                      <Stack flexDirection={"row"} flexWrap={"wrap"} gap={1}>
                        {selectedDates.map((date) => (
                          <Chip key={date} label={date} />
                        ))}
                      </Stack>
                    </Grid>
                  ) : null}
                </>
              ) : null}
            </Grid>
          </Form>
        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton loading={loading} type="submit" onClick={handleSubmit} variant="contained">
            Booking
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default DialogBooking;
