import Link from "next/link"
import { Calendar, Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { HeroSlider } from "@/components/hero-slider"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-sky-600">DentaCare</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Ana Sayfa
            </Link>
            <Link href="#services" className="text-sm font-medium hover:underline underline-offset-4">
              Hizmetlerimiz
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              Hakkımızda
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              İletişim
            </Link>
          </nav>
          <div>
            <Link href="/randevu">
              <Button className="bg-sky-600 hover:bg-sky-700">Randevu Al</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-sky-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-8 items-center">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-sky-800">
                  Sağlıklı Gülüşler İçin Profesyonel Diş Bakımı
                </h1>
                <p className="text-gray-500 text-sm md:text-base lg:text-lg">
                  DentaCare olarak, modern teknoloji ve uzman kadromuzla size en iyi diş sağlığı hizmetini sunuyoruz.
                  Online randevu sistemimiz ile hızlıca randevu alabilirsiniz.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/randevu">
                    <Button className="bg-sky-600 hover:bg-sky-700">Hemen Randevu Al</Button>
                  </Link>
                  <Link href="#services">
                    <Button variant="outline">Hizmetlerimiz</Button>
                  </Link>
                </div>
              </div>
              <div className="lg:order-last">
                <HeroSlider />
              </div>
            </div>
          </div>
        </section>

<section id="services" className="w-full py-12 md:py-24 lg:py-32">
  <div className="container px-4 md:px-6">
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-sky-800">Hizmetlerimiz</h2>
        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Size sunduğumuz kapsamlı diş sağlığı hizmetleri
        </p>
      </div>
    </div>

    {/* Hizmet Kartları */}
    <div className="mx-auto grid max-w-6xl items-stretch h-full gap-6 py-12 lg:grid-cols-3 xl:grid-cols-5 lg:gap-8">
      {/* Genel Diş Bakımı */}
      <div className="flex flex-col justify-between h-full space-y-4 rounded-lg border p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z" />
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
            <path d="m5 16 3 5h8l3-5" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Genel Diş Bakımı</h3>
          <p className="text-gray-500">Düzenli kontroller, diş temizliği ve koruyucu bakım hizmetleri.</p>
        </div>
      </div>

      {/* Estetik Diş Hekimliği */}
      <div className="flex flex-col justify-between h-full space-y-4 rounded-lg border p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Estetik Diş Hekimliği</h3>
          <p className="text-gray-500">Diş beyazlatma, laminat veneerler ve estetik dolgu işlemleri.</p>
        </div>
      </div>

      {/* Cerrahi İşlemler */}
      <div className="flex flex-col justify-between h-full space-y-4 rounded-lg border p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Cerrahi İşlemler</h3>
          <p className="text-gray-500">Diş çekimi, implant uygulamaları ve diğer cerrahi müdahaleler.</p>
        </div>
      </div>

      {/* Ortodonti */}
      <div className="flex flex-col justify-between h-full space-y-4 rounded-lg border p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M3 12h18m-9-9v18" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Ortodonti</h3>
          <p className="text-gray-500">
            Ortodonti, diş ve çene düzensizliklerini düzeltmeye odaklanan uzmanlık alanıdır.
          </p>
        </div>
      </div>

      {/* Pedodonti */}
      <div className="flex flex-col justify-between h-full space-y-4 rounded-lg border p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6" />
            <path d="m21 12-6 0m-6 0-6 0" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Pedodonti</h3>
          <p className="text-gray-500">
            Pedodonti, çocuk diş sağlığını inceleyen ve tedavi eden diş hekimliği dalıdır.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-sky-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="aspect-video relative overflow-hidden rounded-xl">
                <img src="/images/dental-clinic.png" alt="Doktor Ekibimiz" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-sky-800">Hakkımızda</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  DentaCare olarak 15 yılı aşkın süredir hastalarımıza en kaliteli diş sağlığı hizmetini sunuyoruz.
                  Uzman kadromuz ve modern teknolojik ekipmanlarımızla, her yaştan hastamızın ihtiyaçlarına özel
                  çözümler üretiyoruz.
                </p>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Kliniğimizde, genel diş bakımından estetik diş hekimliğine, çocuk diş hekimliğinden implant
                  uygulamalarına kadar geniş bir yelpazede hizmet vermekteyiz.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/randevu">
                    <Button className="bg-sky-600 hover:bg-sky-700">Randevu Al</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-sky-800">İletişim</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Bize ulaşın ve randevu alın
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  <p className="text-gray-500">Bostanlı Mah. Cemal Gürsel Cd. 85A Karşıyaka/İzmir</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-sky-600" />
                  <p className="text-gray-500">+90 232 345 67 89</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-sky-600" />
                  <p className="text-gray-500">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-600" />
                  <p className="text-gray-500">Pazar: Kapalı</p>
                </div>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">İletişim Formu</h3>
                <p className="text-gray-600 mb-4">İletişim formumuz aracılığıyla bize kolayca ulaşabilirsiniz.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-sky-600">DentaCare</span>
            </div>
            <p className="text-sm text-gray-500">Sağlıklı gülüşler için profesyonel diş bakımı hizmetleri.</p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-lg font-medium">Hızlı Bağlantılar</div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:underline">
                Ana Sayfa
              </Link>
              <Link href="#services" className="hover:underline">
                Hizmetlerimiz
              </Link>
              <Link href="#about" className="hover:underline">
                Hakkımızda
              </Link>
              <Link href="#contact" className="hover:underline">
                İletişim
              </Link>
            </nav>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-lg font-medium">İletişim</div>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <p>Bostanlı Mah. Cemal Gürsel Cd. 85A Karşıyaka/İzmir</p>
              <p>+90 232 345 67 89</p>
              <p>info@dentacare.com</p>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} DentaCare. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
