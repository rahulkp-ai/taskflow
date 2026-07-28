import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { BiTrash } from "react-icons/bi";
import { MdRestore, MdDeleteForever } from "react-icons/md";
import { useGetAllTaskQuery, useDeleteRestoreTaskMutation } from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loading";
import Title from "../components/Title";
import Button from "../components/Button";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { TASK_TYPE, formatDate } from "../utils";

const Trash = () => {
  const [openRestore, setOpenRestore] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [actionType, setActionType] = useState("");

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: true,
    search: "",
  });

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const handleAction = async () => {
    try {
      await deleteRestoreTask({ id: selectedId, actionType }).unwrap();
      toast.success("Operation completed successfully");
      refetch();
    } catch {
      toast.error("Operation failed");
    }
    setSelectedId(null);
    setOpenDelete(false);
    setOpenRestore(false);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setActionType("delete");
    setOpenDelete(true);
  };

  const confirmRestore = (id) => {
    setSelectedId(id);
    setActionType("restore");
    setOpenRestore(true);
  };

  const confirmDeleteAll = () => {
    setSelectedId(null);
    setActionType("deleteAll");
    setOpenDelete(true);
  };

  const confirmRestoreAll = () => {
    setSelectedId(null);
    setActionType("restoreAll");
    setOpenRestore(true);
  };

  if (isLoading) return <Loading />;

  const tasks = data?.tasks || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Title title="Trashed Tasks" />
        {tasks.length > 0 && (
          <div className="flex gap-2">
            <Button
              label="Restore All"
              icon={MdRestore}
              onClick={confirmRestoreAll}
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
            />
            <Button
              label="Delete All"
              icon={MdDeleteForever}
              onClick={confirmDeleteAll}
              className="bg-red-600 hover:bg-red-700 text-white text-sm"
            />
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="card p-12 text-center">
          <BiTrash className="text-gray-300 dark:text-gray-600 text-5xl mx-auto mb-3" />
          <p className="text-gray-400 dark:text-gray-500">Trash is empty</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {["Task", "Stage", "Date Trashed", "Actions"].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={clsx("w-2 h-2 rounded-full flex-shrink-0", TASK_TYPE[task.stage])} />
                        <span className="text-sm text-gray-800 dark:text-gray-200 font-medium line-clamp-1">
                          {task.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{task.stage}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-400">{formatDate(task.updatedAt)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => confirmRestore(task._id)}
                          className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 font-medium transition-colors"
                        >
                          <MdRestore size={15} />
                          Restore
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <button
                          onClick={() => confirmDelete(task._id)}
                          className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium transition-colors"
                        >
                          <MdDeleteForever size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onClick={handleAction}
        msg={actionType === "deleteAll" ? "Permanently delete ALL trashed tasks? This cannot be undone." : "Permanently delete this task?"}
      />
      <ConfirmationDialog
        open={openRestore}
        setOpen={setOpenRestore}
        onClick={handleAction}
        type="restore"
        msg={actionType === "restoreAll" ? "Restore all trashed tasks?" : "Restore this task?"}
      />
    </div>
  );
};

export default Trash;
