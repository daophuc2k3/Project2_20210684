import { BookingTypesConvert } from "@constant/order";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { formatDate } from "@utils/format";
import TableOrderDetails from "./TableOrderDetails";

const DialogSeeDetailsOrder = ({
  data,
  open,
  isAdmin = false,
  onClose = () => {},
  onCancel = (item) => {},
  onEditChangeTime = (item) => {},
  onPayment = (item) => {},
  onChangeStatus = (item) => {},
  onUseService = (item) => {},
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth={isAdmin ? false : true}
      fullScreen={isAdmin}
    >
      <DialogTitle>
        {`Order Id ${data._id}.${isAdmin ? "" : `Customer booking ${data.user.displayName}`}`}
      </DialogTitle>

      <DialogContent>
        {isAdmin ? (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <Typography>
              Customer booking:{" "}
              <Box component="b" sx={{ color: (theme) => theme.palette.success.main }}>
                {`${data.user.displayName} (${data.phoneNumber})`}
              </Box>
            </Typography>

            <Typography>
              Booking type: <b>{BookingTypesConvert[data.type]}</b>
            </Typography>

            <Typography>
              Ordered At: <b>{formatDate(data.createdAt)}</b>
            </Typography>

            <Typography>
              Updated At: <b>{formatDate(data.updatedAt)}</b>
            </Typography>
          </Box>
        ) : null}

        <TableOrderDetails
          data={data.details}
          isAdmin={isAdmin}
          onCancel={onCancel}
          onEditChangeTime={onEditChangeTime}
          onPayment={onPayment}
          onChangeStatus={onChangeStatus}
          onUseService={onUseService}
        />
      </DialogContent>

      <DialogActions>
        <Button color="error" variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogSeeDetailsOrder;
