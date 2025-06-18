"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MediaPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of files) {
        // Dosyayı base64'e çevir
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setUploadedImages((prev) => [...prev, result])
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error("Dosya yükleme hatası:", error)
      alert("Dosya yüklenirken hata oluştu!")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-800">Medya Yönetimi</h1>
        <Link href="/admin/dashboard">
          <Button variant="outline">Admin Paneline Dön</Button>
        </Link>
      </div>

      {/* Dosya Yükleme */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Fotoğraf Yükle
          </CardTitle>
          <CardDescription>Klinik fotoğraflarınızı yükleyin (JPG, PNG, WebP desteklenir)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Fotoğraf Seç</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>

            {uploading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                <p className="mt-2 text-sm text-gray-600">Yükleniyor...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Yüklenen Fotoğraflar */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Yüklenen Fotoğraflar ({uploadedImages.length})
            </CardTitle>
            <CardDescription>Fotoğrafları sağ tıklayıp "Resmi Farklı Kaydet" ile indirebilirsiniz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video relative overflow-hidden rounded-lg border">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Yüklenen fotoğraf ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <p className="font-medium">Fotoğraf {index + 1}</p>
                    <p className="text-gray-600 break-all">{image.substring(0, 50)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kullanım Talimatları */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📋 Fotoğraf Kullanım Talimatları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-600">✅ Şu anda sitede kullanılan placeholder'lar:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-2">
                <li>
                  <code>/images/dental-hero.png</code> - Ana sayfa hero resmi
                </li>
                <li>
                  <code>/images/dental-team.png</code> - Doktor ekibi resmi
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-600">🔄 Fotoğrafları değiştirmek için:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 mt-2">
                <li>Yukarıdan fotoğraflarınızı yükleyin</li>
                <li>Beğendiğiniz fotoğrafı sağ tıklayıp "Resmi Farklı Kaydet" ile indirin</li>
                <li>
                  Dosya adını <code>dental-hero.png</code> veya <code>dental-team.png</code> yapın
                </li>
                <li>
                  Projenizin <code>public/images/</code> klasörüne koyun
                </li>
                <li>Sayfayı yenileyin</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-600">⚠️ Önemli Notlar:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 mt-2">
                <li>Fotoğraf boyutları: Hero için 600x400px, Team için 600x400px önerilir</li>
                <li>Dosya formatları: JPG, PNG, WebP desteklenir</li>
                <li>Dosya boyutu: Maksimum 2MB önerilir</li>
                <li>Yüksek kaliteli, profesyonel fotoğraflar kullanın</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
