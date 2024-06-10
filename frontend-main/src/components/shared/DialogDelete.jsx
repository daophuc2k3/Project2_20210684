import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

const DialogDelete = ({
  open = false,
  name = "",
  loading = false,
  onClose = () => {},
  onAgree = () => {},
  title = "Delete",
  subTitle = "Are you sure delete?",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{`${title} \`${name}\``}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{subTitle}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Disagree
        </Button>

        <LoadingButton loading={loading} type="submit" color="success" onClick={onAgree}>
          Agree
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDelete;
