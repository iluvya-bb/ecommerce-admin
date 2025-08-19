import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { formatCurrency } from "../utils/formatCurrency";

function Orders() {
	const [orders, setOrders] = useState([]);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "DESC" });
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const params = {
					page: currentPage,
					limit: 10,
					sortBy: sortConfig.key,
					sortOrder: sortConfig.direction,
					status: statusFilter,
					q: searchTerm, // Assuming backend supports search term `q`
				};
				const response = await API.getAllOrdersAdmin(params);
				setOrders(response.data.data);
				setPagination(response.data.pagination);
			} catch (err) {
				setError("Захиалга татахад алдаа гарлаа.");
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, [currentPage, sortConfig, statusFilter, searchTerm]);

	const handleSort = (key) => {
		let direction = "ASC";
		if (sortConfig.key === key && sortConfig.direction === "ASC") {
			direction = "DESC";
		}
		setSortConfig({ key, direction });
	};

	const SortIcon = ({ columnKey }) => {
		if (sortConfig.key !== columnKey) {
			return <FaSort className="inline-block ml-1 text-gray-400" />;
		}
		return sortConfig.direction === "ASC" ? (
			<FaSortUp className="inline-block ml-1" />
		) : (
			<FaSortDown className="inline-block ml-1" />
		);
	};

	if (loading) return <div>Ачааллаж байна...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-5">
				<h2 className="text-3xl font-bold">Захиалга</h2>
				<Link
					to="/orders/new"
					className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
				>
					Шинэ захиалга
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
				<input
					type="text"
					placeholder="Хайх..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full px-3 py-2 border rounded-md shadow-sm"
				/>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="w-full px-3 py-2 border rounded-md shadow-sm"
				>
					<option value="">Бүх төлөв</option>
					<option value="Awaiting Payment">Төлбөр хүлээгдэж буй</option>
					<option value="Processing">Боловсруулагдаж байна</option>
					<option value="Shipped">Хүргэгдсэн</option>
					<option value="Done">Дууссан</option>
				</select>
			</div>
			<div className="p-5 bg-white rounded-lg shadow-md">
				<table className="w-full">
					<thead>
						<tr className="border-b">
							<th className="p-3 text-left cursor-pointer" onClick={() => handleSort("id")}>
								ID <SortIcon columnKey="id" />
							</th>
							<th className="p-3 text-left">Хэрэглэгч</th>
							<th className="p-3 text-left cursor-pointer" onClick={() => handleSort("createdAt")}>
								Огноо <SortIcon columnKey="createdAt" />
							</th>
							<th className="p-3 text-left">Захиалгын төлөв</th>
							<th className="p-3 text-left">Төлбөрийн төлөв</th>
							<th className="p-3 text-left cursor-pointer" onClick={() => handleSort("total")}>
								Нийт <SortIcon columnKey="total" />
							</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr
								key={order.id}
								className="border-b cursor-pointer hover:bg-gray-50"
								onClick={() => navigate(`/order/${order.id}`)}
							>
								<td className="p-3">#{order.id}</td>
								<td className="p-3">{order.contact ? order.contact.name : "N/A"}</td>
								<td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
								<td className="p-3">
									<span className={`px-2 py-1 rounded-full text-sm ${
										order.status === "Shipped" ? "bg-blue-100 text-blue-800"
										: order.status === "Processing" ? "bg-yellow-100 text-yellow-800"
										: order.status === "Done" ? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
									}`}>
										{order.status}
									</span>
								</td>
								<td className="p-3">
									<span className={`px-2 py-1 rounded-full text-sm ${
										order.paymentRequest?.status === "Paid" ? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
									}`}>
										{order.paymentRequest?.status || "Pending"}
									</span>
								</td>
								<td className="p-3">{formatCurrency(order.total)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{pagination && (
				<div className="flex items-center justify-between mt-4">
					<span className="text-sm text-gray-700">
						Нийт {pagination.total} захиалгын {orders.length}-г харуулж байна
					</span>
					<div>
						<button
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
						>
							Өмнөх
						</button>
						<button
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={currentPage === pagination.pages}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
						>
							Дараах
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Orders;