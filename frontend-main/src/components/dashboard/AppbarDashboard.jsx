import DialogDelete from "@components/shared/DialogDelete";
import { DRAWER_WIDTH } from "@constant/appbar";
import { useAuth } from "@features/auth/authSlice";
import { fetchLogout } from "@features/auth/authThunk";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppbarDashboard = ({ toggleDrawer, open }) => {
  const { accessToken, user } = useAuth();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const navigation = useNavigate();

  const handleLogout = () => {
    setShow(true);
  };

  const handleAgreeLogout = () => {
    dispatch(fetchLogout()).then((payload) => {
      if (!isEmpty(payload.error)) return;

      navigation("/login", { replace: true });
    });
  };

  return (
    <AppBar position="absolute" open={open}>
      {show ? (
        <DialogDelete
          title="Logout"
          name={user?.displayName}
          subTitle="Are you sure logout current account?"
          open={show}
          onClose={() => setShow(false)}
          onAgree={handleAgreeLogout}
        />
      ) : null}

      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        {!Boolean(accessToken) ? (
          <Stack sx={{ color: "white" }} flexDirection={"row"} gap={1}>
            <Button component={Link} to="/sign-up" sx={{ color: "white" }}>
              Sign up
            </Button>
            <Button component={Link} to="/login" sx={{ color: "white" }}>
              Login
            </Button>
          </Stack>
        ) : (
          <Stack sx={{ color: "white" }} flexDirection={"row"} gap={1} alignItems={"center"}>
            {user ? (
              <Typography color="inherit" noWrap sx={{ flexGrow: 1 }}>
                {`Hi, ${user?.displayName}`}
              </Typography>
            ) : null}
            <Button
              sx={{ color: "white" }}
              variant="contained"
              onClick={handleLogout}
              color="error"
            >
              Logout
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppbarDashboard;
