import { ImageResponse } from 'next/server'

// Dynamic favicon to avoid missing public/favicon.ico during development
export const size = {
	width: 32,
	height: 32,
}

export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					width: '100%',
					height: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					background: '#0F172A',
					color: '#06B6D4',
					fontSize: 20,
					fontWeight: 700,
					letterSpacing: -1,
					borderRadius: 6,
				}}
			>
				N
			</div>
		),
		{ ...size }
	)
}


