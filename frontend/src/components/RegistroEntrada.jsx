import { useState } from "react";
import Modal from "./ui/ModalGInventario";
import Button from "./ui/Button";
import { crearEntrada } from "../api/inventario";

export default function ModalEntrada({ isOpen, onClose, title, usuarioId, tipo }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    sabor: "",
    peso: "",
    litros: "",
    talla: "",
    color: "",
    ubicacion: "",
    precio: "",
    cantidad: "",
    ruc_compra: "",
    tipo_venta: "",
  });

  const [imagenFile, setImagenFile] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => { if (e.target.files && e.target.files[0]) setImagenFile(e.target.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const producto = tipo === "comestible"
      ? { nombre: formData.nombre, marca: formData.marca, sabor: formData.sabor, peso: formData.peso, litros: formData.litros, ubicacion: formData.ubicacion, precio: formData.precio }
      : { nombre: formData.nombre, marca: formData.marca, talla: formData.talla, color: formData.color, ubicacion: formData.ubicacion, precio: formData.precio };

    const inventario = { cantidad: formData.cantidad, ruc_compra: formData.ruc_compra, tipo_venta: formData.tipo_venta, id_usuario: usuarioId };

    try {
      await crearEntrada(tipo, producto, inventario, imagenFile);
      onClose();
      setStep(1);
      setFormData({ nombre: "", marca: "", sabor: "", peso: "", litros: "", talla: "", color: "", ubicacion: "", precio: "", cantidad: "", ruc_compra: "", tipo_venta: "" });
      setImagenFile(null);
    } catch (error) {
      console.error("Error al registrar entrada:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} step={step}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-2 md:px-8 text-sm">
        {step === 1 && (
          <section className="space-y-3">
            <h4 className="text-lg font-semibold text-[#4a0d0d] border-b border-[#d1a7a7] pb-1">
              Datos del producto
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
              <InputField label="Marca" name="marca" value={formData.marca} onChange={handleChange} />

              {tipo === "comestible" && <>
                <InputField label="Sabor" name="sabor" value={formData.sabor} onChange={handleChange} />
                <InputField label="Peso (g)" name="peso" type="number" value={formData.peso} onChange={handleChange} />
                <InputField label="Litros" name="litros" type="number" value={formData.litros} onChange={handleChange} />
                <InputField label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
              </>}

              {tipo === "ropa" && <>
                <InputField label="Talla" name="talla" value={formData.talla} onChange={handleChange} />
                <InputField label="Color" name="color" value={formData.color} onChange={handleChange} />
                <InputField label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
                <div></div>
              </>}

              <InputField label="Precio" name="precio" type="number" value={formData.precio} onChange={handleChange} required />

              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1 text-[#4a0d0d]">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-[#d1a7a7] rounded-none px-3 py-1.5 bg-white text-xs"
                />
                {imagenFile && (
                  <div className="mt-2 flex justify-center">
                    <img src={URL.createObjectURL(imagenFile)} alt="Vista previa" className="w-28 h-28 object-cover rounded-none shadow border" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#7b1e1e] hover:bg-[#9c2525] text-white px-6 py-2 rounded-none shadow-md text-sm"
              >
                Siguiente
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-3">
            <h4 className="text-lg font-semibold text-[#4a0d0d] border-b border-[#d1a7a7] pb-1">
              Datos de compra
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Cantidad" name="cantidad" type="number" value={formData.cantidad} onChange={handleChange} required />
              <InputField label="RUC de la compra" name="ruc_compra" value={formData.ruc_compra} onChange={handleChange} />
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1 text-[#4a0d0d]">Tipo de venta</label>
                <select
                  name="tipo_venta"
                  value={formData.tipo_venta}
                  onChange={handleChange}
                  className="w-full border border-[#d1a7a7] rounded-none px-3 py-1.5 bg-white text-xs focus:ring-2 focus:ring-[#b71c1c]"
                >
                  <option value="">Seleccione...</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="credito">Crédito</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-none text-sm">
                Volver
              </Button>

              <Button type="submit" className="bg-[#7b1e1e] hover:bg-[#9c2525] text-white px-6 py-2 rounded-none shadow-md text-sm">
                Guardar
              </Button>
            </div>
          </section>
        )}
      </form>
    </Modal>
  );
}

function InputField({ label, name, type = "text", value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1 text-[#4a0d0d]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border border-[#d1a7a7] rounded-none px-3 py-1.5 focus:ring-2 focus:ring-[#b71c1c] focus:outline-none bg-white text-sm"
        required={required}
      />
    </div>
  );
}
