import React, { useEffect, useState, useMemo } from 'react'
import PetCard from '../components/PetCard'
import { petService } from '../services/petservice'
import applicationService from '../services/applicationService'

	const mockPets = [
	{
		id: 1,
		name: 'Luna',
		breed: 'Golden Retriever',
		age: '2 years',
		size: 'large',
		species: 'Dog',
		imageUrl: '/src/assets/pet1.svg',
		tags: ['Friendly', 'Playful'],
	},
	{
		id: 2,
		name: 'Whiskers',
		breed: 'Tabby Mix',
		age: '3 years',
		size: 'medium',
		species: 'Cat',
		imageUrl: '/src/assets/pet2.svg',
		tags: ['Independent', 'Calm'],
	},
	{
		id: 3,
		name: 'Max',
		breed: 'Beagle',
		age: '4 years',
		size: 'medium',
		species: 'Dog',
		imageUrl: '/src/assets/pet3.svg',
		tags: ['Curious', 'Friendly'],
	},
	{
		id: 4,
		name: 'Mittens',
		breed: 'Siamese',
		age: '1 year',
		size: 'small',
		species: 'Cat',
		imageUrl: '/src/assets/pet4.svg',
		tags: ['Vocal', 'Social'],
	},
	{
		id: 5,
		name: 'Bella',
		breed: 'French Bulldog',
		age: '3 years',
		size: 'small',
		species: 'Dog',
		imageUrl: '/src/assets/pet5.svg',
		tags: ['Affectionate', 'Playful'],
	},
	{
		id: 6,
		name: 'Charlie',
		breed: 'Labrador Mix',
		age: '5 years',
		size: 'large',
		species: 'Dog',
		imageUrl: '/src/assets/pet6.svg',
		tags: ['Loyal', 'Calm'],
	},
	{
		id: 7,
		name: 'Hoppy',
		breed: 'Lop-Eared',
		age: '2 years',
		size: 'small',
		species: 'Rabbit',
		imageUrl: '/src/assets/pet7.svg',
		tags: ['Gentle', 'Quiet'],
	},
	{
		id: 8,
		name: 'Tweety',
		breed: 'Canary',
		age: '1 year',
		size: 'small',
		species: 'Bird',
		imageUrl: '/src/assets/pet8.svg',
		tags: ['Cheerful', 'Active'],
	},
]

export default function DiscoverPage() {
	const [pets, setPets] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
	const [selectedSpecies, setSelectedSpecies] = useState('all')
	const [selectedSize, setSelectedSize] = useState('all')

	// Extract unique species and sizes from mock data
	const speciesOptions = useMemo(() => {
		const species = new Set(mockPets.map(p => p.species))
		return Array.from(species).sort()
	}, [])

	const sizeOptions = ['small', 'medium', 'large']

	// Filter pets based on selected criteria
	const filteredPets = useMemo(() => {
		return pets.filter(pet => {
			const speciesMatch = selectedSpecies === 'all' || pet.species === selectedSpecies
			const sizeMatch = selectedSize === 'all' || pet.size === selectedSize
			return speciesMatch && sizeMatch
		})
	}, [pets, selectedSpecies, selectedSize])

	useEffect(() => {
		let mounted = true

		async function loadPets() {
			try {
				const data = await petService.getAllPets()
				if (!mounted) return
				setPets(Array.isArray(data) && data.length > 0 ? data : mockPets)
			} catch (err) {
				// fallback to mock data if backend not available
				setError(err)
				setPets(mockPets)
			} finally {
				setLoading(false)
			}
		}

		loadPets()
		return () => {
			mounted = false
		}
	}, [])

	const refreshPets = async () => {
		try {
			const data = await petService.getAllPets()
			setPets(Array.isArray(data) && data.length > 0 ? data : mockPets)
		} catch (e) {
			setPets(mockPets)
		}
	}

	const handleApply = async (pet) => {
		if (!confirm(`Submit application for ${pet.name}?`)) return
		try {
			await applicationService.submitApplication(pet.id, '')
			await refreshPets()
			alert('Application submitted')
		} catch (e) {
			alert(String(e.message || e))
		}
	}

	return (
		<main className="max-w-7xl mx-auto px-6 py-10">
			<header className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">Discover Pets</h1>
					<p className="text-sm text-slate-500">Browse {filteredPets.length} adorable pets waiting for their forever homes</p>
				</div>
			</header>

			{/* Filters Section */}
			<section className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
				<div className="space-y-4">
					{/* Filter Title and View Toggle */}
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-slate-700">Filters</h2>
						{/* View Toggle */}
						<div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
							<button
								onClick={() => setViewMode('grid')}
								className={`px-3 py-1 rounded text-sm font-medium transition ${
									viewMode === 'grid'
										? 'bg-emerald-500 text-white'
										: 'bg-white text-slate-600 hover:text-slate-900'
								}`}
								title="Grid view"
							>
								⊞ Grid
							</button>
							<button
								onClick={() => setViewMode('list')}
								className={`px-3 py-1 rounded text-sm font-medium transition ${
									viewMode === 'list'
										? 'bg-emerald-500 text-white'
										: 'bg-white text-slate-600 hover:text-slate-900'
								}`}
								title="List view"
							>
								≡ List
							</button>
						</div>
					</div>

					{/* Species Filter */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">Species</label>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => setSelectedSpecies('all')}
								className={`px-4 py-2 rounded-full text-sm font-medium transition ${
									selectedSpecies === 'all'
										? 'bg-emerald-500 text-white'
										: 'bg-white border border-gray-300 text-slate-700 hover:border-emerald-400'
								}`}
							>
								All
							</button>
							{speciesOptions.map(species => (
								<button
									key={species}
									onClick={() => setSelectedSpecies(species)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition ${
										selectedSpecies === species
											? 'bg-emerald-500 text-white'
											: 'bg-white border border-gray-300 text-slate-700 hover:border-emerald-400'
									}`}
								>
									{species}
								</button>
							))}
						</div>
					</div>

					{/* Size Filter */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => setSelectedSize('all')}
								className={`px-4 py-2 rounded-full text-sm font-medium transition ${
									selectedSize === 'all'
										? 'bg-emerald-500 text-white'
										: 'bg-white border border-gray-300 text-slate-700 hover:border-emerald-400'
								}`}
							>
								All
							</button>
							{sizeOptions.map(size => (
								<button
									key={size}
									onClick={() => setSelectedSize(size)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
										selectedSize === size
											? 'bg-emerald-500 text-white'
											: 'bg-white border border-gray-300 text-slate-700 hover:border-emerald-400'
									}`}
								>
									{size}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			{loading ? (
				<div className="text-center py-12 text-slate-500">Loading pets…</div>
			) : viewMode === 'grid' ? (
				<section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{filteredPets.map((p) => (
						<PetCard key={p.id ?? p.name} pet={{...p, onApply: () => handleApply(p)}} />
					))}
				</section>
			) : (
				<section className="space-y-3">
					{filteredPets.map((p) => (
						<div key={p.id ?? p.name} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition">
							{/* Pet Image */}
							<div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
								<img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
							</div>

							{/* Pet Info */}
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-slate-900">{p.name}</h3>
								<p className="text-sm text-slate-600">{p.breed} • {p.age}</p>
								<div className="flex gap-1 mt-1 flex-wrap">
									<span className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded">
										{p.species}
									</span>
									<span className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded capitalize">
										{p.size}
									</span>
									{p.tags && p.tags.slice(0, 1).map((tag, i) => (
										<span key={i} className="inline-block px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded">
											{tag}
										</span>
									))}
								</div>
							</div>

							{/* Status Badge and Button */}
							<div className="flex-shrink-0 flex flex-col items-end gap-2">
								{p.status && (
									<span className={`px-2 py-1 text-xs font-medium rounded ${
										p.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
										p.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
										'bg-slate-100 text-slate-700'
									}`}>
										{p.status}
									</span>
								)}
								{p.status === 'Available' && (
									<button
										onClick={() => handleApply(p)}
										className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
									>
										Apply
									</button>
								)}
							</div>
						</div>
					))}
					{filteredPets.length === 0 && (
						<div className="text-center py-12 text-slate-500">
							No pets match your filters
						</div>
					)}
				</section>
			)}

			{error && (
				<div className="mt-6 text-sm text-rose-600">Unable to load live pets (using local samples).</div>
			)}
		</main>
	)
}
