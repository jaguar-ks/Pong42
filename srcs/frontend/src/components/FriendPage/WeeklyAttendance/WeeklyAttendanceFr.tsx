"use client"

import { useState, useEffect } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from "chart.js"
import { Pie } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

// Sample data for wins and losses
const matches = { win: 15, lose: 10 } // Example match data

const data = {
  labels: ["Wins", "Losses"],
  datasets: [
    {
      label: "Game Results",
      data: [matches.win, matches.lose],
      backgroundColor: [
        "rgba(0, 0, 0, 0.6)", // Color for Wins
        "rgba(255, 255, 255, 0.6)", // Color for Losses
      ],
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 2,
    },
  ],
}

const options: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      color: "black",
      formatter: (value: number) => {
        return value.toString()
      },
      anchor: "center",
      align: "center",
    },
  },
}

const WeeklyAttendanceFr = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg p-4">
      <Pie data={data} options={options} />
    </div>
  )
}

export default WeeklyAttendanceFr

