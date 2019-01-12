import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8000",
    // baseURL: "http://10.37.63.17:1521",
    headers: {
        Authorization: "Basic YmlsbHlib2I6OThUZUAmNyVmYnhjeSRNSw=="
    }
});
