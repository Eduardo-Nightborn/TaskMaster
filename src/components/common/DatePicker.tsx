import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  control: any;
  name: string;
  label: string;
  errorMessage: string | undefined;
}

export function DatePicker({
  control,
  name,
  label,
  errorMessage,
}: DatePickerProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col px-3">
          <Label
            className="mb-2 text-sm text-[#161618] font-light dark:text-white"
            htmlFor={name}
          >
            {label}
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
              />
            </PopoverContent>
          </Popover>

          {errorMessage && (
            <p className="text-red-500 text-sm font-light mt-1">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    />
  );
}
