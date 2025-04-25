// Supabase removido - protótipo frontend

export type BuildingType = 
  | 'Apartment' | 'Attached' | 'Backsplit' | 'Bi - level' | 'Condo - high rise'
  | 'Condo - stacked' | 'Condo - townhome' | 'Condo/Hi-Rise Apartment' | 'Detached'
  | 'Duplex- Detached' | 'Four plex-Detached' | 'Freehold-Townhouse' | 'Manufactured'
  | 'Row' | 'Semi detached House' | 'Semi-detached' | 'Sidesplit' | 'Single Detached House'
  | 'Single Detached House /Basement Apartment' | 'Stacked townhome'
  | 'Stacked townhome-Condominium' | 'Store Front/Apartment (1 Unit)'
  | 'Store Front/Apartment (2 Units)' | 'Townhome' | 'Townhouse-Condominium'
  | 'Tri - level' | 'Triplex-Detached' | 'Unknown'

export type DwellingType = 
  | 'Duplex' | 'Fourplex' | 'Multi-unit' | 'Single' 
  | 'Single & basment apartment' | 'Single & suite' | 'Triplex' | 'Unknown'

export interface Property {
  id: string
  name: string
  address?: string
  city?: string
  province?: string
  zipCode?: string
  country?: string
  buildingType?: BuildingType
  dwelling?: DwellingType
  stories?: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  yearBuilt?: number
  sqFt?: number
  contactId?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreatePropertyData {
  name: string
  address?: string
  city?: string
  province?: string
  zipCode?: string
  country?: string
  buildingType?: BuildingType
  dwelling?: DwellingType
  stories?: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  yearBuilt?: number
  sqFt?: number
  contactId?: string
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {}

class PropertiesService {
  constructor() {
    // Supabase removido - protótipo frontend
  }

  private async ensureAuth() {
    // Mock user para protótipo frontend
    return { id: 'mock-user', email: 'mock@user.com' }
  }

  private mapToDatabase(property: CreatePropertyData | UpdatePropertyData) {
    const mappedProperty = { ...property } as any

    // Mapeando campos camelCase para snake_case do banco
    if (mappedProperty.zipCode !== undefined) {
      mappedProperty.zip_code = mappedProperty.zipCode
      delete mappedProperty.zipCode
    }

    if (mappedProperty.buildingType !== undefined) {
      mappedProperty.building_type = mappedProperty.buildingType
      delete mappedProperty.buildingType
    }

    if (mappedProperty.yearBuilt !== undefined) {
      mappedProperty.year_built = mappedProperty.yearBuilt
      delete mappedProperty.yearBuilt
    }

    if (mappedProperty.sqFt !== undefined) {
      mappedProperty.sq_ft = mappedProperty.sqFt
      delete mappedProperty.sqFt
    }

    if (mappedProperty.contactId !== undefined) {
      mappedProperty.contact_id = mappedProperty.contactId
      delete mappedProperty.contactId
    }

    return mappedProperty
  }

  private mapFromDatabase(property: any): Property {
    const result = { ...property } as any

    // Mapeando campos snake_case do banco para camelCase
    if (result.zip_code !== undefined) {
      result.zipCode = result.zip_code
      delete result.zip_code
    }

    if (result.building_type !== undefined) {
      result.buildingType = result.building_type
      delete result.building_type
    }

    if (result.year_built !== undefined) {
      result.yearBuilt = result.year_built
      delete result.year_built
    }

    if (result.sq_ft !== undefined) {
      result.sqFt = result.sq_ft
      delete result.sq_ft
    }

    if (result.contact_id !== undefined) {
      result.contactId = result.contact_id
      delete result.contact_id
    }

    return result as Property
  }

  async list() {
    const user = await this.ensureAuth()

    // Mock de propriedades
    return [
      { id: '1', name: 'Propriedade 1', user_id: user.id },
      { id: '2', name: 'Propriedade 2', user_id: user.id }
    ] as Property[]
  }

  async listByContact(contactId: string) {
    const user = await this.ensureAuth()

    // Mock de propriedades por contato
    return [
      { id: '1', name: 'Propriedade 1', user_id: user.id, contactId, created_at: '2025-04-20', updated_at: '2025-04-20' },
      { id: '2', name: 'Propriedade 2', user_id: user.id, contactId, created_at: '2025-04-21', updated_at: '2025-04-21' }
    ] as Property[]
  }

  async getById(id: string) {
    const user = await this.ensureAuth()

    // Mock de busca por ID
    return {
      id,
      name: `Propriedade ${id}`,
      user_id: user.id,
      created_at: '2025-04-20',
      updated_at: '2025-04-20'
    } as Property
  }

  async create(property: CreatePropertyData) {
    const user = await this.ensureAuth()
    // Mock de criação
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...property,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Property
  }

  async update(id: string, property: UpdatePropertyData) {
    const user = await this.ensureAuth()
    // Mock de atualização
    return {
      id,
      ...property,
      user_id: user.id,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    } as Property
  }

  async delete(id: string) {
    // Mock de exclusão: não faz nada, apenas simula sucesso
    return true
  }
}

export const propertiesService = new PropertiesService() 