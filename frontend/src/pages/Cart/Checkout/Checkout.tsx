import { useState, useEffect, FormEvent } from "react";
import {
  faCarrot,
  faTrashCan,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../../api/axios";
import "./styles.css";
import { Link } from "react-router-dom";
import validator from "validator";
import Reveiw from "./Review";
const expREGEX = /^[0-9]{2}[/][0-9]{2}$/;
const cvvREGEX = /^[0-9]{3}$/;
const GET_CART_URL = "/user/items";

interface CartItem {
    cart_item_id: number;
    name: string;
    store: string;
    quantity: number;
    price: number;
    inventory_item: number;
    imageUrl: string;
  }

function ValidateCreditCardNumber(ccNum: string) {
  var isValid = false;

  if (validator.isCreditCard(ccNum))
  {
    isValid =true;
  }

  return isValid;
}

function Checkout() {

  const [creditcard, setCc] = useState("");
  const [validCc, setValidCc] = useState(false);
  const [focusedOnCc, setCcFocus] = useState(false);

  const [exp, setExp] = useState("");
  const [validExp, setValidExp] = useState(false);
  const [focusedOnExp, setExpFocus] = useState(false);

  const [cvv, setCvv] = useState("");
  const [validCvv, setValidCvv] = useState(false);
  const [focusedOnCvv, setCvvFocus] = useState(false);

  // for displaying cart items
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  // for validating payment info
  const [errormessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

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
  }, [creditcard, cvv, exp]);


  // fetch cart data
  useEffect(() => {
    const getCartData = async () => {
      const data = await axios.get(GET_CART_URL, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setTotal(data.data.pop());
      // TODO remove the place holder image
      data.data.map((item: CartItem) => {
        item.imageUrl = "https://via.placeholder.com/150";
      });
     setItems(data.data);
    };
    getCartData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // button hacking check
    const v1 = validator.isCreditCard(creditcard)
    const v2 = expREGEX.test(exp)
    const v3 = cvvREGEX.test(cvv)

    if (!v1 || !v2 || !v3) {
      setErrorMessage("Not a valid Credit Card");
      return;
    }

      setSuccess(true);
      // clear input fields here if we want
  };

  return (
    <>
      {success ? (
        // turn into react rlouter link4
        <div className="form-container">
          <section className="sectionf" style={{textAlign: "center"}}>
            <h1>Thanks for your order! Another blow struck against food waste!</h1>
            <p>
              <Link  to="/">Home</Link>
            </p>
          </section>
        </div>
      ) : (


        <div className="form-container">

                <section className="sectionf">
                    <p className={errormessage ? "errmsg" : "offscreen"}>
                    {errormessage}
                    </p>
                    <h3 style={{textAlign: "center"}}>Checkout</h3>

                    <form onSubmit={handleSubmit}>
                    
                    <label htmlFor="creditcard">
                        Credit Card #:
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
                        required
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
                        Expiry Date:
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
                        required
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
                        CVV:
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
                        required
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
                        !validCc || !validCvv || !validExp
                            ? true
                            : false
                        }
                    >
                        {" "}
                        Checkout{" "}
                    </button>
                    </form>

                        <span style={{display: "flex", justifyContent: "space-between"}}>
                            <Link to={"/"}>
                                Return Home
                            </Link>

                            <Link to={"/cart"}>
                                Return to Cart
                            </Link>
                        </span>

                </section>           


                <section className="list-container">
                    <Reveiw items={items} total={total}/>
                </section>

        </div>
      )}
    </>
  );
}

export default Checkout;
