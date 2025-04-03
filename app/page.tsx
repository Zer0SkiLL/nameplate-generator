import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from 'next/image';

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Nameplate Generator</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create Professional Nameplates
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Generate printable nameplates for your company with customizable designs. Upload your logo, add names, and
            download print-ready PDFs.
          </p>
          <div className="mt-8">
            <Link href="/generator">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-12">
            {/* <img
              src="/example.png"
              alt="Nameplate example"
              className="mx-auto rounded-lg shadow-md"
            /> */}
            <Image 
              src="/example.png" 
              alt="Example image" 
              width={2000} 
              height={1200}
            />
            <p className="mt-4 text-sm text-gray-500">
              Example of a generated nameplate with company logo, name, and attendance tracking.
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Nameplate Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

