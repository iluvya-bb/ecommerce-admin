import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import ProductForm from "./pages/ProductForm";
import Categories from "./pages/Categories";
import CategoryForm from "./pages/CategoryForm";
import OrderDetails from "./pages/OrderDetails";
import NewOrder from "./pages/NewOrder";
import Settings from "./pages/Settings";
import UserForm from "./pages/UserForm";
import ContactSubmissions from "./pages/ContactSubmissions";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route
				path="/"
				element={
					<PrivateRoute>
						<Layout />
					</PrivateRoute>
				}
			>
				<Route index element={<Dashboard />} />
				<Route path="products" element={<Products />} />
				<Route path="product/add" element={<ProductForm />} />
				<Route path="product/:id" element={<ProductForm />} />
				<Route path="orders" element={<Orders />} />
				<Route path="orders/new" element={<NewOrder />} />
				<Route path="order/:id" element={<OrderDetails />} />
				<Route path="customers" element={<Customers />} />
				<Route path="categories" element={<Categories />} />
				<Route path="category/add" element={<CategoryForm />} />
				<Route path="category/:id" element={<CategoryForm />} />
				<Route path="user/:id" element={<UserForm />} />
				<Route path="settings" element={<Settings />} />
				<Route path="contacts" element={<ContactSubmissions />} />
			</Route>
		</Routes>
	);
}

export default App;
