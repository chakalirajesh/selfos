type TaskCardProps = {
  task: any;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">

      <h3 className="text-xl font-bold text-blue-600 mb-2">
        {task.title}
      </h3>

      <p className="text-slate-600 mb-3 break-words">
        {task.description}
      </p>

      <p className="text-sm font-medium text-blue-500 mb-4">
        Status: {task.status}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
}