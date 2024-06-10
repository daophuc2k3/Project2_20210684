import { useState } from "react";
import { Outlet } from "react-router-dom";

// Mui
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";

// Component
import AppbarDashboard from "@components/dashboard/AppbarDashboard";
import Copyright from "@components/dashboard/Copyright";
import SidebarDashboard from "@components/dashboard/SidebarDashboard";
import { useAuth } from "@features/auth/authSlice";

const RootLayout = () => {
  const [open, setOpen] = useState(true);
  const { loading } = useAuth();

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  // if (loading) {
  //   return (
  //     <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
  //       <CircularProgress color="inherit" />
  //     </Backdrop>
  //   );
  // }

  return (
    <Box sx={{ display: "flex" }}>
      <AppbarDashboard toggleDrawer={toggleDrawer} open={open} />

      <SidebarDashboard open={open} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Outlet />
          </Grid>

          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
};

export default RootLayout;
