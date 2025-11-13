import React, { useEffect, useState } from 'react'
import PetCard from '../components/PetCard'
import { petService } from '../services/petservice'

	const mockPets = [
	{
		id: 1,
		name: 'Luna',
		breed: 'Golden Retriever',
		age: '2 years',
		size: 'large',
		imageUrl: '/src/assets/pet1.svg',
		tags: ['Friendly', 'Playful'],
	},
	{
		id: 2,
		name: 'Whiskers',
		breed: 'Tabby Mix',
		age: '3 years',
		size: 'medium',
		imageUrl: '/src/assets/pet2.svg',
		tags: ['Independent', 'Calm'],
	},
	{
		id: 3,
		name: 'Max',
		breed: 'Beagle',
		age: '4 years',
		size: 'medium',
		imageUrl: '/src/assets/pet3.svg',
		tags: ['Curious', 'Friendly'],
	},
	{
		id: 4,
		name: 'Mittens',
		breed: 'Siamese',
		age: '1 year',
		size: 'small',
		imageUrl: '/src/assets/pet4.svg',
		tags: ['Vocal', 'Social'],
	},
	{
		id: 5,
		name: 'Bella',
		breed: 'French Bulldog',
		age: '3 years',
		size: 'small',
		imageUrl: '/src/assets/pet5.svg',
		tags: ['Affectionate', 'Playful'],
	},
	{
		id: 6,
		name: 'Charlie',
		breed: 'Labrador Mix',
		age: '5 years',
		size: 'large',
		imageUrl: '/src/assets/pet6.svg',
		tags: ['Loyal', 'Calm'],
	},
]

export default function DiscoverPage() {
	const [pets, setPets] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

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

	return (
		<main className="max-w-7xl mx-auto px-6 py-10">
			<header className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold text-slate-900">Discover Pets</h1>
				<p className="text-sm text-slate-500">Find your forever friend</p>
			</header>

			{loading ? (
				<div className="text-center py-12 text-slate-500">Loading pets…</div>
			) : (
				<section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{pets.map((p) => (
						<PetCard key={p.id ?? p.name} pet={p} />
					))}
				</section>
			)}

			{error && (
				<div className="mt-6 text-sm text-rose-600">Unable to load live pets (using local samples).</div>
			)}
		</main>
	)
}
