'use client'

import { 
  FormData, 
  inspectionTypes,
  inputClasses, 
  labelClasses, 
  selectClasses,
  textareaClasses
} from './types'

type GeneralInfoStepProps = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export function GeneralInfoStep({ formData, setFormData }: GeneralInfoStepProps) {
  // Função para validar e formatar a data
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    
    // Se o campo estiver vazio, não fazemos nada
    if (!dateValue) {
      setFormData({
        ...formData,
        generalInfo: { ...formData.generalInfo, dateTime: '' }
      })
      return
    }

    try {
      // Tenta criar um objeto Date com o valor
      const date = new Date(dateValue)
      
      // Verifica se é uma data válida
      if (!isNaN(date.getTime())) {
        // Formata a data para o formato aceito pelo input datetime-local
        const formattedDate = dateValue.slice(0, 16) // Remove segundos e milissegundos
        
        setFormData({
          ...formData,
          generalInfo: { ...formData.generalInfo, dateTime: formattedDate }
        })
      }
    } catch (error) {
      console.error('Data inválida:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClasses}>
          Tipo de Inspeção <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.generalInfo.inspectionType}
          onChange={(e) => setFormData({
            ...formData,
            generalInfo: { ...formData.generalInfo, inspectionType: e.target.value }
          })}
          className={selectClasses}
          required
        >
          <option value="">Selecione o tipo</option>
          {inspectionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses}>
          Data e Hora <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={formData.generalInfo.dateTime}
          onChange={handleDateChange}
          className={inputClasses}
          required
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div>
        <label className={labelClasses}>
          Unidade/Apartamento
        </label>
        <input
          type="text"
          value={formData.generalInfo.addressUnit}
          onChange={(e) => setFormData({
            ...formData,
            generalInfo: { ...formData.generalInfo, addressUnit: e.target.value }
          })}
          className={inputClasses}
          placeholder="Digite o número da unidade"
        />
      </div>

      <div>
        <label className={labelClasses}>
          Endereço da Inspeção <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.generalInfo.inspectionAddress}
          onChange={(e) => setFormData({
            ...formData,
            generalInfo: { ...formData.generalInfo, inspectionAddress: e.target.value }
          })}
          className={inputClasses}
          placeholder="Digite o endereço completo"
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          Observações
        </label>
        <textarea
          value={formData.generalInfo.notes}
          onChange={(e) => setFormData({
            ...formData,
            generalInfo: { ...formData.generalInfo, notes: e.target.value }
          })}
          rows={5}
          className={textareaClasses}
          placeholder="Adicione observações importantes"
        />
      </div>
    </div>
  )
}
