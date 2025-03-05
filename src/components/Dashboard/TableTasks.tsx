import { Task } from "@/types/task";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BadgeCheck, List, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { FilterSelector } from "./FilterSelect";
import { TaskDetails } from "../tasks/TaskDetails";
import { useTaskStore } from "@/store/useTaskStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface TableTasksProps {
  tasksProps: Task[];
}

export const TableTask = ({ tasksProps }: TableTasksProps) => {
  const [tasks, setTasks] = useState(tasksProps);
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filterText, setFilterText] = useState("");
  const taskDelete = useTaskStore((state) => state.deleteTask);

  useEffect(() => {
    let filteredTasks = tasksProps;

    if (selectedPriority !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === selectedPriority
      );
    }

    if (selectedStatus !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === selectedStatus
      );
    }

    if (filterText) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    setTasks(filteredTasks);
  }, [selectedPriority, selectedStatus, tasksProps, filterText]);

  const handleDelete = (taskId: string) => {
    taskDelete(taskId);
    toast(
      <div className="flex items-center flex-row text-[#ff0033]">
        <BadgeCheck color="#ff0033" />
        <p className="px-2">Your task has been removed successfully!</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col border rounded-lg w-full h-[calc(100vh-16rem)] lg:h-[calc(100vh-31rem)] p-2 sm:p-4 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <List className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
          All Tasks
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-4">
        <FilterSelector
          onChange={setSelectedPriority}
          value={selectedPriority}
          placeholder="Filter By Priority :"
          isStatus={false}
        />
        <FilterSelector
          onChange={setSelectedStatus}
          value={selectedStatus}
          placeholder="Filter By Status :"
          isStatus={true}
        />
        <div className="flex flex-row w-full items-center justify-center">
          <div className="flex flex-row items-center border rounded-lg w-[220px] md:w-[260px] lg:w-[220px] dark:border-gray-700">
            <Search
              className="mx-2 h-4 w-4 text-5-[#161618]  dark:text-white"
            />
            <Input
              className="border-none outline-none shadow-none focus-visible:ring-0 h-9 py-1 text-sm sm:text-base dark:bg-transparent dark:text-gray-200"
              placeholder="Search here"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
      </div>
      <ScrollArea className="h-full p-2 sm:p-1 scroll-smooth overflow-hidden">
        <div className="p-2 md:p-4">
          <Table>
            <TableCaption className="caption-bottom dark:text-gray-400">
              A list of all your tasks
            </TableCaption>
            <TableHeader>
              <TableRow className="dark:border-gray-800">
                <TableHead className="w-full sm:w-1/4 dark:text-gray-200">Task</TableHead>
                <TableHead className="hidden sm:table-cell w-1/5 dark:text-gray-200">
                  Due Date
                </TableHead>
                <TableHead className="hidden sm:table-cell w-1/5 dark:text-gray-200">
                  Status
                </TableHead>
                <TableHead className="hidden sm:table-cell dark:text-gray-200">Priority</TableHead>
                <TableHead className="w-1/4 sm:w-auto dark:text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={index} className="dark:border-gray-800">
                  <TableCell className="font-medium dark:text-gray-200">{task.title}</TableCell>
                  <TableCell className="hidden sm:table-cell dark:text-gray-300">
                    {format(task.dueDate, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      className={`capitalize ${task.status === "Done"
                          ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-500"
                          : task.status === "InProgress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-300 dark:text-gray-800"
                        }`}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      className={`capitalize ${task.priority === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-500"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-500"
                            : "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-500"
                        }`}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TaskDetails task={task} handleDelete={handleDelete} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
