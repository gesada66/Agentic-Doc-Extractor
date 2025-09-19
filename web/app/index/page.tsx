import IndexBuilderForm from '../../components/IndexBuilderForm'
import IndexConsole from '../../components/IndexConsole'

export default function IndexPage() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
			<div className="lg:col-span-1">
				<IndexBuilderForm />
			</div>
			<div className="lg:col-span-2">
				<IndexConsole />
			</div>
		</div>
	)
}
