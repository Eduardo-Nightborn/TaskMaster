import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskStatus } from "../types/task";
import {
  addTaskService,
  deleteTaskService,
  fetchTasksService,
  updateTaskService,
} from "@/services/TaskServices";

interface BoardState {
  columns: {
    Todo: {
      id: "Todo";
      title: "To Do";
      tasks: Task[];
    };
    InProgress: {
      id: "InProgress";
      title: "In Progress";
      tasks: Task[];
    };
    Done: {
      id: "Done";
      title: "Done";
      tasks: Task[];
    };
  };
  columnOrder: TaskStatus[];
}

interface TaskStore extends BoardState {
  addTask: (task: Omit<Task, "id" | "createdAt" | "order">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (
    taskId: string,
    source: TaskStatus,
    destination: TaskStatus,
    newIndex: number
  ) => void;
  reorderTasks: (
    status: TaskStatus,
    startIndex: number,
    endIndex: number
  ) => void;
  fetchTasks: () => Promise<void>;
  getAllTasks: () => Task[]; // New method to get all tasks
}

const initialState: BoardState = {
  columns: {
    Todo: {
      id: "Todo",
      title: "To Do",
      tasks: [],
    },
    InProgress: {
      id: "InProgress",
      title: "In Progress",
      tasks: [],
    },
    Done: {
      id: "Done",
      title: "Done",
      tasks: [],
    },
  },
  columnOrder: ["Todo", "InProgress", "Done"],
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addTask: (taskData) =>
        set((state) => {
          const id = Date.now().toString();
          const newTask: Task = {
            ...taskData,
            id,
            createdAt: new Date().toISOString(),
            order: state.columns[taskData.status].tasks.length,
          };
          addTaskService(newTask);
          return {
            columns: {
              ...state.columns,
              [taskData.status]: {
                ...state.columns[taskData.status],
                tasks: [...state.columns[taskData.status].tasks, newTask],
              },
            },
          };
        }),

      updateTask: (id, updates) =>
        set((state) => {
          // Find the column containing the task
          const columnKey = Object.keys(state.columns).find((key) =>
            state.columns[key as TaskStatus].tasks.some((t) => t.id === id)
          ) as TaskStatus;
          if (!columnKey) return state;
          const updatedTasks = state.columns[columnKey].tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          );

          if (updates.status && updates.status !== columnKey) {
            const taskToMove = updatedTasks.find((t) => t.id === id)!;
            if (!taskToMove) return state;
            updateTaskService(columnKey, taskToMove);
            return {
              columns: {
                ...state.columns,
                [columnKey]: {
                  ...state.columns[columnKey],
                  tasks: updatedTasks.filter((t) => t.id !== id),
                },
                [updates.status]: {
                  ...state.columns[updates.status],
                  tasks: [...state.columns[updates.status].tasks, taskToMove],
                },
              },
            };
          }
          // If status didn't change, just update the task
          const updatedTask = updatedTasks.find((t) => t.id === id);
          if (updatedTask) {
            updateTaskService(updatedTask.id, updatedTask);
          }
          return {
            columns: {
              ...state.columns,
              [columnKey]: {
                ...state.columns[columnKey],
                tasks: updatedTasks,
              },
            },
          };
        }),

      deleteTask: (id) =>
        set((state) => {
          deleteTaskService(id);
          const columnKey = Object.keys(state.columns).find((key) =>
            state.columns[key as TaskStatus].tasks.some((t) => t.id === id)
          ) as TaskStatus;

          if (!columnKey) return state;

          return {
            columns: {
              ...state.columns,
              [columnKey]: {
                ...state.columns[columnKey],
                tasks: state.columns[columnKey].tasks.filter(
                  (t) => t.id !== id
                ),
              },
            },
          };
        }),

      moveTask: (taskId, source, destination, newIndex) =>
        set((state) => {
          const sourceTasks = [...state.columns[source].tasks];
          const taskIndex = sourceTasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return state; // Safety check

          // Remove the task from the source column
          const [task] = sourceTasks.splice(taskIndex, 1);
          const updatedTask = { ...task, status: destination, order: newIndex };

          // Reindex remaining tasks in the source column
          const updatedSourceTasks = sourceTasks.map((t, index) => ({
            ...t,
            order: index,
          }));

          // Insert the task into the destination column
          const destinationTasks = [...state.columns[destination].tasks];
          destinationTasks.splice(newIndex, 0, updatedTask);

          // Reindex all tasks in the destination column
          const updatedDestinationTasks = destinationTasks.map((t, index) => ({
            ...t,
            order: index,
          }));

          // Update the task in the service (if necessary)
          updateTaskService(taskId, updatedTask);

          return {
            columns: {
              ...state.columns,
              [source]: {
                ...state.columns[source],
                tasks: updatedSourceTasks,
              },
              [destination]: {
                ...state.columns[destination],
                tasks: updatedDestinationTasks,
              },
            },
          };
        }),

      reorderTasks: (status, startIndex, endIndex) =>
        set((state) => {
          const newTasks = [...state.columns[status].tasks];
          const [removed] = newTasks.splice(startIndex, 1);
          newTasks.splice(endIndex, 0, removed);

          newTasks.forEach((task, index) => {
            task.order = index;
            updateTaskService(task.id, task);
          });

          return {
            columns: {
              ...state.columns,
              [status]: {
                ...state.columns[status],
                tasks: newTasks,
              },
            },
          };
        }),

      fetchTasks: async () => {
        const tasks = await fetchTasksService();
        const columns: BoardState["columns"] = {
          Todo: { id: "Todo", title: "To Do", tasks: [] },
          InProgress: { id: "InProgress", title: "In Progress", tasks: [] },
          Done: { id: "Done", title: "Done", tasks: [] },
        };

        tasks.forEach((task: Task) => {
          columns[task.status].tasks.push(task);
        });

        set({ columns });
      },

      
      getAllTasks: () => {
        const state = get();
        return Object.values(state.columns).flatMap((column) => column.tasks);
      },
    }),
    {
      name: "taskmaster-storage",
    }
  )
);