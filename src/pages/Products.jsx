import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { API_URL } from "../services/api";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { formatCurrency } from "../utils/formatCurrency";

function Products() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await API.getAllProducts({
					params: { categoryId: categoryFilter },
				});
				setProducts(response.data.data);
			} catch (err) {
				setError("Бүтээгдэхүүн татахад алдаа гарлаа.");
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [categoryFilter]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await API.getAllCategories();
				setCategories(response.data.data);
			} catch (err) {
				// Handle error silently for filter
				console.error("Failed to fetch categories for filter");
			}
		};
		fetchCategories();
	}, []);

	const handleDelete = async (id) => {
		if (window.confirm("Та энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?")) {
			try {
				await API.deleteProduct(id);
				// Refetch products
				const response = await API.getAllProducts({
					params: { categoryId: categoryFilter },
				});
				setProducts(response.data.data);
			} catch (err) {
				setError("Бүтээгдэхүүн устгахад алдаа гарлаа.");
			}
		}
	};

	const filteredProducts = products.filter((product) => {
		const searchTermLower = searchTerm.toLowerCase();
		return (
			product.name.toLowerCase().includes(searchTermLower) ||
			product.price.toString().includes(searchTermLower) ||
			product.stock.toString().includes(searchTermLower)
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
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold">Бүтээгдэхүүн</h2>
				<Link
					to="/product/add"
					className="flex items-center px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
				>
					<FaPlus className="mr-2" />
					Бүтээгдэхүүн нэмэх
				</Link>
			</div>
			<div className="mb-4">
				<input
					type="text"
					placeholder="Бүтээгдэхүүн хайх..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			<div className="mb-4">
				<select
					onChange={(e) => setCategoryFilter(e.target.value)}
					value={categoryFilter}
					className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option value="">Бүх ангилал</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</div>
			<div className="overflow-x-auto bg-white rounded-lg shadow">
				<table className="min-w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
								Зураг
							</th>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
								Нэр
							</th>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
								Үнэ
							</th>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
								Үлдэгдэл
							</th>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
								Үйлдэл
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{filteredProducts.map((product) => (
							<tr key={product.id}>
								<td className="px-6 py-4 whitespace-nowrap">
									<img
										src={`${API_URL}/${product.featuredImage || product.images[0]?.url}`}
										alt={product.name}
										className="w-10 h-10 rounded-full"
									/>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{formatCurrency(product.price)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
								<td className="px-6 py-4 text-right whitespace-nowrap">
									<Link
										to={`/product/${product.id}`}
										className="text-indigo-600 hover:text-indigo-900"
									>
										<FaEdit className="inline-block w-5 h-5" />
									</Link>
									<button
										onClick={(e) => {
											e.stopPropagation(); // Prevent row click
											handleDelete(product.id);
										}}
										className="ml-4 text-red-600 hover:text-red-900"
									>
										<FaTrash className="inline-block w-5 h-5" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Products;
