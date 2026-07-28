import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { FiPlus } from "react-icons/fi";
import {
  useGetTeamListQuery,
  useDeleteUserMutation,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import Loading from "../components/Loading";
import Title from "../components/Title";
import Button from "../components/Button";
import ConfirmationDialog from "../components/ConfirmationDialog";
import AddUser from "../components/AddUser";
import { BGS, getInitials } from "../utils";

const Users = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [selected, setSelected] = useState(null);

  const { data: users, isLoading, refetch } = useGetTeamListQuery({ search });
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(deleteId).unwrap();
      toast.success("User deleted");
      refetch();
    } catch {
      toast.error("Failed to delete user");
    }
    setDeleteId(null);
  };

  const handleToggleActive = async (user) => {
    try {
      await userAction({ id: user._id, isActive: !user.isActive }).unwrap();
      toast.success(`User ${user.isActive ? "deactivated" : "activated"}`);
      refetch();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Title title="Team Members" />
        <Button
          label="Add User"
          icon={FiPlus}
          onClick={() => setOpenAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field max-w-sm"
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {["User", "Title", "Role", "Email", "Status", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users?.map((user, i) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0", BGS[i % BGS.length])}>
                        {getInitials(user.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.title}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={clsx("text-xs px-2.5 py-1 rounded-full font-medium", user.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={clsx("text-xs font-medium transition-colors", user.isActive ? "text-red-600 dark:text-red-400 hover:text-red-700" : "text-green-600 dark:text-green-400 hover:text-green-700")}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => setDeleteId(user._id)}
                        className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users?.length && (
            <p className="text-center text-sm text-gray-400 py-10">No team members found</p>
          )}
        </div>
      </div>

      <AddUser open={openAdd} setOpen={setOpenAdd} refetch={refetch} />

      <ConfirmationDialog
        open={!!deleteId}
        setOpen={() => setDeleteId(null)}
        onClick={handleDelete}
        msg="Permanently delete this user account?"
      />
    </div>
  );
};

export default Users;
