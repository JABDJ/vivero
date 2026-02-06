-- Script SQL para agregar subcategoría y disponibilidad a la tabla products
-- Ejecutar esto en el SQL Editor de Supabase Dashboard

-- Agregar columna de subcategoría
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategoria TEXT;

-- Agregar columna de disponibilidad (por defecto true)
ALTER TABLE products ADD COLUMN IF NOT EXISTS disponible BOOLEAN DEFAULT true;
