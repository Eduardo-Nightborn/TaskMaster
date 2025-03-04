import { useTaskStore } from "@/store/useTaskStore";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  CircleDashed,
  ListChecks,
  ListPlus,
  Upload,
} from "lucide-react";
import { StatCard } from "@/components/Dashboard/StatCard";
import { DoughnutChart } from "@/components/Dashboard/Chart";
import { TableTask } from "@/components/Dashboard/TableTasks";
import { LineChartCustom } from "@/components/Dashboard/LineChart";

// Register Chart.js components and plugins

function DashBoardPage() {
  const fetchTasks = useCallback(
    useTaskStore((state) => state.fetchTasks),
    []
  );
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getAllTasks = useTaskStore((state) => state.getAllTasks);
  const allTasks = getAllTasks();
  const columns = useTaskStore((state) => state.columns);
  const totalTasks = getAllTasks().length;
  const taskDone = Array.from(columns.Done.tasks);
  const taskInProgress = Array.from(columns.InProgress.tasks);
  const taskToDo = Array.from(columns.Todo.tasks);

  const StatCards = [
    {
      title: "Total Tasks",
      statsNumber: totalTasks,
      icon: (
        <div className="p-1.5 bg-[#FEF9F1] rounded-lg">
          <BriefcaseBusiness color="#E7854D" />
        </div>
      ),
    },
    {
      title: "Tasks To Do",
      statsNumber: taskToDo.length,
      icon: (
        <div className="p-2 bg-[#FBF3F4] rounded-lg">
          <ListPlus color="#c75c72" />
        </div>
      ),
    },
    {
      title: "Tasks in Progress ",
      statsNumber: taskInProgress.length,
      icon: (
        <div className="p-2 bg-[#4D81E71A] rounded-lg">
          <CircleDashed color="#4D81E7" />
        </div>
      ),
    },
    {
      title: "Task Done",
      statsNumber: taskDone.length,
      icon: (
        <div className="p-1.5 bg-[#31B0991A] rounded-lg">
          <ListChecks color="#31B099" />
        </div>
      ),
    },
  ];

  // Doughnut chart data
  const data = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Task Progress",
        data: [taskToDo.length, taskInProgress.length, taskDone.length],
        backgroundColor: ["#c75c72", "#4D81E7", "#31B099"],
        borderRadius: 5,
        spacing: 5,
        hoverOffset: 4,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw} tasks`;
          },
        },
      },
      datalabels: {
        color: "#ffffff",
        font: {
          weight: "bold" as const,
          size: 16,
        },
        formatter: (value: number, context: any) => {
          const datapoints = context.chart.data.datasets[0].data;
          const total = datapoints.reduce(
            (total: number, datapoint: number) => total + datapoint,
            0
          );
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
      },
    },
    id: "1",
  };

  return (
    <div className="flex flex-col w-screen">
      <div className="flex row my-3 border-b-1 py-3 mx-2">
        <BriefcaseBusiness />
        <p className="text-xl mx-3 font-medium">DashBoard</p>
      </div>
      <div className="flex flex-col w-full min-h-screen p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 p-4">
          <p className="text-xl">Analytics Overview of your tasks 📊</p>
          <div className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto flex items-center gap-2 rounded shadow bg-primary cursor-pointer hover:shadow-xl transition-all hover:translate-0.5">
              <Upload />
              <p>Export</p>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
          {StatCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="w-full lg:w-2/5">
            <DoughnutChart
              data={data}
              options={options}
              todo={taskToDo.length}
              inProgress={taskInProgress.length}
              done={taskDone.length}
            />
          </div>
          <div className="w-full lg:w-3/5">
            <TableTask tasksProps={allTasks} />
          </div>
        </div>
        <div className="my-5">
          <LineChartCustom />
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
