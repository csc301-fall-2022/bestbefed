import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";

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
      <Routes>
        <Route index element={<Register />}/>     
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
