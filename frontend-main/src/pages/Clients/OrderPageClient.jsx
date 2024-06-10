import DialogSeeDetailsOrder from "@components/order/DialogSeeDetailsOrder";
import TableOrder from "@components/order/TableOrder";
import Metadata from "@components/shared/Metadata";
import { useAuth } from "@features/auth/authSlice";
import { setFilterOrder, useOrder } from "@features/order/orderSlice";
import { fetchAllOrder } from "@features/order/orderThunk";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const OrderPageClient = () => {
  const { pagination, data, filters, loading } = useOrder();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchAllOrder({ ...filters, where: `user,${user._id}`, sort: "createdAt,desc" }));
  }, [filters, user]);

  const handleChangePage = (_, page) => {
    dispatch(setFilterOrder({ ...filters, page }));
  };

  const handleSeeDetails = (item) => {
    setDetails(item);
  };

  return (
    <>
      <Metadata title={"Ordered"} />

      {details ? (
        <DialogSeeDetailsOrder
          open={Boolean(details)}
          data={details}
          onClose={() => setDetails(null)}
        />
      ) : null}

      <Grid item xs={12} sx={{ position: "relative" }}>
        {loading ? (
          <Box sx={{ width: "100%", position: "absolute" }}>
            <LinearProgress />
          </Box>
        ) : null}

        <TableOrder data={data} onSeeDetails={handleSeeDetails} />
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

export default OrderPageClient;
