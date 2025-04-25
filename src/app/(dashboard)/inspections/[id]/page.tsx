'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { ExteriorForm } from '@/components/forms/ExteriorForm'
import type { ExteriorFormData } from '@/lib/schemas/exterior'
import { toast } from 'sonner'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert } from '@/components/ui/alert'

export default function InspectionPage() {
  const params = useParams()
  const inspectionId = params.id as string
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('exterior')

  const handleSubmit = async (data: ExteriorFormData) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/inspections/${inspectionId}/exterior`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      toast.success('Data saved successfully!')
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(error instanceof Error ? error.message : 'Error saving data')
    } finally {
      setLoading(false)
    }
  }

  // Definition of icons for each inspection section
  const inspectionSections = [
    {
      id: 'exterior',
      label: 'Exterior',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      id: 'roof',
      label: 'Roof',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 16 12 22 2 16 2 8.5 12 2"></polygon>
        </svg>
      )
    },
    {
      id: 'lots-grounds',
      label: 'Lots & Grounds',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22v-5l5-5 5 5-5 5z"></path>
          <path d="M9.5 14.5 16 8l3 3-6.5 6.5"></path>
          <path d="m17 2 5 5-5 5-5-5z"></path>
        </svg>
      )
    },
    {
      id: 'garage',
      label: 'Garage',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
          <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
          <path d="M12 3v6"></path>
        </svg>
      )
    },
    {
      id: 'structure',
      label: 'Structure',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <path d="M3 9h18"></path>
          <path d="M3 15h18"></path>
          <path d="M9 3v18"></path>
          <path d="M15 3v18"></path>
        </svg>
      )
    },
    {
      id: 'electrical',
      label: 'Electrical',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 2v4h4l3 3-4 4 7 7a9.7 9.7 0 0 0 4-8V8h4V2"></path>
        </svg>
      )
    },
    {
      id: 'heating',
      label: 'Heating',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 19v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 2-2V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 0 2 2Z"></path>
          <path d="M7 13v-3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3"></path>
        </svg>
      )
    },
    {
      id: 'cooling',
      label: 'Cooling',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2h4"></path>
          <path d="M12 14v-4"></path>
          <path d="M4 6v4"></path>
          <path d="M20 6v4"></path>
          <path d="M16 20H8"></path>
          <path d="M12 17v-3"></path>
          <path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"></path>
        </svg>
      )
    },
    {
      id: 'plumbing-gas',
      label: 'Plumbing & Gas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3v3"></path>
          <path d="M14 3v3"></path>
          <path d="M14 11h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2Z"></path>
          <path d="M6 13V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a5 5 0 0 1-5 5H3"></path>
        </svg>
      )
    },
    {
      id: 'insulation-ventilation',
      label: 'Insulation / Ventilation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18.3 14.3-1.1-1.1"></path>
          <path d="m12.4 10.4-1.1-1.1"></path>
          <path d="m18.3 9.7-1.1 1.1"></path>
          <path d="m12.4 13.6-1.1 1.1"></path>
          <path d="M16.6 12H22"></path>
          <path d="M17.2 22v-1.5"></path>
          <path d="M17.2 3.5V2"></path>
          <path d="M2 12h5.8"></path>
          <path d="M15.3 18.5a7 7 0 1 0-10.6 0"></path>
          <path d="M9 15h6L9 21h6"></path>
        </svg>
      )
    },
    {
      id: 'fireplace',
      label: 'Fireplace',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.8 13.7C9.5 13.9 9.3 17 7 17c-1 0-1.2-.9-1.9-2 0 0-1 2 0 4 0 0-3.3-5.6-3.1-8.2 0 0 2 .2 3.5 3 0 0 1.1-3-.1-5.1 0 0 1.3.7 1.9 2 .4 .7 1.1 2.1 1.1 2.1 .4 -1.4 0-3.5 -.3-4.3 0 0 3.9 1.5 1.6 8.3"></path>
          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
          <path d="M19 21H5"></path>
        </svg>
      )
    },
    {
      id: 'interior',
      label: 'General Interior',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17h2a2 2 0 1 1 0 4H3v-4Z"></path>
          <path d="M3 7h3a2 2 0 1 1 0 4H3"></path>
          <path d="M3 3h2a2 2 0 1 1 0 4H3z"></path>
          <path d="M13 3h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"></path>
          <path d="M22 3h-3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"></path>
        </svg>
      )
    },
    {
      id: 'basement',
      label: 'Basement',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22v-5"></path>
          <path d="M9 8V5.5a.5 .5 0 0 1 .5-.5h5a.5 .5 0 0 1 .5 .5V8"></path>
          <path d="M22 22H2"></path>
          <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"></path>
          <path d="M6 8h12"></path>
          <path d="M6 15h12"></path>
        </svg>
      )
    },
    {
      id: 'bathrooms',
      label: 'Bathrooms',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16"></path>
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path>
          <path d="M9 12V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v7"></path>
        </svg>
      )
    },
    {
      id: 'kitchen',
      label: 'Kitchen',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 11H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"></path>
          <path d="M15 11V7c0-1.7-1.3-3-3-3v0c-1.7 0-3 1.3-3 3v4"></path>
          <path d="M18 17v3"></path>
          <path d="M6 17v3"></path>
        </svg>
      )
    }
  ]

  // Function to render the correct form based on the active tab
  const renderFormContent = () => {
    switch (activeTab) {
      case 'exterior':
        return <ExteriorForm onSubmit={handleSubmit} />
      case 'roof':
      case 'lots-grounds':
      case 'garage':
      case 'structure':
      case 'electrical':
      case 'heating':
      case 'cooling':
      case 'plumbing-gas':
      case 'insulation-ventilation':
      case 'fireplace':
      case 'interior':
      case 'basement':
      case 'bathrooms':
      case 'kitchen':
        return (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Module in Development</h3>
            <p className="text-gray-500 max-w-md mb-6">
              The {inspectionSections.find(section => section.id === activeTab)?.label} form is being developed and will be available soon.
            </p>
            <button 
              onClick={() => setActiveTab('exterior')}
              className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Back to Exterior
            </button>
          </div>
        )
      default:
        return <ExteriorForm onSubmit={handleSubmit} />
    }
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inspection #{inspectionId}</h1>
          <p className="text-gray-500 mt-1">Fill in the inspection data below</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          <span>In progress</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Inspection Sections</h2>
          <div className="text-sm text-gray-500">
            {activeTab && (
              <span className="inline-flex items-center gap-1">
                <span>Current section:</span>
                <span className="font-medium">{inspectionSections.find(section => section.id === activeTab)?.label}</span>
              </span>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 py-2">
              <TabsList className="inline-flex min-w-full overflow-x-auto py-2 px-1 gap-1">
                {inspectionSections.map((section) => (
                  <TabsTrigger 
                    key={section.id}
                    value={section.id} 
                    className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 whitespace-nowrap"
                  >
                    <span className="text-current">{section.icon}</span>
                    <span>{section.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center bg-blue-100 text-blue-700 rounded-full w-8 h-8">
              {inspectionSections.find(section => section.id === activeTab)?.icon}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {inspectionSections.find(section => section.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the fields below with the inspection information</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {renderFormContent()}
        </div>
      </div>
    </div>
  )
}