import React, { useState } from "react";
import { 
  auth, 
  googleProvider, 
  signInAnonymously, 
  signInWithPopup 
} from "../firebase.config";
import { ShoppingBag, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.error("Guest Auth Error:", err);
      setError("Failed to start Guest session. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Failed to authenticate with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Decorative Background Glows */}
      <div className="bg-glow bg-glow-blue" />
      <div className="bg-glow bg-glow-indigo" />

      <div className="login-card">
        {/* Game Logo Header */}
        <div className="login-header">
          <div className="logo-badge">
            <ShoppingBag className="icon-main animate-pulse" />
            <TrendingUp className="icon-badge" />
          </div>
          <h1 className="game-title">
            Market <span className="gradient-text">Madness</span>
          </h1>
          <p className="game-subtitle">
            The Turn-Based Shop Management Challenge
          </p>
        </div>

        {/* Informative Features */}
        <div className="info-grid">
          <div className="info-card">
            <span className="info-emoji">💰</span>
            <div>
              <h3>Retail Math</h3>
              <p>Master price elasticity and balance wholesale costs against customer willingness to pay.</p>
            </div>
          </div>
          <div className="info-card">
            <span className="info-emoji">📈</span>
            <div>
              <h3>Shop Expansion</h3>
              <p>Progress from a humble Market Stall to premium retail tiers, managing overheads and rent.</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <AlertCircle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Actions */}
        <div className="auth-actions">
          <button 
            onClick={handleGuestLogin} 
            disabled={loading}
            className="btn btn-guest"
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>Quick Play (Guest Login)</span>
                <Sparkles className="btn-icon" />
              </>
            )}
          </button>

          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="btn btn-google"
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <svg className="google-svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.478 0-6.3-2.823-6.3-6.3s2.822-6.3 6.3-6.3c1.706 0 3.2.68 4.29 1.786l3.056-3.056C19.262 2.68 15.987 1.5 12.24 1.5 6.364 1.5 1.5 6.364 1.5 12.24S6.364 22.98 12.24 22.98c5.88 0 10.74-4.242 10.74-10.74 0-.677-.075-1.348-.195-1.955H12.24Z"/>
                </svg>
                <span>Sign In with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>Phase 1 Educational Sandbox • Secure Encrypted Saves</p>
        </div>
      </div>
    </div>
  );
}
