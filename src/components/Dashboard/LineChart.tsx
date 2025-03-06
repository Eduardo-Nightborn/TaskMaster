import { Line } from "react-chartjs-2";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTaskStore } from "@/store/useTaskStore";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";

// Register required ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChartCustom = () => {
  const getAllTasks = useTaskStore((state) => state.getAllTasks);
  const tasks = getAllTasks();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {

    setIsDark(document.documentElement.classList.contains('dark'));

    // Create observer to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);


  const groupTasksByDate = (tasks: Task[]) => {
    const grouped = tasks.reduce(
      (acc: { [key: string]: { done: number; active: number } }, task) => {
        const date = task.createdAt.split("T")[0]; 
        if (!acc[date]) {
          acc[date] = { done: 0, active: 0 };
        }

        if (task.status === "Done") {
          acc[date].done++;
        } else {
          acc[date].active++;
        }

        return acc;
      },
      {}
    );

    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB)
    );
  };

  const groupedData = groupTasksByDate(tasks);
  const dates = groupedData.map(([date]) => date);
  const doneData = groupedData.map(([, counts]) => counts.done);
  const activeData = groupedData.map(([, counts]) => counts.active);

  const options = {
    responsive: true,
    maintainAspectRatio: false,  
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#e5e7eb' : '#1f2937',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: isDark ? '#e5e7eb' : '#1f2937',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#1f2937',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Completed Tasks",
        data: doneData,
        borderColor: "#31B099",
        backgroundColor: "rgba(49, 176, 153, 0.5)",
        tension: 0.3,
      },
      {
        label: "Active Tasks",
        data: activeData,
        borderColor: "#4D81E7",
        backgroundColor: "rgba(77, 129, 231, 0.5)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-1 border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-6 w-full hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <LineChartIcon className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
          Task Evolution
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};
