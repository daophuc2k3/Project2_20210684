import { PHONE_REGEX } from "@components/order/DialogBooking";
import Metadata from "@components/shared/Metadata";
import { useAuth } from "@features/auth/authSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import { useMemo, useState } from "react";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchEditUser } from "@features/user/userThunk";
import { isBuffer, isEmpty } from "lodash";
import { fetchCurrentUser } from "@features/auth/authThunk";
import { useUser } from "@features/user/userSlice";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Schema = yup.object({
  email: yup.string().email().nullable().notRequired(),
  phoneNumber: yup.string().matches(PHONE_REGEX, "Phone number invalid.").nullable().notRequired(),
  displayName: yup.string().required("Display name required"),
});

const ProfilePage = () => {
  const { user } = useAuth();
  const { loading } = useUser();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const initialValues = useMemo(() => {
    if (!user) {
      return {
        email: "",
        phoneNumber: "",
        displayName: "",
      };
    }

    return user;
  }, [user]);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: Schema,
    initialValues,
    onSubmit: (values) => {
      dispatch(
        fetchEditUser({
          id: user._id,
          data: {
            email: values.email,
            phoneNumber: values.phoneNumber,
            displayName: values.displayName,
            avatar: file,
          },
        })
      ).then(({ payload }) => {
        if (!isEmpty(payload.error)) return;

        if (file) {
          setFile(null);
        }

        dispatch(fetchCurrentUser());
      });
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <Metadata title={"Profile"} />

      <Grid item xs={12} alignContent={"center"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={file ? URL.createObjectURL(file) : user?.avatar ?? ""}
            sx={{ m: 1, bgcolor: "primary.main", width: 100, height: 100 }}
          />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Avatar
            <VisuallyHiddenInput onChange={(e) => setFile(e.target.files[0])} type="file" />
          </Button>

          <FormikProvider value={formik}>
            <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
              <Box sx={{ mt: 1, maxWidth: 500 }}>
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="off"
                  disabled
                  {...getFieldProps("username")}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />

                <TextField
                  required
                  fullWidth
                  margin="normal"
                  id="displayName"
                  label="Display Name"
                  name="displayName"
                  autoComplete="off"
                  {...getFieldProps("displayName")}
                  error={touched.displayName && Boolean(errors.displayName)}
                  helperText={touched.displayName && errors.displayName}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="off"
                  {...getFieldProps("email")}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="off"
                  {...getFieldProps("phoneNumber")}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />

                <LoadingButton
                  loading={loading}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save change
                </LoadingButton>
              </Box>
            </Form>
          </FormikProvider>
        </Box>
      </Grid>
    </>
  );
};

export default ProfilePage;
