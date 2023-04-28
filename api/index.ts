import axios from "axios";

const ssApi = axios.create({
	baseURL: "/api",
});

export default ssApi;
