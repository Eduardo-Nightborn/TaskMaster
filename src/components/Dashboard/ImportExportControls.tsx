import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Download, AlertCircle, BadgeCheck } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Task } from "@/types/task";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ImportResult {
  newTasks: Task[];
  duplicates: Task[];
}

export const ImportExportControls = () => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  
  const getAllTasks = useTaskStore((state) => state.getAllTasks);
  const addTask = useTaskStore((state) => state.addTask);

  const handleExport = () => {
    const tasks = getAllTasks();
    const exportData = JSON.stringify(tasks, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmaster-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); 
    toast(
        <div className="flex items-center flex-row text-[#08553b]">
          <BadgeCheck color="#10b981" />
          <p className="px-2">Tasks exported successfully!</p>
        </div>
      );
  };

  const validateImportData = (data: any): data is Task[] => {
    if (!Array.isArray(data)) return false;
    return data.every(task => 
      typeof task.id === 'string' &&
      typeof task.title === 'string' &&
      typeof task.description === 'string' &&
      ['Todo', 'InProgress', 'Done'].includes(task.status) &&
      ['Low', 'Medium', 'High'].includes(task.priority) &&
      typeof task.dueDate === 'string' &&
      typeof task.createdAt === 'string' &&
      typeof task.order === 'number'
    );
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateImportData(data)) {
        throw new Error('Invalid file format');
      }

      const existingTasks = getAllTasks();
      const existingIds = new Set(existingTasks.map(t => t.id));
      
      const newTasks: Task[] = [];
      const duplicates: Task[] = [];

      data.forEach((task: Task) => {
        if (existingIds.has(task.id)) {
          duplicates.push(task);
        } else {
          newTasks.push(task);
        }
      });

      if (duplicates.length > 0) {
        setImportResult({ newTasks, duplicates });
        setShowDuplicateDialog(true);
      } else {
        importTasks(newTasks);
      }
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error instanceof Error ? error.message : 'Failed to import tasks'}</span>
        </div>
      );
    } finally {
      setImporting(false);
      setProgress(100);
      // Reset the file input
      event.target.value = '';
    }
  };

  const importTasks = async (tasks: Task[]) => {
    const total = tasks.length;
    for (let i = 0; i < total; i++) {
      const task = tasks[i];
      await addTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        dependencies: task.dependencies
      });
      setProgress(((i + 1) / total) * 100);
    }
    toast(
        <div className="flex items-center flex-row text-[#08553b]">
          <BadgeCheck color="#10b981" />
          <p className="px-2">Imported {total} tasks successfully!</p>
        </div>
      );
  };

  const handleDuplicateResolution = async (includeDuplicates: boolean) => {
    if (!importResult) return;
    
    const tasksToImport = includeDuplicates 
      ? [...importResult.newTasks, ...importResult.duplicates]
      : importResult.newTasks;
    
    await importTasks(tasksToImport);
    setShowDuplicateDialog(false);
    setImportResult(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleExport}
        className="flex items-center gap-2 rounded shadow bg-primary hover:shadow-xl transition-all"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </Button>
      
      <div className="relative">
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={importing}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={importing}
        >
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </Button>
      </div>

      {importing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Importing Tasks</h3>
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Please wait while your tasks are being imported...</p>
          </div>
        </div>
      )}

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Duplicate Tasks Found</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              {importResult && (
                <>
                  Found {importResult.duplicates.length} duplicate tasks. How would you like to proceed?
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={() => handleDuplicateResolution(false)}
                      className="w-full dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      variant="outline"
                    >
                      Skip duplicates ({importResult.newTasks.length} new tasks only)
                    </Button>
                    <Button
                      onClick={() => handleDuplicateResolution(true)}
                      className="w-full"
                    >
                      Import all ({importResult.newTasks.length + importResult.duplicates.length} tasks)
                    </Button>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};