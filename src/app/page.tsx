'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/admin')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      console.error('Login error:', error)
      return
    }
    
    // The redirect will happen in the auth state change listener
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border border-[#e5e1de]">
        <h1 className="text-2xl font-bold mb-4 text-[#4F2916] text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#d6ccc2] px-3 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#4F2916]"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#d6ccc2] px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#4F2916]"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#4F2916] hover:bg-[#3b1f11] text-white font-medium py-2 px-4 rounded-md transition"
        >
          Masuk
        </button>
      </div>
    </div>
  )
}