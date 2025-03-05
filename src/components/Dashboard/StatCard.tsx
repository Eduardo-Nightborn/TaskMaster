interface StatCardProps {
  title: string;
  statsNumber: number;
  icon: any;
}

export const StatCard = ({ title, statsNumber, icon }: StatCardProps) => {
  return (
    <div 
    className="flex flex-col p-1 lg:p-3 border dark:border-gray-700 text-[#5B5A64] dark:text-gray-400 font-light rounded-lg mx-2 lg:mx-12 my-2 shadow hover:shadow-lg hover:translate-0.1 transition-all ease-in dark:bg-gray-800 dark:hover:shadow-gray-900 dark:hover:translate-0.1">
      <p className="text-gray-500 dark:text-white mx-2">{title}</p>
      <div className="flex flex-row justify-between items-center">
        <p className="px-2 text-xl lg:text-2xl text-[#252528] dark:text-white">{statsNumber}</p>
        <div className="flex items-center px-2">{icon}</div>
      </div>
    </div>
  );
};
