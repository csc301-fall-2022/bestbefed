import { useState, useRef, useEffect, LegacyRef } from "react";
import { faCarrot, faTrashCan, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Register.css'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const FN_REGEX = /^[A-z][A-z0-9-_]{0,23}$/;
const LN_REGEX = /^[A-z][A-z0-9-_]{0,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
const amexpRegEx = /^(?:3[47][0-9]{13})$/;
const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
const expREGEX = /^[0-9]{4}$/;
const cvvREGEX = /^[0-9]{3}$/;
const REGISTER_URL = '/register';


function ValidateCreditCardNumber(ccNum: string) {
  var isValid = false;

  if (visaRegEx.test(ccNum)) {
    isValid = true;
  } else if(mastercardRegEx.test(ccNum)) {
    isValid = true;
  } else if(amexpRegEx.test(ccNum)) {
    isValid = true;
  } else if(discovRegEx.test(ccNum)) {
    isValid = true;
  }

  return isValid;
}

function Register() {
    const userRef = useRef<null | HTMLInputElement>(null);
    const errRef = useRef(null);

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [focusedOnUsername, setUsernameFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [focusedOnPassword, setPasswordFocus] = useState(false);

    const [mpassword, setMPassword] = useState('');
    const [validMPassword, setValidMPassword] = useState(false);
    const [focusedOnMPassword, setMPasswordFocus] = useState(false);

    const [firstname, setFirstname] = useState('');
    const [validFirstname, setValidFirstname] = useState(false);
    const [focusedOnFirstname, setFirstnameFocus] = useState(false);

    const [lastname, setLastname] = useState('');
    const [validLastname, setValidLastname] = useState(false);
    const [focusedOnLastname, setLastnameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [focusedOnEmail, setEmailFocus] = useState(false);

    const [creditcard, setCc] = useState('');
    const [validCc, setValidCc] = useState(false);
    const [focusedOnCc, setCcFocus] = useState(false);

    const [exp, setExp] = useState('');
    const [validExp, setValidExp] = useState(false);
    const [focusedOnExp, setExpFocus] = useState(false);

    const [cvv, setCvv] = useState('');
    const [validCvv, setValidCvv] = useState(false);
    const [focusedOnCvv, setCvvFocus] = useState(false);

    const [errormessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState('false');

    useEffect(() => {
      userRef.current?.focus();
    }, [])

    useEffect(() => {
      const result = USER_REGEX.test(username)
      console.log(result)
      console.log(username)
      setValidUsername(result)
    }, [username]);

    useEffect(() => {
      const result = PWD_REGEX.test(password)
      console.log(result)
      console.log(password)
      setValidPassword(result)
      const matching = (password === mpassword)
      setValidMPassword(matching)
    }, [password, mpassword]);

    useEffect(() => {
      const result = FN_REGEX.test(firstname);
      console.log(firstname);
      console.log(result);
      setValidFirstname(result)
    }, [firstname])

    useEffect(() => {
      const result = LN_REGEX.test(lastname);
      console.log(lastname);
      console.log(result);
      setValidLastname(result)
    }, [lastname])

    useEffect(() => {
      const result = EMAIL_REGEX.test(email);
      console.log(email);
      console.log(result);
      setValidEmail(result)
    }, [email])

    useEffect(() => {
      const result = ValidateCreditCardNumber(creditcard);
      console.log(creditcard);
      console.log(result);
      setValidCc(result)
    }, [creditcard])

    useEffect(() => {
      const result = expREGEX.test(exp);
      console.log(exp);
      console.log(result);
      setValidCc(result)
    }, [exp])

    useEffect(() => {
      const result = cvvREGEX.test(cvv);
      console.log(cvv);
      console.log(result);
      setValidCc(result)
    }, [cvv])

    // clearing error message after user change
    useEffect(() => {
      setErrorMessage('');
    }, [username, password, mpassword, firstname, lastname, email])

    return (
      <section>
        <p ref={errRef} className={errormessage ? "errmsg" : "offscreen"}>{errormessage}</p>
        <h1>Register </h1>

        <form>
          <label htmlFor="username">
            Username: 
            <FontAwesomeIcon icon={faCarrot} className={validUsername ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTrashCan} className={validUsername || !username ? "hide" : "invalid"} />
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
          <p id="uidnote" className={focusedOnUsername && username && !validUsername ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <br/>
                            4 - 24 characters<br/>
                            Begins with a letter. <br/>
                            Letters, numbers, underscores and hyphens only.
          </p>
        </form>
      </section>
    );
  }


  
  export default Register;