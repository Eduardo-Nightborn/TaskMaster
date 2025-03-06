// TaskDependency.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaskStore } from "@/store/useTaskStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "lucide-react";

interface TaskDependencyProps {
  onDependenciesSelected: (selectedTasks: string[]) => void;
  currentTaskId?: string;
  selectedDependencies: string[];
}

export const TaskDependency = ({ 
  onDependenciesSelected, 
  currentTaskId, 
  selectedDependencies 
}: TaskDependencyProps) => {
  const getAllTasks = useTaskStore((state) => state.getAllTasks);
  const [selectedTasks, setSelectedTasks] = useState<string[]>(selectedDependencies);
  const [open, setOpen] = useState(false);
  const tasks = getAllTasks().filter(task => task.id !== currentTaskId && task.status === "Todo");

  useEffect(() => {
    setSelectedTasks(selectedDependencies);
  }, [selectedDependencies]);

  const handleCheckboxChange = (checked: boolean, taskId: string) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(t => t !== taskId));
    }
  };

  const handleSubmit = () => {
    onDependenciesSelected(selectedTasks);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full max-w-xs mx-auto mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
        >
          <Link className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium">Add Dependencies</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Select Task Dependencies
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[320px] w-full mt-4">
          <div className="space-y-3 pr-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-700"
              >
                <Checkbox
                  id={task.id}
                  checked={selectedTasks.some(t => t === task.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, task.id)}
                  className="h-5 w-5 border-gray-300 rounded-md text-blue-600 dark:border-gray-600 dark:text-blue-500"
                />
                <label
                  htmlFor={task.id}
                  className="flex-1 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{task.title}</span>
                    <span className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
                      {task.description}
                    </span>
                  </div>
                </label>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm dark:text-gray-400">
                No available tasks to add as dependencies
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Add Selected Dependencies ({selectedTasks.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};