import { OrderDetailsStatus, OrderDetailsStatusColor } from "@constant/order";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { calcTotalHour, formatDate, formatPrice } from "@utils/format";
import OptionsAction from "./OptionsAction";

const TableOrderDetails = ({
  data,
  isAdmin = false,
  onCancel = (item) => {},
  onEditChangeTime = (item) => {},
  onPayment = (item) => {},
  onChangeStatus = (item) => {},
  onUseService = (item) => {},
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="left">Football</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Times</TableCell>
            <TableCell align="center">Price</TableCell>
            {isAdmin ? (
              <>
                <TableCell align="right">TotalCost</TableCell>
                <TableCell align="right">ReceivedCost</TableCell>
                <TableCell align="right">ChangeCost</TableCell>
              </>
            ) : null}
            <TableCell align="right">ExtraFee</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => {
              const calc = calcTotalHour(row.startTime, row.endTime);

              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {`#.${index + 1}`}
                  </TableCell>

                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    {`${row.football?.name} (number ${row.football?.number})`}
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {formatDate(row.date, "dddd, DD/MM/YYYY", "DD/MM/YYYY")}
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {`${row.startTime} - ${row.endTime} = ${`${calc.hours} hour`} ${
                      calc.minutes ? `${calc.minutes + " minutes"}` : ""
                    } `}
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {formatPrice(row.football.price)}
                  </TableCell>

                  {isAdmin ? (
                    <>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold", color: (theme) => theme.palette.error.main }}
                      >
                        {formatPrice(
                          !row.totalCost
                            ? row.football.price * calc.totalHours + row.extraFee
                            : row.totalCost
                        )}
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatPrice(row.receivedCost)}
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatPrice(row.changeCost)}
                      </TableCell>
                    </>
                  ) : null}

                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    {formatPrice(row.extraFee)}
                  </TableCell>

                  <TableCell align="center">
                    <Chip label={row.status} color={OrderDetailsStatusColor[row.status]} />
                  </TableCell>

                  <TableCell align="right">
                    {isAdmin ? (
                      <OptionsAction
                        onChangeStatus={() => onChangeStatus?.(row)}
                        onEditChangeTime={() => onEditChangeTime?.(row)}
                        onPayment={() => onPayment?.(row)}
                        onUseService={() => onUseService?.(row)}
                      />
                    ) : (
                      <Tooltip title="Cancel">
                        <IconButton
                          disabled={row.status !== OrderDetailsStatus.new}
                          onClick={() => onCancel?.(row)}
                          color="error"
                        >
                          <DoDisturbIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={isAdmin ? 11 : 7} align="center">
                Empty order details data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableOrderDetails;
