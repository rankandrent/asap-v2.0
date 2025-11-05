import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../contexts/AuthContext'
import SEO from '../../components/common/SEO'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password, fullName)

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <SEO
          title="Registration Successful | ASAPAmatom.com"
          description="Your account has been created successfully."
          canonical="https://www.asapamatom.com/auth/signup"
        />

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Account Created! 🎉
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Welcome to ASAPAmatom, {fullName}!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                We've sent a verification email to <strong>{email}</strong>.
                Please check your inbox and verify your email address.
              </p>
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Continue to Login
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Create Account | ASAPAmatom.com"
        description="Sign up for a free account to track orders and manage your purchases."
        canonical="https://www.asapamatom.com/auth/signup"
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-gray-900">ASAPAmatom</h1>
            </Link>
            <p className="mt-2 text-gray-600">Create your account</p>
          </div>

          {/* SignUp Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Registration Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

