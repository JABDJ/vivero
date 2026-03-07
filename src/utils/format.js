/**
 * Formatea un número al estilo venezolano/español:
 * miles separados por punto, decimales por coma
 * Ej: 1000000 → "1.000.000,00"
 */
export function formatPrice(value) {
    const num = Number(value)
    if (isNaN(num)) return '0,00'
    return num.toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}
