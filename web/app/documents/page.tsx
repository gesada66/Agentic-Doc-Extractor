import GalleryItem from '../../components/GalleryItem'
import PreviewDrawer from '../../components/PreviewDrawer'

export default function DocumentsPage() {
	const items = [
		{ id: '1', name: 'Policy Handbook.pdf', pages: 24 },
		{ id: '2', name: 'Claim_2024_07.pdf', pages: 6 },
		{ id: '3', name: 'Scanned_Form.pdf', pages: 3 }
	]
	return (
		<div className="space-y-4">
			<div className="card flex gap-3 items-center">
				<input className="bg-transparent border border-[color:#233028] rounded px-2 py-1" placeholder="Filter by name..." />
				<select className="bg-[color:#0F1511] border border-[color:#233028] rounded px-2 py-1">
					<option>All</option>
					<option>Parsed</option>
					<option>Indexed</option>
				</select>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{items.map((it) => (
					<GalleryItem key={it.id} {...it} />
				))}
			</div>
			<PreviewDrawer />
		</div>
	)
}
