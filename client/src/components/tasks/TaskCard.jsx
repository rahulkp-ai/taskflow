import clsx from "clsx";
import { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { FaLink } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  useTrashTaskMutation,
  useDuplicateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import ConfirmationDialog from "../ConfirmationDialog";
import { UserAvatarGroup } from "../UserAvatar";
import { BGS, PRIORITY_STYLES, TASK_TYPE, formatDate } from "../../utils";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowDown />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task, onEdit, refetch }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [trashTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  const completedSubTasks = task?.subTasks?.filter((s) => s.isCompleted)?.length || 0;
  const totalSubTasks = task?.subTasks?.length || 0;
  const progress = totalSubTasks ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0;

  const handleDelete = async () => {
    try {
      await trashTask({ id: task._id }).unwrap();
      toast.success("Task moved to trash");
      refetch();
    } catch {
      toast.error("Failed to trash task");
    }
  };

  const handleDuplicate = async () => {
    try {
      await duplicateTask(task._id).unwrap();
      toast.success("Task duplicated");
      refetch();
    } catch {
      toast.error("Failed to duplicate task");
    }
    setOpenMenu(false);
  };

  return (
    <>
      <div className="card p-4 hover:shadow-md transition-shadow duration-200 relative group">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={clsx("text-sm", PRIORITY_STYLES[task.priority])}>
              {ICONS[task.priority]}
            </span>
            <span className={clsx("text-xs font-medium capitalize", PRIORITY_STYLES[task.priority])}>
              {task.priority}
            </span>
          </div>

          {user?.isAdmin && (
            <div className="relative">
              <button
                onClick={() => setOpenMenu((v) => !v)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <HiDotsVertical size={16} />
              </button>
              {openMenu && (
                <div className="absolute right-0 top-7 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-36 z-20 py-1">
                  <button
                    onClick={() => { onEdit(task); setOpenMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => { setOpenDelete(true); setOpenMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Trash
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className={clsx("w-2 h-2 rounded-full flex-shrink-0", TASK_TYPE[task.stage])} />
            <h3
              className="font-medium text-gray-800 dark:text-gray-100 text-sm line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => navigate(`/task/${task._id}`)}
            >
              {task.title}
            </h3>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 ml-4">
            {formatDate(task.date)}
          </p>
        </div>

        {/* Progress bar */}
        {totalSubTasks > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Assets & links */}
        <div className="flex items-center gap-3 mt-3 text-gray-400">
          {task?.assets?.length > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <MdAttachFile size={13} />
              {task.assets.length}
            </span>
          )}
          {task?.links?.length > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <FaLink size={11} />
              {task.links.length}
            </span>
          )}
          {totalSubTasks > 0 && (
            <span className="text-xs ml-auto">
              {completedSubTasks}/{totalSubTasks} subtasks
            </span>
          )}
        </div>

        {/* Divider + Team */}
        {task?.team?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <UserAvatarGroup users={task.team} max={4} size="sm" />
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onClick={handleDelete}
        msg="Move this task to trash?"
      />
    </>
  );
};

export default TaskCard;
