import { useEffect, useState } from "react";
import taskApi from "../api/taskApi";
import MainLayout from "../layouts/MainLayout";
import TaskCard from "../components/tasks/TaskCard";

export default function TasksPage() {

    const [tasks, setTasks] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState("");

    const fetchTasks = async () => {
        try {

            const token = localStorage.getItem("accessToken");

            const response = await taskApi.get("", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTasks(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const createTask = async () => {
        if (!title.trim()) {
            alert("Task title is required");
            return;
        }

        setLoading(true);

        try {

            const token = localStorage.getItem("accessToken");

            await taskApi.post(
                "",
                {
                    title,
                    description,
                    priority: 1,
                    dueDate: "2026-12-31T23:59:59Z"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");
            setDescription("");
            setLoading(false);

            fetchTasks();

        } catch (error) {

            setLoading(false);

            console.error(error);
        }
    };
    const updateTask = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await taskApi.put(
                `/${editingId}`,
                {
                    title,
                    description,
                    priority: 1,
                    status: "TODO",
                    dueDate: "2026-12-31T23:59:59Z"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEditingId("");
            setTitle("");
            setDescription("");

            fetchTasks();

        } catch (error: any) {

            console.log("FULL ERROR", error);

            if (error.response) {
                console.log("STATUS", error.response.status);
                console.log("DATA", error.response.data);
            }
        }
    };
    const deleteTask = async (id: string) => {
        if (!window.confirm("Delete this item?")) {
            return;
        }
        try {

            const token =
                localStorage.getItem("accessToken");

            await taskApi.delete(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchTasks();

        } catch (error) {
            console.error(error);
        }
    };
    return (
        <MainLayout>
            <div className="space-y-8">

                <div className="bg-white p-6 rounded-2xl shadow-lg">

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-blue-600">
                            Tasks
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Manage and track all your tasks.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-blue-300 p-3 rounded-lg w-full mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-blue-300 p-3 rounded-lg w-full mb-3"
                    />

                    <div className="flex gap-2">

                        {editingId ? (
                            <button
                                onClick={updateTask}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Update Task
                            </button>
                        ) : (
                            <button
                                onClick={createTask}
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                {loading ? "Creating..." : "Create Task"}
                            </button>
                        )}

                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId("");
                                    setTitle("");
                                    setDescription("");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={(task) => {
                                    setEditingId(task.id);
                                    setTitle(task.title);
                                    setDescription(task.description);
                                }}
                                onDelete={deleteTask}
                            />
                        ))}

                    </div>

                    {tasks.length === 0 && (
                        <div className="bg-white p-10 rounded-2xl shadow text-center mt-8">

                            <h2 className="text-xl font-bold text-blue-600">
                                No Tasks Yet
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create your first task.
                            </p>

                        </div>
                    )}

                </div>

            </div>
        </MainLayout>
    );
}