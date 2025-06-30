# 🏫 LMS Fee Payment System with M-Pesa Integration

A modern Next.js and Express.js application for managing school fee payments via M-Pesa.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18+-green.svg)
![PNPM](https://img.shields.io/badge/pnpm-v8+-orange.svg)

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [Environment Setup](#-environment-setup)
- [M-Pesa Integration](#-m-pesa-integration)
- [API Documentation](#-api-documentation)
- [Database Setup](#-database-setup)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Development Guidelines](#-development-guidelines)
- [Support](#-support)

## 🚀 Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- ngrok (for M-Pesa callback URL)
- MySQL (v8.0 or higher)
- Make (for using Makefile commands)

## ⚡ Quick Start

Using Makefile commands:
```bash
# Install all dependencies
make install

# Set up environment files
make setup-env

# Start development servers
make dev

# Run tests
make test

# Build for production
make build

# Start production servers
make start
```

## 🔧 Detailed Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/LMS-fee-payment-react-mpesa.git
   cd LMS-fee-payment-react-mpesa
   ```

2. **Install Dependencies**
   ```bash
   # Using make
   make install

   # Manual installation
   pnpm install
   cd frontend && pnpm install
   cd ../backend && pnpm install
   ```

## 🔐 Environment Setup

1. **Create Environment Files**
   ```bash
   # Using make
   make setup-env

   # Manual setup
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

2. **Configure Environment Variables**

   Frontend (.env.local):
   ```env
   NEXT_PUBLIC_MPESA_CONSUMER_KEY=your_consumer_key_here
   NEXT_PUBLIC_MPESA_CONSUMER_SECRET=your_consumer_secret_here
   NEXT_PUBLIC_MPESA_BUSINESS_SHORT_CODE=174379
   NEXT_PUBLIC_MPESA_PASSKEY=your_passkey_here
   NEXT_PUBLIC_MPESA_CALLBACK_URL=http://your-domain/api/mpesa/callback
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_BASE_URL=http://localhost:3003
   ```

   Backend (.env):
   ```env
   PORT=3001
   MPESA_CONSUMER_KEY=your_consumer_key_here
   MPESA_CONSUMER_SECRET=your_consumer_secret_here
   MPESA_BUSINESS_SHORT_CODE=174379
   MPESA_PASSKEY=your_passkey_here
   MPESA_CALLBACK_URL=http://your-domain/api/mpesa/callback
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=lms_payments
   ```

## 💳 M-Pesa Integration

1. **Setup ngrok**
   ```bash
   # Using make
   make ngrok

   # Manual setup
   npm install -g ngrok
   ngrok http 3001
   ```

2. **Configure M-Pesa Credentials**
   - Get credentials from [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
   - Update environment files with your credentials
   - Test integration using sandbox environment

## 📚 API Documentation

### Payment Endpoints

```typescript
POST /api/payments/initiate
POST /api/mpesa/callback
GET /api/payments/status/:id
GET /api/payments/history
```

### User Endpoints

```typescript
POST /api/auth/login
POST /api/auth/register
GET /api/users/profile
PUT /api/users/update
```

Complete API documentation available at `/api/docs` when running the server.

## 🗄️ Database Setup

1. **Create Database**
   ```bash
   # Using make
   make setup-db

   # Manual setup
   mysql -u root -p
   CREATE DATABASE lms_payments;
   ```

2. **Run Migrations**
   ```bash
   # Using make
   make migrate

   # Manual setup
   cd backend
   pnpm migrate
   ```

3. **Seed Data (Optional)**
   ```bash
   # Using make
   make seed

   # Manual setup
   cd backend
   pnpm seed
   ```

## 🧪 Testing

```bash
# Run all tests
make test

# Run specific test suites
make test-frontend
make test-backend
make test-e2e

# Generate coverage report
make coverage
```

## 🚀 Deployment

1. **Build Application**
   ```bash
   # Using make
   make build

   # Manual build
   cd frontend && pnpm build
   cd ../backend && pnpm build
   ```

2. **Production Start**
   ```bash
   # Using make
   make start

   # Manual start
   cd frontend && pnpm start
   cd ../backend && pnpm start
   ```

## 🔍 Troubleshooting

1. **Port Conflicts**
   ```bash
   # Check ports
   make check-ports

   # Kill processes on ports
   make kill-ports
   ```

2. **M-Pesa Callback Issues**
   - Ensure ngrok is running (`make ngrok`)
   - Verify callback URLs in .env files
   - Check ngrok tunnel status

3. **Dependencies Issues**
   ```bash
   # Clean and reinstall
   make clean
   make install
   ```

## 👨‍💻 Development Guidelines

1. **Branch Structure**
   - `main`: Production code
   - `develop`: Development integration
   - `feature/*`: Feature branches
   - `docs`: Documentation updates

2. **Code Quality**
   ```bash
   # Run linting
   make lint

   # Run formatting
   make format
   ```

3. **Commit Guidelines**
   - Use conventional commits
   - Include issue references
   - Keep commits atomic

## 🤝 Support

- Create an issue for bug reports
- Join our [Discord Community](your-discord-link)
- Email support: support@example.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Safaricom for M-Pesa API
- Next.js team
- Express.js community 