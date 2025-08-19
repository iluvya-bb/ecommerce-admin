import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API, { API_URL } from "../services/api";

function CategoryForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isFeatured, setIsFeatured] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			const fetchCategory = async () => {
				try {
					const response = await API.getCategory(id);
					const category = response.data.data;
					setName(category.name);
					setDescription(category.description);
					setIsFeatured(category.isFeatured);
					setIsVisible(category.isVisible);
					if (category.images && category.images[0]) {
						setImagePreview(`${API_URL}/${category.images[0].url}`);
					}
				} catch (err) {
					setError("Ангилал татахад алдаа гарлаа.");
				}
			};
			fetchCategory();
		}
	}, [id]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("isFeatured", isFeatured);
		formData.append("isVisible", isVisible);
		if (image) {
			formData.append("images", image); // The backend expects 'images' field from multer
		}

		try {
			if (id) {
				await API.updateCategory(id, formData);
			} else {
				await API.createCategory(formData);
			}
			navigate("/categories");
		} catch (err) {
			setError(`Ангилал ${id ? "шинэчлэхэд" : "үүсгэхэд"} алдаа гарлаа.`);
		}
	};

	const handleRemoveImage = async () => {
		if (!id) return;
		if (window.confirm("Та энэ зургийг устгахдаа итгэлтэй байна уу?")) {
			try {
				await API.deleteCategoryImage(id);
				setImagePreview(null);
				setImage(null);
			} catch (err) {
				setError("Зураг устгахад алдаа гарлаа.");
			}
		}
	};

	return (
		<div>
			<h2 className="mb-4 text-2xl font-bold">
				{id ? "Ангилал засах" : "Ангилал нэмэх"}
			</h2>
			<form
				onSubmit={handleSubmit}
				className="p-8 space-y-6 bg-white rounded-lg shadow-md"
			>
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Нэр
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700"
					>
						Тайлбар
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows="3"
						className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					></textarea>
				</div>
				<div className="flex items-center">
					<input
						id="isFeatured"
						type="checkbox"
						checked={isFeatured}
						onChange={(e) => setIsFeatured(e.target.checked)}
						className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					/>
					<label
						htmlFor="isFeatured"
						className="block ml-2 text-sm text-gray-900"
					>
						Онцлох
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="isVisible"
						type="checkbox"
						checked={isVisible}
						onChange={(e) => setIsVisible(e.target.checked)}
						className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					/>
					<label
						htmlFor="isVisible"
						className="block ml-2 text-sm text-gray-900"
					>
						Харагдах
					</label>
				</div>
				<div>
					<label
						htmlFor="image"
						className="block text-sm font-medium text-gray-700"
					>
						Зураг
					</label>
					<input
						id="image"
						type="file"
						onChange={handleImageChange}
						className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
					{imagePreview && (
						<div className="mt-4">
							<img
								src={imagePreview}
								alt="Image Preview"
								className="object-cover w-40 h-40 rounded-md"
							/>
							<button
								type="button"
								onClick={handleRemoveImage}
								className="mt-2 px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
							>
								Зураг устгах
							</button>
						</div>
					)}
				</div>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<button
					type="submit"
					className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
				>
					{id ? "Ангилал шинэчлэх" : "Ангилал нэмэх"}
				</button>
			</form>
		</div>
	);
}

export default CategoryForm;
