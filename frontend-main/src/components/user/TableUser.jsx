import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatDate } from "@utils/format";

const TableUser = ({ data, onDelete = (item) => {}, onEdit = (item) => {} }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="left">Display name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">PhoneNumber</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right">CreatedAt</TableCell>
            <TableCell align="right">UpdatedAt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {`#${index + 1}`}
                </TableCell>
                <TableCell align="left">{row.displayName}</TableCell>
                <TableCell align="right">{row.email ?? "No email"}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">{row.phoneNumber ?? "No phone number"}</TableCell>
                <TableCell align="right">{row.role}</TableCell>
                <TableCell align="right">{formatDate(row.createdAt)}</TableCell>
                <TableCell align="right">{formatDate(row.updatedAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Empty customer data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableUser;
