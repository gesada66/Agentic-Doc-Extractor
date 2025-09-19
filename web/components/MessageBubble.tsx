export default function MessageBubble({ role, content }: { role: 'user' | 'assistant', content: string }) {
	const isUser = role === 'user'
	return (
		<div className={`max-w-[80%] ${isUser ? 'ml-auto msg-slide-right' : 'msg-slide-left'}`}>
			<div className={`px-3 py-2 rounded-md ${isUser ? 'bg-accent text-black glow-accent' : 'bg-[color:#0F1511] text-text'}`}>
				{content}
			</div>
		</div>
	)
}
