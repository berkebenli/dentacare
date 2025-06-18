"use client"

import * as React from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarComponent } from "@/components/calendar"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({ date, onSelect, placeholder = "Tarih seçin", disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (onSelect) {
      onSelect(newDate)
    }
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
        disabled={disabled}
        onClick={handleToggle}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: tr }) : <span>{placeholder}</span>}
        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Calendar Dropdown */}
          <div className="absolute top-full left-0 z-50 mt-2 rounded-md border bg-white p-0 shadow-lg">
            <CalendarComponent selectedDate={selectedDate} onSelect={handleSelect} />
          </div>
        </>
      )}
    </div>
  )
}
