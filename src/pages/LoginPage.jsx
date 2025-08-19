import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await API.login(email, password);
			localStorage.setItem("token", response.data.token);
			navigate("/");
		} catch (err) {
			setError("Нэвтрэхэд алдаа гарлаа. Таны нэр, нууц үг буруу байна.");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center">Нэвтрэх</h2>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							И-мэйл
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Нууц үг
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<button
						type="submit"
						className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
					>
						Нэвтрэх
					</button>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;