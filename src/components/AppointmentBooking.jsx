import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { format, addDays, addWeeks, startOfWeek, eachDayOfInterval, isSameDay, parseISO, setHours, setMinutes } from 'date-fns'
import hr from 'date-fns/locale/hr'
import Section from './Section'
import './AppointmentBooking.css'

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [workingHours, setWorkingHours] = useState({})
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  // Package mapping
  const packageMap = {
    start: 'START WEB',
    upiti: 'WEB KOJI DONOSI UPITE',
    custom: 'CUSTOM WEB'
  }

  // Read URL params on mount and handle package selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const packageParam = urlParams.get('paket')
    
    if (packageParam && packageMap[packageParam]) {
      setSelectedPackage(packageParam)
      
      // Auto-scroll to booking section if package param exists
      // Using reliable offsetTop method
      const scrollToBooking = (attempt = 0) => {
        const bookingSection = document.getElementById('rezervacija')
        
        if (bookingSection) {
          // Calculate absolute position using offsetTop
          let elementTop = 0
          let element = bookingSection
          while (element) {
            elementTop += element.offsetTop
            element = element.offsetParent
          }
          
          // Offset for floating menu button (80px)
          const offset = 80
          const scrollPosition = elementTop - offset

          // Scroll to position
          window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth'
          })
        } else if (attempt < 10) {
          // Retry if element not found yet (max 10 attempts = 1 second)
          setTimeout(() => scrollToBooking(attempt + 1), 100)
        }
      }
      
      // Start scrolling after component is mounted
      setTimeout(() => scrollToBooking(), 500)
    }
  }, [])

  // Listen for package selection events
  useEffect(() => {
    const handlePackageSelected = (event) => {
      const packageKey = event.detail?.packageKey
      if (packageKey && packageMap[packageKey]) {
        setSelectedPackage(packageKey)
        
        // Scroll to booking section when package is selected
        // Using same method as Navbar: getBoundingClientRect + pageYOffset
        const scrollToBooking = (attempt = 0) => {
          const bookingSection = document.getElementById('rezervacija')
          
          if (bookingSection) {
            // Use same method as Navbar: getBoundingClientRect + pageYOffset
            const offset = 80 // Offset for floating menu button
            const elementPosition = bookingSection.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset

            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            })
          } else if (attempt < 15) {
            // Retry if element not found yet (max 15 attempts = 1.5 seconds)
            setTimeout(() => scrollToBooking(attempt + 1), 100)
          }
        }
        
        // Start scrolling immediately, with retry logic
        scrollToBooking()
      }
    }

    window.addEventListener('packageSelected', handlePackageSelected)
    return () => window.removeEventListener('packageSelected', handlePackageSelected)
  }, [])

  const currentDate = new Date()
  const baseWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekStart = addWeeks(baseWeekStart, weekOffset)
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6)
  })

  const handlePreviousWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset(weekOffset - 1)
      setSelectedDate(null)
      setSelectedTime(null)
    }
  }

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  useEffect(() => {
    loadWorkingHours()
    loadBookedAppointments()
  }, [selectedDate])

  const loadWorkingHours = async () => {
    const { data } = await supabase.from('working_hours').select('*')
    if (data) {
      const hours = {}
      data.forEach(wh => {
        hours[wh.day_of_week] = {
          start: wh.start_time,
          end: wh.end_time,
          is_available: wh.is_available
        }
      })
      setWorkingHours(hours)
    }
  }

  const loadBookedAppointments = async () => {
    if (!selectedDate) return
    
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const { data } = await supabase
      .from('appointments')
      .select('appointment_date')
      .gte('appointment_date', startOfDay.toISOString())
      .lte('appointment_date', endOfDay.toISOString())
      .in('status', ['confirmed', 'pending'])

    if (data) {
      setBookedSlots(data.map(apt => new Date(apt.appointment_date)))
    }
  }

  const generateTimeSlots = (date) => {
    if (!date) return []
    
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
    const hours = workingHours[dayOfWeek]
    if (!hours) return []

    const slots = []
    const [startHour, startMin] = hours.start.split(':').map(Number)
    const [endHour, endMin] = hours.end.split(':').map(Number)
    
    const start = setMinutes(setHours(date, startHour), startMin)
    const end = setMinutes(setHours(date, endHour), endMin)
    
    let current = new Date(start)
    while (current < end) {
      slots.push(new Date(current))
      current = new Date(current.getTime() + 30 * 60000) // 30 minutes
    }
    
    return slots
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    const slots = generateTimeSlots(date)
    setAvailableSlots(slots)
  }

  const isSlotBooked = (slot) => {
    return bookedSlots.some(booked => {
      const bookedTime = new Date(booked).getTime()
      const slotTime = slot.getTime()
      return Math.abs(bookedTime - slotTime) < 60000 // 1 minute tolerance
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) return

    setIsSubmitting(true)
    
    const appointmentDateTime = new Date(selectedDate)
    const [hours, minutes] = selectedTime.split(':')
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    const appointmentData = {
      client_name: clientName,
      client_email: clientEmail,
      appointment_date: appointmentDateTime.toISOString(),
      status: 'pending'
    }
    
    // Add package if selected
    // Note: Requires adding 'package_selected VARCHAR(50)' column to appointments table
    // ALTER TABLE appointments ADD COLUMN IF NOT EXISTS package_selected VARCHAR(50);
    if (selectedPackage) {
      appointmentData.package_selected = selectedPackage
    }

    const { error } = await supabase
      .from('appointments')
      .insert(appointmentData)

    setIsSubmitting(false)
    
    if (error) {
      alert('Greška pri rezervaciji: ' + error.message)
    } else {
      setSubmitSuccess(true)
      setClientName('')
      setClientEmail('')
      setSelectedDate(null)
      setSelectedTime(null)
      // Keep selectedPackage in state (don't reset it)
      setTimeout(() => setSubmitSuccess(false), 5000)
      loadBookedAppointments()
      
      // Clear package from URL after successful submission
      const url = new URL(window.location)
      url.searchParams.delete('paket')
      window.history.replaceState({}, '', url)
    }
  }

  return (
    <Section id="rezervacija" className="appointment-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Rezerviraj termin</h2>
        <p className="section-description">
          Odaberite datum i vrijeme koje vam odgovara za Zoom poziv
        </p>
      </motion.div>

      <div className="appointment-booking">
        <div className="calendar-container">
          <div className="calendar-header">
            <motion.button
              className="week-nav-button"
              onClick={handlePreviousWeek}
              disabled={weekOffset === 0}
              whileHover={weekOffset > 0 ? { scale: 1.1 } : {}}
              whileTap={weekOffset > 0 ? { scale: 0.9 } : {}}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </motion.button>
            <div className="week-info">
              <span className="week-range">
                {format(weekDays[0], 'dd.MM', { locale: hr })} - {format(weekDays[6], 'dd.MM.yyyy', { locale: hr })}
              </span>
            </div>
            <motion.button
              className="week-nav-button"
              onClick={handleNextWeek}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </motion.button>
          </div>
          <div className="calendar-week">
            {weekDays.map((day, index) => {
              const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1
              const isAvailable = workingHours[dayOfWeek]?.is_available !== false
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isPast = day < currentDate && !isSameDay(day, currentDate)

              return (
                <motion.button
                  key={index}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${!isAvailable || isPast ? 'disabled' : ''}`}
                  onClick={() => isAvailable && !isPast && handleDateSelect(day)}
                  disabled={!isAvailable || isPast}
                  whileHover={isAvailable && !isPast ? { scale: 1.05 } : {}}
                  whileTap={isAvailable && !isPast ? { scale: 0.95 } : {}}
                >
                  <div className="day-name">{format(day, 'EEE', { locale: hr })}</div>
                  <div className="day-number">{format(day, 'd')}</div>
                </motion.button>
              )
            })}
          </div>

          {selectedDate && (
            <div className="time-slots">
              <h3 className="time-slots-title">Dostupni termini (30 min)</h3>
              <div className="slots-grid">
                {availableSlots.map((slot, index) => {
                  const timeStr = format(slot, 'HH:mm')
                  const isBooked = isSlotBooked(slot)
                  const isSelected = selectedTime === timeStr

                  return (
                    <motion.button
                      key={index}
                      className={`time-slot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                      onClick={() => !isBooked && setSelectedTime(timeStr)}
                      disabled={isBooked}
                      whileHover={!isBooked ? { scale: 1.05 } : {}}
                      whileTap={!isBooked ? { scale: 0.95 } : {}}
                    >
                      {timeStr}
                      {isBooked && <span className="booked-label">Zauzeto</span>}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <h3 className="form-title">Vaši podaci</h3>
          
          {selectedPackage && (
            <motion.div
              className="package-confirmation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="package-confirmation-text">
                Odabrali ste: <strong>{packageMap[selectedPackage]}</strong>
              </p>
            </motion.div>
          )}

          <div className="form-group">
            <label htmlFor="packageSelect">Paket</label>
            <select
              id="packageSelect"
              value={selectedPackage}
              onChange={(e) => {
                setSelectedPackage(e.target.value)
                // Update URL param
                const url = new URL(window.location)
                if (e.target.value) {
                  url.searchParams.set('paket', e.target.value)
                } else {
                  url.searchParams.delete('paket')
                }
                window.history.pushState({}, '', url)
              }}
              className="form-select"
            >
              <option value="">Odaberite paket (opcionalno)</option>
              <option value="start">START WEB</option>
              <option value="upiti">WEB KOJI DONOSI UPITE</option>
              <option value="custom">CUSTOM WEB</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="clientName">Ime i prezime</label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              placeholder="Unesite vaše ime i prezime"
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientEmail">Email</label>
            <input
              type="email"
              id="clientEmail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
              placeholder="Unesite vaš email"
            />
          </div>

          {selectedDate && selectedTime && (
            <div className="selected-info">
              <p><strong>Odabrani termin:</strong></p>
              <p>{format(selectedDate, 'dd.MM.yyyy', { locale: hr })} u {selectedTime}</p>
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={!selectedDate || !selectedTime || isSubmitting}
          >
            {isSubmitting ? 'Rezerviranje...' : 'Rezerviraj termin'}
          </button>

          {submitSuccess && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Rezervacija je uspješno poslana! Kontaktirat ćemo vas uskoro.
            </motion.div>
          )}
        </form>
      </div>
    </Section>
  )
}

