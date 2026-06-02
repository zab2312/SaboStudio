import { useState, useRef, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Package } from 'lucide-react'
import { PACKAGE_GROUPS, getPackageLabel } from '../constants/packages'
import './PackageSelect.css'

export default function PackageSelect({ id, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const containerRef = useRef(null)
  const listboxId = useId()

  const flatOptions = PACKAGE_GROUPS.flatMap((group) => group.options)
  const totalItems = flatOptions.length + 1

  const selectedLabel = value ? getPackageLabel(value) : null
  const selectedIndex = flatOptions.findIndex((option) => option.value === value)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!open) setHighlightIndex(-1)
    else if (selectedIndex >= 0) setHighlightIndex(selectedIndex + 1)
    else setHighlightIndex(0)
  }, [open, selectedIndex])

  const selectOption = (optionValue) => {
    onChange(optionValue)
    setOpen(false)
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen((prev) => !prev)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((prev) => {
        const next = prev < 0 ? (selectedIndex >= 0 ? selectedIndex + 1 : 0) : prev
        return next < totalItems - 1 ? next + 1 : 0
      })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((prev) => {
        const next = prev < 0 ? (selectedIndex >= 0 ? selectedIndex + 1 : 0) : prev
        return next > 0 ? next - 1 : totalItems - 1
      })
    }
  }

  const handleListKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
    } else if (event.key === 'Enter' && highlightIndex >= 0) {
      event.preventDefault()
      if (highlightIndex === 0) selectOption('')
      else selectOption(flatOptions[highlightIndex - 1].value)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  let optionCounter = -1

  return (
    <div className="package-select" ref={containerRef}>
      <button
        type="button"
        id={id}
        className={`package-select-trigger ${open ? 'is-open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        <span className="package-select-trigger-inner">
          <Package size={18} className="package-select-icon" aria-hidden />
          <span className={`package-select-value ${!selectedLabel ? 'is-placeholder' : ''}`}>
            {selectedLabel || 'Odaberite paket (opcionalno)'}
          </span>
        </span>
        <ChevronDown size={18} className="package-select-chevron" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            className="package-select-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onKeyDown={handleListKeyDown}
          >
            <button
              type="button"
              role="option"
              aria-selected={!value}
              className={`package-select-option package-select-option--placeholder ${!value ? 'is-selected' : ''} ${highlightIndex === 0 ? 'is-highlighted' : ''}`}
              onMouseEnter={() => setHighlightIndex(0)}
              onClick={() => selectOption('')}
            >
              <span>Bez odabira paketa</span>
            </button>

            {PACKAGE_GROUPS.map((group) => (
              <div key={group.label} className="package-select-group">
                <div className="package-select-group-label">{group.label}</div>
                {group.options.map((option) => {
                  optionCounter += 1
                  const flatIndex = optionCounter + 1
                  const isSelected = value === option.value
                  const isHighlighted = highlightIndex === flatIndex

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={[
                        'package-select-option',
                        isSelected ? 'is-selected' : '',
                        isHighlighted ? 'is-highlighted' : '',
                        option.featured ? 'is-featured' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onMouseEnter={() => setHighlightIndex(flatIndex)}
                      onClick={() => selectOption(option.value)}
                    >
                      <span className="package-select-option-label">{option.label}</span>
                      {isSelected && <Check size={16} className="package-select-check" aria-hidden />}
                    </button>
                  )
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
