import Copyright from "@components/dashboard/Copyright";
import Metadata from "@components/shared/Metadata";
import { useAuth } from "@features/auth/authSlice";
import { fetchSignUp } from "@features/auth/authThunk";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Form, FormikProvider, useFormik } from "formik";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";

const signUpSchema = yup.object({
  displayName: yup.string().min(2).max(150).required("Display name required"),
  username: yup.string().min(2).max(150).required("Username required"),
  password: yup.string().min(4).required("Password required"),
});

export default function SignUpPage() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useAuth();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: signUpSchema,
    initialValues: { displayName: "", username: "", password: "" },
    onSubmit: (values) => {
      dispatch(fetchSignUp(values)).then((payload) => {
        if (!isEmpty(payload.error)) return;

        navigation("/login", { replace: true });
      });
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <Container component="main" maxWidth="xs">
      <Metadata title={"Sign up"} />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <FormikProvider value={formik}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="off"
                    name="displayName"
                    required
                    fullWidth
                    id="displayName"
                    label="Display Name"
                    autoFocus
                    {...getFieldProps("displayName")}
                    error={touched.displayName && Boolean(errors.displayName)}
                    helperText={touched.displayName && errors.displayName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="off"
                    {...getFieldProps("username")}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    id="password"
                    autoComplete="new-password"
                    {...getFieldProps("password")}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>
              </Grid>

              <LoadingButton
                loading={loading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </LoadingButton>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Form>
        </FormikProvider>
      </Box>

      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
