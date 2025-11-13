import React, { useEffect, useState } from 'react'
import applicationService from '../services/applicationService'

export default function Applications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await applicationService.getShelterApplications()
        if (!mounted) return
        setApps(data || [])
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function changeStatus(appId, status) {
    try {
      await applicationService.updateApplicationStatus(appId, status)
      const data = await applicationService.getShelterApplications()
      setApps(data || [])
    } catch (e) {
      alert(String(e.message || e))
    }
  }

  if (loading) return <div className="p-8 text-slate-600">Loading applications…</div>
  if (error) return <div className="p-8 text-rose-600">Error loading applications: {String(error)}</div>

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Shelter Applications</h1>
      {apps.length === 0 ? (
        <div className="text-slate-500">No applications found.</div>
      ) : (
        <ul className="space-y-4">
          {apps.map(a => (
            <li key={a.applicationId} className="p-4 border rounded bg-white">
              <div className="flex justify-between">
                <div>
                  <div className="text-lg font-medium">{a.pet?.name ?? 'Unknown Pet'}</div>
                  <div className="text-sm text-slate-600">Applicant: {a.adopter?.email ?? 'unknown'}</div>
                  <div className="text-sm text-slate-500">Submitted: {new Date(a.submittedAt).toLocaleString()}</div>
                  <div className="mt-2 text-sm">{a.supplementaryAnswers}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-semibold">{a.status}</div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button onClick={() => changeStatus(a.applicationId, 'Received')} className="px-2 py-1 bg-slate-400 text-white text-xs rounded">Received</button>
                    <button onClick={() => changeStatus(a.applicationId, 'In_Review')} className="px-2 py-1 bg-blue-500 text-white text-xs rounded">In Review</button>
                    <button onClick={() => changeStatus(a.applicationId, 'Interview_Scheduled')} className="px-2 py-1 bg-purple-500 text-white text-xs rounded">Interview</button>
                    <button onClick={() => changeStatus(a.applicationId, 'Approved')} className="px-2 py-1 bg-emerald-600 text-white text-xs rounded">Approve</button>
                    <button onClick={() => changeStatus(a.applicationId, 'Rejected')} className="px-2 py-1 bg-rose-600 text-white text-xs rounded">Reject</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
