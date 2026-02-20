# Fintech USSD Loan Disbursement System 🏦

A professional **Node.js** backend that bridges **USSD menus** with **Safaricom M-PESA B2C** (Business to Customer) APIs. This system allows users to register, authenticate, and receive automated loan disbursements directly to their mobile wallets.

## 🚀 Key Features
- **Dynamic USSD Logic**: Multi-level menu state management for [Africa's Talking](https://africastalking.com) or similar USSD gateways.
- **Automated Disbursement**: Instant M-PESA B2C integration for loan processing.
- **Cloud Database**: Integrated with [Supabase](https://supabase.com) for real-time user management and loan ledger tracking.
- **Secure Auth**: Session-based login requiring ID numbers and encrypted passwords.
- **Sandbox Ready**: Configured for the [Safaricom Daraja Sandbox](https://developer.safaricom.co.ke) environment.

## 🛠️ Tech Stack
- **Runtime**: Node.js / Express.js
- **Database**: PostgreSQL (via Supabase)
- **APIs**: Safaricom Daraja (M-PESA), USSD Gateway
- **Tools**: Axios, Dotenv, Ngrok

## 📋 Prerequisites
1.  **Safaricom Developer Account**: Obtain your Consumer Key and Secret from the [Daraja Portal](https://developer.safaricom.co.ke).
2.  **Supabase Account**: Create a project and get your API URL and Service Role Key.
3.  **Ngrok**: Required to tunnel Safaricom's JSON callbacks to your localhost.

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com
   cd fintech-ussd-mpesa
   ```
**Database setup**
   ```bash
   -- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  id_number TEXT UNIQUE,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loans Table
CREATE TABLE users_loan_data (
  id SERIAL PRIMARY KEY,
  id_number TEXT,
  phone_no TEXT,
  loaned_amount INT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
 **Configure Environment Variables**
   ```bash
      PORT=3000
      VITE_SUPABASE_URL=your_supabase_url
      VITE_ANON_KEY=your_supabase_anon_key
      SAFARICOM_CONSUMER_KEY=your_daraja_consumer_key
      SAFARICOM_CONSUMER_SECRET=your_daraja_consumer_secret

