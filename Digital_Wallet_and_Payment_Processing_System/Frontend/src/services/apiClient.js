import axios from 'axios';

// Base API configuration derived from env or default local server
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for session token stored in memory/sessionStorage
export const getStoredToken = () => sessionStorage.getItem('wallet_token') || localStorage.getItem('wallet_token') || '';
export const setStoredToken = (token, remember = false) => {
  if (remember) {
    localStorage.setItem('wallet_token', token);
  } else {
    sessionStorage.setItem('wallet_token', token);
  }
};
export const removeStoredToken = () => {
  sessionStorage.removeItem('wallet_token');
  localStorage.removeItem('wallet_token');
};

// Interceptor to inject JWT bearer token
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global status code errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({ message: 'Network error. Please check your internet connection.' });
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    // Handle 401 Unauthorized globally
    if (status === 401) {
      removeStoredToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }

    // Map status code to standard plain-language fintech error messages
    let formattedMessage = serverMessage || 'An unexpected error occurred.';
    if (status === 402) {
      formattedMessage = serverMessage || 'Insufficient wallet balance.';
    } else if (status === 409) {
      formattedMessage = serverMessage || 'Conflict error: Transaction PIN is already configured.';
    } else if (status === 400 && !serverMessage) {
      formattedMessage = 'Invalid request payload or formatting.';
    } else if (status === 500 && !serverMessage) {
      formattedMessage = 'Internal server error. Please try again later.';
    }

    return Promise.reject({
      status,
      message: formattedMessage,
      data: error.response.data,
    });
  }
);

/* ==========================================================================
   API METHODS WITH DOCUMENTATION & TODO COMMENTS
   ========================================================================== */

// 1. Register User - POST /auth/register
// TODO: confirm exact field names against live API docs
export const registerUser = async (data) => {
  // Payload shape: { name, email, phone, password }
  const res = await apiClient.post('/auth/register', data);
  return res.data;
};

// 2. Login - POST /auth/login
// TODO: confirm exact field names against live API docs
export const loginUser = async (credentials) => {
  // Payload shape: { email, password } -> returns { status, message, token }
  const res = await apiClient.post('/auth/login', credentials);
  return res.data;
};

// 3. User Profile - GET /wallet/profile
// TODO: confirm exact field names against live API docs
export const getUserProfile = async () => {
  const res = await apiClient.get('/wallet/profile');
  return res.data;
};

// 4. Deposit Funds - POST /wallet/deposit
// TODO: confirm exact field names against live API docs
export const depositFunds = async (payload) => {
  // Payload shape: { amount } -> returns { transaction, paystackService, authorizationUrl }
  const res = await apiClient.post('/wallet/deposit', payload);
  return res.data;
};

// 5. Verify Deposit Status - GET /wallet/deposit/verify
// TODO: confirm exact field names against live API docs
export const verifyDepositStatus = async (reference) => {
  const res = await apiClient.get(`/wallet/deposit/verify?reference=${reference}`);
  return res.data;
};

// 6. Transfer Funds (Wallet-to-Wallet) - POST /wallet/transfer-wallet
// TODO: confirm exact field names against live API docs
export const transferWalletToWallet = async (payload) => {
  // Payload shape: { fromWalletNumber, toWalletNumber, amount, pin }
  const res = await apiClient.post('/wallet/transfer-wallet', payload);
  return res.data;
};

// 6b. Bank Withdrawal - POST /wallet/transfer
// TODO: confirm exact field names against live API docs
export const withdrawToBank = async (payload) => {
  // Payload shape: { amount, bankAccount, bankName, pin }
  const res = await apiClient.post('/wallet/transfer', payload);
  return res.data;
};

// 7. Verify Transfer Status - GET /wallet/transfer/verify/:reference or /wallet/transfer-wallet/verify
// TODO: confirm exact field names against live API docs
export const verifyTransferStatus = async (reference, type = 'bank') => {
  if (type === 'wallet') {
    const res = await apiClient.get(`/wallet/transfer-wallet/verify?reference=${reference}`);
    return res.data;
  }
  const res = await apiClient.get(`/wallet/transfer/verify/${reference}`);
  return res.data;
};

// 8. Transaction History - GET /wallet/transactions
// TODO: confirm exact field names against live API docs
export const getTransactionHistory = async () => {
  const res = await apiClient.get('/wallet/transactions');
  return res.data;
};

// 9. Change Password - POST /wallet/change-password
// TODO: confirm exact field names against live API docs
export const changePassword = async (payload) => {
  // Payload shape: { oldPassword, newPassword, confirmPassword }
  const res = await apiClient.post('/wallet/change-password', payload);
  return res.data;
};

// 10. Set Transaction PIN - POST /auth/set-pin
// TODO: confirm exact field names against live API docs
export const setTransactionPin = async (payload) => {
  // Payload shape: { pin }
  const res = await apiClient.post('/auth/set-pin', payload);
  return res.data;
};

// 11. Change Transaction PIN - POST /auth/change-pin
// TODO: confirm exact field names against live API docs
export const changeTransactionPin = async (payload) => {
  // Payload shape: { oldPin, newPin, confirmPin }
  const res = await apiClient.post('/auth/change-pin', payload);
  return res.data;
};

export default apiClient;
