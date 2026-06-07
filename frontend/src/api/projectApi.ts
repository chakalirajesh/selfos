import axios from "axios";

const projectApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/projects",
});

export default projectApi;