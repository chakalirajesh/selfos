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

                <button onClick={createTask}>
                    Create Task
                </button>

                <hr />

                {tasks.map((task) => (
                    <div key={task.id}>

                        <h3>{task.title}</h3>

                        <p>{task.description}</p>

                        <p>{task.status}</p>

                        <button
                            onClick={() => deleteTask(task.id)}
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