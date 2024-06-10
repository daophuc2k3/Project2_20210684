import { BookingTypesConvert, OrderDetailsStatusColor } from "@constant/order";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { calcTotalHour, formatDate } from "@utils/format";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Chip } from "@mui/material";

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
            <TableCell align="left">Booking type</TableCell>
            <TableCell align="left">Football</TableCell>
            {isAdmin ? <TableCell align="left">Customer</TableCell> : null}
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Times</TableCell>
            <TableCell align="left">OrderAt</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => {
              const calc = calcTotalHour(
                row.details[0].startTime,
                row.details[0].endTime
              );

              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:first-of-type": {
                      background: (theme) => theme.palette.primary.main,
                      "& > td, & > th": {
                        color: (theme) => theme.palette.common.white,
                      },
                    },
                  }}
                >
                  <TableCell align="left">
                    {BookingTypesConvert[row.type]}
                  </TableCell>
                  <TableCell align="left">
                    {row.details[0].football.name} (number{" "}
                    {row.details[0].football.number})
                  </TableCell>
                  {isAdmin ? (
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      {row.user.displayName}
                    </TableCell>
                  ) : null}
                  <TableCell align="left">
                    {formatDate(
                      row.details[0].date,
                      "dddd, DD/MM/YYYY",
                      "DD/MM/YYYY"
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    {`${row.details[0].startTime} - ${
                      row.details[0].endTime
                    } = ${`${calc.hours} hour`} ${
                      calc.minutes ? `${calc.minutes + " minutes"}` : ""
                    } `}
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(row.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.details[0].status}
                      color={OrderDetailsStatusColor[row.details[0].status]}
                    />
                  </TableCell>
                  <TableCell align="right">
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
              );
            })
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
