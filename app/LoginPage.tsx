import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, LogIn } from 'lucide-react'
import { motion } from 'motion/react'
import { useSupabase } from '@shared/SupabaseProvider'
import { signInWithGmail, supabaseConfigured } from '@shared/auth'

const LoginPage: React.FC = () => {
  const { user, currentUserStatus, isLoading } = useSupabase()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextPath = searchParams.get('next') || '/dashboard'

  useEffect(() => {
    if (isLoading || currentUserStatus === 'loading') return
    if (!user) return

    if (currentUserStatus === 'accepted' || currentUserStatus === 'admin') {
      navigate(nextPath.startsWith('/') ? nextPath : '/dashboard', { replace: true })
      return
    }
    if (
      currentUserStatus === 'pending' ||
      currentUserStatus === 'on-hold' ||
      currentUserStatus === 'rejected'
    ) {
      navigate('/waiting', { replace: true })
      return
    }
    if (currentUserStatus === 'none') {
      navigate('/join-waitlist', { replace: true })
    }
  }, [user, currentUserStatus, isLoading, navigate, nextPath])

  const handleGmail = async () => {
    setError(null)
    setBusy(true)
    const redirectTo = `${window.location.origin}/login?next=${encodeURIComponent(nextPath)}`
    const result = await signInWithGmail(redirectTo)
    if (result.error) {
      setError(result.error)
      setBusy(false)
    }
    // OAuth redirects away on success
  }

  if (isLoading || (user && currentUserStatus === 'loading')) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 className="animate-spin text-clay" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed top-1/4 -left-1/4 w-[50%] h-[50%] bg-clay/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-clay/15 border border-clay/25 flex items-center justify-center mx-auto mb-8">
          <LogIn className="text-clay" size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tighter mb-3">
          Welcome back
        </h1>
        <p className="text-sm text-white/40 mb-10 leading-relaxed">
          Sign in with Gmail to open your dashboard. New here? Join the waitlist first.
        </p>

        {!supabaseConfigured && (
          <p className="mb-6 text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
            Supabase Auth is not configured on this build. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </p>
        )}

        {error && (
          <p className="mb-6 text-xs text-red-200 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleGmail}
          disabled={busy || !supabaseConfigured}
          className="w-full bg-white text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {busy ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Gmail
            </>
          )}
        </button>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
          <Link to="/join-waitlist" className="hover:text-clay transition-colors">
            Join the waitlist
          </Link>
          <span className="mx-3">·</span>
          <Link to="/" className="hover:text-clay transition-colors">
            Home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default LoginPage
