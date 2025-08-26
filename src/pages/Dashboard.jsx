import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";
import { formatCurrency } from "../utils/formatCurrency";

const StatCard = ({ icon, title, value }) => {
	return (
		<div className="p-5 bg-white rounded-lg shadow-md flex items-center">
			<div className="p-3 mr-4 bg-gray-100 rounded-full">{icon}</div>
			<div>
				<h3 className="font-medium text-gray-500">{title}</h3>
				<p className="text-2xl font-bold">{value}</p>
			</div>
		</div>
	);
};

const Dashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await API.getDashboardStats();
				setStats(response.data.data);
			} catch (err) {
				setError("Failed to fetch dashboard stats.");
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	if (loading) {
		return <div>Ачааллаж байна...</div>;
	}
	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<h2 className="mb-5 text-3xl font-bold">Хяналтын самбар</h2>
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				<StatCard
					icon={<FiDollarSign className="text-green-500" />}
					title="Нийт орлого"
					value={formatCurrency(stats.totalRevenue)}
				/>
				<StatCard
					icon={<FiShoppingCart className="text-blue-500" />}
					title="Нийт захиалга"
					value={stats.totalSales.toLocaleString("en-US")}
				/>
				<StatCard
					icon={<FiUsers className="text-purple-500" />}
					title="Нийт хэрэглэгчид"
					value={stats.totalCustomers.toLocaleString("en-US")}
				/>
			</div>

			<div className="mt-8">
				<h3 className="mb-4 text-2xl font-bold">Сүүлийн захиалгууд</h3>
				<div className="overflow-x-auto bg-white rounded-lg shadow-md">
					<div className="p-5">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="p-3 text-left">Захиалгын дугаар</th>
									<th className="p-3 text-left">Хэрэглэгч</th>
									<th className="p-3 text-left">Огноо</th>
									<th className="p-3 text-left">Төлөв</th>
									<th className="p-3 text-left">Нийт</th>
								</tr>
							</thead>
							<tbody>
								{stats.recentOrders.map((order) => (
									<tr
										key={order.id}
										className="border-b cursor-pointer hover:bg-gray-50"
										onClick={() => navigate(`/order/${order.id}`)}
									>
										<td className="p-3">#{order.id}</td>
										<td className="p-3">{order.contact ? order.contact.name : "N/A"}</td>
										<td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
										<td className="p-3">
											<span
												className={`px-2 py-1 rounded-full text-sm ${
													order.status === "Shipped"
														? "bg-blue-100 text-blue-800"
														: order.status === "Processing"
														? "bg-yellow-100 text-yellow-800"
														: order.status === "Done"
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{order.status}
											</span>
										</td>
										<td className="p-3">{formatCurrency(order.total)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;