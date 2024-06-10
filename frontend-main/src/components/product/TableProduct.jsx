import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { formatDate, formatPrice } from "@utils/format";

const TableProduct = ({
  data,
  onDelete = (item) => {},
  onEdit = (item) => {},
  fullWidth = false,
  isUseService = false,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={fullWidth ? { width: "100%" } : { minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Price</TableCell>
            {isUseService ? (
              <>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total Price</TableCell>
              </>
            ) : (
              <>
                <TableCell align="right">CreatedAt</TableCell>
                <TableCell align="right">UpdatedAt</TableCell>
                <TableCell align="right">Actions</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {`#${index + 1}`}
                </TableCell>
                <TableCell align="left">
                  <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
                    <Box
                      component="img"
                      src={row.image}
                      loading="lazy"
                      sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 3 }}
                    />
                    <Typography fontSize={14}>{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{formatPrice(row.price)}</TableCell>
                {isUseService ? (
                  <>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{formatPrice(row.price * row.quantity)}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="right">{formatDate(row.createdAt)}</TableCell>
                    <TableCell align="right">{formatDate(row.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => onEdit?.(row)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete?.(row)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Empty product data
              </TableCell>
            </TableRow>
          )}

          {isUseService && data.length ? (
            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">{data.reduce((t, v) => (t += v.quantity), 0)}</TableCell>
              <TableCell align="right">
                {formatPrice(data.reduce((t, v) => (t += v.quantity * v.price), 0))}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableProduct;
