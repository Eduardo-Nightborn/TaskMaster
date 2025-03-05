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
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.8 : 1,
    scale: isDragging ? 1.02 : 1,
    boxShadow: isDragging ? 'rgba(0, 0, 0, 0.15) 0px 8px 16px' : 'none',
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
      className="relative w-full p-5 my-3 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-grab border border-gray-100/10 dark:border-gray-800/50 group"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
              {task.title}
            </h3>
            <span className="flex-shrink-0">
              {task.priority === "High" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 dark:bg-red-500/20">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-red-500"></span>
                  {task.priority}
                </span>
              ) : task.priority === "Medium" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-orange-500"></span>
                  {task.priority}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 dark:bg-green-500/20">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500"></span>
                  {task.priority}
                </span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
            <div className="flex flex-row-reverse items-center w-full justify-between">
              <TaskDetails task={task} handleDelete={handleDelete} />
              {isDueInNext7Days && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-1 flex items-center gap-1.5">
                <span className="animate-pulse">⚠️</span> {format(dueDate, "dd/MM/yyyy")}
              </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
