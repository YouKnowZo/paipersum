# PaiperSum - Legal Document Analyzer

PaiperSum is an AI-powered legal document analysis platform that provides plain-English risk assessments of contracts, terms of service, and other legal agreements.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Python 3.10+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd paipersum
   npm install
   ```

2. **Start the database and services**
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d db redis minio
   
   # Or start services manually
   # PostgreSQL on port 5432
   # Redis on port 6379  
   # MinIO on port 9000
   ```

3. **Set up the API**
   ```bash
   cd apps/api
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   
   # Run database migrations
   alembic upgrade head
   
   # Start the API server
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Start the web application**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

5. **Build the browser extension** (optional)
   ```bash
   cd apps/extension
   npm install
   npm run build
   # Load the 'dist' folder as an unpacked extension in Chrome
   ```

### Production Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Manual deployment**
   - Set up PostgreSQL, Redis, and MinIO/S3
   - Configure environment variables
   - Deploy API and web applications
   - Set up reverse proxy (nginx)

## 📁 Project Structure

```
paipersum/
├── apps/
│   ├── web/                 # React frontend
│   ├── api/                 # FastAPI backend
│   └── extension/           # Browser extension
├── packages/                # Shared packages
├── docs/                    # Documentation
├── docker-compose.yml       # Development environment
└── package.json            # Monorepo configuration
```

## 🔧 Configuration

### Environment Variables

Create `.env.api` file in the root directory:

```env
# Database
DATABASE_URL=postgresql+psycopg://ps:ps@localhost:5432/paipersum

# Redis
REDIS_URL=redis://localhost:6379

# Storage (MinIO/S3)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio12345
S3_BUCKET=paipersum

# Security
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGINS=*

# Optional
SENTRY_DSN=your-sentry-dsn
STRIPE_SECRET=your-stripe-secret
```

### API Endpoints

- `POST /analyze` - Analyze text
- `POST /analyze-file` - Analyze uploaded file
- `GET /documents` - List user documents
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /health` - Health check

## 🛡️ Security Features

- JWT-based authentication
- Rate limiting (100 requests/minute)
- Input validation and sanitization
- Security headers (CSP, HSTS, etc.)
- File type and size validation
- SQL injection protection
- XSS protection

## 📊 Legal Compliance

- **Not Legal Advice**: All analysis is for informational purposes only
- **Data Privacy**: Documents are processed securely and not stored permanently
- **GDPR Compliant**: User data can be exported and deleted
- **SOC 2 Ready**: Infrastructure follows security best practices

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:web
npm run test:api
npm run test:e2e
```

## 📈 Monitoring

- Health checks on all services
- Structured logging with request IDs
- Error tracking with Sentry
- Performance metrics
- Audit logs for compliance

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement changes
   - Add tests
   - Update documentation

2. **Code Quality**
   - ESLint for JavaScript/TypeScript
   - Prettier for code formatting
   - Pre-commit hooks for validation

3. **Deployment**
   - Automated testing on PR
   - Staging deployment
   - Production deployment with approval

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

PaiperSum provides AI-powered analysis for informational purposes only. It does not constitute legal advice, and users should consult with qualified attorneys for legal decisions. PaiperSum is not a law firm and does not provide legal services.

## 🆘 Support

- Documentation: [docs.paipersum.com](https://docs.paipersum.com)
- Issues: [GitHub Issues](https://github.com/your-org/paipersum/issues)
- Email: support@paipersum.com