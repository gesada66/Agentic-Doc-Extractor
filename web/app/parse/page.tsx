import Dropzone from '../../components/Dropzone'
import FileList from '../../components/FileList'
import ParseOptionsForm from '../../components/ParseOptionsForm'
import ResultPreview from '../../components/ResultPreview'

export default function ParsePage() {
	return (
		<div className="space-y-6">
			<Dropzone />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 space-y-4">
					<FileList />
				</div>
				<div>
					<ParseOptionsForm />
				</div>
			</div>
			<ResultPreview />
		</div>
	)
}
