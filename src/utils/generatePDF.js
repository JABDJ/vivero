import jsPDF from 'jspdf'
import { formatPrice } from './format'

/**
 * Genera y descarga una factura en PDF.
 * @param {Object} factura  - { id, cliente_nombre, creado_en, total }
 * @param {Array}  items    - [{ nombre_producto, cantidad, precio_unitario, subtotal }]
 */
export function generarFacturaPDF(factura, items) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const W = 210   // ancho A4
    const margen = 18
    const col = W - margen * 2

    /* ── Paleta de colores del logo ── */
    const CYAN = [0, 183, 195]     // #00B7C3
    const VERDE = [0, 195, 110]     // #00C36E
    const OSCURO = [15, 25, 40]    // fondo
    const GRIS = [100, 110, 125]
    const BLANCO = [255, 255, 255]
    const LIGHT = [240, 245, 250]

    let y = 0

    /* ─── HEADER con fondo degradado (simulado con rectángulo) ─── */
    doc.setFillColor(...OSCURO)
    doc.rect(0, 0, W, 50, 'F')

    // Barra de acento lateral
    doc.setFillColor(...CYAN)
    doc.rect(0, 0, 5, 50, 'F')

    // Logo / Nombre empresa
    doc.setTextColor(...CYAN)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.text('JABDJ', margen, 20)

    doc.setTextColor(...VERDE)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Sistema de Gestión — El Vivero', margen, 27)

    // Etiqueta FACTURA
    doc.setFillColor(...CYAN)
    doc.roundedRect(W - margen - 40, 10, 40, 14, 3, 3, 'F')
    doc.setTextColor(...BLANCO)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('FACTURA', W - margen - 20, 19.5, { align: 'center' })

    // Número de factura
    doc.setTextColor(180, 200, 220)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`N.º ${String(factura.id).padStart(6, '0')}`, W - margen, 29, { align: 'right' })

    y = 40

    /* ─── INFO CLIENTE / FECHA ─── */
    doc.setFillColor(...LIGHT)
    doc.rect(0, y, W, 28, 'F')

    // Separador cyan
    doc.setDrawColor(...CYAN)
    doc.setLineWidth(0.5)
    doc.line(0, y, W, y)

    y += 7
    doc.setTextColor(...GRIS)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text('CLIENTE', margen, y)
    doc.text('FECHA DE EMISIÓN', W / 2, y)

    y += 5
    doc.setTextColor(30, 40, 55)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(factura.cliente_nombre || 'Sin nombre', margen, y)

    const fecha = factura.creado_en
        ? new Date(factura.creado_en).toLocaleString('es-VE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
        : '—'
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(fecha, W / 2, y)

    y += 10
    doc.setDrawColor(...CYAN)
    doc.line(0, y, W, y)

    y += 10

    /* ─── TABLA DE PRODUCTOS ─── */
    // Encabezados
    doc.setFillColor(...OSCURO)
    doc.rect(margen, y, col, 9, 'F')

    doc.setTextColor(...CYAN)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    const cols = {
        producto: margen + 2,
        cant: margen + col * 0.58,
        precio: margen + col * 0.72,
        subtotal: margen + col * 0.87,
    }
    doc.text('PRODUCTO', cols.producto, y + 6)
    doc.text('CANT.', cols.cant, y + 6)
    doc.text('P. UNIT.', cols.precio, y + 6)
    doc.text('SUBTOTAL', cols.subtotal, y + 6)

    y += 9

    // Filas
    items.forEach((item, i) => {
        const bg = i % 2 === 0 ? [255, 255, 255] : [246, 249, 252]
        doc.setFillColor(...bg)
        doc.rect(margen, y, col, 8, 'F')

        doc.setTextColor(30, 40, 55)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)

        // Nombre (truncado si es largo)
        const nombre = item.nombre_producto?.length > 36
            ? item.nombre_producto.slice(0, 36) + '…'
            : item.nombre_producto
        doc.text(nombre, cols.producto, y + 5.5)
        doc.text(String(item.cantidad), cols.cant, y + 5.5)
        doc.text(`$${formatPrice(item.precio_unitario)}`, cols.precio, y + 5.5)

        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...[0, 140, 80])
        doc.text(`$${formatPrice(item.subtotal)}`, cols.subtotal, y + 5.5)

        y += 8
    })

    // Borde inferior de la tabla
    doc.setDrawColor(...CYAN)
    doc.setLineWidth(0.4)
    doc.line(margen, y, margen + col, y)

    y += 8

    /* ─── TOTAL ─── */
    const totalW = 75
    const totalX = W - margen - totalW

    doc.setFillColor(...OSCURO)
    doc.roundedRect(totalX, y, totalW, 14, 3, 3, 'F')

    doc.setTextColor(...GRIS)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('TOTAL A PAGAR', totalX + 4, y + 5.5)

    doc.setTextColor(...VERDE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(`$${formatPrice(factura.total)}`, totalX + totalW - 4, y + 11, { align: 'right' })

    y += 24

    /* ─── PIE DE PÁGINA ─── */
    doc.setDrawColor(...CYAN)
    doc.setLineWidth(0.3)
    doc.line(margen, y, W - margen, y)

    y += 5
    doc.setTextColor(...GRIS)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7.5)
    doc.text('Gracias por su compra — JABDJ Sistema de Gestión', W / 2, y, { align: 'center' })
    doc.text(`Generado el ${new Date().toLocaleString('es-VE')}`, W / 2, y + 4, { align: 'center' })

    /* ─── Guardar ─── */
    const nombreArchivo = `Factura_${String(factura.id).padStart(6, '0')}_${factura.cliente_nombre?.replace(/\s+/g, '_') || 'cliente'}.pdf`
    doc.save(nombreArchivo)
}
