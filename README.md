# vemasmas Admin

Panel web para administrar personas y equipos. La interfaz usa React, TypeScript, Tailwind CSS, primitivas Shadcn/Radix y React Router. Supabase proporciona autenticacion y PostgreSQL cuando se configuran sus variables publicas.

## Requisitos

- Node.js 20 o superior.
- Docker Desktop en ejecucion para Supabase local.
- npm.

## Desarrollo frontend

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre la URL que indique Vite. Si `.env.local` no contiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, el build de desarrollo habilita un modo local simulado:

- El login acepta cualquier correo y una contrasena de seis caracteres o mas.
- La sesion y los registros de personas se guardan solo en `localStorage` del navegador.
- El modo aparece etiquetado como `Modo local simulado`.
- Nunca debe usarse como autenticacion de produccion.

En un build de produccion sin configuracion de Supabase, el login falla de forma cerrada y no concede acceso simulado.

La ruta `/register` permite crear cuentas de demo tanto localmente como en el proyecto remoto. En local, el registro simulado crea una sesion solo en el navegador cuando no hay variables de Supabase. Con Supabase configurado, el alta usa Auth; si el proyecto requiere confirmacion de email, la pantalla informa al usuario que debe verificar su correo antes de entrar.

## Supabase local

El repositorio ya contiene `supabase/config.toml`, `supabase/seed.sql` y la migracion canonica `supabase/migrations/0000_initial_schema.sql`.

Para inicializar un proyecto desde cero:

```bash
npx supabase init
npx supabase migration new create_persons_table
```

El comando de migracion crea un archivo con prefijo timestamp. Para este proyecto, conserva una unica migracion inicial con el nombre `0000_initial_schema.sql` y elimina el archivo timestamped vacio antes de aplicar cambios.

Con Docker Desktop ejecutandose:

```bash
npx supabase start
npx supabase db reset
npx supabase gen types typescript --local > src/types/database.types.ts
npx supabase status
```

La migracion crea `public.persons` con UUID, timestamp de alta, nombre, correo unico, telefono de diez digitos, rol opcional y estado `active`/`inactive`. Tambien habilita RLS y permite leer, crear, actualizar y borrar solo a usuarios con el rol Supabase `authenticated`.

`supabase/seed.sql` carga 30 personas sinteticas, con roles variados y estados activos/inactivos. El seed se ejecuta con `supabase db reset` y solo sirve para desarrollo local; no se aplica con `supabase db push`.

`src/types/database.types.ts` es un artefacto generado. No lo edites manualmente; regeneralo despues de cada cambio de esquema.

## Supabase remoto

Configura primero las variables en `.env.local` y no uses una clave `service_role` en el navegador. Despues de validar la migracion local:

```bash
export SUPABASE_PROJECT_REF="tu-project-ref"
npx supabase link --project-ref "$SUPABASE_PROJECT_REF"
npx supabase migration list
npx supabase db push
npx supabase gen types typescript --linked > src/types/database.types.ts
```

Este flujo sincroniza el esquema y las politicas RLS revisadas. No envia los registros de `seed.sql` al proyecto remoto. La instancia remota requiere que la CLI tenga una sesion autenticada.

Para el demo remoto, habilita `Authentication > Providers > Email` y configura la confirmacion de email segun la experiencia que quieras mostrar. El registro publico esta pensado para este entorno demo; el modelo RLS actual permite que cualquier usuario autenticado gestione el directorio completo.

El primer release permite que cualquier usuario autenticado gestione todos los registros. No hay roles de RR. HH. ni aislamiento por organizacion; esa ampliacion requiere nuevas politicas RLS y una especificacion separada.

## Comandos de calidad

```bash
npm run lint
npm test
npm run build
```

## Estructura principal

```text
supabase/
  config.toml
  migrations/0000_initial_schema.sql
src/
  components/layout/       # shell, sidebar, header y command palette
  components/persons/      # tabla, formularios, detalle y confirmaciones
  components/providers/    # auth y tema
  components/ui/           # primitivas Shadcn/Radix locales
  hooks/                   # auth, tema y consultas de personas
  lib/                     # validacion, errores y utilidades
  pages/                   # login, dashboard, personas y detalle
  routes/                  # rutas privadas y recuperacion de errores
  services/                # cliente Supabase y operaciones de dominio
  types/                   # tipos de base de datos y personas
```
