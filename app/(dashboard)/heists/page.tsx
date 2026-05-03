'use client'

import { useHeists } from '@/hooks/useHeists'

export default function HeistsPage() {
  const { heists: activeHeists, loading: activeLoading } = useHeists('active')
  const { heists: assignedHeists, loading: assignedLoading } = useHeists('assigned')
  const { heists: expiredHeists, loading: expiredLoading } = useHeists('expired')

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        {activeLoading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {activeHeists.map((h) => <li key={h.id}>{h.title}</li>)}
          </ul>
        )}
      </div>

      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        {assignedLoading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {assignedHeists.map((h) => <li key={h.id}>{h.title}</li>)}
          </ul>
        )}
      </div>

      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        {expiredLoading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {expiredHeists.map((h) => <li key={h.id}>{h.title}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}
