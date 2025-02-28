import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskStatus } from "../types/task";

// Update BoardState to use tasks directly instead of taskIds
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
    (set) => ({
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
          const columnKey = Object.keys(state.columns).find(
            (key) =>
              state.columns[key as TaskStatus].tasks.some((t) => t.id === id)
          ) as TaskStatus;

          if (!columnKey) return state;

          const updatedTasks = state.columns[columnKey].tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          );

          // If status changed, move the task
          if (updates.status && updates.status !== columnKey) {
            const taskToMove = updatedTasks.find((t) => t.id === id)!;
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
          const columnKey = Object.keys(state.columns).find(
            (key) =>
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
          const [task] = sourceTasks.splice(taskIndex, 1);
          const updatedTask = { ...task, status: destination };
          
          const destinationTasks = [...state.columns[destination].tasks];
          destinationTasks.splice(newIndex, 0, updatedTask);

          return {
            columns: {
              ...state.columns,
              [source]: {
                ...state.columns[source],
                tasks: sourceTasks,
              },
              [destination]: {
                ...state.columns[destination],
                tasks: destinationTasks,
              },
            },
          };
        }),

      reorderTasks: (status, startIndex, endIndex) =>
        set((state) => {
          const newTasks = [...state.columns[status].tasks];
          const [removed] = newTasks.splice(startIndex, 1);
          newTasks.splice(endIndex, 0, removed);

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
        const response = await fetch("http://localhost:3000/task");
        const tasks = await response.json();

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
    }),
    {
      name: "taskmaster-storage",
    }
  )
);