import React from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import { Login, Logout, Register } from "./pages/AccountPages";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import Storefront from "./pages/Storefront/Storefront";

function App() {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"auth_token"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
    >
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <RequireAuth loginPath="/login">
                <Outlet />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/store/:id" element={<Storefront />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
