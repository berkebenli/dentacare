"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarComponent } from "@/components/calendar"
import Link from "next/link"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  ImageIcon,
} from "lucide-react"
import { DatePicker } from "@/components/date-picker"

type Appointment = {
  id: string
  service: string
  appointment_date: string
  time: string
  name: string
  phone: string
  email: string
  notes: string
  status: string
  created_at: string
}

type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  is_read: boolean
}

type ViewMode = "calendar" | "list" | "week" | "day"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("appointments")
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  // Form states
  const [newAppointment, setNewAppointment] = useState({
    service: "",
    date: undefined as Date | undefined,
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
    status: "confirmed",
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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true })

      if (appointmentsError) throw appointmentsError

      const { data: messagesData, error: messagesError } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (messagesError) throw messagesError

      setAppointments(appointmentsData || [])
      setMessages(messagesData || [])
    } catch (error) {
      console.error("Veri çekilirken hata:", error)
      alert("Veri yüklenirken hata oluştu!")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async () => {
    try {
      if (
        !newAppointment.name ||
        !newAppointment.phone ||
        !newAppointment.email ||
        !newAppointment.service ||
        !newAppointment.date ||
        !newAppointment.time
      ) {
        alert("Lütfen tüm zorunlu alanları doldurun!")
        return
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          service: newAppointment.service,
          appointment_date: newAppointment.date.toISOString(),
          time: newAppointment.time,
          name: newAppointment.name,
          phone: newAppointment.phone,
          email: newAppointment.email,
          notes: newAppointment.notes,
          status: newAppointment.status,
        })
        .select()

      if (error) throw error

      await fetchData()

      setNewAppointment({
        service: "",
        date: undefined,
        time: "",
        name: "",
        phone: "",
        email: "",
        notes: "",
        status: "confirmed",
      })

      setIsAddModalOpen(false)
      alert("Randevu başarıyla eklendi!")
    } catch (error) {
      console.error("Randevu eklenirken hata:", error)
      alert("Randevu eklenirken hata oluştu!")
    }
  }

  const handleEditAppointment = async () => {
    try {
      if (!editingAppointment) return

      const { error } = await supabase
        .from("appointments")
        .update({
          service: editingAppointment.service,
          appointment_date: editingAppointment.appointment_date,
          time: editingAppointment.time,
          name: editingAppointment.name,
          phone: editingAppointment.phone,
          email: editingAppointment.email,
          notes: editingAppointment.notes,
          status: editingAppointment.status,
        })
        .eq("id", editingAppointment.id)

      if (error) throw error

      await fetchData()
      setIsEditModalOpen(false)
      setEditingAppointment(null)
      alert("Randevu başarıyla güncellendi!")
    } catch (error) {
      console.error("Randevu güncellenirken hata:", error)
      alert("Randevu güncellenirken hata oluştu!")
    }
  }

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Bu randevuyu silmek istediğinizden emin misiniz?")) return

    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id)

      if (error) throw error

      await fetchData()
      alert("Randevu başarıyla silindi!")
    } catch (error) {
      console.error("Randevu silinirken hata:", error)
      alert("Randevu silinirken hata oluştu!")
    }
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", id)

      if (error) throw error

      setAppointments((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)))
      alert("Randevu durumu güncellendi!")
    } catch (error) {
      console.error("Durum güncellenirken hata:", error)
      alert("Güncelleme sırasında hata oluştu!")
    }
  }

  const markMessageAsRead = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id)

      if (error) throw error

      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)))
    } catch (error) {
      console.error("Mesaj okundu olarak işaretlenirken hata:", error)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)

      if (error) throw error

      setMessages((prev) => prev.filter((msg) => msg.id !== id))
      alert("Mesaj başarıyla silindi!")
    } catch (error) {
      console.error("Mesaj silinirken hata:", error)
      alert("Mesaj silinirken hata oluştu!")
    }
  }

  // Takvim fonksiyonları
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Pazartesi = 0
  }

  const getAppointmentsForDate = (date: Date) => {
    // 🎯 DÜZELTME: Local timezone'da tarih karşılaştırması
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const localDateStr = `${year}-${month}-${day}`

    return appointments.filter((app) => {
      // Veritabanından gelen tarihi de local timezone'da karşılaştır
      const appDate = new Date(app.appointment_date)
      const appYear = appDate.getFullYear()
      const appMonth = String(appDate.getMonth() + 1).padStart(2, "0")
      const appDay = String(appDate.getDate()).padStart(2, "0")
      const appLocalDateStr = `${appYear}-${appMonth}-${appDay}`

      return appLocalDateStr === localDateStr
    })
  }

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Pazartesi başlangıç
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek)
      weekDate.setDate(startOfWeek.getDate() + i)
      week.push(weekDate)
    }
    return week
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)

    if (viewMode === "calendar") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    }

    setCurrentDate(newDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Filtreleme fonksiyonları
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]

  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-800">Admin Paneli</h1>
        <div className="flex gap-2">
          <Link href="/admin/media">
            <Button variant="outline" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Fotoğraf Yönetimi
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Toplam Randevu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Bekleyen Randevu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {appointments.filter((app) => app.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Onaylı Randevu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter((app) => app.status === "confirmed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Yeni Mesaj
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{messages.filter((msg) => !msg.is_read).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "appointments"
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            📅 Randevular ({appointments.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "messages" ? "border-b-2 border-sky-600 text-sky-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            💬 Mesajlar ({messages.length})
          </button>
        </div>
      </div>

      {/* Randevular Tab */}
      {activeTab === "appointments" && (
        <div className="space-y-6">
          {/* Görünüm Seçimi ve Kontroller */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Görünüm Butonları */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className={viewMode === "calendar" ? "bg-sky-600 hover:bg-sky-700" : ""}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Takvim
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                    className={viewMode === "week" ? "bg-sky-600 hover:bg-sky-700" : ""}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Hafta
                  </Button>
                  <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("day")}
                    className={viewMode === "day" ? "bg-sky-600 hover:bg-sky-700" : ""}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Gün
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-sky-600 hover:bg-sky-700" : ""}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Liste
                  </Button>
                </div>

                {/* Tarih Navigasyonu */}
                {viewMode !== "list" && (
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-lg font-semibold min-w-[200px] text-center">
                      {viewMode === "calendar" && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                      {viewMode === "week" &&
                        `${getWeekDates(currentDate)[0].getDate()} - ${getWeekDates(currentDate)[6].getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                      {viewMode === "day" &&
                        `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                      Bugün
                    </Button>
                  </div>
                )}

                {/* Arama ve Yeni Randevu */}
                <div className="flex gap-2">
                  {viewMode === "list" && (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Ara..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-48"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tümü</SelectItem>
                          <SelectItem value="pending">Beklemede</SelectItem>
                          <SelectItem value="confirmed">Onaylandı</SelectItem>
                          <SelectItem value="cancelled">İptal</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Randevu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Yeni Randevu Ekle</DialogTitle>
                        <DialogDescription>Manuel olarak yeni bir randevu oluşturun</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Ad Soyad *</Label>
                            <Input
                              id="name"
                              value={newAppointment.name}
                              onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
                              placeholder="Hasta adı soyadı"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Telefon *</Label>
                            <Input
                              id="phone"
                              value={newAppointment.phone}
                              onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                              placeholder="0555 123 45 67"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">E-posta *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newAppointment.email}
                            onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
                            placeholder="hasta@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="service">Hizmet *</Label>
                          <Select
                            value={newAppointment.service}
                            onValueChange={(value) => setNewAppointment({ ...newAppointment, service: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Hizmet seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.value} value={service.value}>
                                  {service.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Tarih Seçin *</Label>
                          <DatePicker
                            date={newAppointment.date}
                            onSelect={(date) => setNewAppointment({ ...newAppointment, date })}
                            placeholder="Randevu tarihi seçin"
                          />
                          {newAppointment.date && (
                            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Seçilen tarih:{" "}
                              {newAppointment.date.toLocaleDateString("tr-TR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="time">Saat *</Label>
                          <Select
                            value={newAppointment.time}
                            onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Saat seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Durum</Label>
                          <Select
                            value={newAppointment.status}
                            onValueChange={(value) => setNewAppointment({ ...newAppointment, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Onaylandı</SelectItem>
                              <SelectItem value="pending">Beklemede</SelectItem>
                              <SelectItem value="cancelled">İptal Edildi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes">Notlar</Label>
                          <Textarea
                            id="notes"
                            value={newAppointment.notes}
                            onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                            placeholder="Ek notlar..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          İptal
                        </Button>
                        <Button onClick={handleAddAppointment} className="bg-sky-600 hover:bg-sky-700">
                          Randevu Ekle
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🎨 YENİ TASARIM: Takvim Görünümü */}
          {viewMode === "calendar" && (
            <Card>
              <CardHeader>
                <CardTitle>📅 Aylık Takvim Görünümü</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-50 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Boş günler */}
                  {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-32 p-1"></div>
                  ))}

                  {/* Ayın günleri */}
                  {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
                    const day = index + 1
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const dayAppointments = getAppointmentsForDate(date)
                    const isToday = new Date().toDateString() === date.toDateString()

                    return (
                      <div
                        key={day}
                        className={`h-32 p-2 border rounded-lg ${
                          isToday ? "bg-sky-50 border-sky-300" : "bg-white border-gray-200"
                        } hover:bg-gray-50 transition-colors overflow-hidden`}
                      >
                        <div className={`text-sm font-medium mb-2 ${isToday ? "text-sky-600" : "text-gray-700"}`}>
                          {day}
                        </div>

                        {/* 🎯 YENİ: Randevuları daha güzel göster */}
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {dayAppointments.length === 0 ? (
                            <div className="text-xs text-gray-400 italic">Randevu yok</div>
                          ) : dayAppointments.length <= 3 ? (
                            // 3 veya daha az randevu varsa hepsini göster
                            dayAppointments.map((appointment) => (
                              <div
                                key={appointment.id}
                                className={`text-xs p-1.5 rounded cursor-pointer transition-all hover:scale-105 ${getStatusColor(appointment.status)}`}
                                onClick={() => {
                                  setEditingAppointment(appointment)
                                  setIsEditModalOpen(true)
                                }}
                                title={`${appointment.time} - ${appointment.name} (${services.find((s) => s.value === appointment.service)?.label})`}
                              >
                                <div className="font-medium truncate">{appointment.time}</div>
                                <div className="truncate">{appointment.name}</div>
                              </div>
                            ))
                          ) : (
                            // 3'ten fazla randevu varsa kompakt göster
                            <>
                              {dayAppointments.slice(0, 2).map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className={`text-xs p-1 rounded cursor-pointer ${getStatusColor(appointment.status)}`}
                                  onClick={() => {
                                    setEditingAppointment(appointment)
                                    setIsEditModalOpen(true)
                                  }}
                                  title={`${appointment.time} - ${appointment.name}`}
                                >
                                  <div className="font-medium">{appointment.time}</div>
                                  <div className="truncate">{appointment.name.split(" ")[0]}</div>
                                </div>
                              ))}
                              <div
                                className="text-xs text-center bg-gray-100 text-gray-600 rounded p-1 cursor-pointer hover:bg-gray-200"
                                title={`Toplam ${dayAppointments.length} randevu. Tümünü görmek için tıklayın.`}
                                onClick={() => {
                                  // Günlük görünüme geç ve o tarihi seç
                                  setCurrentDate(date)
                                  setViewMode("day")
                                }}
                              >
                                +{dayAppointments.length - 2} daha
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Haftalık Görünüm */}
          {viewMode === "week" && (
            <Card>
              <CardHeader>
                <CardTitle>📊 Haftalık Görünüm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDates(currentDate).map((date, index) => {
                    const dayAppointments = getAppointmentsForDate(date)
                    const isToday = new Date().toDateString() === date.toDateString()

                    return (
                      <div key={index} className="space-y-2">
                        <div
                          className={`text-center p-2 rounded-lg ${isToday ? "bg-sky-100 text-sky-800" : "bg-gray-50"}`}
                        >
                          <div className="font-semibold">{dayNames[index]}</div>
                          <div className="text-sm">{date.getDate()}</div>
                        </div>
                        <div className="space-y-1 min-h-[300px] max-h-[400px] overflow-y-auto">
                          {dayAppointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className={`p-2 rounded cursor-pointer text-xs transition-all hover:scale-105 ${getStatusColor(appointment.status)}`}
                              onClick={() => {
                                setEditingAppointment(appointment)
                                setIsEditModalOpen(true)
                              }}
                            >
                              <div className="font-medium">{appointment.time}</div>
                              <div className="truncate">{appointment.name}</div>
                              <div className="truncate text-gray-600">
                                {services.find((s) => s.value === appointment.service)?.label}
                              </div>
                            </div>
                          ))}
                          {dayAppointments.length === 0 && (
                            <div className="text-xs text-gray-400 italic text-center mt-4">Randevu yok</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Günlük Görünüm */}
          {viewMode === "day" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  📆 Günlük Görünüm - {currentDate.getDate()} {monthNames[currentDate.getMonth()]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timeSlots.map((timeSlot) => {
                    const appointment = getAppointmentsForDate(currentDate).find((app) => app.time === timeSlot)

                    return (
                      <div key={timeSlot} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="w-16 text-sm font-medium text-gray-600">{timeSlot}</div>
                        {appointment ? (
                          <div
                            className={`flex-1 p-3 rounded cursor-pointer transition-all hover:scale-[1.02] ${getStatusColor(appointment.status)}`}
                            onClick={() => {
                              setEditingAppointment(appointment)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <div className="font-medium">{appointment.name}</div>
                            <div className="text-sm">
                              {appointment.phone} • {appointment.email}
                            </div>
                            <div className="text-sm">
                              {services.find((s) => s.value === appointment.service)?.label}
                            </div>
                            {appointment.notes && <div className="text-xs mt-1 text-gray-600">{appointment.notes}</div>}
                          </div>
                        ) : (
                          <div className="flex-1 p-3 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded">
                            Randevu yok
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste Görünümü */}
          {viewMode === "list" && (
            <Card>
              <CardHeader>
                <CardTitle>📋 Liste Görünümü ({filteredAppointments.length})</CardTitle>
                <CardDescription>Tüm randevuları görüntüle ve yönet</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== "all"
                        ? "Arama kriterlerinize uygun randevu bulunamadı."
                        : "Henüz randevu bulunmuyor."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="border p-4 rounded-md bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {appointment.name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {appointment.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {appointment.phone}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status === "pending"
                                ? "Beklemede"
                                : appointment.status === "confirmed"
                                  ? "Onaylandı"
                                  : "İptal Edildi"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="flex items-center gap-2">
                              <strong>🦷 Hizmet:</strong>
                              {services.find((s) => s.value === appointment.service)?.label || appointment.service}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <strong>Tarih:</strong>{" "}
                              {new Date(appointment.appointment_date).toLocaleDateString("tr-TR")}
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <strong>Saat:</strong> {appointment.time}
                            </p>
                            <p className="text-sm text-gray-500">
                              <strong>Oluşturulma:</strong>{" "}
                              {new Date(appointment.created_at).toLocaleDateString("tr-TR")}
                            </p>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p>
                              <strong>📋 Notlar:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                            onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                            disabled={appointment.status === "confirmed"}
                          >
                            ✅ Onayla
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-yellow-200"
                            onClick={() => updateAppointmentStatus(appointment.id, "pending")}
                            disabled={appointment.status === "pending"}
                          >
                            ⏳ Beklemede
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                            onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            disabled={appointment.status === "cancelled"}
                          >
                            ❌ İptal Et
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                            onClick={() => {
                              setEditingAppointment(appointment)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Mesajlar Tab */}
      {activeTab === "messages" && (
        <div className="space-y-6">
          {/* Arama */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Mesajlarda ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💬 İletişim Mesajları ({filteredMessages.length})</CardTitle>
              <CardDescription>Gelen mesajları görüntüle ve yönet</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? "Arama kriterlerinize uygun mesaj bulunamadı." : "Henüz mesaj bulunmuyor."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`border p-4 rounded-md shadow-sm ${
                        !message.is_read ? "bg-blue-50 border-blue-200" : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {message.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {message.email}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(message.created_at).toLocaleDateString("tr-TR")} -
                            <Clock className="h-3 w-3 ml-1" />
                            {new Date(message.created_at).toLocaleTimeString("tr-TR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!message.is_read && <Badge className="bg-blue-100 text-blue-800">🆕 Yeni</Badge>}
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <p className="text-gray-800">{message.message}</p>
                      </div>

                      <div className="flex gap-2">
                        {!message.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                            onClick={() => markMessageAsRead(message.id)}
                          >
                            ✅ Okundu İşaretle
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Düzenleme Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Randevu Düzenle</DialogTitle>
            <DialogDescription>Randevu bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          {editingAppointment && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              {/* Sol Taraf - Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Ad Soyad *</Label>
                    <Input
                      id="edit-name"
                      value={editingAppointment.name}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Telefon *</Label>
                    <Input
                      id="edit-phone"
                      value={editingAppointment.phone}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-email">E-posta *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingAppointment.email}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-service">Hizmet *</Label>
                  <Select
                    value={editingAppointment.service}
                    onValueChange={(value) => setEditingAppointment({ ...editingAppointment, service: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-time">Saat *</Label>
                  <Select
                    value={editingAppointment.time}
                    onValueChange={(value) => setEditingAppointment({ ...editingAppointment, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Durum</Label>
                  <Select
                    value={editingAppointment.status}
                    onValueChange={(value) => setEditingAppointment({ ...editingAppointment, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Onaylandı</SelectItem>
                      <SelectItem value="pending">Beklemede</SelectItem>
                      <SelectItem value="cancelled">İptal Edildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-notes">Notlar</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingAppointment.notes}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Sağ Taraf - Takvim */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Tarih Düzenle *</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <CalendarComponent
                      selectedDate={new Date(editingAppointment.appointment_date)}
                      onSelect={(date) => {
                        if (date) {
                          setEditingAppointment({ ...editingAppointment, appointment_date: date.toISOString() })
                        }
                      }}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Seçilen tarih:{" "}
                    {new Date(editingAppointment.appointment_date).toLocaleDateString("tr-TR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleEditAppointment} className="bg-sky-600 hover:bg-sky-700">
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
