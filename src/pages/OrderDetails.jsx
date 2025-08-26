import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { API_URL } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

function OrderDetails() {
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { id } = useParams();
	const navigate = useNavigate();

	const [status, setStatus] = useState("");

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				// Note: We need a getOrder for admin endpoint. Using the user one for now.
				const response = await API.getOrderAdmin(id);
				setOrder(response.data.data);
				setStatus(response.data.data.status);
			} catch (err) {
				setError("Захиалга татахад алдаа гарлаа.");
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [id]);

	const handleStatusUpdate = async () => {
		try {
			await API.updateOrderStatusAdmin(id, status);
			navigate("/orders");
		} catch (err) {
			setError("Төлөв шинэчлэхэд алдаа гарлаа.");
		}
	};

	if (loading) return <div>Ачааллаж байна...</div>;
	if (error) return <div>{error}</div>;
	if (!order) return <div>Захиалга олдсонгүй.</div>;

	return (
		<div>
			<h2 className="mb-5 text-3xl font-bold">Захиалгын дэлгэрэнгүй #{order.id}</h2>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<div className="p-5 bg-white rounded-lg shadow-md">
						<h3 className="mb-4 text-xl font-semibold">Бараанууд</h3>
						<ul>
							{order.products.map((product) => (
								<li key={product.id} className="flex items-center justify-between py-2 border-b">
									<div className="flex items-center">
										<img
											src={`${API_URL}/${product.featuredImage}`}
											alt={product.name}
											className="object-cover w-16 h-16 mr-4 rounded-md"
										/>
										<span>{product.name} (x{product.OrderItem.quantity})</span>
									</div>
									<span>{formatCurrency(product.OrderItem.price * product.OrderItem.quantity)}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div>
					<div className="p-5 bg-white rounded-lg shadow-md">
						<h3 className="mb-4 text-xl font-semibold">Захиалгын мэдээлэл</h3>
						{order.contact && (
							<>
								<p><strong>Холбоо барих нэр:</strong> {order.contact.name}</p>
								<p><strong>И-мэйл:</strong> {order.contact.email}</p>
								<p><strong>Хаяг:</strong> {order.contact.address}</p>
								<p><strong>Утас:</strong> {order.contact.phone}</p>
							</>
						)}
						{order.user && (
							<p className="mt-2"><strong>Бүртгэлтэй хэрэглэгч:</strong> {order.user.email}</p>
						)}
						<p className="mt-4"><strong>Нийт дүн:</strong> {formatCurrency(order.total)}</p>
						<p><strong>НӨАТ (10%):</strong> {formatCurrency(order.vat)}</p>
						
						{order.paymentRequest && (
							<div className="p-4 mt-4 bg-gray-100 rounded-lg">
								<h4 className="font-semibold">Төлбөрийн хүсэлт</h4>
								<p><strong>Төлөв:</strong> {order.paymentRequest.status}</p>
								{order.paymentRequest.status === "Paid" && (
									<>
										<p><strong>Төлбөрийн төрөл:</strong> {order.paymentRequest.paymentType}</p>
										<p><strong>Төлсөн огноо:</strong> {new Date(order.paymentRequest.paidDate).toLocaleString()}</p>
									</>
								)}
							</div>
						)}

						<div className="mt-4">
							<label htmlFor="status" className="block text-sm font-medium text-gray-700">Захиалгын төлөв</label>
							<select
								id="status"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm"
							>
								<option>Awaiting Payment</option>
								<option>Processing</option>
								<option>Shipped</option>
								<option>Done</option>
							</select>
							<button
								onClick={handleStatusUpdate}
								className="w-full px-4 py-2 mt-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
							>
								Төлөв шинэчлэх
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderDetails;
