import DialogAddEditFootball from "@components/football/DialogAddEditFootball";
import TableFootball from "@components/football/TableFootball";
import DialogDelete from "@components/shared/DialogDelete";
import Metadata from "@components/shared/Metadata";
import { useCategory } from "@features/category/categorySlice";
import { fetchAllCategory } from "@features/category/categoryThunk";
import { setFilterFootball, useFootball } from "@features/football/footballSlice";
import {
  fetchAddFootball,
  fetchAllFootball,
  fetchDeleteFootball,
  fetchEditFootball,
} from "@features/football/footballThunk";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const FootballPage = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const { filters, loading, data, pagination } = useFootball();
  const { data: categories } = useCategory();

  useEffect(() => {
    dispatch(fetchAllFootball(filters));
  }, [filters]);

  useEffect(() => {
    dispatch(fetchAllCategory({ limit: 999999999 }));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleChangePage = (_, page) => {
    dispatch(setFilterFootball({ ...filters, page }));
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
      return {
        name: "",
        _id: "",
        price: "",
        category: "",
        thumbNail: null,
        isActive: true,
        status: "available",
        images: null,
        number: "",
      };
    }

    return {
      ...selected,
      category: selected.category._id,
    };
  }, [selected]);

  const handleSubmit = (values) => {
    if (values._id && selected) {
      const cloneSelected = { ...selected };

      const imageDeleted = cloneSelected.images.filter((img) => ![...values.images].includes(img));

      dispatch(fetchEditFootball({ id: values._id, data: { ...values, imageDeleted } })).then(
        (payload) => {
          if (!isEmpty(payload.error)) return;
          setOpen(false);
          setSelected(null);
        }
      );
    } else {
      dispatch(fetchAddFootball(values)).then((payload) => {
        if (!isEmpty(payload.error)) return;
        setOpen(false);
      });
    }
  };

  const handleAgreeDeleteCategory = () => {
    if (!openDelete || !selected) return;

    dispatch(fetchDeleteFootball(selected._id)).then((payload) => {
      if (!isEmpty(payload.error)) return;

      setOpenDelete(false);
      setSelected(null);
      dispatch(fetchAllFootball(filters));
    });
  };

  return (
    <>
      <Metadata title="Football" />

      {open ? (
        <DialogAddEditFootball
          open={open}
          onClose={handleClose}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
          categories={categories}
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
          Add Football
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ position: "relative" }}>
        {loading ? (
          <Box sx={{ width: "100%", position: "absolute" }}>
            <LinearProgress />
          </Box>
        ) : null}

        <TableFootball onEdit={handleOpenEdit} onDelete={handleDelete} data={data} />
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

export default FootballPage;
