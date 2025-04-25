'use client'

import { useState, useEffect } from 'react'
import { Property, propertiesService } from '@/services/properties'
import { PropertyForm } from '@/components/forms/PropertyForm'
import { 
  FormData, 
  inputClasses, 
  labelClasses,
  selectClasses
} from './types'
import { Building2, Plus } from 'lucide-react'

type PropertyInfoStepProps = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export function PropertyInfoStep({ formData, setFormData }: PropertyInfoStepProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (formData.clientInfo?.id) {
      loadProperties()
    }
  }, [formData.clientInfo?.id])

  const loadProperties = async () => {
    try {
      const data = await propertiesService.listByContact(formData.clientInfo.id!)
      setProperties(data)
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error)
    }
  }

  const handleNewProperty = async (data: any) => {
    try {
      await propertiesService.create({
        ...data,
        contactId: formData.clientInfo.id
      })
      loadProperties()
    } catch (error) {
      console.error('Erro ao criar propriedade:', error)
    }
  }

  if (properties.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              Nenhuma propriedade cadastrada
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Comece cadastrando uma propriedade para este cliente.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowNewPropertyModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Cadastrar Propriedade
              </button>
            </div>
          </div>
        </div>

        <PropertyForm
          isOpen={showNewPropertyModal}
          onClose={() => setShowNewPropertyModal(false)}
          onSubmit={handleNewProperty}
          contactId={formData.clientInfo.id}
        />
      </>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className={labelClasses}>
              Selecionar Propriedade
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClasses}
                placeholder="Buscar propriedade por nome ou endereço..."
              />
              <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowNewPropertyModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600] mt-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Propriedade
          </button>
        </div>

        {/* Lista de Propriedades Filtrada */}
        <div className="mt-4 space-y-2">
          {properties
            .filter(property => 
              property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              property.address?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(property => (
              <div
                key={property.id}
                onClick={() => {
                  setSelectedProperty(property)
                  setFormData({
                    ...formData,
                    propertyInfo: {
                      buildingType: property.buildingType || '',
                      dwellingType: property.dwelling || '',
                      stories: property.stories?.toString() || '',
                      rooms: property.rooms?.toString() || '',
                      bathrooms: property.bathrooms?.toString() || '',
                      bedrooms: property.bedrooms?.toString() || '',
                      yearBuilt: property.yearBuilt?.toString() || '',
                      squareFootage: property.sqFt?.toString() || ''
                    }
                  })
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedProperty?.id === property.id
                    ? 'border-[#FFB800] bg-[#FFF9E6] dark:bg-[#FFB800]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#FFB800]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {property.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {property.address} • {property.city}, {property.province}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {property.buildingType} • {property.dwelling}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <PropertyForm
        isOpen={showNewPropertyModal}
        onClose={() => setShowNewPropertyModal(false)}
        onSubmit={handleNewProperty}
        contactId={formData.clientInfo.id}
      />
    </>
  )
}
