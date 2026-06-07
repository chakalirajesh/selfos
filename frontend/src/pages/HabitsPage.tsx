import { useEffect, useState } from "react";
import habitApi from "../api/habitApi";
import MainLayout from "../layouts/MainLayout";

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
            <div>

                <h1>Habits</h1>

                <input
                    type="text"
                    placeholder="Habit Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <br />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br />

                {editingId ? (
                    <button
                        onClick={updateHabit}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Update Habit
                    </button>
                ) : (
                    <button
                        onClick={createHabit}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Create Habit
                    </button>
                )}

                <hr />

                {habits.map((habit) => (
                    <div key={habit.id}>

                        <h3>{habit.name}</h3>

                        <p>{habit.description}</p>
                        <button
                            onClick={() => {
                                setEditingId(habit.id);
                                setName(habit.name);
                                setDescription(habit.description);
                            }}
                            className="bg-yellow-500 text-white p-2 rounded mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteHabit(habit.id)}
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