"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels)

// Sample data for years and corresponding numbers
const chartData = [30, 15, 90, 65, 20] // Numerical values for the y-axis

// Get min and max values from the data array
const minValue = Math.min(...chartData) - Math.min(...chartData) / 5
const maxValue = Math.max(...chartData) + Math.max(...chartData) / 5

const data = {
  labels: ["2019", "2020", "2021", "2022", "2023"], // Years for the x-axis
  datasets: [
    {
      label: "Performance over Years", // Label for the dataset
      data: chartData, // Numerical values for the y-axis
      backgroundColor: "rgba(0, 0, 0, 0.2)", // Background color for the line
      borderColor: "rgba(0, 0, 0, 0.6)", // Line color
      borderWidth: 2,
      fill: true, // Fill the area under the line
      tension: 0.4, // Adds some curve to the line
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
      },
    },
    y: {
      title: {
        display: true,
      },
      min: minValue,
      max: maxValue,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      color: "black",
      formatter: (value) => value.toString(),
      anchor: "end",
      align: "top",
    },
  },
}

const RateFr = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg p-4">
      <Line data={data} options={options} />
    </div>
  )
}

export default RateFr

