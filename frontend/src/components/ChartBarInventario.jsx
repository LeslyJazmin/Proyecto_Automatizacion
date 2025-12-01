"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { obtenerRopa, obtenerComestibles } from "../api/inventario";

// 🎨 Colores
const COLOR_VERDE = "#22c55e";
const COLOR_ROJO = "#ef4444";

// 📦 CARD general
function Card({ title, description, children }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-5 w-full md:w-1/2 border border-gray-200">
      <h2 className="text-lg font-semibold text-center">{title}</h2>
      <p className="text-gray-500 text-xs text-center mb-3">{description}</p>

      {children}

      <div className="mt-3 text-center text-xs text-gray-600">
        <div className="flex justify-center items-center gap-1">
           <TrendingUp className="h-4 w-4" />
        </div>
        <p>Actualización dinámica</p>
      </div>
    </div>
  );
}

// 🍩 Donut
function DonutChart({ datos, tipo }) {
  const data = datos.map((p) => ({
    name: `${p.nombre}`,
    value: p.stock_actual,
  }));

  const lowLimit = tipo === "ropa" ? 10 : 30;
  const getColor = (stock) => (stock <= lowLimit ? COLOR_ROJO : COLOR_VERDE);

  return (
    <ResponsiveContainer width="100%" height={270}>
      <PieChart>
        <Tooltip formatter={(value, name, props) => [`${value} unidades`, props.payload.name]} />

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          label={({ name }) => name}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

///////////////////////////////////////////////////////////
// 📌 ROPA — Modo inteligente (bajo stock o todo)
///////////////////////////////////////////////////////////
export function ChartStockRopa() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerRopa()
      .then((ropa) => {
        const ropaFormateada = ropa.map((p) => ({
          nombre: p.nombre,
          stock_actual: p.stock_actual ?? 0,
        }));

        // FILTRO DE BAJO STOCK
        const bajo = ropaFormateada.filter((p) => p.stock_actual <= 10);

        // SI HAY BAJO STOCK → solo mostrar bajo stock
        // SI NO → mostrar todo
        setDatos(bajo.length > 0 ? bajo : ropaFormateada);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando gráfico de ropa...</p>;

  return (
    <Card
      title={
        datos.some((p) => p.stock_actual <= 10)
          ? "Ropa con Stock Bajo"
          : "Stock de Ropa"
      }
      description={
        datos.some((p) => p.stock_actual <= 10)
          ? "Productos críticos que requieren reposición"
          : "Todos los productos están dentro del nivel normal"
      }
    >
      <DonutChart datos={datos} tipo="ropa" />
    </Card>
  );
}

///////////////////////////////////////////////////////////
// 📌 COMESTIBLES — Modo inteligente (bajo stock o todo)
///////////////////////////////////////////////////////////
export function ChartStockComestibles() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerComestibles()
      .then((comestibles) => {
        const productos = comestibles.map((p) => ({
          nombre: p.nombre,
          stock_actual: p.stock_actual ?? 0,
        }));

        const bajo = productos.filter((p) => p.stock_actual <= 30);

        setDatos(bajo.length > 0 ? bajo : productos);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando gráfico de comestibles...</p>;

  return (
    <Card
      title={
        datos.some((p) => p.stock_actual <= 30)
          ? "Comestibles con Stock Bajo"
          : "Stock de Comestibles"
      }
      description={
        datos.some((p) => p.stock_actual <= 30)
          ? "Productos críticos que requieren reposición"
          : "Todos los productos están dentro del nivel normal"
      }
    >
      <DonutChart datos={datos} tipo="comestible" />
    </Card>
  );
}
