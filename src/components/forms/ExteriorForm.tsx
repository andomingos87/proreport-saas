import { useForm, type FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExteriorFormData, exteriorSchema } from '@/lib/schemas/exterior'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UploadDropzone } from '@/components/ui/upload-dropzone'
import { Alert } from '@/components/ui/alert'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ExteriorFormProps {
  onSubmit: (data: ExteriorFormData) => void
}

type RepairCondition = z.infer<typeof exteriorSchema>['wallSurface']['repairCondition']
type Task = z.infer<typeof exteriorSchema>['wallSurface']['task']
type RepairTime = z.infer<typeof exteriorSchema>['wallSurface']['repairTime']

// Recommendations based on repair condition
const recommendationOptions = {
  'Minor Repair': [
    'Weeping holes are missing or blocked in various areas of the exterior cladding. A qualified masonry contractor should be consulted to perform repairs.',
    'Minor step crack (s) noted in various areas of the exterior brick. Consult with a qualified masonry contractor to repair the step cracks.',
    'Aluminum siding is damaged, repairs to the siding is recommended to avoid water damage to the building.',
    'Vinyl siding is damaged, repairs to the siding is recommended to avoid water damage to the building.',
    'Various areas of the exterior brick mortar joints are worn, repointing of the mortar joints is recommended. A qualified masonry contractor should be consulted to perform repairs',
    'There is no visible drainage system within the EIF stucco. The system without drainage can cause moisture to become trapped behind the product. A further assessment by an approved EIF contractor or engineer is recommended to determine whether a drainage system can be installed, as well as an estimate of the cost of such installation.',
    'The EIF stucco has damage(s), Consult with a qualified contractor to preform repairs.',
    'The siding became distorted. A further assessment of this concern is required from a qualified contractor to evaluate the repairs.'
  ],
  'Major Repair': [
    'Exterior siding is deformed, underlying damage may exist, further evaluation by a qualified contractor or engineer is required.',
    'Brick erosion is noted , consulting with a structural engineer along with a masonry contractor is required to assess the scope of work and costs of the repairs.',
    'Cracks, rust spots are noted to various area to the stucco. EIFS exterior finishes are prone to water infiltration and may cause hidden damage to the structure. We recommend a detailed inspection by a qualified specialist.'
  ],
  'Maintenance': [
    'Caulking is worn and re caulking around the window capping is recommended to reduce any air leakage.',
    'Painting of any wood trim is required in order to prevent decay, monitor all your wood trim and maintain as needed.',
    'Wood is damaged, replacement of the wood trim is recommended.',
    'Apply exterior caulking around all lighting fixtures to prevent water damage.',
    'Recommend to remove old caulking at the intersections is recommended in order to prevent drafts or water from entering.',
    'Apply caulking to all intersections where two different materials meet is required.',
    'Window sills are inverted, this may cause water leakage into the building. repairs are required.'
  ],
  'Upgrade': [
    'Some insurance companies may require the insulbrick siding to covered over in order to provide better fire protection to the building. Consult with your insurance broker is recommended.',
    'Upgrade the siding is recommended, this will protect the building from possible water damage.'
  ]
}

export function ExteriorForm({ onSubmit }: ExteriorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('build-info')
  const [recommendationsForCondition, setRecommendationsForCondition] = useState<string[]>([])
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<ExteriorFormData>({
    resolver: zodResolver(exteriorSchema),
    defaultValues: {
      buildSize: {
        squareFootage: 0
      },
      wallSurface: {
        repairCostMax: 0
      }
    }
  })

  const wallSurfaceType = watch('wallSurface.type')
  const repairCondition = watch('wallSurface.repairCondition')

  // Update recommendations based on selected condition
  useEffect(() => {
    if (repairCondition && repairCondition !== 'None' && repairCondition !== 'Note (Open field)') {
      setRecommendationsForCondition(recommendationOptions[repairCondition] || [])
    } else {
      setRecommendationsForCondition([])
    }
  }, [repairCondition])

  const hasErrors = Object.keys(errors).length > 0

  const handleFormSubmit = async (data: ExteriorFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {hasErrors && (
        <Alert variant="error" className="mb-4">
          <p className="font-medium">There are errors in the form fields.</p>
          <p className="text-xs mt-1">Please check the highlighted fields below.</p>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="build-info" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Building Information</span>
          </TabsTrigger>
          <TabsTrigger value="exterior-details" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span>Exterior & Maintenance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="build-info" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Building Size</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="squareFootage" className="text-sm font-medium">
                      Approximate Square Footage
                    </Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      className={errors.buildSize?.squareFootage ? "border-red-300 focus:ring-red-500" : ""}
                      {...register('buildSize.squareFootage', { valueAsNumber: true })}
                    />
                    {errors.buildSize?.squareFootage && (
                      <p className="text-sm text-red-500 mt-1">{(errors.buildSize.squareFootage as FieldError).message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Property Photos</Label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          const urls = res.map((file) => file.url)
                          setValue('buildSize.photos', urls)
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error(error)
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => setActiveTab('exterior-details')}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exterior-details" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Exterior Wall Surface</h2>
                
                <div>
                  <Label htmlFor="wallSurfaceType" className="text-sm font-medium block mb-1.5">
                    Surface Type
                  </Label>
                  <Select 
                    onValueChange={(value) => setValue('wallSurface.type', value)}
                  >
                    <SelectTrigger className={errors.wallSurface?.type ? "border-red-300" : ""}>
                      <SelectValue placeholder="Select surface type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aluminum-siding">Aluminum Siding</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="board-and-batten">Board and Batten</SelectItem>
                      <SelectItem value="brick">Brick</SelectItem>
                      <SelectItem value="brick-veneer">Brick Veneer</SelectItem>
                      <SelectItem value="eifs">EIFS</SelectItem>
                      <SelectItem value="fiber-cement">Fiber Cement Board</SelectItem>
                      <SelectItem value="insulbrick">Insulbrick</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="pre-cast-stone">Pre-cast Stone</SelectItem>
                      <SelectItem value="stone">Stone</SelectItem>
                      <SelectItem value="stucco">Stucco</SelectItem>
                      <SelectItem value="vinyl">Vinyl</SelectItem>
                      <SelectItem value="wood-siding">Wood Siding</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.wallSurface?.type && (
                    <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.type as FieldError).message}</p>
                  )}
                </div>

                {wallSurfaceType && (
                  <Accordion defaultExpanded="condition-section" className="mt-4">
                    <AccordionItem id="condition-section">
                      <AccordionTrigger id="condition-section" className="py-3 px-4 bg-blue-50 rounded-md">
                        <span className="text-blue-700 font-medium">Condition and Repairs</span>
                      </AccordionTrigger>
                      <AccordionContent id="condition-section" className="pt-4 pb-2 px-1">
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="repairCondition" className="text-sm font-medium block mb-1.5">
                                Repair Condition
                              </Label>
                              <Select onValueChange={(value: RepairCondition) => setValue('wallSurface.repairCondition', value)}>
                                <SelectTrigger className={errors.wallSurface?.repairCondition ? "border-red-300" : ""}>
                                  <SelectValue placeholder="Select repair condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="None">None</SelectItem>
                                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                                  <SelectItem value="Minor Repair">Minor Repair</SelectItem>
                                  <SelectItem value="Major Repair">Major Repair</SelectItem>
                                  <SelectItem value="Upgrade">Upgrade</SelectItem>
                                  <SelectItem value="Note (Open field)">Note</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.wallSurface?.repairCondition && (
                                <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.repairCondition as FieldError).message}</p>
                              )}
                            </div>

                            {repairCondition === 'Note (Open field)' && (
                              <div className="md:col-span-2">
                                <Label htmlFor="note" className="text-sm font-medium block mb-1.5">
                                  Note
                                </Label>
                                <Input
                                  id="note"
                                  {...register('wallSurface.recommendation')}
                                  className={errors.wallSurface?.recommendation ? "border-red-300" : ""}
                                  placeholder="Add a detailed note about the condition"
                                />
                                {errors.wallSurface?.recommendation && (
                                  <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.recommendation as FieldError).message}</p>
                                )}
                              </div>
                            )}
                          </div>

                          {repairCondition && repairCondition !== 'None' && repairCondition !== 'Note (Open field)' && (
                            <div className="space-y-5 bg-gray-50 p-4 rounded-lg">
                              <div>
                                <Label htmlFor="recommendation" className="text-sm font-medium block mb-1.5">
                                  Recommendation
                                </Label>
                                {recommendationsForCondition.length > 0 ? (
                                  <Select onValueChange={(value) => setValue('wallSurface.recommendation', value)}>
                                    <SelectTrigger className={errors.wallSurface?.recommendation ? "border-red-300" : ""}>
                                      <SelectValue placeholder="Select a recommendation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {recommendationsForCondition.map((rec, index) => (
                                        <SelectItem key={index} value={rec}>
                                          {rec.length > 70 ? `${rec.substring(0, 70)}...` : rec}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    {...register('wallSurface.recommendation')}
                                    className={errors.wallSurface?.recommendation ? "border-red-300" : ""}
                                    placeholder="Enter a repair recommendation"
                                  />
                                )}
                                {errors.wallSurface?.recommendation && (
                                  <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.recommendation as FieldError).message}</p>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="task" className="text-sm font-medium block mb-1.5">
                                    Task
                                  </Label>
                                  <Select onValueChange={(value: Task) => setValue('wallSurface.task', value)}>
                                    <SelectTrigger className={errors.wallSurface?.task ? "border-red-300" : ""}>
                                      <SelectValue placeholder="Select a task" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Repair">Repair</SelectItem>
                                      <SelectItem value="Replace">Replace</SelectItem>
                                      <SelectItem value="Repair or Replace">Repair or Replace</SelectItem>
                                      <SelectItem value="Further Evaluation">Further Evaluation</SelectItem>
                                      <SelectItem value="Improve">Improve</SelectItem>
                                      <SelectItem value="Monitor">Monitor</SelectItem>
                                      <SelectItem value="Service">Service</SelectItem>
                                      <SelectItem value="Request Disclosure">Request Disclosure</SelectItem>
                                      <SelectItem value="Service Annually">Service Annually</SelectItem>
                                      <SelectItem value="Demolish">Demolish</SelectItem>
                                      <SelectItem value="Remodel">Remodel</SelectItem>
                                      <SelectItem value="Upgrade">Upgrade</SelectItem>
                                      <SelectItem value="Remove">Remove</SelectItem>
                                      <SelectItem value="Protect">Protect</SelectItem>
                                      <SelectItem value="Clean">Clean</SelectItem>
                                      <SelectItem value="Provide">Provide</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {errors.wallSurface?.task && (
                                    <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.task as FieldError).message}</p>
                                  )}
                                </div>

                                <div>
                                  <Label htmlFor="repairTime" className="text-sm font-medium block mb-1.5">
                                    Repair Time
                                  </Label>
                                  <Select onValueChange={(value: RepairTime) => setValue('wallSurface.repairTime', value)}>
                                    <SelectTrigger className={errors.wallSurface?.repairTime ? "border-red-300" : ""}>
                                      <SelectValue placeholder="Select repair time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Immediate">Immediate</SelectItem>
                                      <SelectItem value="Less than 1 yr">Less than 1 yr</SelectItem>
                                      <SelectItem value="Less than 2 yrs">Less than 2 yrs</SelectItem>
                                      <SelectItem value="Less than 3 yrs">Less than 3 yrs</SelectItem>
                                      <SelectItem value="Less than 4 yrs">Less than 4 yrs</SelectItem>
                                      <SelectItem value="Less than 5 yrs">Less than 5 yrs</SelectItem>
                                      <SelectItem value="Discretionary">Discretionary</SelectItem>
                                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                                      <SelectItem value="Unknown">Unknown</SelectItem>
                                      <SelectItem value="Unpredictable">Unpredictable</SelectItem>
                                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                                      <SelectItem value="If necessary">If necessary</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {errors.wallSurface?.repairTime && (
                                    <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.repairTime as FieldError).message}</p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="repairCostMin" className="text-sm font-medium block mb-1.5">
                                    Minimum Repair Cost
                                  </Label>
                                  <Select onValueChange={(value) => setValue('wallSurface.repairCostMin', value)}>
                                    <SelectTrigger className={errors.wallSurface?.repairCostMin ? "border-red-300" : ""}>
                                      <SelectValue placeholder="Select minimum cost" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Under $100">Under $100</SelectItem>
                                      <SelectItem value="$100">$100</SelectItem>
                                      <SelectItem value="$250">$250</SelectItem>
                                      <SelectItem value="$500">$500</SelectItem>
                                      <SelectItem value="$1000">$1,000</SelectItem>
                                      <SelectItem value="$2000">$2,000</SelectItem>
                                      <SelectItem value="$3000">$3,000</SelectItem>
                                      <SelectItem value="$4000">$4,000</SelectItem>
                                      <SelectItem value="$5000">$5,000</SelectItem>
                                      <SelectItem value="$6000">$6,000</SelectItem>
                                      <SelectItem value="$7000">$7,000</SelectItem>
                                      <SelectItem value="$8000">$8,000</SelectItem>
                                      <SelectItem value="$9000">$9,000</SelectItem>
                                      <SelectItem value="$10000">$10,000</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {errors.wallSurface?.repairCostMin && (
                                    <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.repairCostMin as FieldError).message}</p>
                                  )}
                                </div>
                                <div>
                                  <Label htmlFor="repairCostMax" className="text-sm font-medium block mb-1.5">
                                    Maximum Repair Cost
                                  </Label>
                                  <Select onValueChange={(value) => setValue('wallSurface.repairCostMax', parseInt(value.replace('$', ''), 10))}>
                                    <SelectTrigger className={errors.wallSurface?.repairCostMax ? "border-red-300" : ""}>
                                      <SelectValue placeholder="Select maximum cost" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="$100">$100</SelectItem>
                                      <SelectItem value="$250">$250</SelectItem>
                                      <SelectItem value="$500">$500</SelectItem>
                                      <SelectItem value="$1000">$1,000</SelectItem>
                                      <SelectItem value="$2000">$2,000</SelectItem>
                                      <SelectItem value="$3000">$3,000</SelectItem>
                                      <SelectItem value="$4000">$4,000</SelectItem>
                                      <SelectItem value="$5000">$5,000</SelectItem>
                                      <SelectItem value="$6000">$6,000</SelectItem>
                                      <SelectItem value="$7000">$7,000</SelectItem>
                                      <SelectItem value="$8000">$8,000</SelectItem>
                                      <SelectItem value="$9000">$9,000</SelectItem>
                                      <SelectItem value="$10000">$10,000</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {errors.wallSurface?.repairCostMax && (
                                    <p className="text-sm text-red-500 mt-1">{(errors.wallSurface.repairCostMax as FieldError).message}</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium mb-2 block">Issue Photos</Label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
                                  <UploadDropzone
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      if (res) {
                                        const urls = res.map((file) => file.url)
                                        setValue('wallSurface.photos', urls)
                                      }
                                    }}
                                    onUploadError={(error: Error) => {
                                      console.error(error)
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('build-info')}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className={`px-6 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    disabled={isSubmitting || !isDirty}
                  >
                    {isSubmitting ? "Saving..." : "Save Inspection"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
} 