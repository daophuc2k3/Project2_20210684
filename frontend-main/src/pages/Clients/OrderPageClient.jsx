import DialogSeeDetailsOrder from "@components/order/DialogSeeDetailsOrder";
import TableOrder from "@components/order/TableOrder";
import DialogDelete from "@components/shared/DialogDelete";
import Metadata from "@components/shared/Metadata";
import { useAuth } from "@features/auth/authSlice";
import { setFilterOrder, useOrder } from "@features/order/orderSlice";
import { cancelOrderDetails, fetchAllOrder } from "@features/order/orderThunk";
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
  const [openCancel, setOpenCancel] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    if (!user) return;

    fetchData();
  }, [filters, user]);

  const fetchData = () => {
    dispatch(
      fetchAllOrder({
        ...filters,
        where: `user,${user._id}`,
        sort: "createdAt,desc",
      })
    );
  };

  const handleChangePage = (_, page) => {
    dispatch(setFilterOrder({ ...filters, page }));
  };

  const handleSeeDetails = (item) => {
    setDetails(item);
  };

  const handleCancel = () => {
    if (!details?.details?.length) return;

    dispatch(cancelOrderDetails(orderDetail._id)).then(({ payload }) => {
      if (payload?.metadata?._id) {
        const { metadata } = payload;
        const oldDetails = [...details?.details];

        const index = oldDetails.findIndex((t) => t._id === metadata._id);

        if (index === -1) return;

        console.log(index, oldDetails[index]);

        console.log(`metadata.status`, metadata.status);

        oldDetails[index] = {
          ...oldDetails[index],
          status: metadata.status,
        };

        setDetails((prev) => ({ ...prev, details: oldDetails }));
        onCloseDialogCancel();
      }
    });
  };

  const onCloseDialogCancel = () => {
    setOpenCancel(false);
  };

  const onCancelClick = (orderDetail) => {
    setOrderDetail(orderDetail);
    setOpenCancel(true);
  };

  return (
    <>
      <Metadata title={"Ordered"} />

      {details ? (
        <DialogSeeDetailsOrder
          open={Boolean(details)}
          data={details}
          onClose={() => {
            setDetails(null);
            fetchData();
          }}
          onCancel={onCancelClick}
        />
      ) : null}

      {openCancel && orderDetail ? (
        <DialogDelete
          open={openCancel && Boolean(details)}
          onClose={onCloseDialogCancel}
          onAgree={handleCancel}
          loading={loading}
          title="Cancel booking"
          subTitle="Are you sure you want to cancel?"
          name={details._id}
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
