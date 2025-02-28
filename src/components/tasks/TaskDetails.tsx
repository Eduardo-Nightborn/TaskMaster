import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { TaskForm } from "./TaskForm";

interface TaskDetailsProps {
  task: Task;
  handleDelete: (task: string) => void;
}

export const TaskDetails = ({ task, handleDelete   }: TaskDetailsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-xs text-gray-400 cursor-pointer hover:underline mt-1">
          View Task Details
        </p>
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
          <p className="mt-2 text-gray-600">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Created At</span>
          </div>
          <div className="text-gray-600">
            {format(task.createdAt, "MM/dd/yyyy")}
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Due Date</span>
          </div>
          <div className="text-gray-600">
            {format(task.dueDate, "MM/dd/yyyy")}
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
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer ">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete(task.id)}
            variant="destructive"
            className="cursor-pointer focus-visible:outline-0"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Task
          </Button>
          <TaskForm task={task} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
