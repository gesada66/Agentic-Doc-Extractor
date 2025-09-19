export default function GalleryItem({ id, name, pages }: { id: string, name: string, pages: number }) {
	return (
		<div className="card">
			<div className="h-32 bg-[color:#0F1511] rounded mb-2" />
			<div className="font-medium text-sm">{name}</div>
			<div className="text-xs text-[#cfe9df]">{pages} pages</div>
		</div>
	)
}
