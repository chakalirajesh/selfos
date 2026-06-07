import axios from "axios";

const goalApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/goals",
});

export default goalApi;