"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

interface UseDashboardDataOptions<T> {
  fetchFunction: (clinicId: string) => Promise<T>
  fallbackData: T
  dependencies?: any[]
}

export function useDashboardData<T>({ fetchFunction, fallbackData, dependencies = [] }: UseDashboardDataOptions<T>) {
  const { profile } = useAuth()
  const [data, setData] = useState<T>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!profile?.clinic_id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction(profile.clinic_id)
      setData(result)
    } catch (err) {
      console.error("Dashboard data fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      setData(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [profile?.clinic_id, ...dependencies])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
