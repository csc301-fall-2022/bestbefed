import { useState, useRef, useEffect, FormEvent } from "react";
import {
  faCarrot,
  faTrashCan,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSignIn } from "react-auth-kit";
import "./Login.css";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const LOGIN_URL = "/user/login";

function Login() {
  const userRef = useRef<null | HTMLInputElement>(null);
  const errRef = useRef(null);
  const signIn = useSignIn();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [focusedOnUsername, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [focusedOnPassword, setPasswordFocus] = useState(false);

  // for backend and submission validation
  const [errormessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    console.log(result);
    console.log(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    console.log(result);
    console.log(password);
    setValidPassword(result);
  }, [password]);

  // clearing error message after user change
  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // if button enabled with JS hack
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrorMessage("Invalid Entry. Review Input Fields");
      return;
    }

    // handle submission here
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      // on successful request
      // const s: Boolean = signIn({
      //   token: response.data.token,
      //   expiresIn: response.data.expiresIn,
      //   tokenType: "Bearer",
      //   authState: response.data.authUserState,
      // });
      // console.log("Sign in was: " + s);
      // if (!s) {
      //   // sign in failed
      //   return;
      // }

      // setSuccess(true);
      // setPassword("");
      // setUsername("");
      console.log(username, password);
    } catch (err: any) {
      // if (!err?.response) {
      //   setErrorMessage("No Server Response, possible maintanance at work");
      // } else if (err.response?.status == 404) {
      //   setErrorMessage("Username does not exist");
      // } else if (err.response?.status == 400) {
      //   setErrorMessage("Password is invalid");
      // } else {
      //   setErrorMessage("Login Failed");
      // }
      console.log("err");
    }
  };

  return (
    <>
      {success ? (
        // go to home page here in future
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Home Page</a>
          </p>
        </section>
      ) : (
        <section>
          <p ref={errRef} className={errormessage ? "errmsg" : "offscreen"}>
            {errormessage}
          </p>
          <h1>Login </h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCarrot}
                className={validUsername ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTrashCan}
                className={validUsername || !username ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
            />
            <p
              className={
                focusedOnUsername && username && !validUsername
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <br />
              4 - 24 characters
              <br />
              Begins with a letter. <br />
              Letters, numbers, underscores and hyphens only.
            </p>
            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCarrot}
                className={validPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTrashCan}
                className={validPassword || !password ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              className={
                focusedOnPassword && !validPassword
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <br />
              8 - 24 characters
              <br />
              Includes an uppercase and lowercase letter,
              <br />a letter and a number.
            </p>
            <button disabled={!validUsername || !validPassword ? true : false}>
              {" "}
              Fight Food Waste{" "}
            </button>
            Not a member?
            <br />
            <span className="line">
              <Link to="/register">Sign up here</Link>
            </span>
          </form>
        </section>
      )}
    </>
  );
}

export default Login;
