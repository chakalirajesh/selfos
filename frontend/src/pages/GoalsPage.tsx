import { useEffect, useState } from "react";
import goalApi from "../api/goalApi";
import MainLayout from "../layouts/MainLayout";

export default function GoalsPage() {

    const [goals, setGoals] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState("");

    const fetchGoals = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            const response =
                await goalApi.get("", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            setGoals(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const createGoal = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await goalApi.post(
                "",
                {
                    title,
                    description,
                    targetDate: "2026-12-31T23:59:59Z"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");
            setDescription("");

            fetchGoals();

        } catch (error) {
            console.error(error);
        }
    };
    const updateGoal = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await goalApi.put(
                `/${editingId}`,
                {
                    title,
                    description,
                    targetDate: "2026-12-31T23:59:59Z",
                    progress: 0,
                    status: "NOT_STARTED"
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

            fetchGoals();

        } catch (error: any) {

            console.log("STATUS", error.response?.status);
            console.log("DATA", error.response?.data);

        }
    };
    const deleteGoal = async (id: string) => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await goalApi.delete(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchGoals();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div>

                <h1>Goals</h1>

                <input
                    type="text"
                    placeholder="Goal Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />

                <input
                    type="text"
                    placeholder="Goal Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br />

                {editingId ? (
                    <button
                        onClick={updateGoal}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Update Goal
                    </button>
                ) : (
                    <button
                        onClick={createGoal}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Create Goal
                    </button>
                )}

                <hr />

                {goals.map((goal) => (
                    <div key={goal.id}>

                        <h3>{goal.title}</h3>

                        <p>{goal.description}</p>

                        <hr />
                        <button
                            onClick={() => {
                                setEditingId(goal.id);
                                setTitle(goal.title);
                                setDescription(goal.description);
                            }}
                            className="bg-yellow-500 text-white p-2 rounded mr-2"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteGoal(goal.id)}
                        >
                            Delete
                        </button>

                    </div>
                ))}

            </div>
        </MainLayout>
    );
}