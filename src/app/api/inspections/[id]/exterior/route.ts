import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { ExteriorFormData } from '@/lib/schemas/exterior'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json() as ExteriorFormData
    const inspectionId = params.id

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving exterior data:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar os dados' },
      { status: 500 }
    )
  }
} 