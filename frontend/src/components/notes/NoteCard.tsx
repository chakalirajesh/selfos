type NoteCardProps = {
  note: any;
  onEdit: (note: any) => void;
  onDelete: (id: string) => void;
};

export default function NoteCard({
  note,
  onEdit,
  onDelete
}: NoteCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">

      <h3 className="text-xl font-bold mb-2">
        {note.title}
      </h3>

      <p className="text-slate-600 mb-4 break-words">
        {note.content}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(note)}
          className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(note.id)}
          className="bg-red-500 text-white px-3 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
}