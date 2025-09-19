'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
	{ href: '/dashboard', label: 'Dashboard' },
	{ href: '/parse', label: 'Parse' },
	{ href: '/index', label: 'Index + Query / Chat' },
	{ href: '/chat', label: 'Chat' },
	{ href: '/documents', label: 'Documents' },
	{ href: '/settings', label: 'Settings' },
	{ href: '/classify', label: 'Classify' },
	{ href: '/extract', label: 'Extract' },
	{ href: '/connectors', label: 'Connectors' },
	{ href: '/figures', label: 'Figures Extraction' },
	{ href: '/usage', label: 'Usage & Limits' }
]

export default function Sidebar() {
	const pathname = usePathname()
	return (
		<aside className="hidden md:block w-72 bg-surface border-r border-border p-4">
			<div className="text-accent font-semibold text-xl mb-6">NeuroStack</div>
			<nav className="space-y-1">
				{nav.map((item) => {
					const active = pathname?.startsWith(item.href)
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`block px-3 py-2 rounded-md transition-colors ${
								active ? 'bg-accent/10 text-accent' : 'text-text/80 hover:bg-accent/5 hover:text-text'
							}`}
						>
							{item.label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
