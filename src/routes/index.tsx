import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div>
      <h1>Essencium Frontend v2</h1>
      <p>Setup erfolgreich.</p>
    </div>
  )
}
