"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"

interface UseDashboardDataOptions<T> {
  fetchFunction: (clinicId?: string) => Promise<T>
  fallbackData: T
  dependencies?: any[]
  enabled?: boolean
}

export function useDashboardData<T>({
  fetchFunction,
  fallbackData,
  dependencies = [],
  enabled = true,
}: UseDashboardDataOptions<T>) {
  const { profile, initialized } = useAuth()
  const [data, setData] = useState<T>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchingRef = useRef(false)

  const fetchData = useCallback(async () => {
    if (!enabled || !initialized || fetchingRef.current) {
      return
    }

    try {
      fetchingRef.current = true
      setLoading(true)
      setError(null)

      const result = await fetchFunction(profile?.clinic_id || undefined)
      setData(result)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      setData(fallbackData)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [fetchFunction, profile?.clinic_id, fallbackData, enabled, initialized])

  useEffect(() => {
    if (initialized && enabled) {
      fetchData()
    }
  }, [initialized, enabled, profile?.clinic_id, ...dependencies])

  const refetch = useCallback(() => {
    if (initialized && enabled) {
      fetchData()
    }
  }, [fetchData, initialized, enabled])

  return {
    data,
    loading: loading && enabled,
    error,
    refetch,
  }
}
