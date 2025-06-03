"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseDashboardDataOptions<T> {
  fetchFunction: () => Promise<T>
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
  const [data, setData] = useState<T>(fallbackData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const fetchingRef = useRef(false)

  const fetchData = useCallback(async () => {
    if (!enabled || fetchingRef.current || !mountedRef.current) return

    try {
      fetchingRef.current = true
      setLoading(true)
      setError(null)

      const result = await fetchFunction()

      if (mountedRef.current) {
        // Ensure we always have valid data
        setData(result ?? fallbackData)
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        setData(fallbackData)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
      fetchingRef.current = false
    }
  }, [fetchFunction, fallbackData, enabled])

  useEffect(() => {
    mountedRef.current = true
    fetchData()

    return () => {
      mountedRef.current = false
    }
  }, [fetchData, ...dependencies])

  const refetch = useCallback(() => {
    if (mountedRef.current) {
      fetchData()
    }
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
  }
}
