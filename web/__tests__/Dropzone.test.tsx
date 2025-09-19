import { render, screen } from '@testing-library/react'
import Dropzone from '../components/Dropzone'

describe('Dropzone', () => {
	it('renders upload label', () => {
		render(<Dropzone />)
		expect(screen.getByText('Upload')).toBeInTheDocument()
	})
})
