import clsx from "clsx";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";

const linkData = [
  { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
  { label: "Tasks", link: "tasks", icon: <MdOutlineAddTask /> },
  { label: "Completed", link: "completed/completed", icon: <MdTaskAlt /> },
  { label: "In Progress", link: "in-progress/in progress", icon: <MdOutlinePendingActions /> },
  { label: "To Do", link: "todo/todo", icon: <MdOutlinePendingActions /> },
  { label: "Team", link: "team", icon: <FaUsers /> },
  { label: "Trash", link: "trashed", icon: <BiTrash /> },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const closeSidebar = () => dispatch(setOpenSidebar(false));

  const NavLink = ({ el }) => {
    const isActive = path === el.link.split("/")[0];
    return (
      <Link
        to={`/${el.link}`}
        onClick={closeSidebar}
        className={clsx(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
        )}
      >
        <span className={clsx("text-lg", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300")}>
          {el.icon}
        </span>
        {el.label}
      </Link>
    );
  };

  return (
    <div className="h-full flex flex-col p-3">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 mb-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MdTaskAlt className="text-white text-lg" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          TaskFlow
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {linkData.map((link) =>
          link.label === "Team" && !user?.isAdmin ? null : (
            <NavLink key={link.label} el={link} />
          )
        )}
      </nav>

      {/* Settings */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <MdSettings className="text-lg" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
