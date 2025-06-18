"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu")
      }

      setSuccess(true)
      setFormData({ name: "", email: "", message: "" })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-green-50 p-4 rounded-md text-green-700 mb-4">
          Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
        </div>
      )}

      {error && <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">{error}</div>}

      <div className="grid gap-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          İsim Soyisim
        </label>
        <input
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="İsim Soyisim"
          required
        />
      </div>
      <div className="grid gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          E-posta
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="E-posta adresiniz"
          required
        />
      </div>
      <div className="grid gap-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Mesajınız
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Mesajınızı yazın"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
        {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
      </Button>
    </form>
  )
}
