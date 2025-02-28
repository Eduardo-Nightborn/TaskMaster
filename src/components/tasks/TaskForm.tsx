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
import { BadgeCheck, Plus, Pencil } from "lucide-react";

const TaskStatusSchema = z.enum(["Todo", "InProgress", "Done"]);
const TaskPrioritySchema = z.enum(["Low", "Medium", "High"]);

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must have at least 3 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must have at least 5 characters" }),
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
});

type FormTask = Omit<Task, "id" | "createdAt" | "order">;

interface TaskFormProps {
  task?: Task | null;
}

export const TaskForm = ({ task }: TaskFormProps) => {
  const { addTask, updateTask } = useTaskStore();
  const isEditing = !!task;

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormTask>({
    resolver: zodResolver(formSchema),
    defaultValues: task || {
      title: "",
      description: "",
      status: "Todo",
      priority: "Low",
      dueDate: new Date().toISOString(),
    },
  });

  const onSubmit = (data: FormTask) => {
    if (isEditing && task) {
      updateTask(task.id, data);
      toast(
        <div className="flex items-center flex-row text-[#08553b]">
          <BadgeCheck color="#10b981" />
          <p className="px-2">Your task has been updated successfully!</p>
        </div>
      );
    } else {
      const newTask = {
        ...data,
        createdAt: new Date().toISOString(),
        order: 0,
      };
      addTask(newTask);
      toast(
        <div className="flex items-center flex-row text-[#08553b]">
          <BadgeCheck color="#10b981" />
          <p className="px-2">Your task has been created successfully!</p>
        </div>
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex flex-row rounded shadow bg-primary cursor-pointer hover:shadow-xl transition-all">
          {task !== null ? (
            <>
              <Plus color="#FFFFFF" size={32} /> Edit Task
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" /> Add new Task
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            🗒️ {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <Separator />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-3">
            <Label
              className="my-3 text-sm text-[#161618] font-light"
              htmlFor="title"
            >
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
                  className="my-2"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm font-light">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="p-3">
            <Label
              className="my-3 text-sm text-[#161618] font-light"
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
                  className="my-2 resize-none"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm font-light">
                {errors.description.message}
              </p>
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

          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogTrigger>
            <DialogTrigger>
              <Button
                className="flex flex-row bg-primary cursor-pointer"
                type="submit"
              >
                {isEditing ? "Save modifications" : "Create Task"}
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
