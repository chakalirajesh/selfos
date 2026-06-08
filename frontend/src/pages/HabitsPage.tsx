import { useEffect, useState } from "react";
import habitApi from "../api/habitApi";
import MainLayout from "../layouts/MainLayout";
import HabitCard from "../components/habits/HabitCard";

export default function HabitsPage() {

    const [habits, setHabits] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState("");

    const fetchHabits = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            const response =
                await habitApi.get("", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            setHabits(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const createHabit = async () => {

        if (!name.trim()) {
            alert("Habit name is required");
            return;
        }

        if (!description.trim()) {
            alert("Habit description is required");
            return;
        }

        try {

            const token =
                localStorage.getItem("accessToken");

            await habitApi.post(
                "",
                {
                    name,
                    description,
                    targetFrequency: 7
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setName("");
            setDescription("");

            fetchHabits();

        } catch (error) {
            console.error(error);
        }
    };
    const updateHabit = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await habitApi.put(
                `/${editingId}`,
                {
                    name,
                    description,
                    targetFrequency: 7,
                    streakCount: 0,
                    status: "ACTIVE"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEditingId("");
            setName("");
            setDescription("");

            fetchHabits();

        } catch (error: any) {

            console.log(error.response?.status);
            console.log(error.response?.data);

        }
    };

    const deleteHabit = async (id: string) => {
        if (!window.confirm("Delete this item?")) {
            return;
        }
        try {

            const token =
                localStorage.getItem("accessToken");

            await habitApi.delete(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchHabits();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold">
                            Habits
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Build consistency and track daily habits.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Habit Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-red-300 p-3 rounded-lg w-full mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-red-300 p-3 rounded-lg w-full mb-3"
                    />

                    <div className="flex gap-2">

                        {editingId ? (
                            <button
                                onClick={updateHabit}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Update Habit
                            </button>
                        ) : (
                            <button
                                onClick={createHabit}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Create Habit
                            </button>
                        )}

                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId("");
                                    setName("");
                                    setDescription("");
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        )}

                    </div>


                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                        {habits.map((habit) => (

                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onEdit={(selectedHabit) => {
                                    setEditingId(selectedHabit.id);
                                    setName(selectedHabit.name);
                                    setDescription(selectedHabit.description);
                                }}
                                onDelete={deleteHabit}
                            />

                        ))}

                    </div>
                    {habits.length === 0 && (

                        <div className="bg-white p-10 rounded-2xl shadow text-center">

                            <h2 className="text-xl font-bold">
                                No Habits Yet
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create your first habit.
                            </p>

                        </div>

                    )}
                </div>
            </div>
        </MainLayout>
    );
}