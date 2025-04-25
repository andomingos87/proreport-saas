'use client'

import { 
  FormData, 
  reviewBoxClasses,
  reviewTitleClasses,
  reviewDescriptionClasses,
  reviewButtonClasses
} from './types'

type ReviewStepProps = {
  formData: FormData
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

export function ReviewStep({ formData, setCurrentStep }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className={reviewBoxClasses}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={reviewTitleClasses}>Ready to Submit?</h4>
            <p className={reviewDescriptionClasses}>
              Please review all information before submitting. You can go back to edit any section if needed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(0)}
              className={reviewButtonClasses}
            >
              Edit Information
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
