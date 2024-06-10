import NumericFormatCustom from "@components/shared/NumericFormatCustom";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { calcTotalHour, formatDate, formatPrice } from "@utils/format";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const DialogPayment = ({ loading, data, open, onClose = () => {}, onSubmit = (values) => {} }) => {
  const [receivedCost, setReceivedCost] = useState(data.receivedCost || 0);

  const calc = useMemo(
    () => calcTotalHour(data.startTime, data.endTime),
    [data.startTime, data.endTime]
  );

  const totalCost = useMemo(
    () => data.football.price * calc.totalHours + data.extraFee,
    [data.football.price, calc.totalHours, data.extraFee]
  );

  const handleChangeReceivedCost = ({ target: { value } }) => {
    setReceivedCost(value);
  };

  const changeCost = useMemo(
    () => (receivedCost ? +receivedCost - totalCost : 0),
    [totalCost, receivedCost]
  );

  const handleSubmit = () => {
    if (!receivedCost) {
      toast.error("Received Cost required");
      return;
    }

    if (receivedCost < totalCost) {
      toast.error("Received cost required > total cost ");
      return;
    }

    const payload = {
      orderDetailsId: data._id,
      receivedCost: +receivedCost,
      changeCost,
      totalCost,
      extraFee: data.extraFee,
    };

    onSubmit?.(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`Order Id \`${data.order}\``}</DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <Typography fontSize={14}>
            Date: <b>{formatDate(data.date, "dddd, DD/MM/YYYY", "DD/MM/YYYY")}</b>
          </Typography>

          <Typography fontSize={14}>
            Times:{" "}
            <b>
              {`${data.startTime} - ${data.endTime} = ${`${calc.hours} hour`} ${
                calc.minutes ? `${calc.minutes + " minutes"}` : ""
              } `}
            </b>
          </Typography>

          <Typography fontSize={14}>
            Price: <b>{formatPrice(data.football.price)}</b>
          </Typography>
        </Box>

        <TextField
          margin="dense"
          id="totalCost"
          name="totalCost"
          label="Total Cost"
          fullWidth
          InputProps={{
            inputComponent: NumericFormatCustom,
            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
          }}
          variant="outlined"
          value={Math.round(totalCost)}
          disabled
          sx={{
            "& input": {
              fontSize: 14,
              WebkitTextFillColor: "unset !important",
              fontWeight: 700,

              color: (theme) => theme.palette.error.main,
            },
          }}
        />

        <TextField
          margin="dense"
          id="extraFee"
          name="extraFee"
          label="Extra fee"
          fullWidth
          InputProps={{
            inputComponent: NumericFormatCustom,
            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
          }}
          variant="outlined"
          value={Math.round(data.extraFee)}
          disabled
          sx={{
            "& input": {
              fontSize: 14,
              WebkitTextFillColor: "unset !important",
              fontWeight: 700,

              color: (theme) => theme.palette.primary.main,
            },
          }}
        />

        <TextField
          required
          margin="dense"
          id="receivedCost"
          name="receivedCost"
          label="Received Cost"
          fullWidth
          InputProps={{
            inputComponent: NumericFormatCustom,
            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
          }}
          variant="outlined"
          value={receivedCost}
          onChange={handleChangeReceivedCost}
          sx={{
            "& input": {
              fontSize: 14,
              WebkitTextFillColor: "unset !important",
              fontWeight: 700,

              color: (theme) => theme.palette.success.main,
            },
          }}
        />

        <TextField
          required
          margin="dense"
          id="changeCost"
          name="changeCost"
          label="Change Cost"
          fullWidth
          disabled
          InputProps={{
            inputComponent: NumericFormatCustom,
            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
          }}
          variant="outlined"
          value={Math.floor(changeCost)}
          sx={{
            "& input": {
              fontSize: 14,
              WebkitTextFillColor: "unset !important",
              fontWeight: 700,
              color: (theme) => theme.palette.success.main,
            },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onClose}>
          Close
        </Button>

        <LoadingButton loading={loading} type="submit" onClick={handleSubmit} variant="contained">
          payment confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogPayment;
