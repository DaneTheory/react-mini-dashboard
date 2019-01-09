import axios from "axios";

export default axios.create({
    baseURL: "https://api.unsplash.com",
    headers: {
        Authorization: "Client-ID 5e0aa25c1ee022fab9167053ba44e1a1a201895647bb6961fe3914c1dd3564af"
    }
});
