import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface PrioritySelectorProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  errorMessage: string | undefined;
}

export const PrioritySelector = ({
  control,
  name,
  label,
  placeholder,
  errorMessage,
}: PrioritySelectorProps) => {
  return (
    <div className="p-3">
      <Label className="mb-2 text-sm text-[#161618] font-light" htmlFor={name}>
        {label}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">🟢 Low</SelectItem>
              <SelectItem value="Medium">🟠 Medium</SelectItem>
              <SelectItem value="High">🔴 High</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm font-light mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
