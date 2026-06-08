import { useEffect, useState } from "react";
import projectApi from "../api/projectApi";
import MainLayout from "../layouts/MainLayout";
import ProjectCard from "../components/projects/ProjectCard";
import toast from "react-hot-toast";

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
        if (!name.trim()) {
            toast.error("Project name is required");
            return;
        }

        if (!description.trim()) {
            toast.error("Project description is required");
            return;
        }

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
            toast.success("Project created successfully");

            setName("");
            setDescription("");

            fetchProjects();

        } catch (error) {
            toast.error("Failed to create project");
            console.error(error);
        }
    };
    const updateProject = async () => {

        if (!name.trim()) {
            alert("Project name is required");
            return;
        }

        if (!description.trim()) {
            alert("Project description is required");
            return;
        }
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
            toast.success("Project updated successfully");

            fetchProjects();

        } catch (error: any) {
            toast.error("Failed to update project");
            console.log("STATUS", error.response?.status);
            console.log("DATA", error.response?.data);

        }
    };

    const deleteProject = async (id: string) => {
        if (!window.confirm("Delete this item?")) {
            return;
        }

        try {

            const token =
                localStorage.getItem("accessToken");

            await projectApi.delete(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Project deleted successfully");
            fetchProjects();

        } catch (error) {
            toast.error("Failed to delete project");
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-8">

                <div className="bg-white p-6 rounded-2xl shadow-lg">

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-purple-600">
                            Projects
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Manage all your projects in one place.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Project Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-purple-300 p-3 rounded-lg w-full mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-purple-300 p-3 rounded-lg w-full mb-3"
                    />

                    <div className="flex gap-2">

                        {editingId ? (
                            <button
                                onClick={updateProject}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Update Project
                            </button>
                        ) : (
                            <button
                                onClick={createProject}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Create Project
                            </button>
                        )}

                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId("");
                                    setName("");
                                    setDescription("");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                        {projects.map((project) => (

                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={(selectedProject) => {
                                    setEditingId(selectedProject.id);
                                    setName(selectedProject.name);
                                    setDescription(selectedProject.description);
                                }}
                                onDelete={deleteProject}
                            />

                        ))}

                    </div>

                    {projects.length === 0 && (

                        <div className="bg-white p-10 rounded-2xl shadow text-center mt-8">

                            <h2 className="text-xl font-bold text-purple-600">
                                No Projects Yet
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create your first project.
                            </p>

                        </div>

                    )}

                </div>

            </div>
        </MainLayout>
    );
}