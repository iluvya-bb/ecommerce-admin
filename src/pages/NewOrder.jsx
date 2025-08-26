import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

function NewOrder() {
	const [allProducts, setAllProducts] = useState([]);
	const [productToAdd, setProductToAdd] = useState("");
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [contact, setContact] = useState({ name: "", address: "", phone: "", email: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await API.getAllProducts();
				setAllProducts(response.data.data);
				if (response.data.data.length > 0) {
					setProductToAdd(response.data.data[0].id);
				}
			} catch (err) {
				setError("Бүтээгдэхүүн татахад алдаа гарлаа.");
			}
		};
		fetchProducts();
	}, []);

	const handleAddProduct = () => {
		if (!productToAdd) return;

		// Prevent adding the same product twice
		if (selectedProducts.some(p => p.id === parseInt(productToAdd))) {
			return;
		}

		const product = allProducts.find(p => p.id === parseInt(productToAdd));
		setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
	};

	const handleQuantityChange = (productId, quantity) => {
		const updated = selectedProducts.map(p => 
			p.id === productId ? { ...p, quantity: parseInt(quantity, 10) || 1 } : p
		);
		setSelectedProducts(updated);
	};

	const handleRemoveProduct = (productId) => {
		setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
	};

	const handleContactChange = (e) => {
		setContact({ ...contact, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (selectedProducts.length === 0) {
			setError("Please select at least one product.");
			return;
		}

		const orderData = {
			contact,
			items: selectedProducts.map(p => ({
				productId: p.id,
				quantity: p.quantity,
			})),
		};

		try {
			await API.createOrder(orderData);
			navigate("/orders");
		} catch (err) {
			setError("Захиалга үүсгэхэд алдаа гарлаа.");
		}
	};

	return (
		<div>
			<h2 className="mb-5 text-3xl font-bold">Шинэ захиалга үүсгэх</h2>
			<form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white rounded-lg shadow-md">
				{/* Contact Form */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700">Холбоо барих нэр</label>
						<input type="text" name="name" id="name" value={contact.name} onChange={handleContactChange} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
					</div>
					<div>
						<label htmlFor="address" className="block text-sm font-medium text-gray-700">Хаяг</label>
						<input type="text" name="address" id="address" value={contact.address} onChange={handleContactChange} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
					</div>
					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700">Утас</label>
						<input type="text" name="phone" id="phone" value={contact.phone} onChange={handleContactChange} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">И-мэйл</label>
						<input type="email" name="email" id="email" value={contact.email} onChange={handleContactChange} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
					</div>
				</div>

				{/* Product Selector */}
				<div className="flex items-end gap-4">
					<div className="flex-grow">
						<label htmlFor="product-select" className="block text-sm font-medium text-gray-700">Бүтээгдэхүүн сонгох</label>
						<select
							id="product-select"
							value={productToAdd}
							onChange={(e) => setProductToAdd(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md"
						>
							{allProducts.map(p => (
								<option key={p.id} value={p.id}>
									{p.name} ({formatCurrency(p.price)})
								</option>
							))}
						</select>
					</div>
					<button type="button" onClick={handleAddProduct} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
						Нэмэх
					</button>
				</div>

				{/* Selected Products List */}
				{selectedProducts.length > 0 && (
					<div>
						<h3 className="text-xl font-semibold">Сонгогдсон бараанууд</h3>
						{selectedProducts.map(p => (
							<div key={p.id} className="flex items-center justify-between py-2 mt-2 border-b">
								<span>{p.name}</span>
								<div className="flex items-center gap-4">
									<input
										type="number"
										min="1"
										value={p.quantity}
										onChange={(e) => handleQuantityChange(p.id, e.target.value)}
										className="w-20 px-2 py-1 text-center border rounded-md"
									/>
									<button type="button" onClick={() => handleRemoveProduct(p.id)} className="text-red-500 hover:text-red-700">
										Устгах
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{error && <p className="text-sm text-red-600">{error}</p>}
				<button type="submit" className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
					Захиалга үүсгэх
				</button>
			</form>
		</div>
	);
}

export default NewOrder;