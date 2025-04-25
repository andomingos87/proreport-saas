'use client'

import { 
  FormData, 
  inputClasses, 
  labelClasses,
  selectClasses,
  summaryBoxClasses,
  summaryTitleClasses,
  summaryLabelClasses,
  summaryValueClasses,
  summaryDiscountClasses
} from './types'

type PaymentStepProps = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export function PaymentStep({ formData, setFormData }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Service Price
          </label>
          <div className="mt-1 relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">$</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.payment.price}
              onChange={(e) => setFormData({
                ...formData,
                payment: { ...formData.payment, price: e.target.value }
              })}
              className={inputClasses}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            Payment Method
          </label>
          <select
            value={formData.payment.method}
            onChange={(e) => setFormData({
              ...formData,
              payment: { ...formData.payment, method: e.target.value }
            })}
            className={selectClasses}
          >
            <option value="">Select payment method</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          Payment Split
        </label>
        <select
          value={formData.payment.split}
          onChange={(e) => setFormData({
            ...formData,
            payment: { ...formData.payment, split: e.target.value }
          })}
          className={selectClasses}
        >
          <option value="">Select payment split</option>
          <option value="full">Full Payment</option>
          <option value="inspection">Due at Inspection</option>
          <option value="report">Due at Report Delivery</option>
          <option value="custom">Custom Split</option>
        </select>
      </div>

      <div>
        <label className={labelClasses}>
          Discount
        </label>
        <div className="mt-1 relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">$</span>
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.payment.discount}
            onChange={(e) => setFormData({
              ...formData,
              payment: { ...formData.payment, discount: e.target.value }
            })}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className={summaryBoxClasses}>
        <h4 className={summaryTitleClasses}>Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={summaryLabelClasses}>Service Price:</span>
            <span className={summaryValueClasses}>${formData.payment.price || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={summaryLabelClasses}>Discount:</span>
            <span className={summaryDiscountClasses}>-${formData.payment.discount || '0.00'}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
            <div className="flex justify-between text-sm font-medium">
              <span className={summaryLabelClasses}>Total:</span>
              <span className={summaryValueClasses}>
                ${(Number(formData.payment.price || 0) - Number(formData.payment.discount || 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
