import CategoryIcon from "@mui/icons-material/Category";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

export const listItemsAdmin = [
  {
    name: "Order",
    path: "/admin/order",
    Icon: <ShoppingCartIcon />,
  },
  {
    name: "Customers",
    path: "/admin/customer",
    Icon: <PeopleIcon />,
  },
  {
    name: "Category",
    path: "/admin/category",
    Icon: <CategoryIcon />,
  },
  {
    name: "Football",
    path: "/admin/football",
    Icon: <SportsSoccerIcon />,
  },
  {
    name: "Product",
    path: "/admin/product",
    Icon: <ProductionQuantityLimitsIcon />,
  },
  {
    name: "Statistics",
    path: "/admin/statistics",
    Icon: <EqualizerIcon />,
  },
];

export const listItemsClient = [
  {
    name: "Order",
    path: "/order",
    Icon: <ShoppingCartIcon />,
  },
  {
    name: "Profile",
    path: "/profile",
    Icon: <PeopleIcon />,
    isCustomer: true,
  },
  {
    name: "Football",
    path: "/football",
    Icon: <SportsSoccerIcon />,
  },
];

export const listItemsCommon = [
  {
    name: "Football",
    path: "/football",
    Icon: <SportsSoccerIcon />,
  },
];
