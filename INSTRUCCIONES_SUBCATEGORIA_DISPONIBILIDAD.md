# 🔧 Instrucciones: Agregar Subcategoría y Disponibilidad

## ⚠️ Acción Requerida

Antes de usar las nuevas funcionalidades de **subcategoría** y **disponibilidad**, debes ejecutar los siguientes comandos SQL en Supabase.

---

## ✅ Paso 1: Abrir el SQL Editor de Supabase

1. Abre tu navegador
2. Ve a: **https://supabase.com/dashboard/project/qkthmodcfsudezsfzxeo/editor**
3. Inicia sesión si es necesario

---

## ✅ Paso 2: Ejecutar los Comandos SQL

Copia y pega estos dos comandos en el SQL Editor:

```sql
-- Agregar columna de subcategoría
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategoria TEXT;

-- Agregar columna de disponibilidad (por defecto true)
ALTER TABLE products ADD COLUMN IF NOT EXISTS disponible BOOLEAN DEFAULT true;
```

Haz clic en **"Run"** para ejecutar ambos comandos.

---

## ✅ Paso 3: Verificar

Deberías ver un mensaje de éxito como:
```
Success. No rows returned
```

---

## 🎯 ¿Qué hacen estos comandos?

1. **`subcategoria`**: Agrega un campo de texto opcional para clasificar mejor los productos (ej: "Plantines", "Macetas")

2. **`disponible`**: Agrega un campo booleano para indicar si el producto está disponible o no. Por defecto es `true` (disponible)

---

## 📝 Nota

Solo necesitas ejecutar estos comandos **una vez**. Después de esto, podrás:
- Agregar subcategorías a tus productos
- Marcar productos como disponibles o no disponibles
- Ver estos datos en la lista de productos con badges de colores
