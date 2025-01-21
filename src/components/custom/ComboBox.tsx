import { Check } from "lucide-react";
import { CommandItem } from "../ui/command";
import { CommandGroup } from "../ui/command";
import { CommandEmpty } from "../ui/command";
import { CommandInput, CommandList } from "../ui/command";
import { Command } from "../ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  options: {
    label: string;
    value: string;
  }[];
  onOptionSelected: (option: string) => void;
  initialValue?: string;
};

export function ComboBox({ options, onOptionSelected, initialValue }: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialValue || "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Command className="w-full">
          <CommandInput placeholder="Search types..." className="h-9" />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onOptionSelected(currentValue);
                    setValue(currentValue);
                    setOpen(false)
                  }}
                  className="w-full"
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
