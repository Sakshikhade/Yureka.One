import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Coins, ArrowUpRight, Loader2, Sparkles, Store, RefreshCw, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSupabase } from '@shared/SupabaseProvider'
import { formatPaise, goldbackApi } from '@backend/lib/goldback/client'
import type { GoldbackBalance, GoldbackLedgerEntry } from '@backend/lib/goldback/types'

const GoldbackHome: React.FC = () => {
  const { user } = useSupabase()
  const userId = user?.id || user?.email || 'demo-user'
  const [balance, setBalance] = useState<GoldbackBalance | null>(null)
  const [ledger, setLedger] = useState<GoldbackLedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [b, l] = await Promise.all([goldbackApi.balance(userId), goldbackApi.ledger(userId)])
    if (b.error || !b.data) setError(b.error || 'Could not load balance')
    else setBalance(b.data)
    if (!l.error && l.data) setLedger(l.data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const earnedToday = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return ledger
      .filter((e) => e.status === 'earned' && new Date(e.createdAt) >= start)
      .reduce((sum, e) => sum + e.amountPaise, 0)
  }, [ledger])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-clay/30 blur-xl animate-pulse" />
          <Loader2 className="relative animate-spin text-clay" size={36} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.35em] text-white/35">Loading your Goldback</span>
      </div>
    )
  }

  const balancePaise = balance?.balancePaise ?? 0

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-200"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2.25rem] border border-white/[0.08] bg-[#0c0c0c]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 20%, rgba(52,211,153,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(52,211,153,0.08), transparent 50%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative p-8 md:p-12 lg:p-14">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex h-2 w-2 rounded-full bg-clay shadow-[0_0_12px_#34d399] animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-clay/90">Yureka Goldback</p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-white/45 text-sm mb-3 font-medium">Face-value balance</p>
              <motion.h2
                key={balancePaise}
                initial={{ opacity: 0.4, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums leading-none"
              >
                {formatPaise(balancePaise)}
              </motion.h2>
              <p className="mt-5 text-white/40 text-[15px] max-w-md leading-relaxed">
                Spend smarter with discounts. Earn Goldback that redeems at face value — not rotting points.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto lg:w-56">
              <Link
                to="/dashboard/offers"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-clay px-6 py-4 text-black text-[11px] font-black uppercase tracking-[0.18em] hover:brightness-110 transition shadow-[0_0_40px_rgba(52,211,153,0.25)]"
              >
                <Store size={16} className="transition-transform group-hover:scale-110" />
                Find offers
              </Link>
              <button
                type="button"
                disabled
                title="Redeem ships in v1.1 once payout partner is ready"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-4 text-white/25 text-[11px] font-black uppercase tracking-[0.18em] cursor-not-allowed"
              >
                <Sparkles size={16} /> Redeem soon
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Lifetime earned', value: formatPaise(balancePaise), icon: Coins },
              { label: 'Earned today', value: formatPaise(earnedToday), icon: TrendingUp },
              { label: 'Earn events', value: String(ledger.length), icon: ArrowUpRight },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="rounded-2xl border border-white/[0.07] bg-black/40 backdrop-blur-sm px-4 py-4"
              >
                <div className="flex items-center gap-2 text-white/35 mb-2">
                  <stat.icon size={13} />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em]">{stat.label}</span>
                </div>
                <p className="text-xl font-black text-white tabular-nums tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white">Activity</h3>
            <p className="text-white/30 text-xs mt-1">Recent Goldback credits from offers</p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 hover:text-clay hover:border-clay/30 transition"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {ledger.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[1.75rem] border border-dashed border-white/15 bg-gradient-to-b from-white/[0.04] to-transparent px-8 py-16 text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-clay/10 border border-clay/20">
              <Coins className="text-clay" size={28} />
            </div>
            <p className="text-white font-bold text-lg mb-2">Your vault is empty</p>
            <p className="text-white/45 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Open a tracked offer, shop the deal, and Goldback lands here at face value.
            </p>
            <Link
              to="/dashboard/offers"
              className="inline-flex items-center gap-2 text-clay text-xs font-black uppercase tracking-[0.25em] hover:brightness-125"
            >
              Browse offers <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <ul className="space-y-2.5">
            {ledger.map((entry, idx) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 px-5 py-4 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-clay/10 border border-clay/20 text-clay group-hover:scale-105 transition">
                    <ArrowUpRight size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate">
                      {String(entry.meta?.title || entry.meta?.merchant || entry.type)}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 mt-1">
                      <span className="text-clay/80">{entry.status}</span>
                      {' · '}
                      {new Date(entry.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-clay font-black text-lg tabular-nums shrink-0">
                  +{formatPaise(entry.amountPaise)}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default GoldbackHome
