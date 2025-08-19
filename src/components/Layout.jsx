import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import API from "../services/api";

function Layout() {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await API.getMe();
				setUser(response.data.data);
			} catch (error) {
				// The interceptor in api.js will handle 401 errors
				console.error("Failed to fetch user", error);
			}
		};

		fetchUser();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<div className="w-64 bg-white shadow-md">
				<div className="p-4 text-2xl font-bold">Админ</div>
				<nav className="mt-5">
					<Link
						to="/"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
					>
						Хяналтын самбар
					</Link>
					<Link
						to="/products"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
					>
						Бүтээгдэхүүн
					</Link>
					<Link
						to="/orders"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
					>
						Захиалга
					</Link>
					<Link
						to="/customers"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
					>
						Хэрэглэгчид
					</Link>
					<Link
						to="/categories"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
					>
						Ангилал
					</Link>
					<Link
						to="/settings"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
					>
						Тохиргоо
					</Link>
				</nav>
				<div className="absolute bottom-0 w-64 p-4">
					<button
						onClick={handleLogout}
						className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
					>
						Гарах
					</button>
				</div>
			</div>
			<div className="flex-1 p-10 overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
