import React, { useState } from 'react';
import axios from 'axios';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

 const RegistrationForm = ({ onOpenLogin, onCloseRegistration }) =>  {
  // State for form data and error messages
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '08063247818',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle changes in form fields
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous error messages
    setError(null);
    setSuccess(null);

    try {
      // Make a POST request to your backend for registration
      const response = await axios.post('http://localhost:8080/auth/register', formData);

      if (response.status === 201) {
        setSuccess('Registration successful! You can now login.');
        // Optionally, you can redirect to login page or automatically log in the user
        onCloseRegistration();
        onOpenLogin();
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred during registration. Please try again.');
    }
  };
  
    const handleLoginClick = (event) => {
        event.preventDefault();
        console.log("reg button clicked");
        onCloseRegistration();
        onOpenLogin();
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Create Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select 
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            >
                <option value="buyer">Buyer/Renter</option>
                <option value="agent">Agent</option>
                <option value="owner">Owner</option>
            </select>
          </div>  
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
            </label>
            <div className="relative">
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                />
                <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
                >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
        </div>
        </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
                />
                 <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
                >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>  
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
            >
              Sign up
            </button>
          </div>
        </form>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <div className="flex items-center justify-between">
          <span className="border-t border-gray-300 w-1/3" />
          <span className="text-sm text-gray-500">Or sign up with</span>
          <span className="border-t border-gray-300 w-1/3" />
        </div>
        <div>
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 1.9a6.09 6.09 0 016.09 6.09 6.09 6.09 0 01-6.09 6.09 6.09 6.09 0 01-6.09-6.09A6.09 6.09 0 0112 5.9zm0 1.2A4.89 4.89 0 007.11 12 4.89 4.89 0 0012 16.89 4.89 4.89 0 0016.89 12 4.89 4.89 0 0012 7.1zm0 1.2a3.69 3.69 0 013.69 3.69 3.69 3.69 0 01-3.69 3.69 3.69 3.69 0 01-3.69-3.69A3.69 3.69 0 0112 8.3z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>
        <div className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a
            href="#"
            className="font-medium text-primary-500 hover:text-primary-400"
            onClick={handleLoginClick}
          >
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
