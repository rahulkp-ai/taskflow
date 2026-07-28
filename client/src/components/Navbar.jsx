import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { useGetNotificationsQuery, useMarkNotiAsReadMutation } from "../redux/slices/api/userApiSlice";
import { logout, setOpenSidebar, toggleTheme } from "../redux/slices/authSlice";
import { dateTimeAgo, getInitials } from "../utils";
import NotificationPanel from "./NotificationPanel";
import UserInfo from "./UserInfo";

const Navbar = () => {
  const { user, theme } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openNotif, setOpenNotif] = useState(false);

  const [logoutApi] = useLogoutMutation();
  const { data: notifications } = useGetNotificationsQuery();
  const [markRead] = useMarkNotiAsReadMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate("/log-in");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const unreadCount = notifications?.length || 0;

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm">
      <button
        onClick={() => dispatch(setOpenSidebar(true))}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      >
        <HiMenuAlt2 size={22} />
      </button>

      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden md:block">
        Task Manager
      </h1>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="Toggle dark mode"
        >
          {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpenNotif((v) => !v)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors relative"
          >
            <FaBell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel
            open={openNotif}
            setOpen={setOpenNotif}
            notifications={notifications || []}
            onMarkRead={markRead}
          />
        </div>

        {/* User menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(user?.name)}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.name}
            </span>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <UserInfo user={user} />
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 ${active ? "bg-gray-50 dark:bg-gray-700" : ""}`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
