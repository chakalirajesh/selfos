type HabitCardProps = {
  habit: any;
  onEdit: (habit: any) => void;
  onDelete: (id: string) => void;
};

export default function HabitCard({
  habit,
  onEdit,
  onDelete
}: HabitCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">

      <h3 className="text-xl font-bold text-red-600 mb-2">
        🔥 {habit.name}
      </h3>

      <p className="text-slate-600 mb-4">
        {habit.description}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(habit)}
          className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(habit.id)}
          className="bg-red-500 text-white px-3 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
}