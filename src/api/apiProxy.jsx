import axios from "axios";

let baseURL = "http://no_env_defined:8000";

if (process.env.NODE_ENV === "production") {
    baseURL = "http://10.37.63.17:1521";
} else if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8000";
}
export default axios.create({
    baseURL: baseURL,
    // baseURL: "http://10.37.63.17:1521",
    headers: {
        Authorization: "Basic YmlsbHlib2I6OThUZUAmNyVmYnhjeSRNSw=="
    }
});
