import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "./Button";

const ConfirmationDialog = ({
  open,
  setOpen,
  onClick,
  msg = "Are you sure you want to delete?",
  type = "delete",
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <FiAlertTriangle className="text-red-600 dark:text-red-400" size={26} />
                </div>
                <div>
                  <Dialog.Title className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Confirm Action
                  </Dialog.Title>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{msg}</p>
                </div>
                <div className="flex gap-3 w-full">
                  <Button
                    label="Cancel"
                    onClick={() => setOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  />
                  <Button
                    label={type === "restore" ? "Restore" : "Delete"}
                    onClick={() => {
                      onClick();
                      setOpen(false);
                    }}
                    className={`flex-1 text-white ${
                      type === "restore"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  />
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationDialog;
