import axios from "axios";

const noteApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/notes",
});

export default noteApi;