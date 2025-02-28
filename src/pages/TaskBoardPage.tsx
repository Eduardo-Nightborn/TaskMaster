import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useTaskStore } from "@/store/useTaskStore";
import { useEffect, useCallback } from "react";
import { ListPlus , CircleDashed , ListChecks } from "lucide-react";

function TaskBoardPage() {
  console.log("TaskList rendu");
  const fetchTasks = useCallback(
    useTaskStore((state) => state.fetchTasks),
    []
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = useTaskStore((state) => state.columns);
  const taskDone = Array.from(columns.Done.tasks);
  const taskInProgress = Array.from(columns.InProgress.tasks);
  const taskToDo = Array.from(columns.Todo.tasks);

  return (
    <div className="flex flex-col h-screen w-full p-6">
      <div className="flex flex-row w-full">
        <TaskForm task={null} />
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 w-full">
        <TaskList taskList={taskToDo} title="To Do" bgColor="bg-gray-50" icon={<ListPlus color="#4B5563" size={24} />} />
        <TaskList taskList={taskInProgress} title="In Progress" bgColor="bg-sky-50" icon={ <CircleDashed color="#60A5FA" size={24} />} />
        <TaskList taskList={taskDone} title="Done" bgColor="bg-green-50" icon={ <ListChecks size={24} color="#22C55E" />} />
      </div>
    </div>
  );
}

export default TaskBoardPage;