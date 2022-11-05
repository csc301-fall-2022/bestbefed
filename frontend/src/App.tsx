import Login from "./Login/Login";
import Register from "./Register/Register";
import { AuthProvider } from "react-auth-kit";

function App() {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
    >
      <main className="App">
        {/* <Register /> */}
        <Login />
      </main>
    </AuthProvider>
  );
}

export default App;
