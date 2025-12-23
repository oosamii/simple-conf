"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { User, Mail, Lock, Eye, EyeOff, Building, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/contexts/auth-context"
import { ApiError } from "@/lib/api/client"
import { Department } from "@simpleconf/shared"

const departments = [
  { value: Department.FRONTEND, label: "Frontend" },
  { value: Department.BACKEND, label: "Backend" },
  { value: Department.SALES, label: "Sales" },
  { value: Department.HR, label: "HR" },
  { value: Department.PRODUCT, label: "Product" },
]

export function RegisterForm() {
  const { register } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [department, setDepartment] = useState<Department | "">("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [displayNameError, setDisplayNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [departmentError, setDepartmentError] = useState("")

  const validateDisplayName = (value: string) => {
    if (!value) {
      setDisplayNameError("Display name is required")
      return false
    }
    if (value.length < 2) {
      setDisplayNameError("Display name must be at least 2 characters")
      return false
    }
    setDisplayNameError("")
    return true
  }

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required")
      return false
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    setPasswordError("")
    return true
  }

  const validateDepartment = (value: string) => {
    if (!value) {
      setDepartmentError("Department is required")
      return false
    }
    setDepartmentError("")
    return true
  }

  const isFormValid = () => {
    return (
      displayName &&
      email &&
      password &&
      department &&
      !displayNameError &&
      !emailError &&
      !passwordError &&
      !departmentError
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const displayNameValid = validateDisplayName(displayName)
    const emailValid = validateEmail(email)
    const passwordValid = validatePassword(password)
    const departmentValid = validateDepartment(department)

    if (!displayNameValid || !emailValid || !passwordValid || !departmentValid) {
      return
    }

    setIsLoading(true)

    try {
      await register({
        email,
        password,
        displayName,
        department: department as Department,
      })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "CONFLICT") {
          setError("An account with this email already exists")
        } else if (err.code === "VALIDATION_ERROR") {
          setError(err.message)
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">Create an account</h2>
        <p className="text-sm text-slate-500 text-center">Join SimpleConf to access the knowledge base</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="displayName"
              type="text"
              placeholder="John Doe"
              className="pl-10"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value)
                if (displayNameError) validateDisplayName(e.target.value)
              }}
              onBlur={(e) => validateDisplayName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {displayNameError && <p className="text-red-500 text-sm mt-1">{displayNameError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) validateEmail(e.target.value)
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pl-10 pr-10"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) validatePassword(e.target.value)
              }}
              onBlur={(e) => validatePassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError ? (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          ) : (
            <p className="text-slate-500 text-sm mt-1">At least 8 characters</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
            <Select
              value={department}
              onValueChange={(value) => {
                setDepartment(value as Department)
                if (departmentError) validateDepartment(value)
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {departmentError && <p className="text-red-500 text-sm mt-1">{departmentError}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={!isFormValid() || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Login
        </Link>
      </p>
    </form>
  )
}
