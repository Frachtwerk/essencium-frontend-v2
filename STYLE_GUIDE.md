# STYLE_GUIDE.md — Frachtwerk UI Style Guide für Essencium v2

> **Status: Interim Style Guide.**
> Dieser Guide basiert auf dem bestehenden Essencium v1, der Frachtwerk Corporate Identity (frachtwerk.de) und den Konventionen von shadcn/ui. Er dient als Arbeitsgrundlage, bis die UI/UX-Gilde ein vollständiges Design-System liefert. Anpassungen durch die UI/UX-Gilde haben Vorrang.

---

## 1. Farbsystem

### Frachtwerk Corporate Colors

Die Farben sind aus der Frachtwerk Website und dem bestehenden Essencium Logo abgeleitet. Sie werden als CSS-Variablen in `globals.css` definiert und über Tailwind konsumiert.

```
Primär (Frachtwerk Blau):    #1A3A5C  — Dunkelblau, Hauptfarbe für Navigation, Header, Akzente
Primär Hell:                  #2563EB  — Helles Blau, für Links, aktive Elemente, Focus-States
Akzent:                       #0891B2  — Teal/Cyan, für CTAs, Highlights, Badges
Hintergrund:                  #FFFFFF  — Weiß, Haupthintergrund
Hintergrund Sekundär:         #F8FAFC  — Slate-50, für Cards, Sidebar, alternating Rows
Hintergrund Tertiär:          #F1F5F9  — Slate-100, für Inputs, disabled States
Border:                       #E2E8F0  — Slate-200, für alle Borders
Text Primär:                  #1E293B  — Slate-800, für Überschriften und Body-Text
Text Sekundär:                #64748B  — Slate-500, für Labels, Descriptions, Muted Text
Text Disabled:                #94A3B8  — Slate-400
Erfolg:                       #10B981  — Emerald-500
Warnung:                      #F59E0B  — Amber-500
Fehler:                       #EF4444  — Red-500
Info:                         #3B82F6  — Blue-500
```

### Dark Mode

```
Hintergrund:                  #0F172A  — Slate-900
Hintergrund Sekundär:         #1E293B  — Slate-800
Hintergrund Tertiär:          #334155  — Slate-700
Border:                       #334155  — Slate-700
Text Primär:                  #F1F5F9  — Slate-100
Text Sekundär:                #94A3B8  — Slate-400
```

### Implementierung in globals.css

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 215 28% 17%;
    --card: 210 40% 98%;
    --card-foreground: 215 28% 17%;
    --primary: 213 52% 23%; /* Frachtwerk Blau #1A3A5C */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 215 28% 17%;
    --accent: 189 94% 37%; /* Teal #0891B2 */
    --accent-foreground: 0 0% 100%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --destructive: 0 84% 60%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 213 52% 23%;
    --radius: 0.375rem; /* 6px, entspricht sm */
  }

  .dark {
    --background: 217 33% 17%;
    --foreground: 210 40% 98%;
    --card: 215 28% 17%;
    --card-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 217 33% 17%;
    --secondary: 215 25% 27%;
    --secondary-foreground: 210 40% 98%;
    --accent: 189 94% 37%;
    --accent-foreground: 0 0% 100%;
    --muted: 215 25% 27%;
    --muted-foreground: 215 20% 65%;
    --destructive: 0 63% 31%;
    --border: 215 25% 27%;
    --input: 215 25% 27%;
    --ring: 189 94% 37%;
  }
}
```

### Regel

Farben werden **niemals** hardcoded in Components. Immer über CSS-Variablen (`hsl(var(--primary))`) oder Tailwind-Klassen (`text-primary`, `bg-accent`). Nur so funktioniert Dark Mode und Kunden-Theming.

---

## 2. Typografie

### Font

- **Headings:** `Inter` (sans-serif) — clean, modern, exzellente Lesbarkeit
- **Body:** `Inter` — durchgängig eine Fontfamilie für Konsistenz
- **Monospace:** `JetBrains Mono` — für Code-Blöcke, technische Werte

Falls Inter nicht geladen werden kann: System-Font-Stack als Fallback (`ui-sans-serif, system-ui, sans-serif`).

### Größen (Tailwind-Klassen)

| Element            | Klasse                     | Größe   | Gewicht               |
| ------------------ | -------------------------- | ------- | --------------------- |
| Page Title (h1)    | `text-2xl` oder `text-3xl` | 24–30px | `font-bold` (700)     |
| Section Title (h2) | `text-xl`                  | 20px    | `font-semibold` (600) |
| Card Title (h3)    | `text-lg`                  | 18px    | `font-semibold` (600) |
| Body Text          | `text-sm`                  | 14px    | `font-normal` (400)   |
| Small/Caption      | `text-xs`                  | 12px    | `font-normal` (400)   |
| Label              | `text-sm`                  | 14px    | `font-medium` (500)   |

### Regel

- Body-Text ist `text-sm` (14px), nicht `text-base` (16px). Das ist der shadcn/ui-Standard und schafft kompaktere, professionellere Interfaces.
- Überschriften immer `font-semibold` oder `font-bold`, nie `font-normal`.
- Muted Text via `text-muted-foreground`.

---

## 3. Spacing & Layout

### Spacing-Scale

Wir nutzen die Tailwind-Standard-Scale. Die Frachtwerk-Konvention aus v1 (Mantine xs–xl) wird übersetzt:

| v1 (Mantine) | v2 (Tailwind)                        | Pixel   | Verwendung                                      |
| ------------ | ------------------------------------ | ------- | ----------------------------------------------- |
| xs           | `p-1` / `gap-1`                      | 4px     | Zwischen eng verwandten Elementen (Icon + Text) |
| sm           | `p-2` / `gap-2`                      | 8px     | Innerhalb von Components (Button-Padding)       |
| md           | `p-3` / `gap-3` oder `p-4` / `gap-4` | 12–16px | Standard-Abstand (Card-Padding, Form-Gaps)      |
| lg           | `p-6` / `gap-6`                      | 24px    | Zwischen Sections, Card zu Card                 |
| xl           | `p-8` / `gap-8`                      | 32px    | Page-Padding, große Abstände                    |

### Layout-Regeln

- **Page-Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Card-Padding:** `p-4` oder `p-6`
- **Form-Gaps:** `gap-4` zwischen Feldern, `gap-6` zwischen Sections
- **Stack-Gaps:** `space-y-4` für vertikale Listen
- **Sidebar-Breite:** `w-64` (256px) collapsed: `w-16` (64px)

---

## 4. Border Radius

| v1 (Mantine) | v2 (Tailwind)  | Pixel | Verwendung                            |
| ------------ | -------------- | ----- | ------------------------------------- |
| sm (Default) | `rounded-md`   | 6px   | Buttons, Inputs, Cards — **Standard** |
| md           | `rounded-lg`   | 8px   | Dialoge, Dropdowns, größere Cards     |
| lg           | `rounded-xl`   | 12px  | Modale, Hero-Sections                 |
| full         | `rounded-full` | 50%   | Avatare, Tags, Badges                 |

### Regel

Default ist `rounded-md` (6px). Wird über `--radius: 0.375rem` in den CSS-Variablen gesteuert. shadcn/ui Components nutzen das automatisch.

---

## 5. Shadows

| v1 (Mantine) | v2 (Tailwind) | Verwendung                         |
| ------------ | ------------- | ---------------------------------- |
| sm (Default) | `shadow-sm`   | Cards, Dropdowns — **Standard**    |
| md           | `shadow-md`   | Modale, Popovers                   |
| —            | `shadow-none` | Flat Elements, innerhalb von Cards |

### Regel

Sparsam mit Shadows. Default ist `shadow-sm` für Cards. Modale bekommen `shadow-md`. Die meisten Elemente brauchen keinen Shadow — Borders (`border`) reichen für visuelle Trennung.

---

## 6. Button-Varianten

Übersetzung der v1-Konventionen (Mantine filled/light/subtle) nach shadcn/ui:

| v1 (Mantine) | v2 (shadcn/ui) | Verwendung                                         |
| ------------ | -------------- | -------------------------------------------------- |
| `filled`     | `default`      | Primäre Aktion: Speichern, Erstellen, Bestätigen   |
| `light`      | `secondary`    | Sekundäre Aktion: Abbrechen, Zurück, Filter        |
| `subtle`     | `ghost`        | Tertiäre Aktion: Inline-Aktionen, Navigation-Links |
| `outline`    | `outline`      | Alternative zu Secondary, wenn mehr Präsenz nötig  |
| —            | `destructive`  | Löschen, Entfernen — immer rot                     |
| —            | `link`         | Text-Links innerhalb von Content                   |

### Größen

| Kontext   | shadcn/ui Size | Verwendung                        |
| --------- | -------------- | --------------------------------- |
| Standard  | `default`      | Formulare, Dialoge, Toolbars      |
| Kompakt   | `sm`           | Tabellen-Aktionen, Inline-Buttons |
| Prominent | `lg`           | Standalone-CTAs, leere Zustände   |
| Icon-Only | `icon`         | Sidebar-Toggle, Close-Button      |

### Regeln

- Maximal **eine** primäre Aktion pro sichtbarem Bereich.
- Destruktive Aktionen (`destructive`) immer mit Confirmation-Dialog.
- Icon-Buttons bekommen immer ein `title`-Attribut oder `aria-label`.

---

## 7. Form-Elemente

### Inputs

- Standard-Höhe: `h-9` (36px) — shadcn/ui Default
- Border: `border-input` (Slate-200)
- Focus: `ring-ring` (Frachtwerk Blau)
- Placeholder: `text-muted-foreground`
- Disabled: `opacity-50 cursor-not-allowed`
- Error: `border-destructive` + Error-Text darunter in `text-destructive text-xs`

### Labels

- Immer über dem Input, nie inline
- `text-sm font-medium`
- Required-Felder: Label + `*` in `text-destructive`

### Validierung

- Inline-Validierung: Error wird angezeigt, sobald das Feld verlassen wird (onBlur)
- Error-Text direkt unter dem Feld: `text-xs text-destructive mt-1`
- Erfolg wird **nicht** visuell angezeigt (kein grüner Rand) — Reduktion von visuellem Noise

---

## 8. Tabellen

- Zebra-Striping: alternating `bg-muted/50` auf geraden Zeilen
- Header: `bg-muted font-medium text-muted-foreground text-xs uppercase tracking-wider`
- Hover: `hover:bg-muted/50` auf Zeilen
- Aktionen pro Zeile: rechte Spalte, `ghost` Buttons oder Dropdown-Menü
- Pagination: unter der Tabelle, mit Page-Info und Navigation

---

## 9. Feedback & Status

### Toasts (Sonner)

- Erfolg: Grüner Akzent, kurze Message, verschwindet nach 4s
- Fehler: Roter Akzent, bleibt sichtbar bis dismissed
- Position: Bottom-right

### Badges / Status-Indikatoren

| Status            | Farbe | Tailwind                          |
| ----------------- | ----- | --------------------------------- |
| Aktiv / Erfolg    | Grün  | `bg-emerald-100 text-emerald-800` |
| Warnung / Pending | Gelb  | `bg-amber-100 text-amber-800`     |
| Fehler / Inaktiv  | Rot   | `bg-red-100 text-red-800`         |
| Info / Neutral    | Blau  | `bg-blue-100 text-blue-800`       |
| Default           | Grau  | `bg-slate-100 text-slate-800`     |

In Dark Mode: invertierte Varianten (`bg-emerald-900/30 text-emerald-400` etc.)

### Leere Zustände

- Zentriert in der Content-Area
- Icon (muted) + Headline + Beschreibung + optionaler CTA-Button
- Kein "Keine Daten gefunden" ohne Kontext — immer erklären, was der User tun kann

---

## 10. Icons

- **Library:** Lucide React (`lucide-react`) — ist der shadcn/ui Standard
- **Größe:** `h-4 w-4` als Default, `h-5 w-5` für Navigation/Header
- **Farbe:** `currentColor` (erbt die Textfarbe)
- **Stroke-Width:** Default (2) — nicht anpassen

### Regeln

- Icons allein sind nie ausreichend — immer mit Text-Label _oder_ Tooltip
- Einzige Ausnahme: universell verstandene Icons (Close ✕, Search 🔍, Menu ☰)
- Icon-Buttons in Tabellen: immer mit `title`-Attribut

---

## 11. Responsive Design

### Breakpoints (Tailwind Standard)

- `sm:` — 640px (Mobil-Landscape)
- `md:` — 768px (Tablet)
- `lg:` — 1024px (Desktop)
- `xl:` — 1280px (Wide Desktop)

### Regeln

- **Mobile First:** Base-Styles sind für Mobile, erweitert via `sm:`, `md:`, `lg:`
- **Sidebar:** Ab `lg:` sichtbar, darunter als Sheet/Drawer
- **Tabellen:** Ab `md:` als Tabelle, darunter als Card-Stack
- **Formulare:** Single-Column auf Mobile, Two-Column ab `md:`

---

## 12. Animation & Transitions

- **Default-Transition:** `transition-colors duration-200` für Hover-States
- **Modale/Sheets:** shadcn/ui Default-Animationen (Fade + Scale/Slide)
- **Skeleton-Loading:** `animate-pulse` mit `bg-muted rounded-md`
- **Keine:** aufwändigen Page-Transitions, Parallax, oder Scroll-Animationen

### Regel

Animationen dienen der Usability (Feedback, Orientierung), nicht der Dekoration. Weniger ist mehr.

---

## 13. Accessibility

- **Kontrast:** Alle Text/Background-Kombinationen müssen WCAG 2.1 AA erfüllen (min. 4.5:1 für Text, 3:1 für große Text)
- **Focus:** Alle interaktiven Elemente haben einen sichtbaren Focus-Ring (`ring-ring ring-offset-2`)
- **Keyboard:** Alle Aktionen müssen per Keyboard erreichbar sein (Tab, Enter, Escape)
- **Screen Reader:** Dekorative Icons haben `aria-hidden="true"`, funktionale haben `aria-label`
- **Reduced Motion:** `motion-reduce:` Tailwind-Variants für Nutzer mit `prefers-reduced-motion`

---

## Zusammenfassung: Die Kurzregeln

1. Farben nur über CSS-Variablen / Tailwind-Klassen
2. Body-Text ist `text-sm` (14px)
3. Default-Radius ist `rounded-md` (6px)
4. Default-Shadow ist `shadow-sm`
5. Max. eine primäre Aktion pro sichtbarem Bereich
6. Destruktive Aktionen immer mit Confirmation
7. Icons nie allein — immer mit Label oder Tooltip
8. Mobile First — Sidebar ab `lg:`
9. Animationen dienen der Usability, nicht der Dekoration
10. WCAG 2.1 AA Kontrast ist Pflicht

> **Hinweis:** Dieser Guide wird aktualisiert, sobald die UI/UX-Gilde Design-Specs liefert. Bis dahin gilt er als verbindliche Arbeitsgrundlage.
