type AgentName = 'UIAgent' | 'APIAgent' | 'ParseAgent' | 'IndexAgent' | 'ChatAgent' | 'InfraAgent'

const defaultModel = process.env.OPENAI_DEFAULT_MODEL || 'gpt-5-mini'
const modelOverrides: Record<AgentName, string | undefined> = {
	UIAgent: process.env.NEUROSTACK_MODEL_UI,
	APIAgent: process.env.NEUROSTACK_MODEL_API,
	ParseAgent: process.env.NEUROSTACK_MODEL_PARSE,
	IndexAgent: process.env.NEUROSTACK_MODEL_INDEX,
	ChatAgent: process.env.NEUROSTACK_MODEL_CHAT,
	InfraAgent: process.env.NEUROSTACK_MODEL_INFRA,
}

export function getModelForAgent(agent: AgentName): string {
	return modelOverrides[agent] || defaultModel
}

export function main() {
	(Object.keys(modelOverrides) as AgentName[]).forEach((a) => {
		console.log(`${a} -> ${getModelForAgent(a)}`)
	})
}

// Optional manual run via env flag to avoid CJS-specific require checks in ESM
if (process.env.RUN_AGENTS_COORDINATOR === 'true') {
	main()
}
