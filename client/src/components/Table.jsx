import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { toast } from "sonner";
import { useTrashTaskMutation, useDuplicateTaskMutation } from "../redux/slices/api/taskApiSlice";
import ConfirmationDialog from "./ConfirmationDialog";
import { UserAvatarGroup } from "./UserAvatar";
import { PRIORITY_STYLES, TASK_TYPE, formatDate } from "../utils";

const PRIORITY_ICONS = {
  high: <MdKeyboardDoubleArrowUp className="text-red-500" />,
  medium: <MdKeyboardArrowUp className="text-yellow-500" />,
  normal: <MdKeyboardArrowDown className="text-blue-500" />,
  low: <MdKeyboardArrowDown className="text-gray-400" />,
};

const HEADERS = ["Title", "Priority", "Stage", "Due Date", "Team", ""];

const Table = ({ tasks = [], onEdit, refetch }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [trashTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  const handleDelete = async () => {
    try {
      await trashTask({ id: deleteId }).unwrap();
      toast.success("Task moved to trash");
      refetch();
    } catch {
      toast.error("Failed to trash task");
    }
    setDeleteId(null);
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateTask(id).unwrap();
      toast.success("Task duplicated");
      refetch();
    } catch {
      toast.error("Failed to duplicate task");
    }
    setOpenMenuId(null);
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  {/* Title */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className={clsx("w-2 h-2 rounded-full flex-shrink-0", TASK_TYPE[task.stage])} />
                      <span
                        className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-1"
                        onClick={() => navigate(`/task/${task._id}`)}
                      >
                        {task.title}
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span className={clsx("flex items-center gap-1 text-xs font-medium capitalize", PRIORITY_STYLES[task.priority])}>
                      {PRIORITY_ICONS[task.priority]}
                      {task.priority}
                    </span>
                  </td>

                  {/* Stage */}
                  <td className="py-3.5 px-4">
                    <span className={clsx(
                      "text-xs px-2.5 py-1 rounded-full font-medium capitalize",
                      task.stage === "completed" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      task.stage === "in progress" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                      task.stage === "todo" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                      {task.stage}
                    </span>
                  </td>

                  {/* Due date */}
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(task.date)}
                    </span>
                  </td>

                  {/* Team */}
                  <td className="py-3.5 px-4">
                    <UserAvatarGroup users={task.team} max={3} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4">
                    {user?.isAdmin && (
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                        >
                          <HiDotsVertical size={15} />
                        </button>
                        {openMenuId === task._id && (
                          <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-36 z-20 py-1">
                            <button
                              onClick={() => { onEdit(task); setOpenMenuId(null); }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDuplicate(task._id)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() => { setDeleteId(task._id); setOpenMenuId(null); }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Trash
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tasks.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">No tasks found</p>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={!!deleteId}
        setOpen={() => setDeleteId(null)}
        onClick={handleDelete}
        msg="Move this task to trash?"
      />
    </>
  );
};

export default Table;
