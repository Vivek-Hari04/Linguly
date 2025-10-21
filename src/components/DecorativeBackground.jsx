import { motion } from 'framer-motion';

export default function DecorativeBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full opacity-5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200 to-purple-300 rounded-full opacity-5 blur-3xl" />
    </div>
  );
}
