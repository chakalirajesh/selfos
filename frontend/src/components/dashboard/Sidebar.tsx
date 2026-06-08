import {
  FaHome,
  FaTasks,
  FaBullseye,
  FaProjectDiagram,
  FaStickyNote
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 h-screen text-white p-5">

      <h1 className="text-2xl font-bold mb-8">
        SelfOS
      </h1>

      <ul className="space-y-4">

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <FaHome />
          Dashboard
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <FaTasks />
          Tasks
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <FaBullseye />
          Goals
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <FaProjectDiagram />
          Projects
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
          <FaStickyNote />
          Notes
        </li>

      </ul>

    </div>
  );
}