import React, { useEffect, useMemo, useState } from 'react'
import applicationService from '../services/applicationService'
import { useAuth } from '../context/AuthContext.jsx'

export default function Applications() {
  const { isStaff, isAuthenticated, initializing } = useAuth()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [changingId, setChangingId] = useState(null)
  const [statusNotice, setStatusNotice] = useState(null)

  const STATUS_META = {
    Received: {
      label: 'Received',
      badge: 'bg-slate-100 text-slate-700 border border-slate-200',
      button: 'bg-slate-500 hover:bg-slate-600',
    },
    Approved: {
      label: 'Approved',
      badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
    Rejected: {
      label: 'Rejected',
      badge: 'bg-rose-100 text-rose-700 border border-rose-200',
      button: 'bg-rose-600 hover:bg-rose-700',
    },
  }

  useEffect(() => {
    if (initializing) return
    if (!isAuthenticated) {
      setError(new Error('Please sign in to view your applications.'))
      setLoading(false)
      return
    }
    let mounted = true
    async function load() {
      try {
        const data = isStaff
          ? await applicationService.getShelterApplications()
          : await applicationService.getMyApplications()
        if (!mounted) return
        setApps(data || [])
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [initializing, isAuthenticated, isStaff])

  const title = useMemo(() => (isStaff ? 'Shelter Applications' : 'My Adoption Applications'), [isStaff])
  const emptyCopy = useMemo(
    () =>
      isStaff
        ? 'You have not received any applications yet. Share your pet listings to reach more adopters.'
        : 'You have not submitted any adoption applications yet. Explore pets and send your first application!',
    [isStaff],
  )

  const formatStatus = (status) =>
    STATUS_META[status]?.label ?? (typeof status === 'string' ? status.replace(/_/g, ' ') : status)

  const staffActions = useMemo(
    () => [
      { value: 'Received' },
      { value: 'Approved' },
      { value: 'Rejected' },
    ],
    [],
  )

  async function changeStatus(appId, status) {
    if (!isStaff) return
    try {
      setChangingId(appId)
      setStatusNotice(null)
      const updated = await applicationService.updateApplicationStatus(appId, status)
      setApps((prev) =>
        prev.map((application) =>
          application.applicationId === updated?.applicationId
            ? { ...application, status: updated.status }
            : application,
        ),
      )
      setStatusNotice({ type: 'success', message: `Status updated to ${formatStatus(status)}.` })
    } catch (e) {
      const message = e?.message || String(e)
      setStatusNotice({ type: 'error', message })
    }
    setChangingId(null)
  }

  if (loading) return <div className="p-8 text-slate-600">Loading applications…</div>
  if (error)
    return (
      <div className="p-8 text-rose-600">
        Error loading applications: {String(error.message || error)}
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-12">
      <main className="max-w-5xl mx-auto px-6">
        <header className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-emerald-200 px-4 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
            🐾 {isStaff ? 'Shelter workflow' : 'My adoption journey'}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            {isStaff
              ? 'Review incoming adopter stories, keep application statuses current, and guide each match toward their forever home.'
              : 'Track every pet application, stay informed on status updates, and see the next steps toward welcoming your new companion.'}
          </p>
        </header>

        {statusNotice && (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium shadow-sm ${
              statusNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {statusNotice.message}
          </div>
        )}

        {apps.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-emerald-200 bg-white/60 p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Nothing to show just yet</h2>
            <p className="text-slate-500 max-w-xl mx-auto">{emptyCopy}</p>
          </section>
        ) : (
          <ul className="space-y-6">
            {apps.map((a) => {
              const meta = STATUS_META[a.status] || {}
              const isFinalStatus = a.status === 'Approved' || a.status === 'Rejected'
              const isChanging = changingId === a.applicationId
              const showStaffControls = isStaff && !isFinalStatus

              return (
                <li
                  key={a.applicationId}
                  className="relative rounded-3xl bg-white shadow-lg shadow-emerald-100/60 border border-emerald-100/60 p-8"
                >
                  {/* Status badge pinned upper-right */}
                  <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${
                        meta.badge || 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className="text-base" aria-hidden>
                        {a.status === 'Approved' ? '✅' : a.status === 'Rejected' ? '❌' : '📄'}
                      </span>
                      {formatStatus(a.status)}
                    </span>

                    {/* Controls only until final status */}
                    {showStaffControls && (
                      <div className="w-[220px]">
                        <label className="block text-xs font-semibold text-slate-600 mb-2 text-right">
                          Update status
                        </label>

                        <div className="relative w-full">
                          <select
                            value={a.status || 'Received'}
                            onChange={(e) => changeStatus(a.applicationId, e.target.value)}
                            disabled={isChanging}
                            className={`w-full appearance-none rounded-2xl border bg-white px-4 py-2 pr-10 text-sm font-semibold text-slate-800 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
                              isChanging ? 'cursor-not-allowed opacity-60' : 'hover:border-emerald-200'
                            }`}
                          >
                            {staffActions.map(({ value }) => (
                              <option key={value} value={value}>
                                {formatStatus(value)}
                              </option>
                            ))}
                          </select>

                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            ▾
                          </span>
                        </div>

                        {isChanging && (
                          <div className="mt-2 text-xs text-slate-500 text-right">
                            <span className="font-semibold">Updating…</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Keep content away from pinned status area */}
                  <div className="pr-[260px] max-sm:pr-0">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{a.pet?.name ?? 'Unknown Pet'}</h2>
                        <div className="mt-1 text-sm text-slate-500 flex flex-wrap items-center gap-3">
                          <span>Submitted {new Date(a.submittedAt).toLocaleString()}</span>
                          {a.pet?.shelter?.name && !isStaff && (
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <span className="text-base" aria-hidden>
                                {' '}
                              </span>
                              {a.pet.shelter.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {isStaff ? (
                        <div className="grid gap-3 text-sm text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-800">Applicant</span>
                            <div>{a.adopter?.email ?? 'Unknown adopter'}</div>
                          </div>

                          {a.adopter?.profilePersonalInfo && (
                            <div>
                              <span className="font-semibold text-slate-800">Personal Profile</span>
                              <div className="mt-1 rounded-2xl bg-slate-50 px-4 py-3 text-slate-600 whitespace-pre-line">
                                {a.adopter.profilePersonalInfo}
                              </div>
                            </div>
                          )}

                          {a.supplementaryAnswers && (
                            <div>
                              <span className="font-semibold text-slate-800">Applicant Details</span>
                              <div className="mt-1 rounded-2xl bg-slate-50 px-4 py-3 text-slate-600 whitespace-pre-line">
                                {a.supplementaryAnswers}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid gap-3 text-sm text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-800">Application notes</span>
                            <div className="mt-1 rounded-2xl bg-slate-50 px-4 py-3 text-slate-600 whitespace-pre-line">
                              {a.supplementaryAnswers || "You didn't include any additional answers for this pet."}
                            </div>
                          </div>

                          {a.notes && (
                            <div>
                              <span className="font-semibold text-slate-800">Shelter feedback</span>
                              <div className="mt-1 rounded-2xl bg-amber-50 px-4 py-3 text-amber-700 whitespace-pre-line">
                                {a.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!isStaff && (
                      <div className="mt-5 rounded-lg border border-amber-200 bg-white px-2 py-1 text-xs text-slate-600 shadow-sm w-fit">
                        Need help? Contact the shelter directly with questions about your application status.
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}