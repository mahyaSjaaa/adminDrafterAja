'use client'
import { poppins, poppinsSB } from "@/fonts/font"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { showToast } from "nextjs-toast-notify";

export default function Navbar() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isActive, setIsctive] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

  const handleReset = async () => {
    setMessage('')
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      showToast.error(`Gagal mengirimkan link: ${error.message}`, {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: '',
        sound: true,
    });
    } else {
      showToast.success(`Link reset password telah dikirim ke email: ${email}`, {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: '',
        sound: true,
    });
    }
  }

    const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error.message)
      return
    }

    router.refresh()
    router.push('/')
  }

  const handleSetActive = () => {
    setIsctive(!isActive)
    console.log(isActive);
    
  }

    return(
        <nav className="relative z-40">
            <div className="fixed top-0 right-0 left-0">
                <div className={`${poppins.className} flex justify-between px-10 py-4 bg-[#372415] rounded-b-xl shadow-lg/10`}>
                <p className={`${poppinsSB.className} sm:text-[15px] text-[14px] md:text-[16px] lg:text-[18px] text-[#D0CECB] lg:mt-[2px] md:mt-[4px] sm:mt-[4px] mt-[4px]`}>
                    Admin Panel                </p>
                 {/* <div className="flex justify-between lg:w-120 sm:mt-1 sm:w-80 w-45 text-[#D0CECB] lg:flex md:flex hidden">
                    <Link href="/#home" className="transition ease-in-out duration-200 hover:scale-110 sm:text-[13px] text-[11px] md:text-[16px] lg:text-[16px]">Home</Link>
                    <Link href="/#about" className="transition ease-in-out duration-200 hover:scale-110 sm:text-[13px] text-[11px] md:text-[16px] lg:text-[16px]">About</Link>
                    <Link href="/#product" className="transition ease-in-out duration-200 hover:scale-110 sm:text-[13px] text-[11px] md:text-[16px] lg:text-[16px]">Product</Link>
                    <Link href="/#contact" className="transition ease-in-out duration-200 hover:scale-110 sm:text-[13px] text-[11px] md:text-[16px] lg:text-[16px]">Contact</Link>
                </div> */}
                {/* <a href="https://wa.me/6281999885873" className="sm:text-[13px] text-[13px] md:text-[16px] lg:text-[16px] transition hover:scale-105 duration-300 ease-in-out hover:from-[#6B21A8] hover:to-[#9333EA] px-5 sm:px-6 md:px-8 lg:px-8 rounded-lg pt-[3] sm:py-1 md:py-1 lg:py-1 bg-linear-65 from-[#E49313] to-[#FEEF4C] text-[#2A323F] text-[12px] lg:flex md:flex hidden">Contact Us!</a>  */}
                <Menu size={24} onClick={handleClick} className="mt-[2px] flex " color="#D0CECB"/>
                </div>

                <div className="relative z-50">
                <div className={`
                    fixed top-0 left-0 w-full bg-[#372415] text-[#D0CECB] px-10 py-5 rounded-b-lg
                    ${poppins.className} text-[16px] shadow-xl/20
                    transform transition-all duration-300 ease-in-out
                    ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
                `}>
                    <div className="flex justify-between mb-2">
                        <div className="mb-2"><button onClick={handleSetActive}>Ganti Passowrd</button></div>
                        <X onClick={handleClick} size={24} color="#D0CECB" />
                    </div>
                    {isActive ? (
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Masukkan email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border rounded px-3 py-2"
                            />
                            <button onClick={handleReset} className="bg-blue-600 text-white px-4 py-2 rounded">
                                Kirim Link Reset
                            </button>
                            {message && <p className="text-green-600">{message}</p>}
                            {error && <p className="text-red-600">{error}</p>}
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <div className="mb-2 mt-2"><button onClick={handleLogout}>Logout</button></div>
                </div>
                </div>
            </div>
        </nav>
    )
}