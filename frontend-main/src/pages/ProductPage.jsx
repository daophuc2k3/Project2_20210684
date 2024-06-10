import DialogAddEditProduct from "@components/product/DialogAddEditProduct";
import TableProduct from "@components/product/TableProduct";
import DialogDelete from "@components/shared/DialogDelete";
import Metadata from "@components/shared/Metadata";
import { setFilterProduct, useProduct } from "@features/product/productSlice";
import {
  fetchAddProduct,
  fetchAllProduct,
  fetchDeleteProduct,
  fetchEditProduct,
} from "@features/product/productThunk";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const ProductPage = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { filters, loading, data, pagination } = useProduct();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProduct(filters));
  }, [filters]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleChangePage = (_, page) => {
    dispatch(setFilterProduct({ ...filters, page }));
  };

  const handleCloseDialogDeleteCategory = () => {
    setSelected(null);
    setOpenDelete(false);
  };

  const handleOpenEdit = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const handleDelete = (item) => {
    setSelected(item);
    setOpenDelete(true);
  };

  const initialValues = useMemo(() => {
    if (!selected) {
      return { name: "", _id: "", price: "", type: "", image: null };
    }

    return selected;
  }, [selected]);

  const handleSubmit = (values) => {
    if (values._id) {
      dispatch(fetchEditProduct({ id: values._id, data: values })).then((payload) => {
        if (!isEmpty(payload.error)) return;
        setOpen(false);
        setSelected(null);
      });
    } else {
      dispatch(fetchAddProduct(values)).then((payload) => {
        if (!isEmpty(payload.error)) return;
        setOpen(false);
      });
    }
  };

  const handleAgreeDeleteCategory = () => {
    if (!openDelete || !selected) return;

    dispatch(fetchDeleteProduct(selected._id)).then((payload) => {
      if (!isEmpty(payload.error)) return;

      setOpenDelete(false);
      setSelected(null);
      dispatch(fetchAllProduct(filters));
    });
  };

  return (
    <>
      <Metadata title="Product" />

      {open ? (
        <DialogAddEditProduct
          open={open}
          onClose={handleClose}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
        />
      ) : null}

      {openDelete && selected ? (
        <DialogDelete
          open={openDelete && Boolean(selected)}
          onClose={handleCloseDialogDeleteCategory}
          name={selected?.name}
          onAgree={handleAgreeDeleteCategory}
          loading={loading}
        />
      ) : null}

      <Grid item xs={12}>
        <Button startIcon={<AddIcon />} onClick={handleClickOpen} variant="contained">
          Add Product
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ position: "relative" }}>
        {loading ? (
          <Box sx={{ width: "100%", position: "absolute" }}>
            <LinearProgress />
          </Box>
        ) : null}

        <TableProduct onEdit={handleOpenEdit} onDelete={handleDelete} data={data} />
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

export default ProductPage;
