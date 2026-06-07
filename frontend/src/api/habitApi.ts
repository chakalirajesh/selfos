import axios from "axios";

const habitApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/habits",
});

export default habitApi;