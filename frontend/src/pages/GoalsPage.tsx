import { useEffect, useState } from "react";
import goalApi from "../api/goalApi";
import MainLayout from "../layouts/MainLayout";
import GoalCard from "../components/goals/GoalCard";

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

        if (!title.trim()) {
            alert("Goal title is required");
            return;
        }

        if (!description.trim()) {
            alert("Goal description is required");
            return;
        }

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
        if (!title.trim()) {
            alert("Goal title is required");
            return;
        }

        if (!description.trim()) {
            alert("Goal description is required");
            return;
        }

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
        if (!window.confirm("Delete this item?")) {
            return;
        }

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
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">

                    <div className="mb-8">

                        <h1 className="text-4xl font-bold text-green-600">
                            Goals
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Track your goals and achieve your targets.
                        </p>

                    </div>

                    <input
                        type="text"
                        placeholder="Goal Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-green-300 p-3 rounded-lg w-full mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Goal Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-green-300 p-3 rounded-lg w-full mb-3"
                    />
                    <div className="flex gap-2">
                        {editingId ? (
                            <button
                                onClick={updateGoal}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                            >
                                Update Goal
                            </button>
                        ) : (
                            <button
                                onClick={createGoal}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Create Goal
                            </button>
                        )}
                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId("");
                                    setTitle("");
                                    setDescription("");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                        {goals.map((goal) => (

                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onEdit={(selectedGoal) => {
                                    setEditingId(selectedGoal.id);
                                    setTitle(selectedGoal.title);
                                    setDescription(selectedGoal.description);
                                }}
                                onDelete={deleteGoal}
                            />

                        ))}

                    </div>
                    {goals.length === 0 && (

                        <div className="bg-white p-10 rounded-2xl shadow text-center">

                            <h2 className="text-xl font-bold text-green-600">
                                No Goals Yet
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create your first goal.
                            </p>

                        </div>

                    )}
                </div>
            </div>
        </MainLayout>
    );
}