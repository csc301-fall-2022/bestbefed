import {useState, useEffect, useRef, FormEvent} from "react";
import axios from "../../api/axios";
import { useAuthUser } from "react-auth-kit";
import "./profile.css";
import {
    faCarrot,
    faTrashCan,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const PROFILE_URL = "/user/profile/";
function Profile() {

    interface LooseObject {
        [key: string]: any
    }

    const firstRender = () => {
        const populateDataAsync = async () => {
            try {
                const response = await axios.get(
                    PROFILE_URL,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }
                )
                // on succesful request, set data
                setUserData(response.data)
            } catch (err: any) {
                // unsuccessful, update when api becomes available
                if (!err?.response) {
                    setErrorMessage("No Server Response, possible maintanance at work");
                  } 
                  // update when api is available
            }
        }
        
    }
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

    // for initalizing and setting fetching user data
    const [userdata, setUserData] = useState<any>({});
    const auth = useAuthUser();
    
    // for backend and submission validation
    const [errormessage, setErrorMessage] = useState("");
    const [succmessage, setSuccMessage] = useState("");
    const [updated, setUpdated] = useState(false);

    // for front end validaiton and display, update when api becomes available
    const errRef = useRef<null | HTMLInputElement>(null);
    const sucRef = useRef<null | HTMLInputElement>(null);

    // step 1: fetch user data using axios get call
    useEffect(firstRender, [])


    // step 2: prefill "form" data with axios results
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [focusedOnPassword, setPasswordFocus] = useState(false);

    const [mpassword, setMPassword] = useState("");
    const [validMPassword, setValidMPassword] = useState(false);
    const [focusedOnMPassword, setMPasswordFocus] = useState(false);

    const [firstname, setFirstname] = useState(userdata.firstname || "");
    const [validFirstname, setValidFirstname] = useState(false);
    const [focusedOnFirstname, setFirstnameFocus] = useState(false);
  
    const [lastname, setLastname] = useState(userdata.lastname || "");
    const [validLastname, setValidLastname] = useState(false);
    const [focusedOnLastname, setLastnameFocus] = useState(false);
  
    const [email, setEmail] = useState(userdata.email || "");
    const [validEmail, setValidEmail] = useState(false);
    const [focusedOnEmail, setEmailFocus] = useState(false);
  
    const [creditcard, setCc] = useState(userdata.paymentInfo.creditCard || "");
    const [validCc, setValidCc] = useState(false);
    const [focusedOnCc, setCcFocus] = useState(false);
  
    const [exp, setExp] = useState(userdata.paymentInfo.exp || "");
    const [validExp, setValidExp] = useState(false);
    const [focusedOnExp, setExpFocus] = useState(false);
  
    const [cvv, setCvv] = useState(userdata.paymentInfo.cvv || "");
    const [validCvv, setValidCvv] = useState(false);
    const [focusedOnCvv, setCvvFocus] = useState(false);

    // step 3: change and validate user data in "form"
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
      }, [password, mpassword, firstname, lastname, email]);

      useEffect(() => {
        setSuccMessage("");
        setUpdated(false)
      }, [password, mpassword, firstname, lastname, email]);
    


    // make changes to user data using axios patch call on submit, dont forget to record errors or set success ref

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // button hacking check
        const v2 = PWD_REGEX.test(password);
        const v3 = isEmail(email);
        const v4 = FN_REGEX.test(firstname);
        const v5 = LN_REGEX.test(lastname);
        const v6 = ValidateCreditCardNumber(creditcard);
        const v7 = cvvREGEX.test(cvv);
        const v8 = expREGEX.test(exp);
    
        if ((!v2 && (password)) || (!v3 && (email)) || (!v4 && (firstname)) || (!v5 && (lastname)) ||
            (!v6 && (creditcard)) || (!v7 && (cvv)) || (!v8 && (exp))) {
          setErrorMessage("Invalid Entry. Review Input Fields");
          return;
        }

        // handle submission here
        try {
            const request_data: LooseObject = {};
            if (firstname){
                request_data.firstname = firstname;
            }
            if (lastname){
                request_data.lastname = lastname;
            }
            if (email){
                request_data.email = email;
            }
            if (password){
                request_data.password = password;
            }
            if (creditcard){
                request_data.creditcard = creditcard;
            }
            if (cvv){
                request_data.cvv = cvv;
            }
            if (exp){
                request_data.exp = exp;
            }

            await axios.patch(PROFILE_URL, JSON.stringify(request_data), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              });
            
            setUpdated(true);
            setSuccMessage("Profile Updated! Nice to know ya")
            
        } catch (err: any) {
            if (!err?.response) {
                setErrorMessage("No Server Response, possible maintanance at work");
              } 
              // update when api is available
            
        }
    }
    // on success change data in form

    return (
        
        <div className="form-container">
          <section>
            <p ref={errRef} className={errormessage ? "errmsg" : "offscreen"}>
              {errormessage}
            </p>
            <h1>Register </h1>

            <form onSubmit={handleSubmit}>

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
                    ((!validPassword && (password)) || (!validEmail && (email)) ||
                    (!validFirstname && (firstname)) || (!validLastname && (lastname)) ||
                    (!validCc && (creditcard)) || (!validCvv && (cvv)) || (!validExp && (exp)))
                    ? true
                    : false
                }
              >
                {" "}
                Update Profile{" "}
              </button>

              <p ref={sucRef} className={succmessage ? "succmsg" : "offscreen"}>
              {succmessage}
            </p>
            </form>
          </section>
        </div>
      
    );
}


export default Profile;
