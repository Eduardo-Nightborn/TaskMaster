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
import { Calendar, AlertCircle, CheckCircle, Trash2  } from "lucide-react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { TaskForm } from "./TaskForm";

interface TaskDetailsProps {
  task: Task;
  handleDelete: (task: string) => void;
}

export const TaskDetails = ({ task, handleDelete }: TaskDetailsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className=" flex flex-row items-center cursor-pointer hover:underline mt-1">
          <p className="text-xs text-gray-400 mx-2">View Task Details</p>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            🗒️ Task Details
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-1" />

        <div>
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <DialogDescription className="mt-2 text-gray-600">
            {task.description}
          </DialogDescription>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Created At</span>
          </div>
          <div className="text-gray-600">
            {format(task.createdAt, "dd/MM/yyyy")}
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Due Date</span>
          </div>
          <div className="text-gray-600">
            {format(task.dueDate, "dd/MM/yyyy")}
          </div>
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Priority</span>
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
          {/* Status */}
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Status</span>
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
        <DialogFooter className="mt-6">
          <DialogClose asChild></DialogClose>
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-500 hover:bg-red-400 cursor-pointer hover:translate-[1px] hover:shadow-md rounded px-2">
              <div className="flex flex-row text-white items-center p-1   justify-center ">
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
                  className="bg-red-500 hover:bg-red-400 cursor-pointer hover:translate-[1px] hover:shadow-md"
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
