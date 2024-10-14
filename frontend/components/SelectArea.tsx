"use client"

import React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Kee = 
  'country_name' |
  'state_name' |
  'city_name'

export function SelectArea({ name, areas, keyname, setVal }: {name: string, areas: {country_name: string, state_name: string, city_name: string}[], keyname: Kee, setVal: React.Dispatch<React.SetStateAction<string>>}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  console.log('cct', keyname, areas)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            // ? areas.find((area) => area[keyname] === value)?.keyname
            ? value
            : `Select ${name}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="h-52">
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              {areas?.map((area, index) => (
                <CommandItem
                  key={index}
                  // keyname={area?.[keyname]}
                  value={area?.[keyname]}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setVal(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === area?.[keyname] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {area?.[keyname]}
                  {/* {area?.country_name} */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}