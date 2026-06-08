type GoalCardProps = {
  goal: any;
  onEdit: (goal: any) => void;
  onDelete: (id: string) => void;
};

export default function GoalCard({
  goal,
  onEdit,
  onDelete
}: GoalCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">

      <h3 className="text-xl font-bold text-green-600 mb-2">
        {goal.title}
      </h3>

      <p className="text-slate-600 mb-4">
        {goal.description}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(goal)}
          className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(goal.id)}
          className="bg-red-500 text-white px-3 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
}