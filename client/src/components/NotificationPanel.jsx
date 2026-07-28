import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import { dateTimeAgo } from "../utils";

const NotificationPanel = ({ open, setOpen, notifications, onMarkRead }) => {
  const handleMarkAll = () => {
    onMarkRead({ type: "all", id: "" });
    setOpen(false);
  };

  return (
    <Transition
      show={open}
      as={Fragment}
      enter="transition ease-out duration-150"
      enterFrom="opacity-0 scale-95 translate-y-1"
      enterTo="opacity-100 scale-100 translate-y-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
            Notifications
          </h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            >
              <IoClose size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No new notifications
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                onClick={() => {
                  onMarkRead({ type: "single", id: n._id });
                }}
              >
                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                  {n.text}
                </p>
                {n.task?.title && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                    Task: {n.task.title}
                  </p>
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  {dateTimeAgo(n.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Transition>
  );
};

export default NotificationPanel;
