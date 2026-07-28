import { getInitials } from "../utils";

const UserInfo = ({ user }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
        {getInitials(user?.name)}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {user?.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user?.email}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
