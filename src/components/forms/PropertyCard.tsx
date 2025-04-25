import { Property } from '@/services/properties'
import { Building, MapPin, Home, Layers, DoorOpen, BedDouble, Bath, Calendar, Move } from 'lucide-react'

interface PropertyCardProps {
  property: Property
  onEdit: (property: Property) => void
  onDelete: (property: Property) => void
}

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  return (
    <div className="w-full border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{property.name}</h3>
          {property.buildingType && (
            <span className="ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              {property.buildingType}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-3 p-6 pt-0">
        {property.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            <div className="text-sm">
              <p>{property.address}</p>
              <p>
                {property.city}
                {property.province && `, ${property.province}`}
                {property.zipCode && ` - ${property.zipCode}`}
                {property.country && `, ${property.country}`}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          {property.buildingType && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tipo: {property.buildingType}</span>
            </div>
          )}
          
          {property.dwelling && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Habitação: {property.dwelling}</span>
            </div>
          )}
          
          {property.stories !== undefined && (
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Andares: {property.stories}</span>
            </div>
          )}
          
          {property.rooms !== undefined && (
            <div className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Cômodos: {property.rooms}</span>
            </div>
          )}
          
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Quartos: {property.bedrooms}</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && (
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Banheiros: {property.bathrooms}</span>
            </div>
          )}
          
          {property.yearBuilt !== undefined && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Ano construção: {property.yearBuilt}</span>
            </div>
          )}
          
          {property.sqFt !== undefined && (
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Área: {property.sqFt} ft²</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 p-6 pt-0">
        <button 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent"
          onClick={() => onEdit(property)}
        >
          Editar
        </button>
        <button 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-red-500 text-white hover:bg-red-600"
          onClick={() => onDelete(property)}
        >
          Excluir
        </button>
      </div>
    </div>
  )
} 