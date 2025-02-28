import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";


interface TaskListProps {
  title: string;
  taskList: Task[];
  bgColor: string;
  icon : any
}

export const TaskList = ({ taskList, title, bgColor , icon }: TaskListProps) => {
  return (
    <div
      className={`flex flex-col bg-gray-50  pt-4 pb-8 m-5 px-0.5 rounded-xl ${bgColor}`}
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
      <div className="flex flex-col ">
        {taskList.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
