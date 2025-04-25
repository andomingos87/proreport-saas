export type Step = {
  title: string
  description: string
}

export const steps: Step[] = [
  { title: 'Client Info', description: 'Client details' },
  { title: 'General Info', description: 'Address and inspection type' },
  { title: 'Agent Info', description: 'Agent details' },
  { title: 'Property Info', description: 'Property details' },
  { title: 'Agreement', description: 'Select or create contract' },
  { title: 'Cover Letter', description: 'Add a cover letter' },
  { title: 'Payment', description: 'Payment method and values' },
  { title: 'Review', description: 'Review all information' },
]

export const inspectionTypes = [
  'Wind Mitigation Inspection',
  'Residential Inspection',
  'FL 4-Point Inspection',
  'Commercial Inspection',
  'TREC: Texas Inspection'
]

export type FormData = {
  generalInfo: {
    addressUnit: string
    inspectionAddress: string
    inspectionType: string
    dateTime: string
    notes: string
  }
  clientInfo: {
    id?: string
    name: string
    phone: string
    email: string
    address: string
    city: string
    state: string
    zip: string
    county: string
    notes: string
  }
  agentInfo: {
    name: string
    phone: string
    email: string
    address: string
    city: string
    state: string
    zip: string
    county: string
    notes: string
  }
  propertyInfo: {
    buildingType: string
    dwellingType: string
    stories: string
    rooms: string
    bathrooms: string
    bedrooms: string
    yearBuilt: string
    squareFootage: string
  }
  agreement: {
    selectedContract?: string
  }
  coverLetter: {
    selectedCoverLetter: string | null
    content: string
  }
  payment: {
    price: string
    method: string
    split: string
    discount: string
  }
}

export interface Template {
  id: string
  title: string
  description: string
  content: string
}

export type NewBookingFormProps = {
  isOpen: boolean
  onClose: () => void
}

export type Client = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  type: 'client' | 'agent' | 'other'
  notes: string
  address: string
  city: string
  province: string
  zip_code: string
  country: string
  created_at: string
  updated_at: string
  user_id: string
}

export const initialFormData: FormData = {
  generalInfo: {
    addressUnit: '',
    inspectionAddress: '',
    inspectionType: '',
    dateTime: '',
    notes: ''
  },
  clientInfo: {
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    county: '',
    notes: ''
  },
  agentInfo: {
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    county: '',
    notes: ''
  },
  propertyInfo: {
    buildingType: '',
    dwellingType: '',
    stories: '',
    rooms: '',
    bathrooms: '',
    bedrooms: '',
    yearBuilt: '',
    squareFootage: ''
  },
  agreement: {
    selectedContract: ''
  },
  coverLetter: {
    selectedCoverLetter: null,
    content: ''
  },
  payment: {
    price: '',
    method: '',
    split: '',
    discount: ''
  }
}

// CSS Classes
export const inputClasses = "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"

export const textareaClasses = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FFB800] focus:border-transparent resize-none"

export const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300"

export const selectClasses = inputClasses

export const premiumBoxClasses = "rounded-lg border-2 border-[#FFB800] dark:border-[#FFB800] bg-[#FFF9E6] dark:bg-[#FFB800]/10 p-6"
export const premiumTitleClasses = "text-sm font-medium text-gray-900 dark:text-white"
export const premiumDescriptionClasses = "mt-1 text-sm text-gray-600 dark:text-gray-400"
export const premiumButtonClasses = "flex items-center gap-2 rounded-lg bg-[#FFB800] px-4 py-2 text-sm font-medium text-white hover:bg-[#E6A600] transition-colors"

export const summaryBoxClasses = "rounded-lg border border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700"
export const summaryTitleClasses = "text-sm font-medium text-gray-900 dark:text-white mb-4"
export const summaryLabelClasses = "text-gray-600 dark:text-gray-400"
export const summaryValueClasses = "text-gray-900 dark:text-white"
export const summaryDiscountClasses = "text-red-600 dark:text-red-400"

export const reviewBoxClasses = "rounded-lg border border-gray-200 dark:border-gray-600 p-6"
export const reviewTitleClasses = "text-sm font-medium text-gray-900 dark:text-white"
export const reviewDescriptionClasses = "mt-1 text-sm text-gray-600 dark:text-gray-400"
export const reviewButtonClasses = "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800] disabled:opacity-50 disabled:cursor-not-allowed"
