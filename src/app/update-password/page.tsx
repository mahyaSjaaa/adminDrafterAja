'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { showToast } from "nextjs-toast-notify";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      showToast.error(`Gagal update password: ${error.message}`, {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: '',
        sound: true,
    });
    } else {
      showToast.success("Password berhasil diperbarui!", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: '',
        sound: true,
    });
      setTimeout(() => router.push('/'), 2000) // redirect ke home/login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border border-[#e5e1de]">
        <h1 className="text-2xl font-bold mb-4 text-[#4F2916] text-center">Ganti Password</h1>

        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#d6ccc2] px-3 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#4F2916]"
        />

        <button
          onClick={handleUpdatePassword}
          className="w-full bg-[#4F2916] hover:bg-[#3b1f11] text-white font-medium py-2 px-4 rounded-md transition"
        >
          Simpan Password
        </button>
      </div>
    </div>
  )
}
