"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
// DateRange ve SelectSingleEventHandler'ı import ettiğinizden emin olun
import { DayPicker, type DateRange, SelectSingleEventHandler } from "react-day-picker"
import { tr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// DayPicker'ın temel prop tiplerini alıyoruz, ref'leri hariç tutarak daha temiz bir başlangıç yapıyoruz.
export type CalendarProps = React.ComponentPropsWithoutRef<typeof DayPicker>

export function CalendarComponent({
  className,
  classNames,
  showOutsideDays = true,
  // selectedDate ve onSelect prop'larının tiplerini doğrudan burada belirliyoruz
 selected,
  onSelect,
  ...props
}: CalendarProps & {
  selected?: Date | undefined;
  onSelect?: SelectSingleEventHandler;
}) {

  // Bugünden önceki tarihleri devre dışı bırak
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Bugünün başlangıcını almak için saat, dakika, saniye ve milisaniyeyi sıfırlıyoruz

  // handleSelect fonksiyonu DayPicker'ın onSelect'i için doğru tipe sahip olmalı
  const handleSelect: SelectSingleEventHandler = (date, selectedDay, activeModifiers, e) => {
    // Dışarıya gönderilecek onSelect fonksiyonu yoksa çık
    if (!onSelect) return;

    // `mode="single"` olduğu için `date` parametresi zaten `Date | undefined` tipinde gelir.
    // Saati ayarlayarak olası saat dilimi sorunlarını önleyelim.
    if (date) {
      const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); // Öğlen 12:00'ye ayarla
      onSelect(adjustedDate, selectedDay, activeModifiers, e);
    } else {
      onSelect(undefined, selectedDay, activeModifiers, e);
    }
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      locale={tr} // Türkçe lokalizasyon kullanılıyor
      disabled={(date) => {
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        // Geçmiş tarihleri ve hafta sonlarını devre dışı bırak
        const isWeekend = checkDate.getDay() === 0 || checkDate.getDay() === 6 // 0: Pazar, 6: Cumartesi
        const isPast = checkDate < today // Seçilen tarihin bugünden önce olup olmadığını kontrol et

        return isPast || isWeekend // Geçmiş veya hafta sonu ise devre dışı bırak
      }}
      mode="single" // Tekli tarih seçimi modu
      selected={selected} // Seçili tarihi buraya iletiyoruz
      onSelect={handleSelect} // Tarih seçildiğinde çalışacak fonksiyon
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