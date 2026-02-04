# 🔧 Guía Rápida: Agregar Columna imagen_url a la Base de Datos

## ⚠️ Error Actual

Si ves este error al guardar un producto:
```
Error al guardar: Could not find the 'imagen_url' column of 'products' in the schema cache
```

Significa que falta ejecutar el comando SQL para agregar la columna a la base de datos.

---

## ✅ Solución: Ejecutar SQL en Supabase

### Paso 1: Abrir el SQL Editor de Supabase

1. Abre tu navegador
2. Ve a: **https://supabase.com/dashboard/project/qkthmodcfsudezsfzxeo/editor**
3. Inicia sesión si es necesario

### Paso 2: Ejecutar el Comando SQL

1. En el SQL Editor, pega este comando:

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS imagen_url TEXT;
```

2. Haz clic en el botón **"Run"** (Ejecutar)

3. Deberías ver un mensaje de éxito como:
   ```
   Success. No rows returned
   ```

### Paso 3: Verificar

1. Regresa a tu aplicación
2. Intenta agregar un producto con imagen nuevamente
3. Ahora debería funcionar correctamente ✅

---

## 🎯 Alternativa: Usar la Consola de Supabase

Si prefieres usar la interfaz gráfica:

1. Ve a: **https://supabase.com/dashboard/project/qkthmodcfsudezsfzxeo/editor**
2. En el menú lateral, busca "Table Editor"
3. Selecciona la tabla `products`
4. Haz clic en "+ New Column"
5. Configura:
   - **Name**: `imagen_url`
   - **Type**: `text`
   - **Nullable**: ✅ (permitir valores nulos)
6. Haz clic en "Save"

---

## 📝 Nota

Este paso solo necesitas hacerlo **una vez**. Después de agregar la columna, la aplicación funcionará correctamente para siempre.
