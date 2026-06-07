import axios from "axios";

const taskApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/tasks",
});

export default taskApi;