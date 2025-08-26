import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import API, { API_URL } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

function Products() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// State for filter inputs
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [orderBy, setOrderBy] = useState("name");
	const [order, setOrder] = useState("ASC");
	const [draggedOverProductId, setDraggedOverProductId] = useState(null);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const params = {
				categoryId: categoryFilter,
				q: searchTerm,
				orderBy,
				order,
			};

			if (minPrice) params.minPrice = minPrice;
			if (maxPrice) params.maxPrice = maxPrice;

			const response = await API.getAllProducts(params);
			setProducts(response.data.data);
		} catch (err) {
			setError("Бүтээгдэхүүн татахад алдаа гарлаа.");
		} finally {
			setLoading(false);
		}
	};

	const handleDragOver = (e, productId) => {
		e.preventDefault();
		setDraggedOverProductId(productId);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setDraggedOverProductId(null);
	};

	const handleDrop = async (e, productId) => {
		e.preventDefault();
		setDraggedOverProductId(null);
		const files = Array.from(e.dataTransfer.files);
		if (files.length === 0) return;

		const formData = new FormData();
		files.forEach((file) => {
			formData.append("images", file);
		});

		try {
			await API.updateProduct(productId, formData);
			fetchProducts(); // Refresh the list
		} catch (err) {
			setError("Зураг хуулахад алдаа гарлаа.");
		}
	};

	// Fetch products on initial component mount
	useEffect(() => {
		fetchProducts();
	}, []);

	// Fetch categories for the filter dropdown
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await API.getAllCategories();
				setCategories(response.data.data);
			} catch (err) {
				console.error("Failed to fetch categories for filter");
			}
		};
		fetchCategories();
	}, []);

	const handleApplyFilters = () => {
		fetchProducts();
	};

	const handleDelete = async (id) => {
		if (window.confirm("Та энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?")) {
			try {
				await API.deleteProduct(id);
				fetchProducts(); // Refetch products with current filters after delete
			} catch (err) {
				setError("Бүтээгдэхүүн устгахад алдаа гарлаа.");
			}
		}
	};

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
			<div className="p-4 mb-4 bg-gray-100 rounded-lg">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
					<input
						type="text"
						placeholder="Бүтээгдэхүүн хайх..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full col-span-full sm:col-span-2 lg:col-span-2 px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
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
					<input
						type="number"
						placeholder="Min price"
						value={minPrice}
						onChange={(e) => setMinPrice(e.target.value)}
						className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
					<input
						type="number"
						placeholder="Max price"
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
						className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
					<select
						onChange={(e) => setOrderBy(e.target.value)}
						value={orderBy}
						className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="name">Name</option>
						<option value="price">Price</option>
						<option value="stock">Stock</option>
					</select>
					<select
						onChange={(e) => setOrder(e.target.value)}
						value={order}
						className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="ASC">ASC</option>
						<option value="DESC">DESC</option>
					</select>
				</div>
				<div className="flex justify-end mt-4">
					<button
						onClick={handleApplyFilters}
						className="w-full sm:w-auto px-6 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
					>
						Apply Filters
					</button>
				</div>
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
						{products.map((product) => (
							<tr
								key={product.id}
								onDragOver={(e) => handleDragOver(e, product.id)}
								onDragLeave={(e) => handleDragLeave(e)}
								onDrop={(e) => handleDrop(e, product.id)}
								className={`${
									draggedOverProductId === product.id ? "bg-blue-100" : ""
								}`}
							>
								<td className="px-6 py-4 whitespace-nowrap">
									{(product.featuredImage || product.images?.[0]?.url) ? (
										<img
											src={`${API_URL}/${product.featuredImage || product.images[0].url}`}
											alt={product.name}
											className="w-10 h-10 rounded-full"
										/>
									) : (
										<div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
											<span className="text-xs text-gray-500">No Img</span>
										</div>
									)}
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
										onClick={() => handleDelete(product.id)}
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