import clsx from "clsx";
import { Tooltip } from "./ui/Tooltip";
import { BGS, getInitials } from "../utils";

const UserAvatar = ({ user, index = 0, size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      title={user?.name}
      className={clsx(
        "rounded-full flex items-center justify-center text-white font-semibold border-2 border-white dark:border-gray-800",
        sizes[size],
        BGS[index % BGS.length]
      )}
    >
      {getInitials(user?.name)}
    </div>
  );
};

export const UserAvatarGroup = ({ users = [], max = 4, size = "md" }) => {
  const visible = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <UserAvatar key={user._id || i} user={user} index={i} size={size} />
      ))}
      {extra > 0 && (
        <div
          className={clsx(
            "rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-white dark:border-gray-800 text-gray-700 dark:text-gray-200 font-semibold",
            size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
