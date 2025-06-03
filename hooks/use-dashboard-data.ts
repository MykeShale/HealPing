"use client"

import { useState, useEffect } from "react"

interface UseDashboardDataOptions<T> {
  fetchFunction: () => Promise<T>
  fallbackData: T
  dependencies?: any[]
}

export function useDashboardData<T>({ fetchFunction, fallbackData, dependencies = [] }: UseDashboardDataOptions<T>) {
  const [data, setData] = useState<T>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      setData(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
