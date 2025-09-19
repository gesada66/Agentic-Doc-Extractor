import MessageBubble from '../../components/MessageBubble'
import Composer from '../../components/Composer'
import SourcesPanel from '../../components/SourcesPanel'

export default function ChatPage() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
			<div className="lg:col-span-2 space-y-4">
				<div className="card space-y-3 h-[60vh] overflow-y-auto">
					<MessageBubble role="user" content="What is our claims policy?" />
					<MessageBubble role="assistant" content="Here is a summary with sources." />
				</div>
				<Composer />
			</div>
			<div>
				<SourcesPanel />
			</div>
		</div>
	)
}
