// TaskList.tsx
import { Task, TaskStatus } from "@/types/task";
import { TaskItem } from "./TaskItem";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskListProps {
  title: string;
  taskList: Task[];
  bgColor: string;
  icon: any;
  status: TaskStatus;
}

export const TaskList = ({ taskList, title, status, bgColor, icon }: TaskListProps) => {
  const { setNodeRef, attributes, listeners, isDragging, transform, transition } = useSortable({ 
    id: status,
    data: {
      type: 'container',
      status,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
  };

  // Trier les tâches par order
  const sortedTasks = [...taskList].sort((a, b) => a.order - b.order);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-col bg-gray-50 dark:bg-gray-800 pt-4 pb-8 m-5 px-0.5 rounded-xl ${bgColor} transition-colors duration-200 ${
        isDragging ? 'ring-2 ring-primary/50 shadow-lg' : ''
      }`}
    >
      <div className="flex flex-row mx-3 items-center justify-between">
        <div className="flex flex-row">
          {icon}
          <h1 className="text-xl text-gray-600 dark:text-gray-200 font-medium mx-2">{title}</h1>
        </div>
        <div className="px-2 border-gray-200 dark:border-gray-700 border-1 rounded bg-white dark:bg-gray-700 shadow dark:text-gray-200">
          {taskList.length}
        </div>
      </div>
      <SortableContext
        items={sortedTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col h-full">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
