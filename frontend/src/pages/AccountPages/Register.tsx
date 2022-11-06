import { useState, useRef, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  faCarrot,
  faTrashCan,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../api/axios";
import "./styles.css";
import { Link } from "react-router-dom";
import { useIsAuthenticated } from "react-auth-kit";
import isEmail from "validator/lib/isEmail";
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const FN_REGEX = /^[A-z][A-z ]{0,23}$/;
const LN_REGEX = /^[A-z][A-z ]{0,23}$/;
const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
const amexpRegEx = /^(?:3[47][0-9]{13})$/;
const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
const expREGEX = /^[0-9]{2}[/][0-9]{2}$/;
const cvvREGEX = /^[0-9]{3}$/;
const REGISTER_URL = "/user";

function ValidateCreditCardNumber(ccNum: string) {
  var isValid = false;

  if (visaRegEx.test(ccNum)) {
    isValid = true;
  } else if (mastercardRegEx.test(ccNum)) {
    isValid = true;
  } else if (amexpRegEx.test(ccNum)) {
    isValid = true;
  } else if (discovRegEx.test(ccNum)) {
    isValid = true;
  }

  return isValid;
}

function Register() {
  const userRef = useRef<null | HTMLInputElement>(null);
  const errRef = useRef<null | HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [focusedOnUsername, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [focusedOnPassword, setPasswordFocus] = useState(false);

  const [mpassword, setMPassword] = useState("");
  const [validMPassword, setValidMPassword] = useState(false);
  const [focusedOnMPassword, setMPasswordFocus] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [validFirstname, setValidFirstname] = useState(false);
  const [focusedOnFirstname, setFirstnameFocus] = useState(false);

  const [lastname, setLastname] = useState("");
  const [validLastname, setValidLastname] = useState(false);
  const [focusedOnLastname, setLastnameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [focusedOnEmail, setEmailFocus] = useState(false);

  const [creditcard, setCc] = useState("");
  const [validCc, setValidCc] = useState(false);
  const [focusedOnCc, setCcFocus] = useState(false);

  const [exp, setExp] = useState("");
  const [validExp, setValidExp] = useState(false);
  const [focusedOnExp, setExpFocus] = useState(false);

  const [cvv, setCvv] = useState("");
  const [validCvv, setValidCvv] = useState(false);
  const [focusedOnCvv, setCvvFocus] = useState(false);

  // for backend and submission validation
  const [errormessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // For redirection after a successful login
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isAuthenticated()) navigate("/");
  });

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const matching = password === mpassword;
    setValidMPassword(matching);
  }, [password, mpassword]);

  useEffect(() => {
    const result = FN_REGEX.test(firstname);
    setValidFirstname(result);
  }, [firstname]);

  useEffect(() => {
    const result = LN_REGEX.test(lastname);
    setValidLastname(result);
  }, [lastname]);

  useEffect(() => {
    const result = isEmail(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = ValidateCreditCardNumber(creditcard);
    setValidCc(result);
  }, [creditcard]);

  useEffect(() => {
    const result = expREGEX.test(exp);
    setValidExp(result);
  }, [exp]);

  useEffect(() => {
    const result = cvvREGEX.test(cvv);
    setValidCvv(result);
  }, [cvv]);

  // clearing error message after user change
  useEffect(() => {
    setErrorMessage("");
  }, [username, password, mpassword, firstname, lastname, email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // button hacking check
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    const v3 = isEmail(email);
    const v4 = FN_REGEX.test(firstname);
    const v5 = LN_REGEX.test(lastname);

    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      setErrorMessage("Invalid Entry. Review Input Fields");
      return;
    }
    // TODO: handle submission here
    try {
      const request_data = {
        username: username,
        password: password,
        firstName: firstname,
        lastName: lastname,
        email: email,
        paymentInfo: {
          creditCard: creditcard,
          expiryDate: exp,
          cvv: cvv,
        },
      };
      await axios.post(REGISTER_URL, JSON.stringify(request_data), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setSuccess(true);
      // clear input fields here if we want
    } catch (err: any) {
      if (!err?.response) {
        setErrorMessage("No server response, possible maintainance at work");
      } else if (err.response?.status === 400) {
        setErrorMessage("That username is taken");
      } else {
        setErrorMessage("Registration Failed");
      }
      errRef.current?.focus();
    }
  };

  return (
    <>
      {success ? (
        // turn into react rlouter link4
        <div className="form-container">
          <section>
            <h1>Success!</h1>
            <p>
              <Link to="/login">Sign in</Link>
            </p>
          </section>
        </div>
      ) : (
        <div className="form-container">
          <section>
            <p ref={errRef} className={errormessage ? "errmsg" : "offscreen"}>
              {errormessage}
            </p>
            <h1>Register </h1>

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
                <br />a symbol and a number.
              </p>
              <label htmlFor="mpassword">
                Confirm Password:
                <FontAwesomeIcon
                  icon={faCarrot}
                  className={validMPassword && mpassword ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={validMPassword || !mpassword ? "hide" : "invalid"}
                />
              </label>
              <input
                type="password"
                id="mpassword"
                onChange={(e) => setMPassword(e.target.value)}
                required
                onFocus={() => setMPasswordFocus(true)}
                onBlur={() => setMPasswordFocus(false)}
              />
              <p
                className={
                  focusedOnMPassword && !validMPassword
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Passwords do not match.
              </p>
              <label htmlFor="firstname">
                First Name:
                <FontAwesomeIcon
                  icon={faCarrot}
                  className={validFirstname ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={validFirstname || !firstname ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="firstname"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
                required
                onFocus={() => setFirstnameFocus(true)}
                onBlur={() => setFirstnameFocus(false)}
              />
              <p
                className={
                  focusedOnFirstname && !validFirstname
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <br />
                1 - 24 characters
                <br />
                Must begin with a letter
                <br />
                Letters and spaces only
              </p>
              <label htmlFor="lastname">
                Last Name:
                <FontAwesomeIcon
                  icon={faCarrot}
                  className={validLastname ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={validLastname || !lastname ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="lastname"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
                required
                onFocus={() => setLastnameFocus(true)}
                onBlur={() => setLastnameFocus(false)}
              />
              <p
                className={
                  focusedOnLastname && !validLastname
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <br />
                1 - 24 characters
                <br />
                Must begin with a letter
                <br />
                Letters and spaces only
              </p>
              <label htmlFor="eml">
                Email:
                <FontAwesomeIcon
                  icon={faCarrot}
                  className={validEmail ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={validEmail || !email ? "hide" : "invalid"}
                />
              </label>
              <input
                type="email"
                id="eml"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              <p
                className={
                  focusedOnEmail && !validEmail && email
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                "someone@example.com"
              </p>
              <label htmlFor="creditcard">
                Credit Card #: <i>(optional)</i>
                <FontAwesomeIcon
                  icon={faCarrot}
                  className={validCc ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={validCc || !creditcard ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="creditcard"
                onChange={(e) => setCc(e.target.value)}
                value={creditcard}
                onFocus={() => setCcFocus(true)}
                onBlur={() => setCcFocus(false)}
              />
              <p
                className={
                  focusedOnCc && !validCc && creditcard
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Invalid Credit Card Number.
              </p>
              <label htmlFor="exp">
                Expiry Date: <i>(optional)</i>
                <FontAwesomeIcon
                  icon={faCarrot}
                  className={validExp ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={validExp || !exp ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="exp"
                onChange={(e) => setExp(e.target.value)}
                value={exp}
                onFocus={() => setExpFocus(true)}
                onBlur={() => setExpFocus(false)}
              />
              <p
                className={
                  focusedOnExp && !validExp && exp
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Invalid Date. Example: "01/25"
              </p>
              <label htmlFor="cvv">
                CVV: <i>(optional)</i>
                <FontAwesomeIcon
                  icon={faCarrot}
                  className={validCvv ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={validCvv || !cvv ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="cvv"
                onChange={(e) => setCvv(e.target.value)}
                value={cvv}
                onFocus={() => setCvvFocus(true)}
                onBlur={() => setCvvFocus(false)}
              />
              <p
                className={
                  focusedOnCvv && !validCvv && cvv
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Invalid CVV number.
              </p>
              <button
                disabled={
                  !validUsername ||
                  !validPassword ||
                  !validMPassword ||
                  !validLastname ||
                  !validFirstname ||
                  !validEmail
                    ? true
                    : false
                }
              >
                {" "}
                Fight Food Waste{" "}
              </button>
              Already a member?
              <br />
              <span className="line">
                {/*put router link here*/}
                <Link to="/login">Login here</Link>
              </span>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

export default Register;
