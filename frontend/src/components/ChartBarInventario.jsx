"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp } from "lucide-react"
import { obtenerRopa, obtenerComestibles } from "../api/inventario"

// Componente reutilizable de gráfico pequeño
function StockChart({ title, description, datos, color }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-3 w-full md:w-1/2">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>

      {/* Gráfico responsivo */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={datos.map(p => ({ name: p.nombre, stock: p.stock_actual }))}
          layout="vertical"
          margin={{ left: 20, right: 10 }}
        >
          <YAxis 
            dataKey="name" 
            type="category" 
            tickLine={false} 
            axisLine={false} 
            width={100} 
            tick={{ fontSize: 12, fill: "#374151" }} 
          />
          <XAxis type="number" hide />
          <Tooltip formatter={(value) => [`${value}`, "Stock"]} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
          <Bar dataKey="stock" radius={[5, 5, 5, 5]}>
            {datos.map((entry, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-2 flex flex-col items-start gap-1 text-xs">
        <div className="flex gap-2 font-medium items-center">
          Trending up <TrendingUp className="h-3 w-3" />
        </div>
        <div className="text-gray-500">
          Cantidad de productos en stock
        </div>
      </div>
    </div>
  )
}

// Gráfico de ropa
export function ChartStockRopa() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRopa() {
      setLoading(true)
      try {
        const ropa = await obtenerRopa()
        setDatos(ropa.map(p => ({ nombre: p.nombre, stock_actual: p.stock_actual ?? 0 })))
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los datos de ropa")
      } finally {
        setLoading(false)
      }
    }
    fetchRopa()
  }, [])

  if (loading) return <p>Cargando gráfico de ropa...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return <StockChart title="Stock de Ropa" description="Stock actual de ropa" datos={datos} color="#3b82f6" />
}

// Gráfico de comestibles
export function ChartStockComestibles() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchComestibles() {
      setLoading(true)
      try {
        const comestibles = await obtenerComestibles()
        setDatos(comestibles.map(p => ({ nombre: p.nombre, stock_actual: p.stock_actual ?? 0 })))
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los datos de comestibles")
      } finally {
        setLoading(false)
      }
    }
    fetchComestibles()
  }, [])

  if (loading) return <p>Cargando gráfico de comestibles...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return <StockChart title="Stock de Comestibles" description="Stock actual de comestibles" datos={datos} color="#f43f5e" />
}
