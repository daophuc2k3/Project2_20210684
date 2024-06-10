// Mui
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";

// Component
import { DRAWER_WIDTH } from "@constant/appbar";
import { UserRoles } from "@constant/user";
import { useAuth } from "@features/auth/authSlice";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { listItemsAdmin, listItemsClient, listItemsCommon } from "./listItems";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const SidebarDashboard = ({ open, toggleDrawer }) => {
  const { user } = useAuth();

  const listItems = useMemo(() => {
    if (!user) return listItemsCommon;

    const { role } = user;

    if (role === UserRoles.admin) return listItemsAdmin;

    return listItemsClient;
  }, [user]);

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      <List component="nav">
        {listItems.map((item, index) => (
          <ListItemButton
            key={index}
            component={NavLink}
            to={item.path}
            sx={{
              "&.active": {
                color: "text.primary",
                bgcolor: "action.selected",
                fontWeight: "fontWeightBold",
              },
            }}
            end="true"
          >
            <ListItemIcon>{item.Icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>

      {user?.role === UserRoles.admin ? (
        <>
          <Divider />

          <List component="nav">
            <ListItemButton>
              <ListItemText
                primary={`For customer`}
                sx={{ "& > span": { fontWeight: 700 } }}
              />
            </ListItemButton>

            {listItemsClient
              .filter((it) => it.isCustomer)
              .map((item, index) => (
                <ListItemButton
                  key={index}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    "&.active": {
                      color: "text.primary",
                      bgcolor: "action.selected",
                      fontWeight: "fontWeightBold",
                    },
                  }}
                  end="true"
                >
                  <ListItemIcon>{item.Icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
          </List>
        </>
      ) : null}
    </Drawer>
  );
};

export default SidebarDashboard;
