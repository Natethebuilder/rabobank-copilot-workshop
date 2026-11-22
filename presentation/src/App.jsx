import { lazy, Suspense, useEffect } from 'react'
import { EVENT } from './content.js'
import { OSProvider, useHash } from './ui/ui.jsx'
import Home from './site/Home.jsx'
import Lab from './site/Lab.jsx'
import Cheatsheet from './site/Cheatsheet.jsx'

const Deck = lazy(() => import('./deck/DeckView.jsx'))
const Presenter = lazy(() => import('./deck/Presenter.jsx'))

const ROUTES = {
  deck: { title: 'Deck', el: <Deck /> },
  presenter: { title: 'Presenter', el: <Presenter /> },
  lab: { title: 'Participant guide', el: <Lab /> },
  cheatsheet: { title: 'Cheat sheet', el: <Cheatsheet /> },
}

export default function App() {
  const hash = useHash()
  const key = hash.replace(/^#\/?/, '').split(/[?/]/)[0]
  const route = ROUTES[key]

  useEffect(() => {
    document.title = route ? `${route.title} · ${EVENT.fullTitle}` : `${EVENT.fullTitle} · ${EVENT.cobrand}`
    document.documentElement.dataset.route = key || 'home'
    if (key !== 'deck') window.scrollTo(0, 0)
  }, [key, route])

  return (
    <OSProvider>
      <Suspense fallback={<div className="loading" aria-busy="true" />}>
        {route ? route.el : <Home />}
      </Suspense>
    </OSProvider>
  )
}
