"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "chart.js/auto"
import ChartDataLabels from "chartjs-plugin-datalabels"
import classes from "./rate.module.css"
import axios from "axios"
import { useUserContext } from "@/context/UserContext"

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
})

interface Player {
  id: number
  username: string
  rating: number
}

interface MatchData {
  id: number
  player1: Player
  player2: Player
  created_at: string
}

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: MatchData[]
}

const Rate = () => {
  const { userData } = useUserContext()
  const [chartData, setChartData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost:8000/api/pongue/${userData.id}/matches`,{withCredentials: true})
        const matches = res.data.results

        // Sort matches by date
        matches.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

        // Extract ratings and dates
        const ratings: number[] = []
        const dates: string[] = []
        matches.forEach((match) => {
          const player = match.player1.id === userData.id ? match.player1 : match.player2
          ratings.push(player.rating)
          dates.push(new Date(match.created_at).toLocaleDateString())
        })

        setChartData(ratings)
        setLabels(dates)
        setLoading(false)
      } catch (err) {
        console.error("Error in fetching user data", err)
        setError("Failed to load rating history. Please try again later.")
        setLoading(false)
      }
    }
    if (typeof userData.id === "number")
      fetchData()
  }, [userData.id])

  if (loading) {
    return <div className={classes.loading}>Loading rating history...</div>
  }

  if (error) {
    return <div className={classes.error}>{error}</div>
  }

  const minValue = Math.min(...chartData) - Math.min(...chartData) / 5
  const maxValue = Math.max(...chartData) + Math.max(...chartData) / 5

  const data = {
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

  const options = {
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
        align: "top",
      },
    },
  }

  return (
    <div className={classes.container}>
      <Line data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  )
}

export default Rate

