// TaskList.tsx
import { Task, TaskStatus } from "@/types/task";
import { TaskItem } from "./TaskItem";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TaskListProps {
  title: string;
  taskList: Task[];
  bgColor: string;
  icon: any;
  status: TaskStatus;
}

export const TaskList = ({ taskList, title, status, bgColor, icon }: TaskListProps) => {
  const { setNodeRef, attributes, listeners } = useSortable({ id: status });

  // Trier les tâches par order
  const sortedTasks = [...taskList].sort((a, b) => a.order - b.order);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex flex-col bg-gray-50 pt-4 pb-8 m-5 px-0.5 rounded-xl ${bgColor}`}
    >
      <div className="flex flex-row mx-3 items-center justify-between">
        <div className="flex flex-row">
          {icon}
          <h1 className="text-xl text-gray-600 font-medium mx-2">{title}</h1>
        </div>
        <div className="px-2 border-gray-200 border-1 rounded bg-white shadow">
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
