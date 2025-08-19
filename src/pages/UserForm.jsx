import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function UserForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [role, setRole] = useState("user");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await API.getUser(id);
				const user = response.data.data;
				setName(user.name);
				setEmail(user.email);
				setPhone(user.phone || "");
				setRole(user.role);
			} catch (err) {
				setError("Хэрэглэгчийн мэдээллийг татахад алдаа гарлаа.");
			} finally {
				setLoading(false);
			}
		};
		if (id) {
			fetchUser();
		} else {
			setLoading(false); // Should not happen, but handle it
		}
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const userData = { name, email, phone, role };
		if (password) {
			userData.password = password;
		}

		try {
			await API.updateUser(id, userData);
			navigate("/customers");
		} catch (err) {
			setError("Хэрэглэгчийн мэдээллийг шинэчлэхэд алдаа гарлаа.");
		}
	};

	if (loading) {
		return <div>Ачааллаж байна...</div>;
	}

	return (
		<div>
			<h2 className="mb-4 text-2xl font-bold">Хэрэглэгч засах</h2>
			<form
				onSubmit={handleSubmit}
				className="p-8 space-y-6 bg-white rounded-lg shadow-md"
			>
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">Нэр</label>
					<input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm"/>
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">И-мэйл</label>
					<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm"/>
				</div>
				<div>
					<label htmlFor="phone" className="block text-sm font-medium text-gray-700">Утас</label>
					<input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm"/>
				</div>
				<div>
					<label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
					<select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm">
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-700">Шинэ нууц үг (солих бол бөглөнө үү)</label>
					<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm"/>
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}
				<button type="submit" className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
					Хадгалах
				</button>
			</form>
		</div>
	);
}

export default UserForm;
