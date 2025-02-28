// src/types/task.ts
export type TaskStatus = "Todo" | "InProgress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  order: number; // For positioning within a column
}

export interface Column {
  id: TaskStatus;
  title: string;
  taskIds: string[]; // For maintaining order
}

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Record<TaskStatus, Column>;
  columnOrder: TaskStatus[];
}
