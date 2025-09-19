import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
	title: 'NeuroStack',
	description: 'Agentic Document Extractor'
}
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className="bg-background text-text antialiased">
				<div className="min-h-screen flex">
					<Sidebar />
					<div className="flex-1 flex flex-col">
						<TopNav />
						<main className="p-6">{children}</main>
					</div>
				</div>
			</body>
		</html>
	)
}
