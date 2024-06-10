import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "@features/category/categorySlice";
import productReducer from "@features/product/productSlice";
import footballReducer from "@features/football/footballSlice";
import authReducer from "@features/auth/authSlice";
import orderReducer from "@features/order/orderSlice";
import userReducer from "@features/user/userSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    football: footballReducer,
    auth: authReducer,
    order: orderReducer,
    user: userReducer,
  },
});
