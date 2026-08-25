import { adminMatchApi } from '#/features/admin/api/admin-review-match.api'
import { MatchDetailsModal } from '#/features/admin/components/reviewMatch/Matchdetailsmodal'
import { MatchTable } from '#/features/admin/components/reviewMatch/Matchtable'
import { RejectDialog } from '#/features/admin/components/reviewMatch/Rejectdialog'
import { SearchBar } from '#/features/admin/components/reviewMatch/Searchbar'
import { StatusFilter } from '#/features/admin/components/reviewMatch/Statusfilter'
import type { ApprovalStatus, MatchSubmission } from '#/features/admin/types/admin-match.types'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
// import { adminMatchApi } from '../components/api'
// import { MatchDetailsModal } from '../components/MatchDetailsModal'
// import { MatchTable } from '../components/MatchTable'
// import { RejectDialog } from '../components/RejectDialog'
// import { SearchBar } from '../components/SearchBar'
// import { StatusFilter } from '../components/StatusFilter'
// import type { ApprovalStatus, MatchSubmission } from '../components/types'

export const Route = createFileRoute('/admin/_authed/review')({
  head: () => ({
    meta: [
      { title: "Review Match — Spotig Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const [matches, setMatches] = useState<MatchSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<ApprovalStatus>('PENDING')
  const [pendingActionId, setPendingActionId] = useState<string | null>(null)

  const [detailsMatch, setDetailsMatch] = useState<MatchSubmission | null>(null)
  const [rejectingMatch, setRejectingMatch] = useState<MatchSubmission | null>(null)

  async function loadMatches() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminMatchApi.list()
      setMatches(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatches()
  }, [])

  const counts = useMemo(() => {
    return matches.reduce(
      (acc, m) => {
        acc[m.status] += 1
        return acc
      },
      { PENDING: 0, APPROVED: 0, REJECTED: 0 } as Record<ApprovalStatus, number>,
    )
  }, [matches])

  const filteredMatches = useMemo(
    () => matches.filter((m) => m.status === statusFilter),
    [matches, statusFilter],
  )

  async function handleApprove(match: MatchSubmission) {
    setPendingActionId(match.id)
    try {
      const { data: updated } = await adminMatchApi.approve(match.id)
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve match.')
    } finally {
      setPendingActionId(null)
    }
  }

  async function handleConfirmReject(reason: string) {
    if (!rejectingMatch) return
    setPendingActionId(rejectingMatch.id)
    try {
      const { data: updated } = await adminMatchApi.reject(rejectingMatch.id, { reason })
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      setRejectingMatch(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject match.')
    } finally {
      setPendingActionId(null)
    }
  }

  return (
    <div className="m-0 max-w-6xl p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wider md:text-3xl">Review matches</h1>
          <p className="mt-1 text-sm text-slate-500">
            Approve or reject match submissions from players.
          </p>
        </div>
        <SearchBar />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <StatusFilter value={statusFilter} onChange={setStatusFilter} counts={counts} />
        <button
          type="button"
          onClick={loadMatches}
          disabled={loading}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4">
        {loading ? (
          <div className="rounded-xl border border-slate-200 py-16 text-center text-sm text-slate-400">
            Loading matches…
          </div>
        ) : (
          <MatchTable
            matches={filteredMatches}
            activeStatus={statusFilter}
            pendingActionId={pendingActionId}
            onApprove={handleApprove}
            onReject={setRejectingMatch}
            onShowData={setDetailsMatch}
          />
        )}
      </div>

      {detailsMatch && (
        <MatchDetailsModal match={detailsMatch} onClose={() => setDetailsMatch(null)} />
      )}

      {rejectingMatch && (
        <RejectDialog
          match={rejectingMatch}
          isSubmitting={pendingActionId === rejectingMatch.id}
          onCancel={() => setRejectingMatch(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </div>
  )
}