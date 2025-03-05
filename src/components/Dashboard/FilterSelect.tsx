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
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="All" className="dark:text-white dark:focus:bg-gray-700">
              {isStatus ? "All Status" : "All Priorities"}
            </SelectItem>
            {isStatus ? (
              <>
                <SelectItem value="Todo" className="dark:text-white dark:focus:bg-gray-700"> ⚫️ To Do</SelectItem>
                <SelectItem value="InProgress" className="dark:text-white dark:focus:bg-gray-700">🔵 In Progress</SelectItem>
                <SelectItem value="Done" className="dark:text-white dark:focus:bg-gray-700">🟢 Done</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="Low" className="dark:text-white dark:focus:bg-gray-700">🟢 Low</SelectItem>
                <SelectItem value="Medium" className="dark:text-white dark:focus:bg-gray-700">🟠 Medium</SelectItem>
                <SelectItem value="High" className="dark:text-white dark:focus:bg-gray-700">🔴 High</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
