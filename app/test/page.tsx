"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function TestPage() {
  const [status, setStatus] = useState("Yükleniyor...")
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log("Supabase Key var mı:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Evet" : "Hayır")
        
        // Basit bir sorgu dene
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .limit(5)
        
        if (error) {
          throw error
        }
        
        setResult(data)
        setStatus("Bağlantı başarılı!")
      } catch (err: any) {
        console.error("Test hatası:", err)
        setError(err.message || "Bilinmeyen hata")
        setStatus("Bağlantı başarısız!")
      }
    }
    
    testConnection()
  }, [])

  const sendTestMessage = async () => {
    try {
      setStatus("Mesaj gönderiliyor...")
      
      const { data, error } = await supabase
        .from("contact_messages")
        .insert({
          name: "Test Kullanıcı",
          email: "test@example.com",
          message: "Bu bir test mesajıdır - " + new Date().toLocaleTimeString()
        })
        .select()
      
      if (error) throw error
      
      setStatus("Mesaj başarıyla gönderildi!")
      setResult(data)
    } catch (err: any) {
      console.error("Gönderme hatası:", err)
      setError(err.message || "Bilinmeyen hata")
      setStatus("Mesaj gönderilemedi!")
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Bağlantı Testi</h1>
      
      <div className="p-4 border rounded mb-4">
        <p className="font-bold">Durum: <span className={status.includes("başarı") ? "text-green-600" : "text-red-600"}>{status}</span></p>
        {error && <p className="text-red-600 mt-2">Hata: {error}</p>}
      </div>
      
      <button 
        onClick={sendTestMessage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Test Mesajı Gönder
      </button>
      
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Sonuç:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  )
}