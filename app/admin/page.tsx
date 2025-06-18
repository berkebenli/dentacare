"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Form data:", formData)

    if (formData.email === "admin@dentacare.com" && formData.password === "admin123") {
      console.log("Giriş başarılı!")
      router.push("/admin/dashboard")
    } else {
      console.log("Giriş başarısız!")
      setError("Geçersiz e-posta veya şifre")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/" className="absolute top-4 left-4 text-sky-600 hover:text-sky-800">
        Ana Sayfaya Dön
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-800">DentaCare</h1>
          <p className="text-gray-500">Yönetici Girişi</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>Randevuları yönetmek için giriş yapın</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="bg-red-50 p-3 rounded-md text-red-600 mb-4">{error}</div>}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-posta adresinizi giriniz"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Şifrenizi giriniz"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
