import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaEdit } from "react-icons/fa";

const Customers = () => {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCustomers = async () => {
			try {
				const response = await API.getUsers();
				setCustomers(response.data.data);
			} catch (err) {
				setError("Хэрэглэгчдийг татахад алдаа гарлаа.");
			} finally {
				setLoading(false);
			}
		};
		fetchCustomers();
	}, []);

	const handleRowClick = (id) => {
		navigate(`/user/${id}`);
	};

	const filteredCustomers = customers.filter((customer) => {
		const searchTermLower = searchTerm.toLowerCase();
		return (
			customer.name.toLowerCase().includes(searchTermLower) ||
			customer.email.toLowerCase().includes(searchTermLower) ||
			(customer.phone && customer.phone.toLowerCase().includes(searchTermLower))
		);
	});

	if (loading) {
		return <div>Ачааллаж байна...</div>;
	}
	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<h2 className="mb-5 text-3xl font-bold">Хэрэглэгчид</h2>
			<div className="mb-4">
				<input
					type="text"
					placeholder="Хэрэглэгч хайх..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			<div className="p-5 bg-white rounded-lg shadow-md">
				<table className="w-full">
					<thead>
						<tr className="border-b">
							<th className="p-3 text-left">Нэр</th>
							<th className="p-3 text-left">И-мэйл</th>
							<th className="p-3 text-left">Утас</th>
							<th className="p-3 text-left">Role</th>
							<th className="p-3 text-right">Үйлдэл</th>
						</tr>
					</thead>
					<tbody>
						{filteredCustomers.map((customer) => (
							<tr
								key={customer.id}
								className="border-b cursor-pointer hover:bg-gray-50"
								onClick={() => handleRowClick(customer.id)}
							>
								<td className="p-3">{customer.name}</td>
								<td className="p-3">{customer.email}</td>
								<td className="p-3">{customer.phone || "N/A"}</td>
								<td className="p-3">{customer.role}</td>
								<td className="p-3 text-right">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleRowClick(customer.id);
										}}
										className="text-indigo-600 hover:text-indigo-900"
									>
										<FaEdit className="inline-block w-5 h-5" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Customers;
