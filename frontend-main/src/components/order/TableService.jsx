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
import { formatDate, formatPrice } from "@utils/format";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const TableService = ({ data, onDelete = (item) => {}, onEdit = (item) => {} }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">CreatedAt</TableCell>
            <TableCell align="right">UpdatedAt</TableCell>
            <TableCell align="right">Actions</TableCell>
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
              <TableCell colSpan={6} align="center">
                Empty product data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableService;
