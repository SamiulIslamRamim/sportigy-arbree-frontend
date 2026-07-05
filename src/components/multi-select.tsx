
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";


import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

type Option = { id: string; name: string };

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled,
  id,
}: {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const toggle = (name: string) => {
    onChange(value.includes(name) ? value.filter((v) => v !== name) : [...value, name]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-auto min-h-9 w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {value.map((name) => (
              <Badge
                key={name}
                variant="secondary"
                className="mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(name);
                }}
              >
                {name}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.id} onSelect={() => toggle(opt.name)}>
                  <Check className={cn("mr-2 h-4 w-4", value.includes(opt.name) ? "opacity-100" : "opacity-0")} />
                  {opt.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}