import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./notFoundPage";
import Layout from "../components/Layout";
import ListingPage from "./listingPage";
import LoginPage from "./loginPage";
import RegistrationPage from "./registrationPage";
import OrderPage from "./orderPage";
import SuccessPage from "./successPage";
import ProductPage from "./productPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ListingPage />,
      },
      { path: "products/:id", element: <ProductPage /> },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "registration",
        element: <RegistrationPage />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "success",
        element: <SuccessPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
