import DialogEditEndTime from "@components/order/DialogEditEndTime";
import DialogSeeDetailsOrder from "@components/order/DialogSeeDetailsOrder";
import TableOrder from "@components/order/TableOrder";
import Metadata from "@components/shared/Metadata";
import { OrderDetailsStatus } from "@constant/order";
import { setFilterOrder, useOrder } from "@features/order/orderSlice";
import {
  fetchAllOrder,
  fetchChangeStatus,
  fetchEditOrderDetails,
} from "@features/order/orderThunk";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import DialogPayment from "@components/order/DialogPayment";
import { toast } from "sonner";
import DialogUseService from "@components/order/DialogUseService";

const OrderPage = () => {
  const { pagination, data, filters, loading, isFetching } = useOrder();
  const dispatch = useDispatch();
  const [details, setDetails] = useState(null);
  const [selectedChangeEdit, setSelectedChangeEdit] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedUseService, setSelectedUseService] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrder({ ...filters, sort: "createdAt,desc" }));
  }, [filters]);

  const handleChangePage = (_, page) => {
    dispatch(setFilterOrder({ ...filters, page }));
  };

  const handleSeeDetails = (item) => {
    setDetails(item);
  };

  const checkOut = (status) => {
    if (status === OrderDetailsStatus.canceled || status === OrderDetailsStatus.finished)
      return true;

    return false;
  };

  const handleChangeStatus = async (item) => {
    if (checkOut(item.status)) return;

    if (item.status === OrderDetailsStatus.processing && !item.totalCost && !item.receivedCost) {
      toast.error("Please payment before finish match!");
      return;
    }

    let { payload } = await dispatch(fetchChangeStatus(item._id));

    if (!isEmpty({ payload }?.error)) return;

    const { payload: payload2 } = await dispatch(
      fetchAllOrder({ ...filters, sort: "createdAt,desc" })
    );

    if (!isEmpty(payload2?.error)) return;

    const cloneSeeDetails = { ...details };

    const order = [...payload2?.metadata].find((t) => t._id === cloneSeeDetails._id);

    console.log(order);

    setDetails(order);
  };

  const handleUseService = (item) => {
    if (checkOut(item.status)) return;

    setSelectedUseService(item);
  };

  const handleOnEditChangeTime = (item) => {
    if (checkOut(item.status)) return;

    setSelectedChangeEdit(item);
  };

  const handleOnPayment = (item) => {
    if (checkOut(item.status)) return;

    if (item.status === OrderDetailsStatus.new) {
      toast.error("Please change status to processing before payment");
      return;
    }

    setSelectedPayment(item);
  };

  const handleSubmitEndTime = async (values) => {
    const fEndTime = values.endTime.toDate();

    let { payload } = await dispatch(
      fetchEditOrderDetails({ data: { endTime: fEndTime }, orderDetailsId: selectedChangeEdit._id })
    );

    if (!isEmpty(payload?.error)) return;

    const { payload: payload2 } = await dispatch(
      fetchAllOrder({ ...filters, sort: "createdAt,desc" })
    );

    if (!isEmpty(payload2?.error)) return;

    const cloneSeeDetails = { ...details };

    setSelectedChangeEdit(null);

    const order = [...payload2?.metadata].find((t) => t._id === cloneSeeDetails._id);

    setDetails(order);
  };

  const handleSubmitPayment = async (values) => {
    const { orderDetailsId, ...orderData } = values;

    let { payload } = await dispatch(
      fetchEditOrderDetails({ data: orderData, orderDetailsId: orderDetailsId })
    );

    if (!isEmpty(payload?.error)) return;

    const { payload: payload2 } = await dispatch(
      fetchAllOrder({ ...filters, sort: "createdAt,desc" })
    );

    if (!isEmpty(payload2?.error)) return;

    const cloneSeeDetails = { ...details };

    setSelectedPayment(null);

    const order = [...payload2?.metadata].find((t) => t._id === cloneSeeDetails._id);

    setDetails(order);
  };

  const handleAddItem = async (item, data) => {
    const cloneProducts = [...data.services];

    if (!cloneProducts.length) {
      cloneProducts.push({ ...item, quantity: 1 });
    } else {
      const index = cloneProducts.findIndex((t) => t._id === item._id);

      if (index === -1) {
        cloneProducts.push({ ...item, quantity: 1 });
      } else {
        cloneProducts[index] = {
          ...cloneProducts[index],
          quantity: cloneProducts[index].quantity + 1,
        };
      }
    }

    const extraFee = cloneProducts.reduce((t, v) => (t += v.quantity * v.price), 0);

    let { payload } = await dispatch(
      fetchEditOrderDetails({
        data: { extraFee, services: cloneProducts },
        orderDetailsId: data._id,
      })
    );

    if (!isEmpty(payload?.error)) return;

    const { payload: payload2 } = await dispatch(
      fetchAllOrder({ ...filters, sort: "createdAt,desc" })
    );

    if (!isEmpty(payload2?.error)) return;

    const cloneSeeDetails = { ...details };

    setSelectedPayment(null);

    const order = [...payload2?.metadata].find((t) => t._id === cloneSeeDetails._id);

    if (!order) return;

    const orderDetails = order.details.find((t) => t._id === data._id);

    if (!orderDetails) return;

    setSelectedUseService(orderDetails);

    setDetails(order);
  };

  return (
    <>
      <Metadata title={"Ordered"} />

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={isFetching}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {Boolean(selectedPayment) ? (
        <DialogPayment
          data={selectedPayment}
          open
          loading={isFetching}
          onClose={() => setSelectedPayment(null)}
          onSubmit={handleSubmitPayment}
        />
      ) : null}

      {Boolean(selectedUseService) ? (
        <DialogUseService
          data={selectedUseService}
          open
          loading={isFetching}
          onClose={() => setSelectedUseService(null)}
          onSubmit={handleSubmitPayment}
          onAddItem={handleAddItem}
        />
      ) : null}

      {Boolean(selectedChangeEdit) ? (
        <DialogEditEndTime
          open
          loading={isFetching}
          initialValues={{ endTime: `${selectedChangeEdit.date} ${selectedChangeEdit.endTime}` }}
          onClose={() => setSelectedChangeEdit(null)}
          onSubmit={handleSubmitEndTime}
          minDate={moment(
            `${selectedChangeEdit.date} ${selectedChangeEdit.startTime}`,
            "DD/MM/YYYY HH:mm"
          ).add("hour", 1)}
        />
      ) : null}

      {details ? (
        <DialogSeeDetailsOrder
          isAdmin
          open={Boolean(details)}
          data={details}
          onClose={() => setDetails(null)}
          onChangeStatus={handleChangeStatus}
          onUseService={handleUseService}
          onEditChangeTime={handleOnEditChangeTime}
          onPayment={handleOnPayment}
        />
      ) : null}

      <Grid item xs={12} sx={{ position: "relative" }}>
        {loading ? (
          <Box sx={{ width: "100%", position: "absolute" }}>
            <LinearProgress />
          </Box>
        ) : null}

        <TableOrder isAdmin data={data} onSeeDetails={handleSeeDetails} />
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

export default OrderPage;
