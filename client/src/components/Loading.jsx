const Loading = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export const TaskSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="skeleton h-4 w-3/4" />
    <div className="skeleton h-3 w-1/2" />
    <div className="flex gap-2 mt-2">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
    <div className="flex gap-1 mt-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton w-7 h-7 rounded-full" />
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card p-5 space-y-2">
          <div className="skeleton h-3 w-1/2" />
          <div className="skeleton h-8 w-1/3" />
        </div>
      ))}
    </div>
    <div className="card p-4">
      <div className="skeleton h-64 w-full" />
    </div>
  </div>
);

export default Loading;
