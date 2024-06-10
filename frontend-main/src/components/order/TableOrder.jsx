import { BookingTypesConvert } from "@constant/order";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { formatDate } from "@utils/format";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const TableOrder = ({
  data,
  onDelete = (item) => {},
  onEdit = (item) => {},
  onSeeDetails = (item) => {},
  isAdmin = false,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell align="left">Booking type</TableCell>
            {isAdmin ? <TableCell align="left">Customer</TableCell> : null}
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">OrderAt</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:first-child": {
                    background: (theme) => theme.palette.primary.main,
                    "& > td, & > th": {
                      color: (theme) => theme.palette.common.white,
                    },
                  },
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                  {row._id}
                </TableCell>

                <TableCell align="left">{BookingTypesConvert[row.type]}</TableCell>
                {isAdmin ? (
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    {row.user.displayName}
                  </TableCell>
                ) : null}
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {row.phoneNumber}
                </TableCell>
                <TableCell align="right">{formatDate(row.createdAt)}</TableCell>
                <TableCell align="right">
                  {isAdmin ? (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => onEdit?.(row)}
                          color={index === 0 ? "inherit" : "primary"}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => onDelete?.(row)}
                          color={index === 0 ? "inherit" : "error"}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : null}

                  <Tooltip title="See details">
                    <IconButton
                      onClick={() => onSeeDetails?.(row)}
                      color={index === 0 ? "inherit" : "secondary"}
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} align="center">
                Empty order data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableOrder;
