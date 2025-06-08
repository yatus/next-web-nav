"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { useConfigStore } from "@/stores"
import { siteConfig } from "@/config/site"
import Link from "next/link"

export function Sidebar() {
  const [activeTabId, setActiveTabId] = useState(0)

  const scroll = (activeTabId: number) => {
    const ele = document.getElementById(String(activeTabId))
    if (ele) {
      const elePosition = ele.getBoundingClientRect().top
      const offsetPosition = elePosition + window.scrollY - 99
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const scrollUpdate = () => {
    const ele = document.getElementById("main")
    if (ele) {
      const childElements = Array.from(ele.children)
      for (const children of childElements) {
        const top = children.getBoundingClientRect().top
        if (top < 100) {
          setActiveTabId(Number(children.id))
        }
      }
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior
    })
    window.addEventListener("scroll", scrollUpdate)
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener("scroll", scrollUpdate)
    }
  }, [])

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { categories } = useConfigStore()

  return (
    <nav className="after:h-[calc(100vh - 65px)] block min-h-screen w-60 flex-row flex-nowrap bg-gray-50 font-semibold sm:bg-background sm:px-6 sm:pb-6">
      <div className="hidden h-16 items-center sm:flex sm:pl-6">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50 group-hover:bg-muted transition-all duration-200">
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">导</span>
          </div>
          <div className="flex flex-col">
            <div className="text-base font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200">
              {siteConfig.name}
            </div>
            {/* <div className="text-xs text-muted-foreground/60 -mt-0.5">
              {siteConfig.description}
            </div> */}
          </div>
        </Link>
      </div>
      <div className="flex-start relative z-40 flex h-auto w-full flex-1 flex-col overflow-y-auto overflow-x-hidden rounded pt-4 opacity-100">
        <div className="flex list-none flex-col md:min-w-full md:flex-col">
          <div className={"flex-none pb-12"}>
            <div className="space-y-4 pb-4">
              <div className="py-2">
                <div className="space-y-1">
                  {categories.map((category, index) => {
                    return (
                      <div
                        className={`relative block cursor-pointer rounded-lg transition-colors ease-in-out ${activeTabId === index ? "bg-accent" : ""}`}
                        key={index}
                        onClick={() => scroll(index)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <AnimatePresence>
                          {hoveredIndex === index && (
                            <motion.span
                              className="absolute inset-0 block h-full w-full rounded-lg bg-accent"
                              layoutId="hoverScrollBackground"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.15 }
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.15, delay: 0.2 }
                              }}
                            />
                          )}
                        </AnimatePresence>
                        <div className="relative z-10 mb-2 flex items-center gap-2 rounded-r-lg p-2 transition-colors ease-in-out before:transition-colors hover:no-underline sm:border-l-0 sm:pl-6 sm:before:absolute sm:before:left-[-5px] sm:before:top-[2px] sm:before:h-[calc(100%-4px)] sm:before:w-[10px] sm:before:rounded-full sm:before:transition-colors">
                          <span className="truncate text-sm">{category.title}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
