import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <img src="/img/logo.svg" alt="Essencium" className="mb-4 h-8" />
          <CardTitle className="text-xl">Essencium Frontend v2</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="email" placeholder="E-Mail" />
          <Input type="password" placeholder="Passwort" />
          <Button className="w-full">Anmelden</Button>
          <Button variant="secondary" className="w-full">
            Registrieren
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
