import { FootballStatus } from "@constant/football";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
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

const TableFootball = ({ data, onDelete = (item) => {}, onEdit = (item) => {} }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Football number</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Active</TableCell>
            <TableCell align="right">CreatedAt</TableCell>
            <TableCell align="right">UpdatedAt</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
                    <Box
                      component="img"
                      src={row.thumbNail}
                      loading="lazy"
                      sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 3 }}
                    />
                    <Typography fontSize={14}>{`${row.name} (số ${row.number})`}</Typography>
                  </Stack>
                </TableCell>

                <TableCell align="right">{row.number}</TableCell>
                <TableCell align="right">{row.category?.name}</TableCell>
                <TableCell align="right">{formatPrice(row.price)}</TableCell>
                <TableCell align="right">
                  <Typography
                    fontSize={14}
                    color={row.status === FootballStatus.available ? "green" : "red"}
                    fontWeight={700}
                  >
                    {row.status}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {row.isActive ? (
                    <Chip label="Yes" color="success" />
                  ) : (
                    <Chip label="No" color="error" />
                  )}
                </TableCell>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                Empty football data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableFootball;
