"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  obtenerMovimientosRopa,
  obtenerMovimientosComestibles,
} from "../api/inventario";

const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export default function ChartMovimientosAnual({ tipo }) {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovimientos() {
      setLoading(true);

      try {
        const res =
          tipo === "ropa"
            ? await obtenerMovimientosRopa()
            : await obtenerMovimientosComestibles();

        // Debug: ver qué datos llegan
        console.log("Movimientos recibidos de la API:", res);

        const agrupado = {};

        res.forEach(item => {
          // Validar que exista fecha
          const fechaStr = item.fecha || item.fecha_movimiento || item.created_at;
          if (!fechaStr) return;

          const fecha = new Date(fechaStr);
          if (isNaN(fecha.getTime())) return;

          const mes = fecha.getMonth(); // 0-11

          if (!agrupado[mes]) {
            agrupado[mes] = {
              mes: meses[mes],
              entrada: 0,
              salida: 0,
            };
          }

          const tipoMov = (item.tipo_movimiento || "").toLowerCase();
          const cantidad = Number(item.cantidad) || 0;

          if (tipoMov === "entrada") {
            agrupado[mes].entrada += cantidad;
          } else if (tipoMov === "salida") {
            agrupado[mes].salida += cantidad;
          }
        });

        // Ordenar por mes calendario y agregar diferencia neta
        const datosOrdenados = meses.map((nombreMes, index) => {
          const mesData = agrupado[index] || { entrada: 0, salida: 0 };
          return {
            mes: nombreMes,
            entrada: mesData.entrada,
            salida: mesData.salida,
            diferencia: mesData.entrada - mesData.salida,
          };
        });

        console.log("Datos agrupados por mes:", datosOrdenados);

        setDatos(datosOrdenados);
      } catch (error) {
        console.error("Error cargando movimientos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovimientos();
  }, [tipo]);

  if (loading) return <p>Cargando movimientos...</p>;

  // Custom tooltip para mostrar entradas, salidas y diferencia
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{label}</p>
          <p style={{ color: "#3b82f6" }}>Entradas: {data.entrada} unidades</p>
          <p style={{ color: "#ef4444" }}>Salidas: {data.salida} unidades</p>
          <p style={{ color: data.diferencia >= 0 ? "green" : "red" }}>
            Diferencia: {data.diferencia} unidades
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-3">
        Movimientos de {tipo === "ropa" ? "Ropa" : "Comestibles"} (Anual)
      </h3>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos}>
            <XAxis dataKey="mes" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Bar
              dataKey="entrada"
              stackId="a"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Entradas"
            />
            <Bar
              dataKey="salida"
              stackId="a"
              fill="#ef4444"
              radius={[0, 0, 4, 4]}
              name="Salidas"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
