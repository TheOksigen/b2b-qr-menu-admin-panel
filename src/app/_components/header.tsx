'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Sun, Search, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/app/_components/ui/sheet"

type HeaderProps = {
  ownerName: string;
}

export function Header({ ownerName }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { name: 'Restaurant', href: '/restaurant' },
    { name: 'User', href: '/user' },
    { name: 'Menu', href: '/menu' },
    { name: 'Menu Item', href: '/menu-item' },
    { name: 'Category', href: '/category' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Left Section: Logo and Navigation Button */}
        <div className="flex items-center justify-between w-full space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link key={item.name} href={item.href} className="text-lg font-medium">
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">
              {ownerName}'s Restaurant Dashboard
            </span>
          </Link>
        </div>

        {/* Right Section: Search and Theme Toggle */}
        <div className="flex items-center space-x-4">
          <form className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 md:w-[200px] lg:w-[300px]"
            />
          </form>
          <nav className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && (
                <>
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>

  )
}