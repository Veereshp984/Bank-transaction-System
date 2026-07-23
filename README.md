# Secure Bank Transaction System

A secure and robust bank transaction system built with Node.js, Express.js, and MongoDB. This application provides comprehensive banking features including user authentication, account management, deposits, withdrawals, fund transfers, and detailed transaction history with RESTful APIs.

## Features

✨ **Core Banking Features:**
- 🔐 Secure user authentication with JWT tokens
- 💳 Account balance management
- 💰 Deposits and withdrawals
- 🔄 Fund transfers between accounts
- 📋 Complete transaction history tracking
- 🛡️ Secure data handling and encryption

🔧 **Technical Features:**
- RESTful API architecture
- JWT-based authentication
- MongoDB database integration
- Input validation and error handling
- Request logging and monitoring

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Language:** JavaScript

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Veereshp984/Bank-transaction-System.git
cd Bank-transaction-System
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file** in the root directory and add the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bank-system
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **Start the application:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## Project Structure

```
Bank-transaction-System/
├── models/              # Database schemas
├── routes/              # API routes
├── controllers/         # Business logic
├── middleware/          # Authentication & validation
├── config/              # Configuration files
├── .env                 # Environment variables
├── server.js            # Entry point
└── package.json         # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Account Management
- `GET /api/account/balance` - Get account balance
- `GET /api/account/details` - Get account details

### Transactions
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer funds to another account
- `GET /api/transactions/history` - Get transaction history
- `GET /api/transactions/:id` - Get transaction details

## Security Features

🔒 **Security Measures Implemented:**
- JWT token-based authentication
- Password encryption and hashing
- Input validation and sanitization
- Protected API endpoints
- Secure error handling
- MongoDB injection prevention

## Usage Example

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

### Check Balance
```bash
curl -X GET http://localhost:5000/api/account/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Make a Deposit
```bash
curl -X POST http://localhost:5000/api/transactions/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000
  }'
```

## Development

### Run in Development Mode
```bash
npm run dev
```

### Run Tests (if available)
```bash
npm test
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token generation |
| `NODE_ENV` | Environment (development/production) |

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Recommendations

🔐 **For Production Deployment:**
- Use environment variables for all sensitive data
- Enable HTTPS/SSL encryption
- Implement rate limiting
- Add two-factor authentication (2FA)
- Regular security audits
- Use strong JWT secrets
- Implement CORS properly
- Enable MongoDB authentication
- Keep dependencies updated

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or check your MONGODB_URI
- Verify database credentials if using cloud MongoDB

**JWT Token Errors:**
- Check if token is expired
- Ensure JWT_SECRET is set correctly in .env
- Verify token format in Authorization header

**Port Already in Use:**
- Change PORT in .env file
- Or kill the process using the port

## Performance Considerations

- Implement database indexing for frequently queried fields
- Use caching for balance queries
- Implement pagination for transaction history
- Monitor database performance

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the maintainer.

## Author

**Veereshp984**
- GitHub: [@Veereshp984](https://github.com/Veereshp984)

## Acknowledgments

- Built with Node.js and Express.js
- MongoDB for data persistence
- JWT for secure authentication
- Community best practices and security standards

---

**Note:** This is a demonstration project. Ensure proper security measures are implemented before deploying to production.
