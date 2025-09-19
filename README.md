# NeuroStack - Agentic Document Extractor

> A Next.js-based document processing platform with AI-powered extraction, indexing, and querying capabilities.

## 🎨 Theme & Design

**Current Theme**: Neon Slate + Glow Pulse
- **Background**: `#0F172A` (slate black)
- **Surface**: `#1E293B` (muted steel)
- **Accent**: `#06B6D4` (neon cyan)
- **Secondary Accent**: `#8B5CF6` (violet)
- **Text**: `#F1F5F9`
- **Tone**: Futuristic startup vibe

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional)

### Installation
```bash
cd web
npm install
```

### Development
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### Testing
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📁 Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # KPI dashboard
│   ├── parse/            # Document parsing interface
│   ├── index/            # Index management
│   ├── chat/             # Query interface
│   ├── documents/        # Document gallery
│   └── settings/         # Configuration
├── components/            # Reusable UI components
├── lib/                  # Business logic
├── styles/               # Global CSS and themes
├── tests/                # Test suites
│   ├── e2e/             # Playwright E2E tests
│   └── fixtures/        # Test data
└── agents/               # Agent coordination
```

## 🧪 Testing Strategy

### Unit Tests
- **Framework**: Jest + React Testing Library
- **Coverage**: Components and utilities
- **Command**: `npm test`

### E2E Tests
- **Framework**: Playwright
- **Coverage**: User flows, visual regression
- **Command**: `npm run test:e2e`
- **Visual Testing**: Screenshot comparisons for theme changes

### Key Testing Practices
- ✅ Always run E2E tests for visual changes
- ✅ Use `--headed` flag for debugging
- ✅ Update snapshots with `--update-snapshots`
- ✅ Verify actual appearance, not just DOM classes

## 🎯 Features

### MVP (Phase 1)
- [x] **Dashboard**: KPI cards, charts, recent documents
- [x] **Parse**: File upload, parsing options, previews
- [x] **Index + Query**: Index building, chat interface
- [x] **Documents**: Gallery view, metadata, previews
- [x] **Settings**: Configuration management
- [x] **Theme System**: Neon Slate theme with animations

### Phase 2 (Future)
- [ ] **Classify**: Document classification rules
- [ ] **Extract**: Schema-based data extraction
- [ ] **Connectors**: External service integrations
- [ ] **Figures**: Image and table extraction
- [ ] **Usage & Limits**: Monitoring and quotas

## 🔧 Configuration

### Environment Variables
Copy `env.example.txt` to `.env` and configure:
```bash
OPENAI_API_KEY=your_key_here
OPENAI_DEFAULT_MODEL=gpt-4o
MAX_UPLOAD_MB=50
DATABASE_URL=sqlite://./dev.db
```

### Theme Customization
Themes are defined in `styles/globals.css`:
- CSS variables for colors
- Animation keyframes
- Utility classes

## 🐳 Docker Support

```bash
# Build image
docker build -t neurostack .

# Run container
docker run -p 3000:3000 neurostack
```

## 📊 Development Status

### ✅ Completed
- Next.js App Router setup
- Neon Slate theme implementation
- Component library (shadcn/ui)
- E2E testing with Playwright
- API stubs and mock data
- Docker configuration
- CI/CD pipeline setup

### 🔄 In Progress
- Agent coordination system
- Real API integrations
- Advanced testing scenarios

### 📋 Next Steps
- Implement Phase 2 features
- Add real document processing
- Performance optimization
- Production deployment

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Testing**: Jest, Playwright, React Testing Library
- **Backend**: Next.js API routes, SQLite
- **DevOps**: Docker, GitHub Actions
- **AI**: OpenAI API integration

## 📝 Development Notes

### Theme Implementation
- Single theme system (Neon Slate only)
- CSS variables for dynamic theming
- Animation support with keyframes
- E2E visual regression testing

### Testing Philosophy
- Visual changes require E2E verification
- Screenshot comparisons for theme validation
- Comprehensive test coverage
- Automated CI/CD testing

## 🤝 Contributing

1. Follow the testing practices outlined above
2. Use E2E tests for visual changes
3. Update documentation for new features
4. Maintain theme consistency

## 📄 License

MIT License - see LICENSE file for details
