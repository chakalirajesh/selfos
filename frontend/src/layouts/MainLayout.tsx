import { Link, useLocation } from "react-router-dom";
import {
    FaHome,
    FaTasks,
    FaBullseye,
    FaFolder,
    FaStickyNote,
    FaFire,
    FaSignOutAlt
} from "react-icons/fa";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;

}) {
    const location = useLocation();
    const logout = () => {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    };
    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FaHome />
        },
        {
            name: "Tasks",
            path: "/tasks",
            icon: <FaTasks />
        },
        {
            name: "Goals",
            path: "/goals",
            icon: <FaBullseye />
        },
        {
            name: "Projects",
            path: "/projects",
            icon: <FaFolder />
        },
        {
            name: "Notes",
            path: "/notes",
            icon: <FaStickyNote />
        },
        {
            name: "Habits",
            path: "/habits",
            icon: <FaFire />
        }
    ];

    return (
    <div className="flex min-h-screen">

        {/* Sidebar */}
        <div className="w-64 bg-slate-950 text-white p-6 flex flex-col">

            <div>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold">
                        SelfOS
                    </h1>

                    <p className="text-slate-400 text-sm mt-1">
                        Productivity Platform
                    </p>
                </div>

                <div className="flex flex-col gap-2">

                    {menuItems.map((item) => (

                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-800 text-slate-300"
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>

                    ))}

                </div>

            </div>

            {/* User Profile */}
            <div>

                <div className="bg-slate-800 rounded-xl p-3 mb-4">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                            R
                        </div>

                        <div>
                            <p className="font-semibold">
                                Rajesh
                            </p>

                            <p className="text-xs text-slate-400">
                                SelfOS User
                            </p>
                        </div>

                    </div>

                </div>

                <button
                    onClick={logout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>

        </div>

        {/* Main Content */}
        <div className="flex-1 bg-slate-50 min-h-screen">

            <div className="p-8">
                {children}
            </div>

        </div>

    </div>
);
}