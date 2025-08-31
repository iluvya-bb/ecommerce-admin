import { useEffect, useState, useRef } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { 
    FaBars, FaTachometerAlt, FaBoxOpen, FaShoppingCart, 
    FaUsers, FaTags, FaCog, FaSignOutAlt, FaUserCircle,
    FaBell, FaSearch, FaChevronDown
} from "react-icons/fa";

const NavLink = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link 
            to={to} 
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-md ${
                isActive 
                ? "text-white bg-gray-900" 
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
        >
            {icon}
            <span className="ml-3">{children}</span>
        </Link>
    );
};

const NavSection = ({ title, children }) => (
    <div>
        <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="px-2 space-y-1">{children}</div>
    </div>
);

function Sidebar({ user, onLogout }) {
    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="p-4 text-2xl font-bold border-b border-gray-700">Админ</div>
            <nav className="flex-1 mt-5 space-y-4">
                <NavSection title="Store">
                    <NavLink to="/" icon={<FaTachometerAlt />}>Хяналтын самбар</NavLink>
                    <NavLink to="/products" icon={<FaBoxOpen />}>Бүтээгдэхүүн</NavLink>
                    <NavLink to="/orders" icon={<FaShoppingCart />}>Захиалга</NavLink>
                    <NavLink to="/customers" icon={<FaUsers />}>Хэрэглэгчид</NavLink>
                    <NavLink to="/categories" icon={<FaTags />}>Ангилал</NavLink>
                    <NavLink to="/contacts" icon={<FaBell />}>Санал хүсэлт</NavLink>
                </NavSection>
                <NavSection title="General">
                    <NavLink to="/settings" icon={<FaCog />}>Тохиргоо</NavLink>
                </NavSection>
            </nav>
        </div>
    );
}

function UserDropdown({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <FaUserCircle className="w-8 h-8 text-gray-500" />
                <span className="hidden font-medium text-gray-700 md:block">{user?.name || "Admin"}</span>
                <FaChevronDown className="hidden w-4 h-4 text-gray-500 md:block" />
            </button>
            {isOpen && (
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {user && (
                            <Link to={`/user/${user.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Профайл
                            </Link>
                        )}
                        <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                            <FaSignOutAlt className="mr-2" /> Гарах
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Layout() {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.getMe();
                setUser(response.data.data);
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            navigate(`/orders?q=${searchTerm.trim()}`);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Static Sidebar for Desktop */}
            <div className="hidden w-64 shadow-lg md:block">
                <Sidebar user={user} onLogout={handleLogout} />
            </div>

            {/* Mobile Sidebar (Overlay) */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 shadow-lg transform md:hidden ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out`}
            >
                <Sidebar user={user} onLogout={handleLogout} />
            </div>

            <div className="flex flex-col flex-1">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 md:hidden">
                            <FaBars className="w-6 h-6" />
                        </button>
                        <div className="relative hidden ml-4 md:block">
                            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search orders..." 
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
                            <FaBell className="w-6 h-6" />
                        </button>
                        <UserDropdown user={user} onLogout={handleLogout} />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 overflow-y-auto md:p-10">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default Layout;