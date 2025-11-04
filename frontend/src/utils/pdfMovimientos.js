import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generarPDFMovimientos(movRopa = [], movComestibles = [], options = {}) {
  const { filename, meta } = options;
  const doc = new jsPDF("p", "mm", "a4");

  const COLOR_HEADER = [95, 0, 30];
  const COLOR_ACCENT = [255, 193, 7];
  const COLOR_TEXT_DARK = [51, 51, 51];
  const HEADER_HEIGHT = 45;

  // ======================
  // 🔰 Encabezado
  // ======================
  try {
    const logoUrl = "http://localhost:5000/uploads/1762191774524-235873924.png";
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const base64Logo = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    doc.setFillColor(...COLOR_HEADER);
    doc.rect(0, 0, 210, HEADER_HEIGHT, "F");
    doc.addImage(base64Logo, "PNG", 12, 6, 50, 34);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text("HISTORIAL DE MOVIMIENTOS", 72, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 220, 220);
    doc.text(meta?.subtitle || `Generado: ${new Date().toLocaleString("es-PE")}`, 72, 26);

    doc.setFillColor(...COLOR_ACCENT);
    doc.rect(72, 30, 75, 1.6, "F");
  } catch (err) {
    console.warn("⚠️ No se pudo cargar el logo:", err);
    doc.setFillColor(...COLOR_HEADER);
    doc.rect(0, 0, 210, HEADER_HEIGHT, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("HISTORIAL DE MOVIMIENTOS", 20, 25);
  }

  // 💧 Marca de agua
  const addWatermark = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.13 }));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(110, 0, 30);
    doc.text("GIMNASIO TERRONES", pageWidth / 2, pageHeight / 2, { align: "center" });
    doc.restoreGraphicsState();
  };
  addWatermark();

  // ======================
  // ⚡ Configuración común para tablas
  // ======================
  const tableOptions = {
    styles: {
      fontSize: 7,       // Fuente compacta
      cellPadding: 1.5,  // Celdas compactas
      halign: "left",
      textColor: COLOR_TEXT_DARK,
    },
    headStyles: {
      fillColor: COLOR_HEADER,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    didDrawPage: addWatermark,
    columnStyles: {
      0: { cellWidth: 20 }, // Producto reducido
      1: { cellWidth: 30 }, // Usuario
      2: { cellWidth: 18 }, // Tipo
      3: { cellWidth: 12 }, // Cantidad
      4: { cellWidth: 25 }, // Comprobante
      5: { cellWidth: 20 }, // Pago
      6: { cellWidth: 20 }, // Monto
      7: { cellWidth: 45 }, // Fecha más ancha
    },
  };

  const sectionTitleOptions = {
    fontSize: 9,
    fontStyle: "bold",
    textColor: COLOR_TEXT_DARK,
    marginLeft: 14,
    spacingAfter: 2,
  };

  // ======================
  // 👕 Ropa Deportiva
  // ======================
  let posY = HEADER_HEIGHT + 20;
  if (movRopa?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(sectionTitleOptions.fontSize);
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.text("Movimientos de Ropa Deportiva", sectionTitleOptions.marginLeft, posY);

    autoTable(doc, {
      startY: posY + sectionTitleOptions.spacingAfter,
      head: [["Producto", "Usuario", "Tipo", "Cantidad", "Comprobante", "Pago", "Monto", "Fecha"]],
      body: movRopa.map((m) => [
        m.producto || "—",
        m.usuario || "—",
        m.tipo_movimiento?.toUpperCase() || "—",
        m.cantidad ?? 0,
        `${m.tipo_comprobante || "-"} / ${m.numero_comprobante || "-"}`,
        m.metodo_pago || "-",
        m.monto_pagado ? `S/ ${(parseFloat(m.monto_pagado) || 0).toFixed(2)}` : "-",
        m.fecha || "-",
      ]),
      ...tableOptions,
    });

    posY = doc.lastAutoTable.finalY + 8;
  }

  // ======================
  // 🍎 Comestibles
  // ======================
  if (movComestibles?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(sectionTitleOptions.fontSize);
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.text("Movimientos de Comestibles y Suplementos", sectionTitleOptions.marginLeft, posY);

    autoTable(doc, {
      startY: posY + sectionTitleOptions.spacingAfter,
      head: [["Producto", "Usuario", "Tipo", "Cantidad", "Comprobante", "Pago", "Monto", "Fecha"]],
      body: movComestibles.map((m) => [
        m.producto || "—",
        m.usuario || "—",
        m.tipo_movimiento?.toUpperCase() || "—",
        m.cantidad ?? 0,
        `${m.tipo_comprobante || "-"} / ${m.numero_comprobante || "-"}`,
        m.metodo_pago || "-",
        m.monto_pagado ? `S/ ${(parseFloat(m.monto_pagado) || 0).toFixed(2)}` : "-",
        m.fecha || "-",
      ]),
      ...tableOptions,
    });
  }

  // ======================
  // 📄 Pie de página
  // ======================
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, pageHeight - 14, 196, pageHeight - 14);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Sistema de Gestión de Inventario | ${new Date().getFullYear()}`, 14, pageHeight - 8);
  doc.text("Reporte de Movimientos Generado Automáticamente", 196, pageHeight - 8, { align: "right" });

  const safeName = filename || `Movimientos_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(safeName);
}
