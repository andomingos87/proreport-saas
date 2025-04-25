import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'
import type { ExteriorFormData } from '@/lib/schemas/exterior'

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  })

  try {
    const cookieStore = cookies() // Synchronously get read-only cookies

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // Read from the incoming request's cookies
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Modify the outgoing response's cookies
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            // Modify the outgoing response's cookies
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // Use the customized response object for returning errors
      response = NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      return response
    }

    const body = await request.json() as ExteriorFormData
    const inspectionId = context.params.id

    // Salvar os dados do tamanho da construção
    const { data: buildSizeData, error: buildSizeError } = await supabase
      .from('exterior')
      .upsert({
        id: inspectionId,
        square_footage: body.buildSize.squareFootage,
        photos: body.buildSize.photos
      })
      .select()
      .single()

    if (buildSizeError) {
      throw buildSizeError
    }

    // Salvar os dados da superfície da parede
    const { error: wallSurfaceError } = await supabase
      .from('exterior_wall_surface')
      .upsert({
        exterior_id: inspectionId,
        type: body.wallSurface.type,
        repair_condition: body.wallSurface.repairCondition,
        recommendation: body.wallSurface.recommendation,
        task: body.wallSurface.task,
        repair_time: body.wallSurface.repairTime,
        repair_cost_min: body.wallSurface.repairCostMin,
        repair_cost_max: body.wallSurface.repairCostMax,
        photos: body.wallSurface.photos
      })

    if (wallSurfaceError) {
      throw wallSurfaceError
    }

    // Use the customized response object for returning success
    response = NextResponse.json({ success: true })
    return response

  } catch (error) {
    console.error('Error saving exterior data:', error)
    // Use the customized response object for returning errors
    response = NextResponse.json(
      { error: 'Erro ao salvar os dados' },
      { status: 500 }
    )
    return response
  }
}