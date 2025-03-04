import { ChartColumnDecreasing } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  data: any;
  options: any;
  todo: number;
  inProgress: number;
  done: number;
}

export const DoughnutChart = ({
  data,
  options,
  todo,
  inProgress,
  done,
}: DoughnutChartProps) => {
  ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

  return (
    <div className="bg-white rounded-xl border-1 border-gray-100 shadow-sm p-4 sm:p-6 w-full hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <ChartColumnDecreasing className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
          Tasks Insights
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <div className="w-48 sm:w-56 md:w-64 lg:w-72 mx-auto lg:mx-0">
          <Doughnut data={data} options={options} />
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          {/* To do Legend */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#c75c72] rounded-full"></div>
              <span className="text-gray-600 font-medium text-sm sm:text-base">
                To Do
              </span>
            </div>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {todo}
            </span>
          </div>

          {/* In Progress legend */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#4D81E7] rounded-full"></div>
              <span className="text-gray-600 font-medium text-sm sm:text-base">
                In Progress
              </span>
            </div>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {inProgress}
            </span>
          </div>

          {/* Done legend */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#31B099] rounded-full"></div>
              <span className="text-gray-600 font-medium text-sm sm:text-base">
                Done
              </span>
            </div>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {done}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
