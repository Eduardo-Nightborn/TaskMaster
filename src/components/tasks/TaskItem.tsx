import { Task } from "@/types/task";
import { BadgeCheck } from "lucide-react";
import { TaskDetails } from "./TaskDetails";
import { useTaskStore } from "@/store/useTaskStore";
import { toast } from "sonner";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const taskDelete = useTaskStore((state) => state.deleteTask);
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const dueDate = new Date(task.dueDate);
  const isDueInNext7Days = dueDate >= today && dueDate <= sevenDaysFromNow;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative w-full p-4 my-2 rounded-lg bg-white shadow-sm hover:translate-1 hover:shadow-md transition-all duration-200 ease-in-out cursor-grab border border-gray-100"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {task.title}
            </h3>
            <span className="flex-shrink-0">
              {task.priority === "High" ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <span className="w-1.5 h-1.5 mr-1 rounded-full bg-red-500"></span>
                  {task.priority}
                </span>
              ) : task.priority === "Medium" ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  <span className="w-1.5 h-1.5 mr-1 rounded-full bg-orange-500"></span>
                  {task.priority}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500"></span>
                  {task.priority}
                </span>
              )}
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
            <div className="flex flex-row-reverse items-center w-full justify-between">
              <TaskDetails task={task} handleDelete={handleDelete} />
              {isDueInNext7Days && (
              <p className="text-xs text-red-500 mt-1 ">
                ⚠️ {format(dueDate, "dd/MM/yyyy")}
              </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
