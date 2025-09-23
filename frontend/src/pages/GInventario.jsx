import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { registrarEntrada, registrarSalida, obtenerProductos } from "../api/inventario";

export default function GInventario() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada"); // "entrada" o "salida"
  const [tipoProducto, setTipoProducto] = useState("ropa"); // "ropa" o "comestible"
  const [productosExistentes, setProductosExistentes] = useState([]);
  const [formData, setFormData] = useState({
    id_producto: "",
    nombre: "",
    marca: "",
    talla: "",
    color: "",
    precio: "",
    sabor: "",
    peso: "",
    litros: "",
    ubicacion: "",
    imagen: "",
    cantidad: "",
    ruc_compra: "",
    tipo_venta: "",
    id_usuario: "",
  });

  // Autocompletar ID Usuario desde sesión/localStorage
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    setFormData(prev => ({ ...prev, id_usuario: usuario.id_usuario || "" }));
  }, []);

  // Obtener productos existentes al registrar salida
  useEffect(() => {
    if (tipoMovimiento === "salida") {
      obtenerProductos(tipoProducto).then(data => setProductosExistentes(data));
    }
  }, [tipoMovimiento, tipoProducto]);

  // Abrir modal
  const handleOpenModal = (tipo) => {
    setTipoMovimiento(tipo);
    setFormData({
      id_producto: "",
      nombre: "",
      marca: "",
      talla: "",
      color: "",
      precio: "",
      sabor: "",
      peso: "",
      litros: "",
      ubicacion: "",
      imagen: "",
      cantidad: "",
      ruc_compra: "",
      tipo_venta: "",
      id_usuario: formData.id_usuario, // mantener usuario
    });
    setTipoProducto("ropa");
    setModalOpen(true);
  };

  // Validación y límite de caracteres
  const handleChange = (e) => {
    let { name, value } = e.target;

    switch(name) {
      case "id_producto":
      case "id_usuario":
        value = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7);
        break;
      case "nombre":
        value = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50);
        break;
      case "marca":
        value = value.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 20);
        break;
      case "talla":
        value = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
        break;
      case "color":
      case "sabor":
        value = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 20);
        break;
      case "precio":
      case "peso":
      case "litros":
        value = value.replace(/[^0-9.]/g, "").slice(0, 10);
        break;
      case "ubicacion":
        value = value.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 50);
        break;
      case "imagen":
        value = value.slice(0, 255);
        break;
      case "cantidad":
        value = value.replace(/[^0-9]/g, "").slice(0, 10);
        break;
      case "ruc_compra":
        value = value.replace(/[^0-9]/g, "").slice(0, 15);
        break;
      case "tipo_venta":
        value = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 10);
        break;
      default:
        break;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id_inventario = `INV${Math.floor(Math.random() * 10000).toString().padStart(4,"0")}`;
      const body = { id_inventario, tipoProducto, ...formData };

      let data;
      if (tipoMovimiento === "entrada") {
        data = await registrarEntrada(body);
      } else {
        data = await registrarSalida(body);
      }

      alert(data.message);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al registrar inventario");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={() => console.log("Cerrar sesión")} />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de Inventario</h1>

        <div className="space-x-4 mb-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => handleOpenModal("entrada")}
          >
            Registrar Entrada
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => handleOpenModal("salida")}
          >
            Registrar Salida
          </button>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                Registrar {tipoMovimiento === "entrada" ? "Entrada (Compra)" : "Salida (Venta)"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Tipo de producto */}
                <div>
                  <label className="block mb-1">Tipo de Producto</label>
                  <select
                    value={tipoProducto}
                    onChange={(e) => setTipoProducto(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="ropa">Ropa</option>
                    <option value="comestible">Comestible</option>
                  </select>
                </div>

                {/* ID Producto */}
                <div>
                  <label className="block mb-1">ID Producto</label>
                  {tipoMovimiento === "salida" ? (
                    <select
                      name="id_producto"
                      value={formData.id_producto}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                      required
                    >
                      <option value="">--Seleccione--</option>
                      {productosExistentes.map(p => (
                        <option key={p.id_producto || p.id_ropa} value={p.id_producto || p.id_ropa}>
                          {p.nombre} ({p.id_producto || p.id_ropa})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="id_producto"
                      value={formData.id_producto}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                      required
                    />
                  )}
                </div>

                {/* Campos de producto para entrada */}
                {tipoMovimiento === "entrada" && tipoProducto === "ropa" && (
                  <>
                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
                    <input type="text" name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="text" name="talla" placeholder="Talla" value={formData.talla} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="number" step="0.01" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
                    <input type="text" name="ubicacion" placeholder="Ubicación (opcional)" value={formData.ubicacion} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="text" name="imagen" placeholder="URL de Imagen (opcional)" value={formData.imagen} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                  </>
                )}

                {tipoMovimiento === "entrada" && tipoProducto === "comestible" && (
                  <>
                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
                    <input type="text" name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="text" name="sabor" placeholder="Sabor" value={formData.sabor} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
                    <input type="number" step="0.01" name="peso" placeholder="Peso" value={formData.peso} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="number" step="0.01" name="litros" placeholder="Litros" value={formData.litros} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="number" step="0.01" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
                    <input type="text" name="ubicacion" placeholder="Ubicación (opcional)" value={formData.ubicacion} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    <input type="text" name="imagen" placeholder="URL de Imagen (opcional)" value={formData.imagen} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                  </>
                )}

                {/* Cantidad */}
                <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />

                {/* RUC de compra para entrada */}
                {tipoMovimiento === "entrada" && (
                  <input type="text" name="ruc_compra" placeholder="RUC de Compra" value={formData.ruc_compra} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
                )}

                {/* Tipo de venta para salida */}
                {tipoMovimiento === "salida" && (
                  <input type="text" name="tipo_venta" placeholder="Tipo de Venta" value={formData.tipo_venta} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
                )}

                {/* ID Usuario */}
                <input type="text" name="id_usuario" placeholder="ID Usuario" value={formData.id_usuario} readOnly className="w-full border px-2 py-1 rounded bg-gray-100" />

                {/* Botones */}
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded border">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <p>Contenido de gestión de inventario...</p>
      </div>
    </div>
  );
}
