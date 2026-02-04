-- Script SQL para agregar la columna imagen_url a la tabla products
-- Ejecutar esto en el SQL Editor de Supabase Dashboard

ALTER TABLE products ADD COLUMN IF NOT EXISTS imagen_url TEXT;
