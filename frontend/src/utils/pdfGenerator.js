import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * 📦 Genera un PDF moderno del inventario con logo grande,
 * color sólido elegante y marca de agua más visible.
 */
export async function generarPDFInventario(ropa = [], comestibles = [], options = {}) {
  const { filename, meta } = options;
  const doc = new jsPDF("p", "mm", "a4");

  // 🎨 Paleta moderna
  const COLOR_HEADER = [95, 0, 30]; // Vino
  const COLOR_ACCENT = [255, 193, 7]; // Dorado
  const COLOR_TEXT_DARK = [51, 51, 51];
  const HEADER_HEIGHT = 45;

  // ======================
  // 🔰 ENCABEZADO CON LOGO GRANDE A LA IZQUIERDA
  // ======================
  try {
    const logoUrl = "http://localhost:5000/uploads/1762191774524-235873924.png";

    // Convierte imagen a Base64
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const base64Logo = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    // Fondo vino
    doc.setFillColor(...COLOR_HEADER);
    doc.rect(0, 0, 210, HEADER_HEIGHT, "F");

    // Logo grande al lado izquierdo
    const LOGO_WIDTH = 50;
    const LOGO_HEIGHT = 34;
    const LOGO_X = 12;
    const LOGO_Y = 6;
    doc.addImage(base64Logo, "PNG", LOGO_X, LOGO_Y, LOGO_WIDTH, LOGO_HEIGHT);

    // Texto del título alineado a la derecha
    const TEXT_X = LOGO_X + LOGO_WIDTH + 10;
    const TEXT_Y = 20;

    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text("STOCK GENERAL DE INVENTARIO", TEXT_X, TEXT_Y);

    // Subtítulo debajo del título
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 220, 220);
    doc.text(
      meta?.subtitle || `Generado: ${new Date().toLocaleString("es-PE")}`,
      TEXT_X,
      TEXT_Y + 6
    );

    // Línea decorativa dorada
    doc.setFillColor(...COLOR_ACCENT);
    doc.rect(TEXT_X, TEXT_Y + 10, 75, 1.6, "F");
  } catch (err) {
    console.warn("⚠️ No se pudo cargar el logo:", err);
    doc.setFillColor(...COLOR_HEADER);
    doc.rect(0, 0, 210, HEADER_HEIGHT, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("STOCK GENERAL DE INVENTARIO", 20, 25);
  }

  // 💧 Marca de agua: más visible y un poquito más grande
  const addWatermark = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.13 })); // más visible
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28); // un poco más grande
    doc.setTextColor(110, 0, 30); // color vino más intenso
    doc.text("", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 0, // centrado sin rotación
    });
    doc.restoreGraphicsState();
  };

  addWatermark();

  // ======================
  // 👕 TABLA DE ROPA
  // ======================
  let posY = HEADER_HEIGHT + 20;
  if (ropa?.length > 0) {
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.setFontSize(13);
    doc.text("Ropa Deportiva", 14, posY);

    autoTable(doc, {
      startY: posY + 4,
      head: [["ID", "Nombre", "Marca", "Stock", "Talla", "Color", "Precio", "Ubicación"]],
      body: ropa.map((p) => [
        p.id_ropa || "—",
        p.nombre || "—",
        p.marca || "—",
        p.stock_actual ?? 0,
        p.talla || "—",
        p.color || "—",
        `S/ ${(parseFloat(p.precio) || 0).toFixed(2)}`,
        p.ubicacion || "—",
      ]),
      theme: "grid",
      styles: { fontSize: 9, halign: "center", textColor: COLOR_TEXT_DARK },
      headStyles: { fillColor: COLOR_HEADER, textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didDrawPage: addWatermark,
    });
    posY = doc.lastAutoTable.finalY + 12;
  }

  // ======================
  // 🥤 TABLA DE COMESTIBLES
  // ======================
  if (comestibles?.length > 0) {
    doc.setFontSize(13);
    doc.text("Comestibles y Suplementos", 14, posY);
    autoTable(doc, {
      startY: posY + 4,
      head: [
        ["ID", "Nombre", "Marca", "Sabor", "Peso", "Litros", "Vencimiento", "Precio", "Ubicación"],
      ],
      body: comestibles.map((p) => [
        p.id_comestible || "—",
        p.nombre || "—",
        p.marca || "—",
        p.sabor || "—",
        p.peso || "-",
        p.litros || "-",
        p.fecha_vencimiento
          ? new Date(p.fecha_vencimiento).toLocaleDateString("es-PE")
          : "—",
        `S/ ${(parseFloat(p.precio) || 0).toFixed(2)}`,
        p.ubicacion || "—",
      ]),
      theme: "grid",
      styles: { fontSize: 9, halign: "center", textColor: COLOR_TEXT_DARK },
      headStyles: { fillColor: COLOR_HEADER, textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didDrawPage: addWatermark,
    });
  }

  // ======================
  // 📄 PIE DE PÁGINA
  // ======================
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, pageHeight - 14, 196, pageHeight - 14);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Sistema de Gestión de Inventario | ${new Date().getFullYear()}`, 14, pageHeight - 8);
  doc.text("Reporte generado automáticamente", 196, pageHeight - 8, { align: "right" });

// 💾 GUARDAR
const safeName = filename || `Inventario_Stock_Actual_${new Date().toISOString().slice(0, 10)}.pdf`;
doc.save(safeName);
}
