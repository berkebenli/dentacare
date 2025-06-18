"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DateRange } from "react-day-picker"
import { tr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function CalendarComponent({
  className,
  classNames,
  showOutsideDays = true,
  selectedDate,
  onSelect,
  ...props
}: CalendarProps & {
  selectedDate?: Date | undefined
  onSelect?: (date: Date | undefined) => void
}) {
  // Bugünden önceki tarihleri devre dışı bırak
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleSelect = (date: Date | DateRange | undefined) => {
    if (!date || !onSelect) return

    // Eğer date bir DateRange ise (nesne içinde from var mı kontrolü)
    if (typeof date === "object" && "from" in date) {
      // Tekli seçim modunda genellikle böyle gelmez ama garanti olsun diye:
      const fromDate = date.from
        ? new Date(date.from.getFullYear(), date.from.getMonth(), date.from.getDate(), 12)
        : undefined
      onSelect(fromDate)
    } else if (date instanceof Date) {
      const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
      onSelect(adjustedDate)
    } else {
      onSelect(undefined)
    }
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      locale={tr}
      disabled={(date) => {
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        // Geçmiş tarihleri ve hafta sonlarını devre dışı bırak
        const isWeekend = checkDate.getDay() === 0 || checkDate.getDay() === 6
        const isPast = checkDate < today

        return isPast || isWeekend
      }}
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-sky-600 text-white hover:bg-sky-700 hover:text-white focus:bg-sky-600 focus:text-white font-semibold",
        day_today: "bg-sky-100 text-sky-800 font-medium",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
