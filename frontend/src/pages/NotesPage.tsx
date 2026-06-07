import { useEffect, useState } from "react";
import noteApi from "../api/noteApi";
import MainLayout from "../layouts/MainLayout";

export default function NotesPage() {

    const [notes, setNotes] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchNotes = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            const response =
                await noteApi.get("", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            setNotes(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const createNote = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await noteApi.post(
                "",
                {
                    title,
                    content
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");
            setContent("");

            fetchNotes();

        } catch (error) {
            console.error(error);
        }
    };

    const deleteNote = async (id: string) => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await noteApi.delete(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchNotes();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div>

                <h1>Notes</h1>

                <input
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />

                <textarea
                    placeholder="Note Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <br />

                <button onClick={createNote}>
                    Create Note
                </button>

                <hr />

                {notes.map((note) => (
                    <div key={note.id}>

                        <h3>{note.title}</h3>

                        <p>{note.content}</p>

                        <button
                            onClick={() => deleteNote(note.id)}
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