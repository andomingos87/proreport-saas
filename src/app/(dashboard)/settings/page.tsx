'use client'

import { useState } from 'react'
import { 
  User,
  Building,
  Bell,
  Lock,
  CreditCard,
  Mail,
  Globe,
  Save
} from 'lucide-react'

const settingsSections = [
  {
    title: 'Profile',
    icon: User,
    description: 'Update your personal information and preferences.',
  },
  {
    title: 'Company',
    icon: Building,
    description: 'Manage your company details and business information.',
  },
  {
    title: 'Notifications',
    icon: Bell,
    description: 'Configure how you receive alerts and notifications.',
  },
  {
    title: 'Security',
    icon: Lock,
    description: 'Manage your password and security settings.',
  },
  {
    title: 'Billing',
    icon: CreditCard,
    description: 'View and update your billing information and plan.',
  },
  {
    title: 'Email',
    icon: Mail,
    description: 'Configure your email preferences and templates.',
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Profile')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.title

          return (
            <button
              key={section.title}
              onClick={() => setActiveSection(section.title)}
              className={`
                p-6 text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-colors
                ${isActive 
                  ? 'border-[#6C5DD3]' 
                  : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  p-2 rounded-lg
                  ${isActive 
                    ? 'bg-[#6C5DD3] text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {activeSection} Settings
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6C5DD3] rounded-lg hover:bg-[#5B4EC7] transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          {activeSection === 'Profile' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-[#6C5DD3] focus:outline-none focus:ring-1 focus:ring-[#6C5DD3] placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-[#6C5DD3] focus:outline-none focus:ring-1 focus:ring-[#6C5DD3] placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-[#6C5DD3] focus:outline-none focus:ring-1 focus:ring-[#6C5DD3] placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Language
                </label>
                <select
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-[#6C5DD3] focus:outline-none focus:ring-1 focus:ring-[#6C5DD3]"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
            </div>
          )}

          {/* Company Settings */}
          {activeSection === 'Company' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-[#6C5DD3] focus:outline-none focus:ring-1 focus:ring-[#6C5DD3] placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Industry
                </label>
                <select
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-[#6C5DD3] focus:outline-none focus:ring-1 focus:ring-[#6C5DD3]"
                >
                  <option value="real-estate">Real Estate</option>
                  <option value="construction">Construction</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-[#6C5DD3] focus:outline-none focus:ring-1 focus:ring-[#6C5DD3] placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                  placeholder="Enter company address"
                />
              </div>
            </div>
          )}

          {/* Other sections will be added with similar dark mode support */}
          {activeSection !== 'Profile' && activeSection !== 'Company' && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure your {activeSection.toLowerCase()} settings here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 