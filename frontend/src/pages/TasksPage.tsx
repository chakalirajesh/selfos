import { useEffect, useState } from "react";
import taskApi from "../api/taskApi";
import MainLayout from "../layouts/MainLayout";

export default function TasksPage() {

    const [tasks, setTasks] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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

            fetchTasks();

        } catch (error) {
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

    console.log("TASKS =", tasks);
    console.log("COUNT =", tasks.length);
    const [editingId, setEditingId] = useState("");

    return (
        <MainLayout>
            <div>

                <h1>Tasks</h1>

                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />

                <input
                    type="text"
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br />

                {editingId ? (
                    <button
                        onClick={updateTask}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Update Task
                    </button>
                ) : (
                    <button
                        onClick={createTask}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Create Task
                    </button>
                )}
                <hr />

                {tasks.map((task) => (
                    <div key={task.id}>

                        <h3>{task.title}</h3>

                        <p>{task.description}</p>

                        <p>{task.status}</p>

                        <button
                            onClick={() => {
                                setEditingId(task.id);
                                setTitle(task.title);
                                setDescription(task.description);
                            }}
                            className="bg-yellow-500 text-white p-2 rounded mr-2"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Delete
                        </button>

                        <hr />

                    </div>
                ))}

            </div>
        </MainLayout>
    );
}