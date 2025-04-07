import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Home } from 'lucide-react';

const Blocked = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                when: 'beforeChildren',
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-200"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                    <AlertCircle className="w-16 h-16 text-red-600" />
                </motion.div>

                <motion.h1 
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-bold text-red-800 text-center mb-4"
                >
                    Access Denied
                </motion.h1>

                <motion.p 
                    variants={itemVariants}
                    className="text-gray-600 text-lg text-center mb-8"
                >
                    Your account has been blocked. Please contact{' '}
                    <a 
                        href="mailto:support@example.com" 
                        className="text-red-600 hover:text-red-700 underline transition-colors"
                    >
                        support@example.com
                    </a>{' '}
                    for assistance.
                </motion.p>

                <motion.div 
                    variants={itemVariants}
                    className="flex justify-center"
                >
                    <button
                        onClick={handleGoBack}
                        className="group flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Return to Homepage
                        <motion.span
                            className="ml-2"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            →
                        </motion.span>
                    </button>
                </motion.div>

                <motion.p 
                    variants={itemVariants}
                    className="text-sm text-gray-500 mt-6 text-center"
                >
                    Error Code: BLK-403 |{' '}
                    <span className="font-mono">{new Date().toLocaleString()}</span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Blocked;