import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <img
          src="/img/logo.svg"
          alt="Essencium"
          className="mx-auto mb-8 h-10"
        />
        <h1 className="text-3xl font-bold text-foreground">
          Essencium Frontend v2
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Setup erfolgreich.</p>
      </div>
    </div>
  )
}
