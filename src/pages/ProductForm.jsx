import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API, { API_URL } from "../services/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { FaStar, FaTrash } from "react-icons/fa";

function ProductForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState("");
	const [isFeatured, setIsFeatured] = useState(false);
	const [existingImages, setExistingImages] = useState([]);
	const [newImages, setNewImages] = useState([]);
	const [newImagePreviews, setNewImagePreviews] = useState([]);
	const [featuredImage, setFeaturedImage] = useState(null);
	const [allCategories, setAllCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { id } = useParams();

	const quillRef = useRef(null);
	const quillInstance = useRef(null);

	const imageHandler = () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			const file = input.files[0];
			const formData = new FormData();
			formData.append("image", file);

			try {
				const response = await API.uploadEditorImage(formData);
				const imageUrl = `${API_URL}/${response.data.data.url}`;
				const range = quillInstance.current.getSelection(true);
				quillInstance.current.insertEmbed(range.index, "image", imageUrl);
			} catch (err) {
				setError("Зураг хуулахад алдаа гарлаа.");
			}
		};
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const catResponse = await API.getAllCategories();
				const fetchedCategories = catResponse.data.data;

				if (id) {
					const prodResponse = await API.getProduct(id);
					const product = prodResponse.data.data;
					setName(product.name);
					setDescription(product.description || "");
					setPrice(product.price);
					setStock(product.stock);
					setIsFeatured(product.isFeatured);
					setExistingImages(product.images || []);
					setFeaturedImage(product.featuredImage);

					const selected = product.categories || [];
					setSelectedCategories(selected);

					const available = fetchedCategories.filter(
						(c) => !selected.some((s) => s.id === c.id)
					);
					setAllCategories(available);
				} else {
					setAllCategories(fetchedCategories);
				}
			} catch (err) {
				setError("Өгөгдөл татахад алдаа гарлаа.");
			}
		};
		fetchData();
	}, [id]);

	useEffect(() => {
		let quillEditor = null;
		if (quillRef.current) {
			const editorNode = quillRef.current;
			quillInstance.current = new Quill(editorNode, {
				theme: "snow",
				modules: {
					toolbar: {
						container: [
							[{ header: [1, 2, 3, false] }],
							["bold", "italic", "underline", "strike"],
							[{ list: "ordered" }, { list: "bullet" }],
							["link", "image"],
							["clean"],
						],
						handlers: {
							image: imageHandler,
						},
					},
				},
			});
			quillEditor = quillInstance.current;

			quillEditor.on("text-change", () => {
				setDescription(quillEditor.root.innerHTML);
			});

			return () => {
				quillEditor.off("text-change");
				const toolbar = editorNode.parentNode.querySelector('.ql-toolbar');
				if(toolbar) toolbar.remove();
			};
		}
	}, []);

	useEffect(() => {
		if (quillInstance.current && description !== quillInstance.current.root.innerHTML) {
			quillInstance.current.root.innerHTML = description;
		}
	}, [description]);

	const handleSelectCategory = (category) => {
		setSelectedCategories([...selectedCategories, category]);
		setAllCategories(allCategories.filter((c) => c.id !== category.id));
	};

	const handleDeselectCategory = (category) => {
		setAllCategories([...allCategories, category]);
		setSelectedCategories(
			selectedCategories.filter((c) => c.id !== category.id)
		);
	};

	const handleNewImageChange = (e) => {
		const files = Array.from(e.target.files);
		setNewImages(files);

		const previews = files.map(file => URL.createObjectURL(file));
		setNewImagePreviews(previews);
	};

	const handleSetFeaturedImage = async (imageId) => {
		try {
			const response = await API.setFeaturedImage(id, imageId);
			setFeaturedImage(response.data.data.featuredImage);
		} catch (err) {
			setError("Онцлох зураг тохируулахад алдаа гарлаа.");
		}
	};

	const handleDeleteImage = async (imageId) => {
		if (window.confirm("Та энэ зургийг устгахдаа итгэлтэй байна уу?")) {
			try {
				await API.deleteProductImage(id, imageId);
				setExistingImages(existingImages.filter(img => img.id !== imageId));
			} catch (err) {
				setError("Зураг устгахад алдаа гарлаа.");
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("price", price);
		formData.append("stock", stock);
		formData.append("isFeatured", isFeatured);

		const categoryIds = selectedCategories.map((c) => c.id);
		formData.append("categoryIds", JSON.stringify(categoryIds));

		if (newImages.length > 0) {
			newImages.forEach(image => {
				formData.append("images", image);
			});
		}

		try {
			if (id) {
				await API.updateProduct(id, formData);
			} else {
				await API.createProduct(formData);
			}
			navigate("/products");
		} catch (err) {
			setError(`Бүтээгдэхүүн ${id ? "шинэчлэхэд" : "үүсгэхэд"} алдаа гарлаа.`);
		}
	};

	return (
		<div>
			<h2 className="mb-4 text-2xl font-bold">
				{id ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}
			</h2>
			<form
				onSubmit={handleSubmit}
				className="p-8 space-y-6 bg-white rounded-lg shadow-md"
			>
				{/* Form fields for name, description, price, stock, categories */}
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">Нэр</label>
					<input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
				</div>
				<div>
					<label htmlFor="description" className="block text-sm font-medium text-gray-700">Тайлбар</label>
					<div ref={quillRef} style={{ height: "200px" }} className="mt-1 bg-white"></div>
				</div>
				<div>
					<label htmlFor="price" className="block text-sm font-medium text-gray-700">Үнэ</label>
					<input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
				</div>
				<div>
					<label htmlFor="stock" className="block text-sm font-medium text-gray-700">Үлдэгдэл</label>
					<input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
				</div>
				<div>
					<label htmlFor="isFeatured" className="flex items-center text-sm font-medium text-gray-700">
						<input id="isFeatured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 mr-2 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
						Онцлох бүтээгдэхүүн
					</label>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Ангилал</label>
					<div className="grid grid-cols-2 gap-4 mt-2">
						<div>
							<h4 className="text-sm font-semibold">Сонгогдсон ангилалууд</h4>
							<div className="p-2 mt-1 overflow-y-auto border rounded-md h-40">
								{selectedCategories.map((cat) => (
									<div key={cat.id} onClick={() => handleDeselectCategory(cat)} className="px-2 py-1 cursor-pointer hover:bg-gray-100">
										{cat.name}
									</div>
								))}
							</div>
						</div>
						<div>
							<h4 className="text-sm font-semibold">Боломжит ангилалууд</h4>
							<div className="p-2 mt-1 overflow-y-auto border rounded-md h-40">
								{allCategories.map((cat) => (
									<div key={cat.id} onClick={() => handleSelectCategory(cat)} className="px-2 py-1 cursor-pointer hover:bg-gray-100">
										{cat.name}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Image Management Section */}
				<div>
					<label htmlFor="images" className="block text-sm font-medium text-gray-700">Шинэ зураг нэмэх</label>
					<input id="images" name="images" type="file" multiple onChange={handleNewImageChange} className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
				</div>

				{newImagePreviews.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold">Шинэ зургийн урьдчилсан харалт</h4>
						<div className="grid grid-cols-3 gap-4 mt-2">
							{newImagePreviews.map((preview, index) => (
								<img key={index} src={preview} alt="New Preview" className="object-cover w-full h-32 rounded-md"/>
							))}
						</div>
					</div>
				)}

				{id && existingImages.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold">Одоо байгаа зургууд</h4>
						<div className="grid grid-cols-3 gap-4 mt-2">
							{existingImages.map((img) => (
								<div key={img.id} className="relative">
									<img src={`${API_URL}/${img.url}`} alt="Product" className="object-cover w-full h-32 rounded-md"/>
									<button
										type="button"
										onClick={() => handleSetFeaturedImage(img.id)}
										className={`absolute top-2 right-2 p-1 rounded-full ${
											featuredImage === img.url ? "text-yellow-400 bg-gray-800" : "text-gray-400 bg-gray-600"
										}`}
										title="Онцлох зураг болгох"
									>
										<FaStar />
									</button>
									<button
										type="button"
										onClick={() => handleDeleteImage(img.id)}
										className="absolute bottom-2 right-2 p-1 text-white bg-red-600 rounded-full"
										title="Зураг устгах"
									>
										<FaTrash />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{error && <p className="text-sm text-red-600">{error}</p>}
				<button type="submit" className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
					{id ? "Бүтээгдэхүүн шинэчлэх" : "Бүтээгдэхүүн нэмэх"}
				</button>
			</form>
		</div>
	);
}

export default ProductForm;