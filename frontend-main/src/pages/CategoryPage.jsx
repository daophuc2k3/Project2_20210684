import DialogAddEditCategory from "@components/category/DialogAddEditCategory";
import TableCategory from "@components/category/TableCategory";
import DialogDelete from "@components/shared/DialogDelete";
import Metadata from "@components/shared/Metadata";
import { setFilterCategory, useCategory } from "@features/category/categorySlice";
import {
  fetchAddCategory,
  fetchAllCategory,
  fetchDeleteCategory,
  fetchEditCategory,
} from "@features/category/categoryThunk";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const CategoryPage = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { filters, loading, data, pagination } = useCategory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategory(filters));
  }, [filters]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleChangePage = (_, page) => {
    dispatch(setFilterCategory({ ...filters, page }));
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
      return { name: "", quantity: 0 };
    }

    return {
      ...selected,
      quantity: selected?.quantity ?? 0,
    };
  }, [selected]);

  const handleSubmit = (values) => {
    if (values._id) {
      dispatch(fetchEditCategory({ id: values._id, data: values })).then((payload) => {
        if (!isEmpty(payload.error)) return;

        setOpen(false);
        setSelected(null);
      });
    } else {
      dispatch(fetchAddCategory(values)).then((payload) => {
        if (!isEmpty(payload.error)) return;

        setOpen(false);
      });
    }
  };

  const handleAgreeDeleteCategory = () => {
    if (!openDelete || !selected) return;

    dispatch(fetchDeleteCategory(selected._id)).then((payload) => {
      if (!isEmpty(payload.error)) return;

      setOpenDelete(false);
      setSelected(null);
      dispatch(fetchAllCategory(filters));
    });
  };

  return (
    <>
      <Metadata title="Category" />

      {open ? (
        <DialogAddEditCategory
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
          Add Category
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ position: "relative" }}>
        {loading ? (
          <Box sx={{ width: "100%", position: "absolute" }}>
            <LinearProgress />
          </Box>
        ) : null}

        <TableCategory onEdit={handleOpenEdit} onDelete={handleDelete} data={data} />
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

export default CategoryPage;
