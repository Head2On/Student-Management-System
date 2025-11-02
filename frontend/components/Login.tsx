
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { loginUser, AuthResponse } from '@/services/authService';
import { AxiosError } from 'axios';

// Define the error response type
interface ErrorResponse {
  detail?: string;
  username?: string;
  role?: string;
  access?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrId: '',
    password: '',
    role: 'admin',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log("LOGIN: Attempting to log in...");
      
      // 1. Call the login service
      const response: AuthResponse = await loginUser({
        username: formData.emailOrId,
        password: formData.password,
        role: formData.role,
      });
      console.log("LOGIN: API call successful!", response);

      localStorage.setItem('authToken', response.access);
      localStorage.setItem('user', JSON.stringify(response.user));
      // -------------------------

      setIsLoading(false);
      setIsSuccess(true);

      // 3. Redirect after success
      setTimeout(() => {
        console.log("LOGIN: Redirecting to /profile...");
        router.push('/profile'); 
      }, 1000);

    } catch (err: unknown) { // Using 'unknown' is correct, not 'any'
      console.error("LOGIN: API call failed.", err);
      setIsLoading(false);
      
      const axiosErr = err as AxiosError<ErrorResponse>;
      const detail = axiosErr.response?.data?.detail;
      setError(detail || (err instanceof Error ? err.message : "An unexpected error occurred."));
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ... the rest of your component's JSX is unchanged ...
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-linear-to-br bg-white">
       <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '50%', right: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '10%', left: '50%' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl border border-red-300 p-8">
           <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-domine text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-700 font-domine">Sign in to continue your journey</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-700 text-center font-domine p-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label htmlFor="emailOrId" className="block text-sm font-domine text-gray-800 mb-2">
                Email or ID
              </label>
              <input
                type="text"
                id="emailOrId"
                name="emailOrId"
                value={formData.emailOrId}
                onChange={handleChange}
                className="w-full px-4 py-3 font-domine border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email or ID"
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-domine text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
               className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label htmlFor="role" className="block text-sm font-domine text-gray-800 mb-2">
                Select Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="student" className="bg-gray-200">Student</option>
                <option value="teacher" className="bg-gray-200">Teacher</option>
                <option value="admin" className="bg-gray-200">Admin</option>
              </select>
            </motion.div>

            {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-domine">Remember Me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-domine transition-colors">
              Forgot Password?
            </a>
          </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading || isSuccess} 
                whileHover={{ scale: (isLoading || isSuccess) ? 1 : 1 }}
                whileTap={{ scale: (isLoading || isSuccess) ? 1 : 0.95 }}
                className={`w-full py-3 px-4 text-white font-domine rounded-lg shadow-lg transition-all duration-300
                  ${isSuccess ? 'bg-gray-800' : ''}
                  ${isLoading ? 'bg-gray-700' : ''}
                  ${!isLoading && !isSuccess ? 'bg-linear-to-r bg-black hover:shadow-xl' : ''}
                `}
              >
                {isSuccess ? 'Success!' : isLoading ? 'Signing In...' : 'Login'}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
