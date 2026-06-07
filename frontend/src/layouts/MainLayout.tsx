import { Link, useLocation } from "react-router-dom";

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

    return (
        <div className="flex min-h-screen">

            <div className="w-64 bg-gray-900 text-white p-5">

                <h1 className="text-2xl font-bold mb-8">
                    SelfOS
                </h1>

                <div className="flex flex-col gap-4">

                    <Link
                        to="/dashboard"
                        className={
                            location.pathname === "/dashboard"
                                ? "bg-blue-500 p-2 rounded"
                                : "p-2"
                        }
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/tasks"
                        className={
                            location.pathname === "/tasks"
                                ? "bg-blue-500 p-2 rounded"
                                : "p-2"
                        }
                    >
                        Tasks
                    </Link>

                    <Link
                        to="/goals"
                        className={
                            location.pathname === "/goals"
                                ? "bg-blue-500 p-2 rounded"
                                : "p-2"
                        }
                    >
                        Goals
                    </Link>

                    <Link
                        to="/projects"
                        className={
                            location.pathname === "/projects"
                                ? "bg-blue-500 p-2 rounded"
                                : "p-2"
                        }
                    >
                        Projects
                    </Link>

                    <Link
                        to="/notes"
                        className={
                            location.pathname === "/notes"
                                ? "bg-blue-500 p-2 rounded"
                                : "p-2"
                        }
                    >
                        Notes
                    </Link>

                    <Link
                        to="/habits"
                        className={
                            location.pathname === "/habits"
                                ? "bg-blue-500 p-2 rounded"
                                : "p-2"
                        }
                    >
                        Habits
                    </Link>

                    <button
                        onClick={logout}
                        className="mt-8 bg-red-500 text-white p-2 rounded"
                    >
                        Logout
                    </button>

                </div>

            </div>

            <div className="flex-1 p-8 bg-gray-100">
                {children}
            </div>

        </div>
    );
}