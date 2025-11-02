'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Meh  } from 'lucide-react';

const Notfound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-amber-100 fomnt-sans text-gray-500">
            <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut'}}
            className="text-center p-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl max-w-max"
            >   
            <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 100 }}
            className="mb-6 flex justify-center" >

            <div className="bg-white p-4 rounded-full">
                <Meh className="w-25 h-25 text-red-500" />
            </div>
             </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-8xl font-bold tracking-tighter mb-6"
                >
                Sorry Hony !
            </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl font-light text-gary-800 mb-8 mt-6"
        >
          Page Not Found
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-transparent hover:border-white/50 hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <Home className="w-5 h-5 text-blue-600" />
              <p className='text-blue-500'> Go Back Home </p>
          </Link>
        </motion.div>
        </motion.div>
        </div>
    );
}

export default Notfound;    