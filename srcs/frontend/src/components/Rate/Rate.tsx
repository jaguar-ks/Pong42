"use client"

import type React from "react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ChartOptions } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import styles from "./rate.module.css"
import axios from "axios"
import { useUserContext } from "@/context/UserContext"
import Api from "@/lib/api"

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
})

interface RatingHistory {
  date: string
  rating: number
}

const Rate: React.FC<{ user: string }> = ({ user }) => {
  const { userData, userDataSearch } = useUserContext()
  const [chartData, setChartData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const data = user === "search" ? userDataSearch.id : userData.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        if (!data) return
        const res = await Api.get(`/pongue/${data}/rating_history`)
        if (!res.data || !Array.isArray(res.data.results)) {
          throw new Error("Invalid data received from server")
        }
        const ratingHistory: RatingHistory[] = res.data.results
        const ratings = ratingHistory.map((item) => item.rating)
        const dates = ratingHistory.map((item) => item.date)
        setChartData(ratings)
        setLabels(dates)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rating history. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [data])

  if (loading) {
    return <div className={styles.loading}>Loading rating history...</div>
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>
  }

  const chartDataConfig = {
    labels: chartData.length > 0 ? labels : ["No Data"],
    datasets: [
      {
        label: "Rating over Time",
        data: chartData.length > 0 ? chartData : [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }
  return (
    <div className={styles.container}>
      <Line data={chartDataConfig} plugins={[ChartDataLabels]} />
    </div>
  )
}

export default Rate

