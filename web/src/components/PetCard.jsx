import React from 'react'
import applicationService from '../services/applicationService'

/**
 * PetCard
 * Props: { pet }
 * pet: { id, name, breed, age, size, imageUrl, tags }
 */
export default function PetCard({ pet = {} }) {
  const {
    name = 'Unknown',
    breed = '',
    age = '',
    size = '',
    imageUrl = '',
    tags = [],
  } = pet

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden ring-1 ring-slate-100 hover:shadow-2xl transition-shadow duration-200">
      <div className="relative">
        <div className="overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl || '/vite.svg'}
            alt={name}
            className="w-full h-56 object-cover block"
          />
        </div>

        <button
          aria-label="favorite"
          className="absolute right-3 top-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.001 4.529c1.5-2.03 4.592-2.03 6.092 0 1.5 2.03 1.5 5.313 0 7.343L12 20.5 5.907 11.872c-1.5-2.03-1.5-5.313 0-7.343 1.5-2.03 4.592-2.03 6.094 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        <p className="text-sm text-slate-500 mt-1">{breed}</p>
        <p className="text-sm text-slate-400 mt-2">{age} • {size}</p>

        <div className="mt-3">
          <span className="text-xs uppercase font-medium px-2 py-1 rounded text-slate-700 bg-slate-100">{pet?.raw?.status ?? 'Unknown'}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full shadow-sm"
              >
                {t}
              </span>
            ))
          ) : (
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">No tags</span>
          )}
        </div>

        {/* Apply button for adopters when pet is Available */}
        {(() => {
          try {
            const token = JSON.parse(localStorage.getItem('happytails_token'))
            const isAuthenticated = !!token
            const status = pet?.raw?.status || ''
            if (status === 'Available') {
              // allow parent to override handling via pet.onApply
              if (typeof pet.onApply === 'function') {
                return (
                  <div className="mt-4">
                    <button onClick={() => pet.onApply(pet)} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm">Apply to Adopt</button>
                  </div>
                )
              }

              if (isAuthenticated) {
                return (
                  <div className="mt-4">
                    <button
                      onClick={async () => {
                        try {
                          await applicationService.submitApplication(pet.id, '')
                          alert('Application submitted. The shelter will review your request.')
                          window.location.reload()
                        } catch (e) {
                          alert(String(e.message || e))
                        }
                      }}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 text-white text-sm"
                    >
                      Apply to Adopt
                    </button>
                  </div>
                )
              }
            }
          } catch (e) { }
          return null
        })()}
      </div>
    </article>
  )
}
