
import React from 'react';

const Submit: React.FC = () => {
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<div className="px-4 pt-8 pb-2">
				<h1 className="text-3xl font-semibold text-gray-800">Submissions</h1>
				<p className="text-gray-700 text-base mt-1">
					Submit your data to CMCINTEL, the world's largest chemical database, for global Open Access.
				</p>
			</div>
			<div className="flex-1 flex items-center justify-center">
				<div className="bg-blue-50 rounded w-full max-w-6xl flex flex-col md:flex-row items-center p-8 md:p-12 shadow">
					{/* Left: Login Form */}
					<div className="flex-1 flex flex-col items-start justify-center max-w-md w-full">
						<h2 className="text-xl font-light text-gray-700 mb-6">Please login to start your submission</h2>
						<form className="w-full">
							<label className="block text-gray-600 text-sm mb-1" htmlFor="username">Username</label>
							<input id="username" type="text" className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
							<label className="block text-gray-600 text-sm mb-1" htmlFor="password">Password</label>
							<input id="password" type="password" className="mb-6 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
							<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded mb-2">Login</button>
						</form>
						<div className="flex w-full justify-between text-xs text-blue-700 mt-1 mb-4">
							<a href="#" className="hover:underline">Forgot Password?</a>
							<a href="#" className="hover:underline">Create an Account</a>
						</div>
						<div className="flex items-center mt-2">
							<input type="checkbox" id="userguide" className="mr-2" />
							<label htmlFor="userguide" className="text-xs text-gray-700">User Guide</label>
						</div>
					</div>
					{/* Right: Illustration */}
					<div className="flex-1 flex items-center justify-center w-full mt-8 md:mt-0">
						{/* Placeholder SVG illustration */}
						<svg width="260" height="180" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="30" y="30" width="120" height="120" rx="8" fill="#e5eaf5" />
							<rect x="60" y="60" width="90" height="15" rx="3" fill="#b0b8c9" />
							<rect x="60" y="85" width="70" height="15" rx="3" fill="#b0b8c9" />
							<rect x="60" y="110" width="50" height="15" rx="3" fill="#b0b8c9" />
							<circle cx="180" cy="90" r="50" fill="#e5eaf5" />
							<g>
								<ellipse cx="180" cy="110" rx="28" ry="28" fill="#b0b8c9" />
								<path d="M180 90 v28" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
								<ellipse cx="180" cy="120" rx="10" ry="5" fill="#fff" />
							</g>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Submit;
