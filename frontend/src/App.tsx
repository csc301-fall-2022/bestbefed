import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";
import { BrowserRouter } from "react-router-dom";

import Login from "./Login/Login";
import Register from "./Register/Register";

function App() {
  // Need to make <Home /> index and <Register /> have a path of path="/register"
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
