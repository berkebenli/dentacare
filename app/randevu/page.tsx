"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, CheckCircle, AlertCircle } from "lucide-react"

export default function AppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookedTimes, setBookedTimes] = useState<string[]>([]) // 🚫 Dolu saatler
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const [appointmentData, setAppointmentData] = useState({
    service: "",
    date: undefined as Date | undefined,
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const services = [
    { value: "genel-kontrol", label: "Genel Kontrol ve Muayene" },
    { value: "dis-temizligi", label: "Diş Temizliği" },
    { value: "beyazlatma", label: "Diş Beyazlatma" },
    { value: "dolgu", label: "Dolgu Tedavisi" },
    { value: "kanal-tedavisi", label: "Kanal Tedavisi" },
    { value: "implant", label: "İmplant" },
    { value: "protez", label: "Protez" },
    { value: "ortodonti", label: "Ortodonti" },
    { value: "cerrahi", label: "Cerrahi İşlemler" },
    { value: "diger", label: "Diğer" },
  ]

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  // 🔍 DÜZELTME: Seçilen tarihteki dolu saatleri kontrol et
  const checkAvailableSlots = async (selectedDate: Date) => {
    if (!selectedDate) return

    setCheckingAvailability(true)
    try {
      // 🎯 TARİH FORMATINI DÜZELT
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
      const day = String(selectedDate.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`

      // 🚀 DAHA GÜÇLÜ SORGU: Hem tarih hem de saat kontrolü
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("time, appointment_date, name, status")
        .gte("appointment_date", `${dateStr}T00:00:00.000Z`)
        .lt("appointment_date", `${dateStr}T23:59:59.999Z`)
        .neq("status", "cancelled") // İptal edilenler hariç

      if (error) {
        console.error("❌ Veritabanı hatası:", error)
        throw error
      }

      const bookedSlots = [...new Set(appointments?.map((app) => app.time) || [])]
      setBookedTimes(bookedSlots)
    } catch (error) {
      console.error("❌ Dolu saatler kontrol edilirken hata:", error)
      setBookedTimes([])
    } finally {
      setCheckingAvailability(false)
    }
  }

  // Tarih değiştiğinde dolu saatleri kontrol et
  useEffect(() => {
    if (appointmentData.date) {
      checkAvailableSlots(appointmentData.date)

      // Seçili saat dolu ise temizle
      if (appointmentData.time && bookedTimes.includes(appointmentData.time)) {
        setAppointmentData((prev) => ({ ...prev, time: "" }))
      }
    }
  }, [appointmentData.date])

  // 🔄 Dolu saatler değiştiğinde kontrol et
  useEffect(() => {
    if (appointmentData.time && bookedTimes.includes(appointmentData.time)) {
      setAppointmentData((prev) => ({ ...prev, time: "" }))
    }
  }, [bookedTimes, appointmentData.time])

  const handleChange = (field: string, value: any) => {
    setAppointmentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!appointmentData.date) {
        alert("Lütfen bir tarih seçin!")
        return
      }

      // 🚫 SON KONTROL: Seçilen saat hala müsait mi?
      await checkAvailableSlots(appointmentData.date)

      // Kısa bir bekleme süresi ekle ki kontrol tamamlansın
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (bookedTimes.includes(appointmentData.time)) {
        alert(
          `❌ Üzgünüz, ${appointmentData.time} saati başka bir hasta tarafından alındı. Lütfen başka bir saat seçin.`,
        )
        setStep(2) // Saat seçim adımına geri dön
        setLoading(false)
        return
      }

      // 🎯 TARİH FORMATINI DÜZELT
      const appointmentDateTime = new Date(appointmentData.date)
      appointmentDateTime.setHours(12, 0, 0, 0) // Saat dilimi sorunlarını önlemek için

      const { error } = await supabase.from("appointments").insert({
        service: appointmentData.service,
        appointment_date: appointmentDateTime.toISOString(),
        time: appointmentData.time,
        name: appointmentData.name,
        phone: appointmentData.phone,
        email: appointmentData.email,
        notes: appointmentData.notes,
        status: "pending",
      })

      if (error) {
        console.error("❌ Randevu kaydetme hatası:", error)
        throw error
      }

      setStep(4)
    } catch (error) {
      console.error("❌ Randevu oluşturulurken hata:", error)
      alert("Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const selectedService = services.find((s) => s.value === appointmentData.service)

  // 🎨 Saat slot'unun durumunu belirle
  const getTimeSlotStatus = (time: string) => {
    if (bookedTimes.includes(time)) {
      return "booked" // Dolu
    }
    return "available" // Müsait
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-sky-800 mb-2">Online Randevu</h1>
            <p className="text-gray-600">Hızlı ve kolay randevu alın</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step >= stepNumber ? "bg-sky-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Hizmet Seçimi */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Hizmet Seçimi
                </CardTitle>
                <CardDescription>Almak istediğiniz hizmeti seçin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {services.map((service) => (
                    <div
                      key={service.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-sky-300 ${
                        appointmentData.service === service.value ? "border-sky-600 bg-sky-50" : "border-gray-200"
                      }`}
                      onClick={() => handleChange("service", service.value)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{service.label}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleNext}
                  disabled={!appointmentData.service}
                  className="w-full bg-sky-600 hover:bg-sky-700"
                >
                  Devam Et
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Tarih ve Saat Seçimi */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tarih ve Saat Seçimi
                </CardTitle>
                <CardDescription>
                  {selectedService && `${selectedService.label} için uygun tarih ve saat seçin`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tarih Seçimi */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Tarih Seçin</Label>
                  <DatePicker
                    date={appointmentData.date}
                    onSelect={(date) => handleChange("date", date)}
                    placeholder="Randevu tarihi seçin"
                  />
                  {appointmentData.date && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Seçilen tarih:{" "}
                      {appointmentData.date.toLocaleDateString("tr-TR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Saat Seçimi */}
                {appointmentData.date && (
                  <div>
                    <Label className="text-base font-medium mb-3 block flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Saat Seçin
                      {checkingAvailability && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-sky-600"></div>
                          Kontrol ediliyor...
                        </span>
                      )}
                    </Label>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((time) => {
                        const status = getTimeSlotStatus(time)
                        const isBooked = status === "booked"
                        const isSelected = appointmentData.time === time

                        return (
                          <Button
                            key={time}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => !isBooked && handleChange("time", time)}
                            disabled={isBooked || checkingAvailability}
                            className={`relative ${
                              isSelected
                                ? "bg-sky-600 hover:bg-sky-700"
                                : isBooked
                                  ? "bg-red-50 text-red-500 border-red-200 cursor-not-allowed opacity-60"
                                  : "hover:border-sky-300"
                            }`}
                          >
                            {time}
                            {isBooked && (
                              <div className="absolute -top-1 -right-1">
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              </div>
                            )}
                          </Button>
                        )
                      })}
                    </div>

                    {/* 🎯 DETAYLI DURUM BİLGİSİ */}
                    <div className="mt-4 space-y-2">
                      {/* Dolu saatler uyarısı */}
                      {bookedTimes.length > 0 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              ❌ Bu tarihte DOLU saatler: {bookedTimes.join(", ")}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Müsait saatler bilgisi */}
                      {appointmentData.date && !checkingAvailability && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">
                              ✅ Müsait saatler:
                              {timeSlots.filter((time) => !bookedTimes.includes(time)).length > 0 &&
                                ` (${timeSlots.filter((time) => !bookedTimes.includes(time)).join(", ")})`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Geri
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!appointmentData.date || !appointmentData.time || checkingAvailability}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  Devam Et
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Kişisel Bilgiler */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kişisel Bilgiler
                </CardTitle>
                <CardDescription>Randevu için kişisel bilgilerinizi girin</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="appointment-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={appointmentData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        value={appointmentData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0555 123 45 67"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={appointmentData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Ek Notlar</Label>
                    <Textarea
                      id="notes"
                      value={appointmentData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Varsa özel durumlarınızı belirtin..."
                      rows={3}
                    />
                  </div>

                  {/* Özet */}
                  <div className="bg-sky-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Randevu Özeti:</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Hizmet:</strong> {selectedService?.label}
                      </p>
                      <p>
                        <strong>Tarih:</strong> {appointmentData.date?.toLocaleDateString("tr-TR")}
                      </p>
                      <p>
                        <strong>Saat:</strong> {appointmentData.time}
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={loading}>
                  Geri
                </Button>
                <Button
                  type="submit"
                  form="appointment-form"
                  disabled={loading || !appointmentData.name || !appointmentData.phone || !appointmentData.email}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  {loading ? "İşleniyor..." : "Randevu Oluştur"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4: Başarılı */}
          {step === 4 && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Randevunuz Oluşturuldu!</h2>
                <p className="text-gray-600 mb-6">
                  Randevunuz başarıyla kaydedildi. En kısa sürede size dönüş yapacağız.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-2">Randevu Detayları:</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Hizmet:</strong> {selectedService?.label}
                    </p>
                    <p>
                      <strong>Tarih:</strong> {appointmentData.date?.toLocaleDateString("tr-TR")}
                    </p>
                    <p>
                      <strong>Saat:</strong> {appointmentData.time}
                    </p>
                    <p>
                      <strong>Ad Soyad:</strong> {appointmentData.name}
                    </p>
                    <p>
                      <strong>Telefon:</strong> {appointmentData.phone}
                    </p>
                  </div>
                </div>
                <Button onClick={() => router.push("/")} className="bg-sky-600 hover:bg-sky-700">
                  Ana Sayfaya Dön
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
