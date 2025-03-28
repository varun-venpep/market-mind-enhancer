
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-brand-400/10 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 20, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-brand-500/10 blur-3xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -30, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-[40%] right-[25%] w-72 h-72 rounded-full bg-brand-300/10 blur-3xl"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -20, 0] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 22,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="fixed top-0 left-0 w-full z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">MarketMind</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/pricing" 
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                to={window.location.pathname === "/login" ? "/signup" : "/login"}
                className="text-sm font-medium px-4 py-2 border border-brand-500 text-brand-600 rounded-md hover:bg-brand-50 transition-colors"
              >
                {window.location.pathname === "/login" ? "Sign Up" : "Sign In"}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div 
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Storytelling section */}
          <div className="mb-8 text-center">
            <motion.h2 
              className="text-2xl font-bold mb-3 gradient-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Unlock Your Content's Full Potential
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              In just a few clicks, transform your content strategy and climb to the top of search rankings.
            </motion.p>
            <motion.div
              className="flex justify-center space-x-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    step === 1 ? "bg-brand-500" : 
                    step === 2 ? "bg-brand-600" : 
                    "bg-brand-700"
                  }`}>
                    {step}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {step === 1 ? "Sign Up" : step === 2 ? "Analyze" : "Rank Higher"}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Auth form */}
          {children}
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} MarketMind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
