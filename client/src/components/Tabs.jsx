import clsx from "clsx";

const Tabs = ({ tabs, setSelected, selected }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className={clsx(
            "px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px",
            selected === i
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          )}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
