import FootballCard from "@components/football/FootballCard";
import DialogBooking from "@components/order/DialogBooking";
import Metadata from "@components/shared/Metadata";
import { useAuth } from "@features/auth/authSlice";
import { useCategory } from "@features/category/categorySlice";
import { fetchAllCategory } from "@features/category/categoryThunk";
import { setFilterFootball, useFootball } from "@features/football/footballSlice";
import { fetchAllFootball } from "@features/football/footballThunk";
import { useOrder } from "@features/order/orderSlice";
import { fetchAddOrder } from "@features/order/orderThunk";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Box from "@mui/material/Box";

const FootballPageClient = () => {
  const { data: categories } = useCategory();
  const { filters, data: footballs, pagination } = useFootball();
  const [openBooking, setOpenBooking] = useState(false);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();
  const { loading } = useOrder();

  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const currentDate = new Date();
  const maxYear = currentDate.getFullYear();

  useEffect(() => {
    dispatch(fetchAllCategory({ limit: 9999999 }));
  }, []);

  useEffect(() => {
    dispatch(fetchAllFootball({ ...filters, limit: 10, sort: "category,asc" }));
  }, [filters]);

  const handleOnBookingNow = (item) => {
    if (!user) {
      toast.error("Login required!");
      return;
    }
    setSelected(item);
    setOpenBooking(true);
  };

  const handleCloseOpenBooking = () => {
    setSelected(null);
    setOpenBooking(false);
  };

  const initialValues = useMemo(() => {
    if (!user) {
      return { user: "", phoneNumber: "", type: "" };
    }

    return { user: user.displayName, phoneNumber: user.phoneNumber ?? "", type: "" };
  }, [user]);

  const handleOnSubmitBooking = (values) => {
    // console.log(`values`, values);
    dispatch(fetchAddOrder({ ...values, user: user._id })).then(({ payload }) => {
      if (!isEmpty(payload.error)) return;

      navigate("/order");
      setOpenBooking(false);
      setSelected(null);
    });
  };

  const handleChangePage = (_, page) => {
    dispatch(setFilterFootball({ ...filters, page }));
  };

  return (
    <>
      <Metadata title={"Home"} />

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {openBooking && selected ? (
        <DialogBooking
          open={openBooking}
          onClose={handleCloseOpenBooking}
          item={selected}
          initialValues={initialValues}
          onSubmit={handleOnSubmitBooking}
        />
      ) : null}

      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Category"
            variant="outlined"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);

              if (!e.target.value) {
                dispatch(
                  setFilterFootball({
                    limit: filters.limit,
                    page: 1,
                  })
                );

                return;
              }

              dispatch(
                setFilterFootball({
                  ...filters,
                  where: `category,${e.target.value}`,
                })
              );
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories?.map((item) => (
              <MenuItem value={item?._id}>{item?.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* <Grid item xs={2.5}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Booking type</InputLabel>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Booking type"
            variant="outlined"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={BookingTypes.day}>Booking by day</MenuItem>
            <MenuItem value={BookingTypes.month}>Booking by month</MenuItem>
            <MenuItem value={BookingTypes.year}>Booking by year</MenuItem>
          </Select>
        </FormControl>
      </Grid> */}

      <Grid item xs={12}>
        <Grid container spacing={1}>
          {footballs.length ? (
            footballs.map((item, index) =>
              item.isActive ? (
                <FootballCard
                  onBookingNow={handleOnBookingNow}
                  key={index}
                  item={item}
                  images={item.images}
                />
              ) : null
            )
          ) : (
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Typography sx={{ fontWeight: "bold", color: (theme) => theme.palette.error.main }}>
                Empty data
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {pagination.totalPage ? (
          <Pagination
            count={pagination.totalPage}
            color="primary"
            page={pagination.page}
            onChange={handleChangePage}
          />
        ) : null}
      </Grid>
    </>
  );
};

export default FootballPageClient;
