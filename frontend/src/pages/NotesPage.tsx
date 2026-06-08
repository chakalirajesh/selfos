import { useEffect, useState } from "react";
import noteApi from "../api/noteApi";
import MainLayout from "../layouts/MainLayout";
import NoteCard from "../components/notes/NoteCard";

export default function NotesPage() {

    const [notes, setNotes] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState("");

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

        if (!title.trim()) {
            alert("Note title is required");
            return;
        }

        if (!content.trim()) {
            alert("Note content is required");
            return;
        }

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

        } catch (error: any) {

            console.log("FULL ERROR", error);

            if (error.response) {
                console.log("STATUS", error.response.status);
                console.log("DATA", error.response.data);
            }
        }
    };
    const updateNote = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await noteApi.put(
                `/${editingId}`,
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

            setEditingId("");
            setTitle("");
            setContent("");

            fetchNotes();

        } catch (error: any) {

            console.log(error.response?.status);
            console.log(error.response?.data);

        }
    };

    const deleteNote = async (id: string) => {
        if (!window.confirm("Delete this item?")) {
            return;
        }
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
            <div className="space-y-8">

                <div className="bg-white p-6 rounded-2xl shadow-lg">

                    <div className="mb-8">

                        <h1 className="text-4xl font-bold text-orange-600">
                            Notes
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Capture ideas, learning notes and thoughts.
                        </p>

                    </div>

                    <input
                        type="text"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-slate-300 focus:ring-2 focus:ring-orange-500 p-3 rounded-xl w-full mb-3 outline-none"
                    />

                    <textarea
                        placeholder="Note Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border border-slate-300 focus:ring-2 focus:ring-orange-500 p-3 rounded-xl w-full mb-3 min-h-[120px] outline-none"
                    />

                    <div className="flex gap-2">

                        {editingId ? (
                            <button
                                onClick={updateNote}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Update Note
                            </button>
                        ) : (
                            <button
                                onClick={createNote}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Create Note
                            </button>
                        )}

                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId("");
                                    setTitle("");
                                    setContent("");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                        {notes.map((note) => (

                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={(selectedNote) => {
                                    setEditingId(selectedNote.id);
                                    setTitle(selectedNote.title);
                                    setContent(selectedNote.content);
                                }}
                                onDelete={deleteNote}
                            />

                        ))}

                    </div>

                    {notes.length === 0 && (

                        <div className="bg-white p-10 rounded-2xl shadow text-center mt-8">

                            <h2 className="text-xl font-bold text-orange-600">
                                No Notes Yet
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create your first note.
                            </p>

                        </div>

                    )}

                </div>

            </div>
        </MainLayout>
    );
}