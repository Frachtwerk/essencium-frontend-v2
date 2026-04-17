import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Essencium Frontend v2</h1>
        <p className="mt-4 text-lg text-gray-600">Setup erfolgreich.</p>
      </div>
    </div>
  )
}
