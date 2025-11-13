import React from 'react'

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
    <article className="bg-white rounded-2xl shadow-md overflow-hidden ring-1 ring-slate-100">
      <div className="relative">
        <img
          src={imageUrl || '/vite.svg'}
          alt={name}
          className="w-full h-56 object-cover"
        />
        <button
          aria-label="favorite"
          className="absolute right-3 top-3 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8.5C3 5.46 5.46 3 8.5 3 10.24 3 11.8 3.87 12.76 5.07 13.72 3.87 15.28 3 17.02 3 20.06 3 22.52 5.46 22.52 8.5 22.52 13.02 12 20 12 20S1.48 13.02 1.48 8.5z"
            />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        <p className="text-sm text-slate-500 mt-1">{breed}</p>
        <p className="text-sm text-slate-400 mt-2">{age} • {size}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full"
              >
                {t}
              </span>
            ))
          ) : (
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">No tags</span>
          )}
        </div>
      </div>
    </article>
  )
}
