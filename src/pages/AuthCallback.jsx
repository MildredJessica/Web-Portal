import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    console.log('AuthCallback fired')
    console.log('Full URL:', window.location.href)
    console.log('access_token:', accessToken)
    console.log('refresh_token:', refreshToken)

    if (accessToken) {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      console.log('Tokens saved, navigating to /dashboard')
      navigate('/dashboard', { replace: true })
    } else {
      console.log('No token found, going to /login')
      navigate('/login', { replace: true })
    }
  }, [])

  return <div>Logging in...</div>
}