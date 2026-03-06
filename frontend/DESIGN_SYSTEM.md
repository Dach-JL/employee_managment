# Workforce — Futuristic Design System

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--neon-blue` | `#4F7CFF` | Primary actions, active states |
| `--neon-purple` | `#7A5CFF` | Secondary accent, badges |
| `--accent-cyan` | `#00E5FF` | Highlights, links, glow |
| `--bg-main` | `#0B0F1A` | Page background |
| `--bg-secondary` | `#0F172A` | Sidebar, panels |
| `--bg-card` | `#111827` | Card backgrounds |
| `--glass-overlay` | `rgba(255,255,255,0.05)` | Glass layers |
| `--border-soft` | `rgba(255,255,255,0.1)` | Subtle borders |
| `--success` | `#22C55E` | Positive states |
| `--warning` | `#FACC15` | Warnings |
| `--danger` | `#EF4444` | Errors, destructive |
| `--info` | `#38BDF8` | Info badges |

## Gradient

```css
linear-gradient(135deg, #4F7CFF, #7A5CFF, #00E5FF)
```

## Typography

| Level | Size | Weight | Tracking |
|---|---|---|---|
| H1 | 2.5rem | 900 | tight |
| H2 | 1.75rem | 700 | tight |
| H3 | 1.25rem | 600 | normal |
| Body | 0.875rem | 400 | normal |
| Caption | 0.75rem | 500 | wide |

## Text Colors

| Token | Hex |
|---|---|
| `--text-primary` | `#E5E7EB` |
| `--text-secondary` | `#9CA3AF` |
| `--text-muted` | `#6B7280` |

## Glass Classes

- `.glass` — Standard glass panel
- `.glass-card` — Floating card with deeper blur
- `.glass-panel` — Side panels
- `.glow-blue` — Blue neon shadow
- `.glow-purple` — Purple neon shadow

## Dependencies

| Package | Purpose |
|---|---|
| `framer-motion` | Page transitions, micro-interactions |
| `lucide-react` | Icon system |
| `recharts` | Analytics charts |
| `cmdk` | Command palette (Ctrl+K) |
| `@radix-ui/react-dialog` | Modals, dialogs |
| `zustand` | State management |
| `socket.io-client` | Real-time features |
