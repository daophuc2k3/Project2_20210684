import {
  HideSourceOutlined,
  ShowChartOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
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

const TableCategory = ({
  data,
  onDelete = (item) => {},
  onEdit = (item) => {},
  onUpdateStatus,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Slug</TableCell>
            <TableCell align="right">People quantity</TableCell>
            <TableCell align="right">CreatedAt</TableCell>
            <TableCell align="right">UpdatedAt</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {`#${index + 1}`}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="right">{row.slug}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{formatDate(row.createdAt)}</TableCell>
                <TableCell align="right">{formatDate(row.updatedAt)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit?.(row)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  {row.status === "SHOW" ? (
                    <Tooltip title="Hide">
                      <IconButton
                        onClick={() =>
                          onUpdateStatus({ ...row, status: "HIDE" })
                        }
                      >
                        <VisibilityOff />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Show">
                      <IconButton
                        onClick={() =>
                          onUpdateStatus({ ...row, status: "SHOW" })
                        }
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Empty category data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableCategory;
