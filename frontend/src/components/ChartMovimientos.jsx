    "use client"

    import { useEffect, useState } from "react";
    import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from "recharts";
    import { obtenerMovimientosRopa, obtenerMovimientosComestibles } from "../api/inventario";

    export function ChartMovimientos({ tipo }) {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMovimientos() {
        setLoading(true);
        try {
            let res = [];
            if (tipo === "ropa") {
            res = await obtenerMovimientosRopa();
            } else if (tipo === "comestibles") {
            res = await obtenerMovimientosComestibles();
            }

            setDatos(res.map(item => ({
            fecha: item.fecha,
            cantidad: item.cantidad,
            })));
        } catch (err) {
            console.error(err);
            setError(`No se pudieron cargar los movimientos de ${tipo}`);
        } finally {
            setLoading(false);
        }
        }

        fetchMovimientos();
    }, [tipo]);

    if (loading) return <p>Cargando movimientos de {tipo}...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    const color = tipo === "ropa" ? "#3b82f6" : "#f43f5e";

    return (
        <div className="bg-white shadow-lg rounded-2xl p-4 w-full md:w-1/2">
        <h3 className="text-lg font-semibold mb-1">Movimientos {tipo}</h3>
        <p className="text-gray-500 text-xs mb-3">Entradas y salidas recientes</p>
        <AreaChart width={400} height={250} data={datos}>
            <defs>
            <linearGradient id={`grad-${tipo}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="fecha" tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="natural" dataKey="cantidad" stroke={color} fill={`url(#grad-${tipo})`} />
        </AreaChart>
        </div>
    );
    }
