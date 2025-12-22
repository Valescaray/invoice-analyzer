import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Right side - Gradient/Branding */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 p-12">
        <div className="text-white space-y-6 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold">Invoice Analyzer</h1>
          </div>
          
          <p className="text-xl font-medium text-white/90">
            Automate your invoice processing with AI-powered extraction
          </p>
          
          <ul className="space-y-3 text-white/80">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span>Extract data from PDFs and images instantly</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span>Organize and search your invoices effortlessly</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span>Get insights with powerful analytics</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
