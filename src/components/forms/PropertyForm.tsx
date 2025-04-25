import { useState, useEffect, FormEvent } from 'react'
import { CreatePropertyData, Property } from '@/services/properties'
import { X } from 'lucide-react'

interface PropertyFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePropertyData) => Promise<void>
  initialData?: Property
  contactId?: string
  title?: string
}

export function PropertyForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  contactId,
  title = 'Nova Propriedade'
}: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [buildingType, setBuildingType] = useState<string>('')
  const [dwelling, setDwelling] = useState<string>('')
  const [stories, setStories] = useState<string>('')
  const [rooms, setRooms] = useState<string>('')
  const [bedrooms, setBedrooms] = useState<string>('')
  const [bathrooms, setBathrooms] = useState<string>('')
  const [yearBuilt, setYearBuilt] = useState<string>('')
  const [sqFt, setSqFt] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const buildingTypes = [
    'Apartment', 'Attached', 'Backsplit', 'Bi - level', 'Condo - high rise',
    'Condo - stacked', 'Condo - townhome', 'Condo/Hi-Rise Apartment', 'Detached',
    'Duplex- Detached', 'Four plex-Detached', 'Freehold-Townhouse', 'Manufactured',
    'Row', 'Semi detached House', 'Semi-detached', 'Sidesplit', 'Single Detached House',
    'Single Detached House /Basement Apartment', 'Stacked townhome',
    'Stacked townhome-Condominium', 'Store Front/Apartment (1 Unit)',
    'Store Front/Apartment (2 Units)', 'Townhome', 'Townhouse-Condominium',
    'Tri - level', 'Triplex-Detached', 'Unknown'
  ]

  const dwellingTypes = [
    'Duplex', 'Fourplex', 'Multi-unit', 'Single', 
    'Single & basment apartment', 'Single & suite', 'Triplex', 'Unknown'
  ]

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setAddress(initialData.address || '')
      setCity(initialData.city || '')
      setProvince(initialData.province || '')
      setZipCode(initialData.zipCode || '')
      setCountry(initialData.country || '')
      setBuildingType(initialData.buildingType || '')
      setDwelling(initialData.dwelling || '')
      setStories(initialData.stories?.toString() || '')
      setRooms(initialData.rooms?.toString() || '')
      setBedrooms(initialData.bedrooms?.toString() || '')
      setBathrooms(initialData.bathrooms?.toString() || '')
      setYearBuilt(initialData.yearBuilt?.toString() || '')
      setSqFt(initialData.sqFt?.toString() || '')
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const formData: CreatePropertyData = {
        name,
        address: address || undefined,
        city: city || undefined,
        province: province || undefined,
        zipCode: zipCode || undefined,
        country: country || undefined,
        buildingType: buildingType as any || undefined,
        dwelling: dwelling as any || undefined,
        stories: stories ? parseInt(stories, 10) : undefined,
        rooms: rooms ? parseInt(rooms, 10) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
        bathrooms: bathrooms ? parseFloat(bathrooms) : undefined,
        yearBuilt: yearBuilt ? parseInt(yearBuilt, 10) : undefined,
        sqFt: sqFt ? parseInt(sqFt, 10) : undefined,
        contactId
      }

      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome da Propriedade*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Nome da propriedade"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Endereço
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Endereço completo"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Cidade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado/Província
              </label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Estado/Província"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CEP/Código Postal
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="CEP/Código Postal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                País
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="País"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Construção
              </label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Selecione um tipo</option>
                {buildingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Habitação
              </label>
              <select
                value={dwelling}
                onChange={(e) => setDwelling(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Selecione um tipo</option>
                {dwellingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Andares
              </label>
              <input
                type="number"
                value={stories}
                onChange={(e) => setStories(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Número de andares"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cômodos
              </label>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Número de cômodos"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quartos
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Número de quartos"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Banheiros
              </label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Número de banheiros"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ano de Construção
              </label>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ano de construção"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Área (ft²)
              </label>
              <input
                type="number"
                value={sqFt}
                onChange={(e) => setSqFt(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Área em pés quadrados"
                min="1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 