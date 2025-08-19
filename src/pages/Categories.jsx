import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { API_URL } from "../services/api";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ImagePreviewModal from "../components/ImagePreviewModal";

function Categories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const response = await API.getAllCategories();
			setCategories(response.data.data);
		} catch (err) {
			setError("Ангилал татахад алдаа гарлаа.");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Та энэ ангиллыг устгахдаа итгэлтэй байна уу?")) {
			try {
				await API.deleteCategory(id);
				fetchCategories(); // Refresh the list
			} catch (err) {
				setError("Ангилал устгахад алдаа гарлаа.");
			}
		}
	};

	const handleImageClick = (e, imageUrl) => {
		e.stopPropagation();
		setSelectedImage(imageUrl);
	};

	const filteredCategories = categories.filter((category) => {
		const searchTermLower = searchTerm.toLowerCase();
		return (
			category.name.toLowerCase().includes(searchTermLower) ||
			(category.description &&
				category.description.toLowerCase().includes(searchTermLower))
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
				<h2 className="text-2xl font-bold">Ангилал</h2>
				<Link
					to="/category/add"
					className="flex items-center px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
				>
					<FaPlus className="mr-2" />
					Ангилал нэмэх
				</Link>
			</div>
			<div className="mb-4">
				<input
					type="text"
					placeholder="Ангилал хайх..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
				/>
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
								Тайлбар
							</th>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
								Онцлох
							</th>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
								Харагдах
							</th>
							<th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
								Үйлдэл
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{filteredCategories.map((category) => (
							<tr
								key={category.id}
								onClick={() => navigate(`/category/${category.id}`)}
								className="cursor-pointer hover:bg-gray-50"
								style={{ height: "70px" }}
							>
								<td className="px-6 py-4 whitespace-nowrap">
									{category.images && category.images[0] ? (
										<img
											src={`${API_URL}/${category.images[0].url}`}
											alt={category.name}
											className="object-cover cursor-pointer"
											style={{ maxWidth: "50px", maxHeight: "50px" }}
											onClick={(e) =>
												handleImageClick(
													e,
													`${API_URL}/${category.images[0].url}`
												)
											}
										/>
									) : (
										<div
											className="bg-gray-200"
											style={{ width: "50px", height: "50px" }}
										></div>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
								<td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{category.isFeatured ? "Тийм" : "Үгүй"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{category.isVisible ? "Тийм" : "Үгүй"}
								</td>
								<td className="px-6 py-4 text-right whitespace-nowrap">
									<Link
										to={`/category/${category.id}`}
										className="text-indigo-600 hover:text-indigo-900"
									>
										<FaEdit className="inline-block w-5 h-5" />
									</Link>
									<button
										onClick={(e) => {
											e.stopPropagation(); // Prevent row click
											handleDelete(category.id);
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
			<ImagePreviewModal
				imageUrl={selectedImage}
				onClose={() => setSelectedImage(null)}
			/>
		</div>
	);
}

export default Categories;
