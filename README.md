# SIGIC — Sistema Integral de Gestión e Investigación Criminal

PWA de inteligencia criminal para investigación de delitos complejos, narcotráfico y homicidios en la provincia de Santa Fe, Argentina.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite 8 |
| Estado | Zustand |
| Base de Datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth (JWT + 2FA) |
| Mapas | React-Leaflet + Deck.gl |
| Análisis Espacial | Turf.js |
| Grafos | Sigma.js + Graphology |
| Documentos | PDFMake + DocxTemplater |
| Hosting | Vercel |

## Módulos

1. **Dashboard** — Métricas de seguridad y estadísticas
2. **Causas Penales** — CRUD completo de expedientes con CUIJ
3. **Inteligencia Criminal** — Análisis de vínculos POLE + Sigma.js
4. **Geoespacial** — Mapas de calor, geofencing, timeline temporal
5. **Documentos** — Generación de órdenes, informes, PDF/DOCX

## Setup Local

```bash
# 1. Clonar
git clone https://github.com/nespinosaoimpa-wq/Gadget.git
cd Gadget

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Ejecutar
npm run dev
```

## Variables de Entorno

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |

## Licencia

Uso interno — Ministerio de Seguridad, Provincia de Santa Fe.
