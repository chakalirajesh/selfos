import { FaBell } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="bg-slate-800 p-4 flex justify-between items-center rounded-xl">

      <h2 className="text-white text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">

        <button className="text-white">
          <FaBell />
        </button>

        <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
          R
        </div>

      </div>

    </div>
  );
}