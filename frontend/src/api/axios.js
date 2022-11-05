import axios from "axios";

export default axios.create({
  // baseURL: "http://bestbefed-env.eba-gfsfbp2h.us-east-2.elasticbeanstalk.com/",
  baseURL: "http://localhost:8000/",
});
