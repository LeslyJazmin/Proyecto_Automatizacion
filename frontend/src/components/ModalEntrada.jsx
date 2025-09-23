import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/input";
import { crearEntrada } from "../api/inventario";

// Generar ID alfanumérico de 7 caracteres
const generarIdAlfanumerico = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export default function ModalEntrada({ isOpen, onClose, usuarioId }) {
  const [step, setStep] = useState(1);
  const [tipoProducto, setTipoProducto] = useState("ropa");

  const [producto, setProducto] = useState({
    id_producto: "",
    nombre: "",
    marca: "",
    talla: "",
    color: "",
    precio: "",
    sabor: "",
    peso: "",
    litros: "",
  });

  const [inventario, setInventario] = useState({
    id_inventario: "",
    id_producto: "",
    cantidad: "",
    tipo_movimiento: "entrada",
    ruc_compra: "",
    tipo_venta: "",
    id_usuario: usuarioId,
  });

  // Generar IDs automáticos al abrir modal o cambiar tipo de producto
  useEffect(() => {
    const nuevoIdProducto = generarIdAlfanumerico();
    const nuevoIdInventario = generarIdAlfanumerico();

    setProducto(prev => ({ ...prev, id_producto: nuevoIdProducto }));
    setInventario(prev => ({ ...prev, id_inventario: nuevoIdInventario, id_producto: nuevoIdProducto }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tipoProducto]);

  const handleNext = () => {
    if (!producto.nombre || !producto.precio || 
        (tipoProducto === "comestible" && !producto.sabor)) {
      alert("Completa todos los campos obligatorios del producto");
      return;
    }
    setInventario(prev => ({ ...prev, id_producto: producto.id_producto }));
    setStep(2);
  };

  const handleSave = async () => {
    if (!inventario.cantidad) {
      alert("Completa los campos obligatorios del inventario");
      return;
    }
    try {
      await crearEntrada(tipoProducto, producto, inventario);
      alert("Entrada registrada correctamente");
      onClose();
      setStep(1);

      // Resetear producto e inventario con nuevos IDs de 7 caracteres
      const nuevoIdProducto = generarIdAlfanumerico();
      const nuevoIdInventario = generarIdAlfanumerico();

      setProducto({
        id_producto: nuevoIdProducto,
        nombre: "",
        marca: "",
        talla: "",
        color: "",
        precio: "",
        sabor: "",
        peso: "",
        litros: "",
      });

      setInventario({
        id_inventario: nuevoIdInventario,
        id_producto: nuevoIdProducto,
        cantidad: "",
        tipo_movimiento: "entrada",
        ruc_compra: "",
        tipo_venta: "",
        id_usuario: usuarioId,
      });
    } catch (error) {
      console.error(error);
      alert("Error al registrar entrada");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Entrada">
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Tipo de Producto*</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              value={tipoProducto}
              onChange={e => setTipoProducto(e.target.value)}
            >
              <option value="ropa">Ropa Deportiva</option>
              <option value="comestible">Producto Comestible</option>
            </select>
          </div>

          <Input label="ID Producto*" value={producto.id_producto} readOnly />
          <Input label="Nombre*" placeholder="Nombre del producto" value={producto.nombre} onChange={e => setProducto({...producto, nombre: e.target.value})} />
          <Input label="Marca" placeholder="Opcional" value={producto.marca} onChange={e => setProducto({...producto, marca: e.target.value})} />

          {tipoProducto === "ropa" && (
            <>
              <Input label="Talla" placeholder="Ej: M, L, XL" value={producto.talla} onChange={e => setProducto({...producto, talla: e.target.value})} />
              <Input label="Color" placeholder="Color del producto" value={producto.color} onChange={e => setProducto({...producto, color: e.target.value})} />
            </>
          )}

          {tipoProducto === "comestible" && (
            <>
              <Input label="Sabor*" placeholder="Ej: Chocolate" value={producto.sabor} onChange={e => setProducto({...producto, sabor: e.target.value})} />
              <Input label="Peso (kg)" type="number" placeholder="Opcional" value={producto.peso} onChange={e => setProducto({...producto, peso: e.target.value})} />
              <Input label="Litros" type="number" placeholder="Opcional" value={producto.litros} onChange={e => setProducto({...producto, litros: e.target.value})} />
            </>
          )}

          <Input label="Precio*" type="number" placeholder="Precio en soles" value={producto.precio} onChange={e => setProducto({...producto, precio: e.target.value})} />

          <Button onClick={handleNext}>Siguiente</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Input label="ID Inventario*" value={inventario.id_inventario} readOnly />
          <Input label="Cantidad*" type="number" placeholder="Cantidad del producto" value={inventario.cantidad} onChange={e => setInventario({...inventario, cantidad: e.target.value})} />
          <div>
            <label className="block font-semibold mb-1">Tipo Movimiento*</label>
            <select value={inventario.tipo_movimiento} onChange={e => setInventario({...inventario, tipo_movimiento: e.target.value})} className="w-full p-2 rounded-lg bg-gray-700 text-white">
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <Input label="RUC Compra" placeholder="Opcional" value={inventario.ruc_compra} onChange={e => setInventario({...inventario, ruc_compra: e.target.value})} />
          <Input label="Tipo Venta" placeholder="Opcional" value={inventario.tipo_venta} onChange={e => setInventario({...inventario, tipo_venta: e.target.value})} />
          <Input label="ID Usuario" value={inventario.id_usuario} readOnly />

          <Button onClick={handleSave}>Guardar</Button>
        </div>
      )}
    </Modal>
  );
}
