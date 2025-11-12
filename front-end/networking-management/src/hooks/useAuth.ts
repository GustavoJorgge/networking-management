'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useAuth(redirectTo = '/login') {
    const router = useRouter()
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        // Evita chamadas síncronas
        const verifyAuth = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push(redirectTo)
                return
            }
            setAuthenticated(true)
        }

        verifyAuth()
    }, [router, redirectTo])

    return { authenticated }
}
