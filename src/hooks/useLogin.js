import { useState, useEffect } from "react"
import { useAuthContext } from "./useAuthContext"
import { projectAuth } from "../firebase/config"

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)
        try {
            const resp = await projectAuth.signInWithEmailAndPassword(email, password)
            dispatch({ type: 'LOGIN', payload: resp.user })
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { login, isPending, error }
}