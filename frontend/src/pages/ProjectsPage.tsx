import { useEffect, useState } from "react";
import projectApi from "../api/projectApi";
import MainLayout from "../layouts/MainLayout";

export default function ProjectsPage() {

    const [projects, setProjects] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState("");

    const fetchProjects = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            const response =
                await projectApi.get("", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            setProjects(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const createProject = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await projectApi.post(
                "",
                {
                    name,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setName("");
            setDescription("");

            fetchProjects();

        } catch (error) {
            console.error(error);
        }
    };
    const updateProject = async () => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await projectApi.put(
                `/${editingId}`,
                {
                    name,
                    description,
                    progress: 0,
                    status: "PLANNED"
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

            fetchProjects();

        } catch (error: any) {

            console.log("STATUS", error.response?.status);
            console.log("DATA", error.response?.data);

        }
    };

    const deleteProject = async (id: string) => {

        try {

            const token =
                localStorage.getItem("accessToken");

            await projectApi.delete(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchProjects();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div>

                <h1>Projects</h1>

                <input
                    type="text"
                    placeholder="Project Name"
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
                        onClick={updateProject}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Update Project
                    </button>
                ) : (
                    <button
                        onClick={createProject}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Create Project
                    </button>
                )}

                <hr />

                {projects.map((project) => (
                    <div key={project.id}>

                        <h3>{project.name}</h3>

                        <p>{project.description}</p>

                        <button
                            onClick={() => {
                                setEditingId(project.id);
                                setName(project.name);
                                setDescription(project.description);
                            }}
                            className="bg-yellow-500 text-white p-2 rounded mr-2"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteProject(project.id)}
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