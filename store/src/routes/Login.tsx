import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
const back_url="https://mystore-n3gb.onrender.com/"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${back_url}api/login/`, {
                username,
                password,
            });

            login(response.data.token);
            setMessage("Successful login! 🎉");
            navigate("/");
        } catch (error: any) {
            setMessage("Error during login ❌");
            console.error("Login error:", error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded"
                >
                    Login
                </button>

                {message && <p className="mt-4 text-center text-sm">{message}</p>}
            </form>
        </div>
    );
}

export default Login;
