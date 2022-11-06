import axios from "axios";

export default axios.create({
  baseURL: process.env.NODE_ENV
    ? "https://bestbefed.ca"
    : "http://localhost:8000",
});
