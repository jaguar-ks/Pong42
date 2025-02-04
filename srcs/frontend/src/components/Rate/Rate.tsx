"use client"

import type React from "react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ChartOptions } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import styles from "./rate.module.css"
import axios from "axios"
import { useUserContext } from "@/context/UserContext"

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
  const data = user === "search" ? userDataSearch : userData

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null) // Reset error state
        if (!data.id) {
          throw new Error("User ID is not available")
        }
        const res = await axios.get(`http://localhost:8000/api/pongue/1/rating_history`, {
          withCredentials: true,
        })
        if (!res.data || !Array.isArray(res.data.results)) {
          throw new Error("Invalid data received from server")
        }
        const ratingHistory: RatingHistory[] = res.data.results

        // Sort rating history by date
        ratingHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // Extract ratings and dates
        const ratings = ratingHistory.map((item) => item.rating)
        const dates = ratingHistory.map((item) => new Date(item.date).toLocaleDateString())

        setChartData(ratings)
        setLabels(dates)
      } catch (err) {
        console.error("Error in fetching rating history =========================", err)
        setError(err instanceof Error ? err.message : "Failed to load rating history. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [data.id])

  if (loading) {
    return <div className={styles.loading}>Loading rating history...</div>
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>
  }

  if (chartData.length === 0) {
    return <div className={styles.noData}>No rating history available.</div>
  }

  const minValue = Math.min(...chartData) - Math.min(...chartData) / 5
  const maxValue = Math.max(...chartData) + Math.max(...chartData) / 5

  const chartDataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Rating over Time",
        data: chartData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Rating",
        },
        min: minValue,
        max: maxValue,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        color: "black",
        formatter: (value: number) => {
          return value.toFixed(0)
        },
        anchor: "end",
        align: "top" as const,
      },
    },
  }

  return (
    <div className={styles.container}>
      <Line data={chartDataConfig} options={options} plugins={[ChartDataLabels]} />
    </div>
  )
}

export default Rate

