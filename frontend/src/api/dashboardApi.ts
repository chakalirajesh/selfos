import axios from "axios";

const dashboardApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/dashboard",
});

export default dashboardApi;