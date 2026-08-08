import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Gift, Loader2, Search, X, RefreshCw, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '@shared/SupabaseProvider'
import type { GiftCard } from '@backend/lib/hubble/types'

const formatInr = (n: number) =>
  `₹${n.toLocaleString('en-IN')}`

const prettyCategory = (c: string) =>
  c
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const GiftCardsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useSupabase()
  const [items, setItems] = useState<GiftCard[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<GiftCard | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [amount, setAmount] = useState<number | null>(null)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)

  const userId = user?.id || user?.email || 'demo-user'

  const load = useCallback(async (opts?: { refresh?: boolean }) => {
    if (opts?.refresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      if (opts?.refresh) {
        await fetch('/api/giftcards/refresh', { method: 'POST' })
      }
      const params = new URLSearchParams({ status: 'ACTIVE' })
      if (category !== 'all') params.set('category', category)
      if (query.trim()) params.set('q', query.trim())
      const res = await fetch(`/api/giftcards?${params}`)
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Failed to load gift cards')
      setItems(json.data.items || [])
      setCategories(json.data.categories || [])
      setTotal(json.data.total || 0)
    } catch (e: any) {
      setError(e?.message || 'Could not load gift cards')
      setItems([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [category, query])

  useEffect(() => {
    const t = setTimeout(() => load(), query ? 280 : 0)
    return () => clearTimeout(t)
  }, [load, query])

  useEffect(() => {
    if (!selected) {
      setAmount(null)
      setBuyError(null)
      return
    }
    if (selected.denominations.length) {
      setAmount(selected.denominations[0])
    } else if (selected.minAmount != null) {
      setAmount(selected.minAmount)
    } else {
      setAmount(null)
    }
    setBuyError(null)
  }, [selected])

  const chips = useMemo(() => ['all', ...categories], [categories])

  const openVariableOk =
    selected &&
    !selected.denominations.length &&
    amount != null &&
    (selected.minAmount == null || amount >= selected.minAmount) &&
    (selected.maxAmount == null || amount <= selected.maxAmount)

  const canBuy =
    !!selected &&
    amount != null &&
    amount > 0 &&
    (selected.denominations.length ? selected.denominations.includes(amount) : openVariableOk) &&
    !buying

  const placeOrder = async () => {
    if (!selected || amount == null || !canBuy) return
    setBuying(true)
    setBuyError(null)
    try {
      const res = await fetch('/api/giftcards/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          productId: selected.id,
          denomination: amount,
          quantity: 1,
          customerName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Yureka User',
          customerEmail: user?.email || 'noreply@yureka.one',
          customerPhone: user?.user_metadata?.phone || '',
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Order failed')
      const statusUrl = json.data?.statusUrl || `/dashboard/giftcards/orders/${json.data?.order?.id}`
      navigate(statusUrl)
    } catch (e: any) {
      setBuyError(e?.message || 'Could not place order')
    } finally {
      setBuying(false)
    }
  }

  if (loading && !items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <Loader2 className="animate-spin text-clay" size={36} />
        <span className="text-[11px] font-black uppercase tracking-[0.35em] text-white/35">
          Loading gift cards
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black tracking-tight text-white mb-2">Gift cards</h2>
          <p className="text-white/45 text-[15px] leading-relaxed">
            {total.toLocaleString('en-IN')} active brands via Hubble — pick an amount and buy. Payment settles on Hubble&apos;s partner wallet.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load({ refresh: true })}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/45 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </motion.div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands…"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-clay/40 focus:ring-1 focus:ring-clay/20 transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-xl px-3.5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                category === c
                  ? 'bg-clay text-black shadow-[0_0_24px_rgba(52,211,153,0.25)]'
                  : 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white'
              }`}
            >
              {c === 'all' ? 'All' : prettyCategory(c)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-3 text-sm text-red-200">{error}</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((card, idx) => (
          <motion.button
            key={card.id}
            type="button"
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.02, 0.3) }}
            onClick={() => setSelected(card)}
            className="group text-left rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d] overflow-hidden hover:border-white/20 transition"
          >
            <div className="aspect-[16/10] bg-white/[0.03] relative overflow-hidden">
              {card.imageUrl ? (
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-clay/40">
                  <Gift size={36} />
                </div>
              )}
              {card.categories[0] && (
                <span className="absolute left-3 top-3 rounded-lg bg-black/70 backdrop-blur px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white/80">
                  {prettyCategory(card.categories[0])}
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3">
                {card.logoUrl && (
                  <img src={card.logoUrl} alt="" className="h-9 w-9 rounded-xl object-cover bg-white/5 shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-white tracking-tight truncate">{card.title}</h3>
                  <p className="text-[11px] text-white/35 mt-0.5 truncate">
                    {card.redemptionType.replace(/_/g, ' ').toLowerCase()}
                    {card.minAmount != null && card.maxAmount != null && (
                      <> · {formatInr(card.minAmount)}–{formatInr(card.maxAmount)}</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {!items.length && !error && (
        <div className="rounded-[1.75rem] border border-white/10 px-8 py-16 text-center text-white/40 text-sm">
          No gift cards match that filter.
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.aside
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-white/10 bg-[#0a0a0a] overflow-y-auto dashboard-scroll shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur px-5 py-4">
                <p className="font-black tracking-tight truncate">{selected.title}</p>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl p-2 text-white/40 hover:text-white hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 space-y-6">
                {selected.imageUrl && (
                  <img src={selected.imageUrl} alt="" className="w-full rounded-2xl object-cover aspect-video bg-white/5" />
                )}
                {selected.description && (
                  <p className="text-white/55 text-sm leading-relaxed">{selected.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {selected.categories.map((c) => (
                    <span key={c} className="rounded-lg border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white/45">
                      {prettyCategory(c)}
                    </span>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-2">Amount</p>
                  {!!selected.denominations.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selected.denominations.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setAmount(d)}
                          className={`rounded-xl px-3 py-2 text-xs font-bold tabular-nums border transition ${
                            amount === d
                              ? 'bg-clay/20 border-clay/40 text-clay'
                              : 'bg-white/[0.03] border-white/10 text-white/55 hover:text-white'
                          }`}
                        >
                          {formatInr(d)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="number"
                      min={selected.minAmount ?? 1}
                      max={selected.maxAmount ?? undefined}
                      value={amount ?? ''}
                      onChange={(e) => setAmount(Number(e.target.value) || null)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white focus:outline-none focus:border-clay/40"
                      placeholder="Enter amount"
                    />
                  )}
                </div>

                {!!selected.howToUse.length && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-2">How to use</p>
                    <ol className="space-y-2 text-sm text-white/50 list-decimal list-inside">
                      {selected.howToUse.slice(0, 6).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {selected.tncUrl && (
                  <a
                    href={selected.tncUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-clay text-sm font-bold hover:underline"
                  >
                    Terms & conditions <ExternalLink size={14} />
                  </a>
                )}

                {buyError && (
                  <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {buyError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={placeOrder}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-clay text-black font-black uppercase tracking-[0.18em] text-[11px] py-3.5 disabled:opacity-40 hover:brightness-110 transition active:scale-[0.98]"
                >
                  {buying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Placing order…
                    </>
                  ) : (
                    <>Buy {amount != null ? formatInr(amount) : ''} via Hubble</>
                  )}
                </button>
                <p className="text-[11px] text-white/30 leading-relaxed">
                  Hubble issues the voucher against Yureka&apos;s partner wallet. You&apos;ll see codes on the order page when ready.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GiftCardsPage
