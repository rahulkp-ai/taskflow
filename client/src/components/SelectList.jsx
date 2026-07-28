import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";

const SelectList = ({ lists, selected, setSelected, label }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-8 text-left text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <span className="block truncate capitalize">{selected}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <BsChevronExpand className="text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 text-sm overflow-auto max-h-52 focus:outline-none">
              {lists.map((item, idx) => (
                <Listbox.Option
                  key={idx}
                  value={item}
                  className={({ active }) =>
                    `cursor-pointer select-none px-3 py-2 flex items-center gap-2 capitalize ${
                      active
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`
                  }
                >
                  {({ selected: isSelected }) => (
                    <>
                      {isSelected ? (
                        <MdCheck className="text-blue-600 dark:text-blue-400" />
                      ) : (
                        <span className="w-4" />
                      )}
                      {item}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default SelectList;
