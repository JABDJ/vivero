// Script temporal para agregar la columna imagen_url a la tabla products
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkthmodcfsudezsfzxeo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdGhtb2RjZnN1ZGV6c2Z6eGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Nzk3NzEsImV4cCI6MjA3ODE1NTc3MX0.cnDVh_crWZXpFpDJHhmN0gbCSoLVG9fORKGsXUvJIZo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addImageColumn() {
    try {
        // Intentar agregar la columna usando una consulta RPC o directamente
        // Nota: Supabase JS client no permite ejecutar ALTER TABLE directamente
        // Necesitamos usar el SQL Editor en el dashboard o crear una función RPC

        console.log('⚠️  Este script requiere acceso al SQL Editor de Supabase')
        console.log('Por favor, ejecuta el siguiente comando en el SQL Editor:')
        console.log('')
        console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS imagen_url TEXT;')
        console.log('')
        console.log('URL: https://supabase.com/dashboard/project/qkthmodcfsudezsfzxeo/editor')

    } catch (error) {
        console.error('Error:', error)
    }
}

addImageColumn()
