"use client";

import { useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function Homepage() {
  // Refs for scroll-triggered animations
  const featureRefs = [useRef(null), useRef(null), useRef(null)];

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector('.hero-section');
      if (hero) {
        hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      {/* Hero section with advanced overlay gradient */}
      <div 
        className="hero-section relative min-h-screen bg-[url('/landing-bg.jpg')] bg-cover bg-fixed overflow-hidden"
      >
        {/* Gradient overlay with improved colors and opacity */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-blue-900/30 backdrop-blur-sm"></div>
        
        {/* Content container */}
        <div className="relative z-10">
          {/* Hero content */}
          <div className="container mx-auto px-4 pt-32 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto text-center"
            >
              {/* Logo mark (decorative element above title) */}
              <div className="mb-6 inline-flex">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-green-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Improved title with multi-layer text effect */}
              <h1 className="relative text-6xl md:text-8xl font-black mb-6 tracking-tight">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-500 to-yellow-500 bg-clip-text text-transparent blur-sm">
                  Budget Buddy
                </span>
                <span className="relative bg-gradient-to-r from-blue-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                  Budget Buddy
                </span>
              </h1>
              
              {/* Subtitle with improved typography and fading effect */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-xl md:text-2xl text-gray-200 mb-8 font-light leading-relaxed"
              >
                Your <span className="font-medium text-blue-400">modern</span> personal finance tracker for budgeting, 
                transaction tracking, and goal planning.
              </motion.p>
              
              {/* CTA buttons with hover effects */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-16">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-blue-500 text-white font-medium text-lg shadow-lg shadow-purple-600/30 transition-all hover:shadow-xl hover:shadow-purple-600/40"
                >
                  Get Started Now
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-lg shadow-lg transition-all hover:bg-white/20"
                >
                  See How It Works
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Curved separator for visual interest */}
          <div className="w-full overflow-hidden">
            <svg className="w-full h-24 text-gray-900/5 fill-current" viewBox="0 0 1440 74" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 C120,20 240,20 360,10 C480,0 600,-10 720,10 C840,30 960,70 1080,70 C1200,70 1320,30 1440,10 L1440,74 L0,74 Z" />
            </svg>
          </div>
          
          {/* Features section with staggered animations */}
          <div className="container mx-auto px-4 py-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center text-white"
            >
              Powerful <span className="text-blue-400">Features</span> To Manage Your Finances
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {/* Feature Card 1 */}
              <motion.div 
                ref={featureRefs[0]}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="group p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-purple-500/10 transition-all hover:-translate-y-2"
              >
                {/* Icon wrapper */}
                <div className="mb-6 p-4 rounded-2xl bg-purple-600/20 inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">Manage Budgets</h3>
                <p className="text-gray-300 leading-relaxed">
                  Set personalized spending limits across multiple categories and track your progress with visual indicators and detailed reports.
                </p>
                
                {/* Bottom accent line with animation */}
                <div className="mt-6 h-1 w-12 bg-purple-500 rounded-full group-hover:w-full transition-all duration-300"></div>
              </motion.div>
              
              {/* Feature Card 2 */}
              <motion.div 
                ref={featureRefs[1]}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="group p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-2"
              >
                {/* Icon wrapper */}
                <div className="mb-6 p-4 rounded-2xl bg-blue-600/20 inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">Track Transactions</h3>
                <p className="text-gray-300 leading-relaxed">
                  Record and categorize all your financial activity with powerful filtering, searching, and visualization tools to identify spending patterns.
                </p>
                
                {/* Bottom accent line with animation */}
                <div className="mt-6 h-1 w-12 bg-blue-500 rounded-full group-hover:w-full transition-all duration-300"></div>
              </motion.div>
              
              {/* Feature Card 3 */}
              <motion.div 
                ref={featureRefs[2]}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="group p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-pink-500/10 transition-all hover:-translate-y-2"
              >
                {/* Icon wrapper */}
                <div className="mb-6 p-4 rounded-2xl bg-pink-600/20 inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-pink-300 transition-colors">Achieve Goals</h3>
                <p className="text-gray-300 leading-relaxed">
                  Set financial milestones, visualize your progress, and receive adaptive recommendations to help you reach your targets faster.
                </p>
                
                {/* Bottom accent line with animation */}
                <div className="mt-6 h-1 w-12 bg-pink-500 rounded-full group-hover:w-full transition-all duration-300"></div>
              </motion.div>
            </div>
          </div>
          
          {/* Testimonials with blurred orbs for visual interest */}
          <div className="relative py-24">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-700/30 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-700/20 blur-3xl"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm font-medium text-green-300 mb-6">
                  What Our Users Say
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white">Join thousands of satisfied users</h2>
                
                {/* Testimonial card */}
                <div className="p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500"></div>
                      <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white">
                        JD
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-xl md:text-2xl text-gray-200 font-light italic mb-6">
                    "Budget Buddy transformed how I manage my finances. The visual charts and goal tracking features keep me motivated and on track."
                  </blockquote>
                  <p className="text-blue-300 font-medium">Student, UVCE</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Call to action section */}
          <div className="container mx-auto px-4 py-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-green-900/80 to-blue-900/80 p-12 backdrop-blur-lg border border-white/10 shadow-2xl text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to take control of your finances?</h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join Budget Buddy today and experience the easiest way to track, plan, and achieve your financial goals.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 rounded-full bg-white text-green-900 font-medium text-lg shadow-xl shadow-purple-500/20 transition-all hover:shadow-2xl hover:shadow-purple-500/30"
              >
                Get Started — It's Free
              </motion.button>
            </motion.div>
          </div>
          
          {/* Footer with creator info */}
          <div className="container mx-auto px-4 py-12">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center space-x-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              </div>
              <p className="text-gray-400 mb-2">Designed with passion for smart budgeting</p>
              <p className="text-gray-500">Created by: <span className="text-blue-500">Madhusudhan M :U25UV22T006024 and Shreyas S Rao :U25UV22T006044</span> </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}