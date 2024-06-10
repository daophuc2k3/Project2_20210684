import Metadata from "@components/shared/Metadata";
import TableUser from "@components/user/TableUser";
import { setFilterUser, useUser } from "@features/user/userSlice";
import { fetchAllUser } from "@features/user/userThunk";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const CustomerPage = () => {
  const { filters, loading, data, pagination } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUser({ ...filters, where: "role,client" }));
  }, [filters]);

  const handleChangePage = (_, page) => {
    dispatch(setFilterUser({ ...filters, page }));
  };

  return (
    <>
      <Metadata title="Customer" />

      <Grid item xs={12} sx={{ position: "relative" }}>
        {loading ? (
          <Box sx={{ width: "100%", position: "absolute" }}>
            <LinearProgress />
          </Box>
        ) : null}

        <TableUser data={data} />
      </Grid>

      {pagination.totalPage ? (
        <Grid item xs={12}>
          <Pagination
            count={pagination.totalPage}
            color="primary"
            page={pagination.page}
            onChange={handleChangePage}
          />
        </Grid>
      ) : null}
    </>
  );
};

export default CustomerPage;
