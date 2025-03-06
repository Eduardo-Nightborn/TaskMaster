import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  Trash2,
  Link,
} from "lucide-react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { TaskForm } from "./TaskForm";
import { useTaskStore } from "@/store/useTaskStore";

interface TaskDetailsProps {
  task: Task;
  handleDelete: (task: string) => void;
}

export const TaskDetails = ({ task, handleDelete }: TaskDetailsProps) => {
  const getAllTasks = useTaskStore((state) => state.getAllTasks);

  const getDependencies = (taskIds : string[])=>{

    return getAllTasks().filter((t)=> taskIds.includes(t.id));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row items-center cursor-pointer hover:underline mt-1">
          <p className="text-xs text-gray-400 mx-2">View Task Details</p>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            🗒️ Task Details
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-1" />

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {task.title}
          </h2>
          <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
            {task.description}
          </DialogDescription>
        </div>

        {/* Grid for other details */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Created At
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {format(task.createdAt, "dd/MM/yyyy")}
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {format(task.dueDate, "dd/MM/yyyy")}
          </div>
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Priority
            </span>
          </div>
          <div>
            <Badge
              className={`capitalize ${
                task.priority === "High"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Status
            </span>
          </div>
          <div>
            <Badge
              className={`capitalize ${
                task.status === "Done"
                  ? "bg-green-100 text-green-800"
                  : task.status === "InProgress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.status}
            </Badge>
          </div>
        </div>

        {/* Task Dependencies moved outside the grid */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-gray-600 dark:text-gray-300 flex-shrink-0" />
            <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">
              Task Dependencies
            </span>
          </div>
          <div className="mt-2">
            {task.dependencies ? (
              <div className="space-y-2 pl-2">
                {getDependencies(task.dependencies).map((task, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between py-2.5 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200/80 dark:border-gray-700/50 text-sm text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-all duration-200"
                  >
                    <span className="font-medium text-gray-900 dark:text-white truncate flex-1 pr-2">
                      {task.title}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <TaskDetails task={task} handleDelete={handleDelete} />

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="pl-2 text-sm text-gray-500 dark:text-gray-400 italic">
                No dependencies assigned yet
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild></DialogClose>
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-500 hover:bg-red-400 cursor-pointer hover:translate-[1px] hover:shadow-md rounded px-2">
              <div className="flex flex-row text-white items-center p-1 justify-center">
                <Trash2 className="mr-2 h-4 w-4" color="#FFFF" /> Delete Task
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>⚠️ Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 hover:bg-red-400 cursor-pointer hover:translate-[1px] hover:shadow-md dark:bg-red-500 dark:hover:bg-red-400 dark:text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <TaskForm task={task} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};