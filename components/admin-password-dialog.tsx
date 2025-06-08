'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock } from "lucide-react"

interface AdminPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AdminPasswordDialog({ open, onOpenChange, onSuccess }: AdminPasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      toast({
        title: "请输入密码",
        description: "密码不能为空",
        variant: "destructive",
        duration: 3000
      })
      return
    }

    setIsVerifying(true)
    
    try {
      // 调用服务器端验证API
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "验证成功",
          description: "欢迎管理员",
          duration: 2000
        })
        setPassword("")
        onOpenChange(false)
        onSuccess()
      } else {
        toast({
          title: "验证失败",
          description: data.error || "请输入正确的管理员密码",
          variant: "destructive",
          duration: 3000
        })
      }
    } catch (error) {
      console.error('验证请求失败:', error)
      toast({
        title: "验证失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
        duration: 3000
      })
    }
    
    setIsVerifying(false)
  }

  const handleCancel = () => {
    setPassword("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            管理员验证
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            此功能仅限管理员使用，请输入管理员密码以继续
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              管理员密码
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入管理员密码"
                className="pr-10"
                disabled={isVerifying}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isVerifying}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isVerifying}
              className="w-full sm:w-auto"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="w-full sm:w-auto"
            >
              {isVerifying ? "验证中..." : "确认"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 