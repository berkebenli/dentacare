import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Gerekli alanları kontrol et
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Tüm alanları doldurun" }, { status: 400 })
    }

    // Supabase'e mesajı kaydet
    const { error } = await supabase.from("contact_messages").insert({ name, email, message })

    if (error) throw error

    return NextResponse.json({ success: true, message: "Mesajınız başarıyla gönderildi" }, { status: 200 })
  } catch (error) {
    console.error("Mesaj gönderilirken hata:", error)
    return NextResponse.json({ error: "Mesaj gönderilirken bir hata oluştu" }, { status: 500 })
  }
}