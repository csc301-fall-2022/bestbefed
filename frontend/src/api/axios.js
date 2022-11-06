import axios from "axios";

export default axios.create({
  baseURL: process.env.PRODUCTION
    ? "https://app.bestbefed.ca"
    : "http://localhost:8000",
});
