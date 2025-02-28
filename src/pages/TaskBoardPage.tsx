import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useTaskStore } from "@/store/useTaskStore";
import { useEffect, useCallback } from "react";
import { ListPlus, CircleDashed, ListChecks } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { Task, TaskStatus } from "../types/task"; // Assuming this is where your types are defined

// Assuming TaskList props type (adjust according to your actual TaskList component)
interface TaskListProps {
  taskList: Task[];
  title: string;
  bgColor: string;
  icon: any;
}

function TaskBoardPage() {
  console.log("TaskList rendu");

  const fetchTasks = useCallback(
    useTaskStore((state) => state.fetchTasks),
    []
  );
  const columns = useTaskStore((state) => state.columns);
  const moveTask = useTaskStore((state) => state.moveTask);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const taskDone = Array.from(columns.Done.tasks);
  const taskInProgress = Array.from(columns.InProgress.tasks);
  const taskToDo = Array.from(columns.Todo.tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string ;
    const overId = over.id as string;

    // Find source column with proper typing
    const sourceColumn = Object.keys(columns).find((key) =>
      columns[key as TaskStatus].tasks.some((t) => t.order === Number(activeId))
    ) as TaskStatus | undefined;

    // Find destination column
    const destColumn = Object.keys(columns).find(
      (key) =>
        columns[key as TaskStatus].tasks.some((t) => t.order === Number(overId)) ||
        key === overId
    ) as TaskStatus | undefined;

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = columns[sourceColumn].tasks;
    const destTasks = columns[destColumn].tasks;

    if (sourceColumn === destColumn) {
      // Reordering within same column
      const oldIndex = sourceTasks.findIndex((t) => t.order === Number(activeId));
      const newIndex = destTasks.findIndex((t) => t.order === Number(overId));

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        reorderTasks(sourceColumn, oldIndex, newIndex);
      }
    } else {
      // Moving between columns
      const sourceIndex = sourceTasks.findIndex((t) => t.order === Number(activeId));
      const destIndex = destTasks.findIndex((t) => t.order === Number(overId));
      const newIndex = destIndex !== -1 ? destIndex : destTasks.length;

      if (sourceIndex !== -1) {
        
        moveTask(activeId, sourceColumn, destColumn, newIndex);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-col w-full">
        <div className="flex row my-3 border-b-1 py-3">
          <p className="text-xl font-medium">Task Board</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-2xl font-medium">Let’s manage your tasks 👏🏻</p>
          <div className="mx-6">
            <TaskForm task={null} />
          </div>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 w-full h-full">
          <TaskList
            taskList={taskToDo}
            title="To Do"
            bgColor="bg-gray-50"
            icon={<ListPlus color="#4B5563" size={24} />}
          />
          <TaskList
            taskList={taskInProgress}
            title="In Progress"
            bgColor="bg-sky-50"
            icon={<CircleDashed color="#60A5FA" size={24} />}
          />
          <TaskList
            taskList={taskDone}
            title="Done"
            bgColor="bg-green-50"
            icon={<ListChecks size={24} color="#22C55E" />}
          />
        </div>
      </DndContext>
    </div>
  );
}

export default TaskBoardPage;
