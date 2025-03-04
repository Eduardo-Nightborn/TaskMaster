import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrioritySelectorProps {
  onChange: (filter: string) => void;
  placeholder: string;
  value: string | undefined;
  isStatus: boolean;
}

export const FilterSelector = ({
  onChange,
  placeholder,
  value,
  isStatus,
}: PrioritySelectorProps) => {
  return (
    <div className="flex flex-row w-full lg:w-2/3 items-center justify-center">
      <div className="px-3 w-[250px] md:w-[150px] lg:w-[150px]">
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">
              {isStatus ? "All Status" : "All Priorities"}
            </SelectItem>
            {isStatus ? (
              <>
                <SelectItem value="Todo"> ⚫️ To Do</SelectItem>
                <SelectItem value="InProgress">🔵 In Progress</SelectItem>
                <SelectItem value="Done">🟢 Done</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="Low">🟢 Low</SelectItem>
                <SelectItem value="Medium">🟠 Medium</SelectItem>
                <SelectItem value="High">🔴 High</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
