import { useEffect, useState } from "react";
import habitApi from "../api/habitApi";
import MainLayout from "../layouts/MainLayout";

export default function HabitsPage() {

    const [habits, setHabits] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

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

                <button onClick={createHabit}>
                    Create Habit
                </button>

                <hr />

                {habits.map((habit) => (
                    <div key={habit.id}>

                        <h3>{habit.name}</h3>

                        <p>{habit.description}</p>

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