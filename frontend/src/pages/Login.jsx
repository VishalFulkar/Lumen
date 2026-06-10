import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import bg from "../assets/bg3.jpg"
import icon from "../assets/icon.svg"
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    // Clear error on mount
    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#070709] flex items-center justify-center p-4 md:p-8 font-sans overflow-y-auto">
            {/* Split container */}
            <div className="w-full max-w-5xl bg-[#0e0e12]/80 border border-zinc-800/80 rounded-[32px] overflow-hidden grid grid-cols-1 md:grid-cols-2 p-3 gap-8 min-h-[600px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl relative z-10">
                
                {/* Left Side: Brand Panel */}
                <div className="hidden md:flex flex-col justify-between p-10 rounded-[24px] relative overflow-hidden border border-zinc-800/30  min-h-[500px]" style={{ background: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 relative z-10">
                        <div className="w-9 h-9 rounded-xl  flex items-center justify-center">
                            <img className="w-12 h-12" src={icon} alt="" />
                        </div>
                        <span className="text-2xl font-bold font-logo bg-linear-to-r from-blue-400 via-cyan-200 to-gray-300 bg-clip-text text-transparent">Lumen</span>
                    </div>

                    {/* Copywriting */}
                    <div className="relative z-10">
                        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight font-display">
                            Search Deeper.<br />
                            Synthesize Faster.<br />
                            Discover Smarter.
                        </h2>
                        <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
                            An AI-powered research co-pilot that orchestrates deep web analysis and writes publication-ready reports in seconds.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form Panel */}
                <div className="flex flex-col justify-center px-4 py-8 md:p-10">
                    <div className="w-full max-w-md mx-auto">
                        <div className="text-center md:text-left mb-8">
                            <h3 className="text-3xl font-bold text-white tracking-tight">Sign In To Account</h3>
                            <p className="text-zinc-400 text-sm mt-2">Enter credentials to access your research workspace</p>
                        </div>

                        {/* Sign-in Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#141418] text-white border border-zinc-800 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none text-sm placeholder-zinc-600"
                                    placeholder="Enter email address"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-4 pr-10 py-3 bg-[#141418] text-white border border-zinc-800 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none text-sm placeholder-zinc-600"
                                        placeholder="••••••••••••••••"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-red-400 text-xs text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-xs text-zinc-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold underline transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
