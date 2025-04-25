'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useBookings, type Booking } from '@/hooks/useBookings'
import { BookingDetailsModal } from '@/components/modals/BookingDetailsModal'

type ViewType = 'month' | 'week' | 'day'

const eventColors = {
  scheduled: 'bg-state-info/20 text-state-info',
  completed: 'bg-state-success/20 text-state-success',
  cancelled: 'bg-state-error/20 text-state-error',
  pending: 'bg-state-warning/20 text-state-warning'
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function Calendar() {
  const [view, setView] = useState<ViewType>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const { bookings, loading } = useBookings()

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7)
    } else {
      newDate.setDate(currentDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1)
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7)
    } else {
      newDate.setDate(currentDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getWeekDays = (date: Date) => {
    const days = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    return days
  }

  const monthDays = useMemo(() => getDaysInMonth(currentDate), [currentDate])
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

  const getBookingsForDate = (date: Date) => {
    if (!date || !bookings) return []
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.inspection_date)
      return bookingDate.toDateString() === date.toDateString()
    })
  }

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map(day => (
        <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
          {day}
        </div>
      ))}
      {monthDays.map((day, index) => (
        <div
          key={index}
          className={`h-[90px] p-2 border border-border-light ${
            day ? 'bg-bg-primary' : 'bg-bg-secondary'
          } ${
            day?.toDateString() === new Date().toDateString()
              ? 'border-brand-primary'
              : ''
          }`}
        >
          {day && (
            <>
              <div className="text-sm font-medium text-text-primary">
                {day.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {getBookingsForDate(day).map(booking => (
                  <button
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className={`w-full px-2 py-1 text-xs rounded-lg text-left ${eventColors[booking.status as keyof typeof eventColors]}`}
                  >
                    {booking.form_data.clientInfo.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )

  const renderWeekView = () => (
    <div className="grid grid-cols-8 gap-1">
      <div className="p-2" /> {/* Empty cell for time column */}
      {weekDays.map(day => (
        <div
          key={day.toISOString()}
          className={`p-2 text-center text-sm font-medium ${
            day.toDateString() === new Date().toDateString()
              ? 'text-brand-primary'
              : 'text-text-secondary'
          }`}
        >
          {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
        </div>
      ))}
      {HOURS.map(hour => (
        <div key={`hour-${hour}`}>
          <div className="p-2 text-right text-sm text-text-secondary">
            {hour.toString().padStart(2, '0')}:00
          </div>
          {weekDays.map(day => {
            const bookings = getBookingsForDate(day).filter(
              booking => new Date(booking.inspection_date).getHours() === hour
            )
            return (
              <div
                key={`${day.toISOString()}-${hour}`}
                className="p-1 border border-border-light h-[40px] bg-bg-primary"
              >
                {bookings.map(booking => (
                  <button
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className={`w-full px-2 py-1 text-xs rounded-lg text-left ${eventColors[booking.status as keyof typeof eventColors]}`}
                  >
                    {booking.form_data.clientInfo.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  const renderDayView = () => (
    <div className="space-y-1">
      {HOURS.map(hour => (
        <div
          key={hour}
          className="grid grid-cols-[100px_1fr] gap-4 h-[60px] border-b border-border-light"
        >
          <div className="p-2 text-right text-sm text-text-secondary">
            {hour.toString().padStart(2, '0')}:00
          </div>
          <div className="p-2 bg-bg-primary">
            {getBookingsForDate(currentDate)
              .filter(booking => new Date(booking.inspection_date).getHours() === hour)
              .map(booking => (
                <button
                  key={booking.id}
                  onClick={() => handleBookingClick(booking)}
                  className={`w-full px-3 py-2 rounded-lg text-left ${eventColors[booking.status as keyof typeof eventColors]}`}
                >
                  <div className="font-medium">{booking.form_data.clientInfo.name}</div>
                  <div className="text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(booking.inspection_date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="bg-bg-primary rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-secondary rounded w-1/4" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-[90px] bg-bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-bg-primary rounded-xl shadow-sm">
        <div className="p-6 border-b border-border-light">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium text-text-primary">Calendar</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    view === 'month'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    view === 'week'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    view === 'day'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  Day
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-1 text-text-secondary hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-text-primary">
                  {currentDate.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                    ...(view === 'day' && { day: 'numeric' })
                  })}
                </span>
                <button
                  onClick={handleNext}
                  className="p-1 text-text-secondary hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[600px] scrollbar-thin scrollbar-thumb-border-light scrollbar-track-bg-tertiary">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  )
} 