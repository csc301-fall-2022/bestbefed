import { useState, useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const FN_REGEX = /^[A-z][A-z0-9-_]{0,23}$/;
const LN_REGEX = /^[A-z][A-z0-9-_]{0,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const REGISTER_URL = '/register';

function Register() {
    const userRef = useRef<null | HTMLInputElement>(null);
    const errRef = useRef();

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [focusedOnUsername, setUsernameFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [focusedOnPassword, setPasswordFocus] = useState(false)

    const [mpassword, setMPassword] = useState('')
    const [validMPassword, setValidMPassword] = useState(false)
    const [focusedOnMPassword, setMPasswordFocus] = useState(false)

    const [firstname, setFirstname] = useState('')
    const [validFirstname, setValidFirstname] = useState(false)
    const [focusedOnFirstname, setFirstnameFocus] = useState(false)

    const [lastname, setLastname] = useState('')
    const [validLastname, setValidLastname] = useState(false)
    const [focusedOnLastname, setLastnameFocus] = useState(false)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [focusedOnEmail, setEmailFocus] = useState(false)

    const [errormessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState('false')

    useEffect(() => {
      userRef.current?.focus();
    }, [])

    useEffect(() => {
      const result = USER_REGEX.test(username)
      console.log(result)
      console.log(username)
      setValidUsername(result)
    }, [username])

    useEffect(() => {
      const result = PWD_REGEX.test(password)
      console.log(result)
      console.log(password)
      setValidPassword(result)
      const matching = (password === mpassword)
      setValidMPassword(matching)
    }, [password, mpassword])
    return (
      <h1>And hello form the Register page</h1>
    );
  }
  
  export default Register;