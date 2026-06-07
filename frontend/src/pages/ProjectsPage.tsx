import { useEffect, useState } from "react";
import projectApi from "../api/projectApi";
import MainLayout from "../layouts/MainLayout";

export default function ProjectsPage() {

    const [projects, setProjects] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

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

                <button onClick={createProject}>
                    Create Project
                </button>

                <hr />

                {projects.map((project) => (
                    <div key={project.id}>

                        <h3>{project.name}</h3>

                        <p>{project.description}</p>

                        <button
                            onClick={() => deleteProject(project.id)}
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