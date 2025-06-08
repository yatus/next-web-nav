"use client"

import Link from "next/link"
import { useCallback, useState } from "react"

import { siteConfig } from "@/config/site"

import { Circle, Laptop, Moon, Sun, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { DialogTitle } from "@radix-ui/react-dialog"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"

import { Icons } from "./components/icons"
import { ThemeToggle } from "./components/theme-toggle"
import { useConfigStore } from "@/stores"
import SettingDialog from "./components/setting-dialog"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { setTheme } = useTheme()
  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const { categories } = useConfigStore()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container m-0 relative flex h-16 items-center justify-center px-4">
        {/* 搜索框 - 居中显示 */}
        <div className="w-full max-w-md">
          <Button
            variant="outline"
            className="relative h-9 w-full justify-start text-sm text-muted-foreground bg-muted/40 border-muted-foreground/20 hover:bg-muted/60 hover:text-foreground transition-all duration-200 group"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4 group-hover:text-primary transition-colors duration-200" />
            <span className="flex-1 text-left">搜索网站和工具...</span>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground/60">
              <kbd className="px-1.5 py-0.5 bg-background/80 rounded border text-xs font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-background/80 rounded border text-xs font-mono">K</kbd>
            </div>
          </Button>
        </div>

        {/* 右侧：工具栏 - 绝对定位到右侧 */}
        <div className="absolute right-4 flex items-center space-x-1">
          <ThemeToggle />
          <div className="h-4 w-px bg-border mx-2" />
          <SettingDialog />
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">搜索命令</DialogTitle>
        <CommandInput placeholder="搜索网站和工具..." className="text-base" />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">未找到相关结果</p>
              <p className="text-xs text-muted-foreground/60 mt-1">尝试使用不同的关键词</p>
            </div>
          </CommandEmpty>
          
          {categories.map((category) => (
            <CommandGroup heading={category.title} key={category.title}>
              {category.items.map((navItem) => (
                <CommandItem
                  key={navItem.link}
                  value={`${navItem.title} ${navItem.desc}`}
                  onSelect={() => {
                    runCommand(() => window.open(navItem.link, "_blank"))
                  }}
                  className="flex items-start space-x-3 px-3 py-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Circle className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col space-y-1 min-w-0 flex-1">
                    <div className="font-medium text-sm">{navItem.title}</div>
                    {navItem.desc && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {navItem.desc}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          
          <CommandSeparator />
          
          <CommandGroup heading="偏好设置">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-3 h-4 w-4" />
              <span>浅色主题</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-3 h-4 w-4" />
              <span>深色主题</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-3 h-4 w-4" />
              <span>跟随系统</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}
