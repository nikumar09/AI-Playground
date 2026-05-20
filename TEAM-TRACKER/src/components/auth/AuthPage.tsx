import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

type Mode = 'signin' | 'signup';

const AuthPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');

  // Sign in state
  const [email, setEmail] = useState('');

  // Sign up state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setLoading(true);
    const result = signIn(email);
    setLoading(false);
    if (!result.success) setError(result.error ?? 'Sign in failed.');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim()) { setError('First name is required.'); return; }
    if (!lastName.trim())  { setError('Last name is required.'); return; }
    if (!signUpEmail.trim()) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail.trim())) {
      setError('Please enter a valid email address.'); return;
    }
    setLoading(true);
    const result = signUp(firstName, lastName, signUpEmail);
    setLoading(false);
    if (!result.success) setError(result.error ?? 'Sign up failed.');
  };

  const switchMode = (m: Mode) => { setMode(m); setError(''); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <img src={logo} alt="Team Tracker" className="auth-logo" />
          <span className="auth-brand-name">Team Tracker</span>
        </div>

        {mode === 'signin' ? (
          <>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Enter your email to sign in to your account.</p>

            <form className="auth-form" onSubmit={handleSignIn} noValidate>
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-email">Email address</label>
                <input
                  id="auth-email"
                  type="email"
                  className="auth-input"
                  placeholder="you@teamtracker.dev"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  autoComplete="email"
                />
              </div>

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <button className="auth-link" onClick={() => switchMode('signup')}>Sign up</button>
            </p>

            <div className="auth-hint">
              <p className="auth-hint-title">Demo accounts</p>
              <p className="auth-hint-body">alex@teamtracker.dev · sarah@teamtracker.dev · jordan@teamtracker.dev · liam@teamtracker.dev</p>
            </div>
          </>
        ) : (
          <>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-sub">Join your team on Team Tracker.</p>

            <form className="auth-form" onSubmit={handleSignUp} noValidate>
              <div className="auth-row">
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-first">First name</label>
                  <input
                    id="auth-first"
                    type="text"
                    className="auth-input"
                    placeholder="Alex"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    autoFocus
                    autoComplete="given-name"
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-last">Last name</label>
                  <input
                    id="auth-last"
                    type="text"
                    className="auth-input"
                    placeholder="Rivera"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-signup-email">Work email</label>
                <input
                  id="auth-signup-email"
                  type="email"
                  className="auth-input"
                  placeholder="you@company.com"
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <button className="auth-link" onClick={() => switchMode('signin')}>Sign in</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
