import RulesBuilder from '../../components/RulesBuilder'

export default function ClassifyPage() {
	return (
		<div className="space-y-6">
			<div className="card">
				<h1 className="text-2xl font-bold text-text mb-2">Document Classification</h1>
				<p className="text-text/70">Automatically classify documents using custom rules and AI-powered analysis.</p>
			</div>
			<RulesBuilder />
		</div>
	)
}
