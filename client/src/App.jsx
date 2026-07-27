import { Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar, Sidebar } from "./components";
import {
  Dashboard,
  Login,
  TaskDetail,
  Tasks,
  Trash,
  Users,
  StatusPage,
} from "./pages";
import { setOpenSidebar } from "./redux/slices/authSlice";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/log-in" state={{ from: location }} replace />;
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white dark:bg-gray-800 sticky top-0 hidden md:flex flex-col shadow-sm border-r border-gray-200 dark:border-gray-700">
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => dispatch(setOpenSidebar(false));

  return (
    <Transition
      show={isSidebarOpen}
      as={Fragment}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed inset-0 z-50 bg-black/50"
        onClick={closeSidebar}
      >
        <div
          className="bg-white dark:bg-gray-800 w-3/4 max-w-xs h-full shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={closeSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <IoMdClose size={22} />
            </button>
          </div>
          <Sidebar />
        </div>
      </div>
    </Transition>
  );
};

const App = () => {
  const { theme } = useSelector((state) => state.auth);

  return (
    <main className={theme}>
      <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route element={<Layout />}>
            {/* FIXED: was 'psth' (typo) */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/completed/:status?" element={<Tasks />} />
            <Route path="/in-progress/:status?" element={<Tasks />} />
            <Route path="/todo/:status?" element={<Tasks />} />
            <Route path="/trashed" element={<Trash />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/team" element={<Users />} />
            <Route path="/status" element={<StatusPage />} />
          </Route>
          <Route path="/log-in" element={<Login />} />
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
};

export default App;
