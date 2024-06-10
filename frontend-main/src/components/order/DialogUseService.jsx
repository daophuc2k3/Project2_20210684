import TableProduct from "@components/product/TableProduct";
import { useProduct } from "@features/product/productSlice";
import { fetchAllProduct } from "@features/product/productThunk";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { calcTotalHour, formatDate, formatPrice } from "@utils/format";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

const DialogUseService = ({
  loading,
  data,
  open,
  onClose = () => {},
  onSubmit = (values) => {},
  onAddItem = (item, data) => {},
}) => {
  const { data: products } = useProduct();
  const dispatch = useDispatch();

  const calc = useMemo(
    () => calcTotalHour(data.startTime, data.endTime),
    [data.startTime, data.endTime]
  );

  useEffect(() => {
    dispatch(fetchAllProduct({ limit: 999999999 }));
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {`Use services. Date: ${formatDate(data.date, "dddd, DD/MM/YYYY", "DD/MM/YYYY")}. Time: ${
          data.startTime
        } - ${data.endTime} = ${`${calc.hours} hour`} ${
          calc.minutes ? `${calc.minutes + " minutes"}` : ""
        } `}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={3} borderRight={`1px solid #eee`}>
            <Stack flexDirection={"row"} flexWrap={"wrap"} gap={2}>
              {products.length ? (
                [...products].map((t) => (
                  <Card key={t._id} sx={{ minWidth: 245 }}>
                    <CardMedia sx={{ height: 140 }} image={t.image} title="green iguana" />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {t.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Type: <b>{t.type}</b>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`Price: ${formatPrice(t.price)}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" onClick={() => onAddItem?.(t, data)}>
                        Add
                      </Button>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography>Data is empty</Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={9}>
            <TableProduct fullWidth data={data.services} isUseService />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUseService;
