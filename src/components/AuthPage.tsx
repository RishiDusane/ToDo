import { LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

export default function AuthPage() {
  const [registerMode, setRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const error = useAuthStore((state) => state.error)
  const loading = useAuthStore((state) => state.loading)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try { if (registerMode) await register(name, email, password); else await login(email, password) } catch { /* The store exposes the message below the form. */ }
  }

  return <main className="auth-shell"><div className="auth-brand"><span>TF</span><strong>TaskFlow</strong></div><section className="auth-card"><p className="eyebrow">Your focused workspace</p><h1>{registerMode ? 'Create your account' : 'Welcome back'}</h1><p className="auth-subtitle">{registerMode ? 'Start planning work that feels possible.' : 'Pick up where you left off.'}</p><form className="auth-form" onSubmit={submit}>{registerMode && <label><span>Name</span><div className="auth-input"><UserRound size={17} /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required minLength={2} /></div></label>}<label><span>Email</span><div className="auth-input"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></div></label><label><span>Password</span><div className="auth-input"><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required minLength={8} /></div></label>{error && <p className="auth-error">{error}</p>}<button className="button primary auth-submit" disabled={loading}>{loading ? 'Please wait...' : registerMode ? 'Create account' : 'Log in'}</button></form><button className="auth-switch" onClick={() => setRegisterMode(!registerMode)}>{registerMode ? 'Already have an account? Log in' : 'New here? Create an account'}</button><p className="auth-note">Your data is stored in the TaskFlow MySQL database.</p></section></main>
}
