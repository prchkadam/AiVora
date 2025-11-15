import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to AiVora Quiz</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue or create a new account to start playing.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}