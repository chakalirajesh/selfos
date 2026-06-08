type ProjectCardProps = {
  project: any;
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
};

export default function ProjectCard({
  project,
  onEdit,
  onDelete
}: ProjectCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">

      <h3 className="text-xl font-bold text-purple-700 mb-2">
        {project.name}
      </h3>

      <p className="text-slate-600 mb-4 break-words">
        {project.description}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(project)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(project.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
}