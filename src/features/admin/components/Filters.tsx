"use client";
export default function Filters({ onSearch, onFilter, onSort }: any) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 w-full">
        <input 
          type="text" 
          placeholder="Search property by name..." 
          onChange={(e) => onSearch(e.target.value)}
          className="w-full sm:max-w-md border border-gray-300 dark:border-[#363636] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <select 
          onChange={(e) => onFilter(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 dark:border-[#363636] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
        
        <select 
          onChange={(e) => onSort(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 dark:border-[#363636] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          <option value="asc">Sort A to Z</option>
          <option value="desc">Sort Z to A</option>
        </select>
      </div>
    </div>
  );
}