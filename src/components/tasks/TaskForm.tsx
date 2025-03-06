import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Task } from "@/types/task";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "../common/DatePicker";
import { PrioritySelector } from "../common/PrioritySelector";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/useTaskStore";
import { toast } from "sonner";
import { BadgeCheck, Plus, Pencil, X } from "lucide-react";
import { TaskDependency } from "./TaskDependency";

const TaskStatusSchema = z.enum(["Todo", "InProgress", "Done"]);
const TaskPrioritySchema = z.enum(["Low", "Medium", "High"]);

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must have at least 3 characters" }),
  description: z.string().min(5, { message: "Description must have at least 5 characters" }),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  dueDate: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(parsedDate.getTime()) && parsedDate > today;
    },
    { message: "The date must be a valid future date." }
  ),
  dependencies: z.array(z.string()).default([]),
});

type FormTask = Omit<Task, "id" | "createdAt" | "order">;

interface TaskFormProps {
  task?: Task | null;
}

export const TaskForm = ({ task }: TaskFormProps) => {
  const { addTask, updateTask } = useTaskStore();
  const getAllTasks = useTaskStore((state) => state.getAllTasks);
  const isEditing = !!task;
  const [open, setOpen] = useState(false);
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(task?.dependencies || []);

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormTask>({
    resolver: zodResolver(formSchema),
    defaultValues: task || {
      title: "",
      description: "",
      status: "Todo",
      priority: "Low",
      dueDate: new Date().toISOString(),
      dependencies: [],
    },
  });

  useEffect(() => {
    if (open && task) {
      reset(task);
      setSelectedDependencies(task.dependencies || []);
    }
  }, [open, task, reset]);

  const handleDependenciesSelected = (dependencies: string[]) => {
    setSelectedDependencies(dependencies);
    setValue("dependencies", dependencies);
  };

  const handleRemoveDependency = (taskId: string) => {
    const updatedDependencies = selectedDependencies.filter((dep) => dep !== taskId);
    setSelectedDependencies(updatedDependencies);
    setValue("dependencies", updatedDependencies);
  };

  const onSubmit = (data: FormTask) => {
    setOpen(false);
    try {
      if (isEditing && task) {
        updateTask(task.id, { ...data, dependencies: selectedDependencies });
        toast(
          <div className="flex items-center flex-row text-[#08553b]">
            <BadgeCheck color="#10b981" />
            <p className="px-2">Your task has been updated successfully!</p>
          </div>
        );
      } else {
        const newTask = { ...data, dependencies: selectedDependencies };
        addTask(newTask);
        toast(
          <div className="flex items-center flex-row text-[#08553b]">
            <BadgeCheck color="#10b981" />
            <p className="px-2">Your task has been created successfully!</p>
          </div>
        );
      }
      
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const getDependencies = (taskIds: string[]): Task[] => {
    return getAllTasks().filter(t => taskIds.includes(t.id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} aria-describedby={undefined}>
      <DialogTrigger asChild>
        <Button
          className="flex flex-row rounded shadow bg-primary cursor-pointer hover:shadow-xl transition-all hover:translate-0.5"
          onClick={() => setOpen(true)}
        >
          {task ? (
            <>
              <Pencil className="mr-2 h-4 w-4 dark:text-[#3863C6]" /> Edit Task
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4 dark:text-[#3863C6]" size={32} /> Add new Task
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-black">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            🗒️ {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <Separator className="dark:bg-gray-700" />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-3">
            <Label className="my-3 text-sm text-[#161618] dark:text-white font-light" htmlFor="title">
              Title
            </Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  id="title"
                  required
                  placeholder="Title of your task..."
                  className="my-2 dark:bg-black dark:text-white"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm font-light">{errors.title.message}</p>
            )}
          </div>
          <div className="p-3">
            <Label
              className="my-3 text-sm text-[#161618] dark:text-white font-light"
              htmlFor="description"
            >
              Description
            </Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  required
                  placeholder="Describe your task..."
                  className="my-2 resize-none dark:bg-black dark:text-white"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm font-light">{errors.description.message}</p>
            )}
          </div>

          <DatePicker
            control={control}
            name="dueDate"
            label="Select the due date"
            errorMessage={errors.dueDate?.message}
          />
          <PrioritySelector
            control={control}
            name="priority"
            placeholder="Select the priority of your task"
            label="Priority"
            errorMessage={errors.priority?.message}
          />

          <TaskDependency
            onDependenciesSelected={handleDependenciesSelected}
            currentTaskId={task?.id}
            selectedDependencies={selectedDependencies}
          />

          {selectedDependencies.length > 0 && (
            <div className="mt-4 space-y-2 p-3">
              <Label className="text-sm text-[#161618] dark:text-white font-light">
                Selected Dependencies
              </Label>
              {getDependencies(selectedDependencies).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-3 px-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 dark:bg-transparent dark:hover:bg-gray-900"
                >
                  <span className="font-medium text-gray-900 truncate flex-1 dark:text-white">
                    {task.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDependency(task.id)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-150 focus:outline-none"
                  >
                    <X size={18} className="dark:text-white dark:hover:text-red-500 hover:text-red-500 cursor-pointer" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex flex-row justify-center text-white px-2 p-1 rounded shadow bg-primary cursor-pointer hover:shadow-xl transition-all hover:translate-0.5 dark:text-black"
            >
              {isEditing ? "Save modifications" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};