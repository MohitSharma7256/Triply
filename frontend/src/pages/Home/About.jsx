import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaGlobe,
    FaHeart,
    FaUsers,
    FaCamera,
    FaMapMarkedAlt,
    FaShareAlt,
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaEnvelope
} from 'react-icons/fa';
import { MdSecurity, MdSpeed, MdDevices } from 'react-icons/md';
import Navbar from '../../components/Navbar';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';


const About = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");



    // Get user info
    const getUserInfo = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            } else {
                console.error("Failed to fetch user:", error);
                toast.error("Failed to fetch user information");
            }
        }
    }, [navigate]);

    // Clear search and reset filters
    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
        resetFilters();
    }, []);

    // Search stories by query
    const onSearchStory = useCallback(async (query) => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            handleClearSearch();
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.get("/search/filter", {
                params: {
                    query: trimmedQuery
                }
            });

            if (response.data?.error === false) {
                setFilterType("search");
                setAllStories(response.data.stories || []);

                if (response.data.stories?.length === 0) {
                    toast.info(`No stories found for "${trimmedQuery}"`);
                }
            } else {
                setAllStories([]);
                toast.error(response.data?.message || "Search failed");
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error(error.response?.data?.message || "Search failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [handleClearSearch]);



    useEffect(() => {
        getUserInfo();
        if (typeof document !== 'undefined') {
            Modal.setAppElement('#root');
        }
    }, [getUserInfo, ]);


    const [activeTab, setActiveTab] = useState('mission');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: <FaCamera className="text-3xl text-blue-500" />,
            title: "Share Your Stories",
            description: "Capture and share your travel experiences with beautiful photos and detailed narratives."
        },
        {
            icon: <FaMapMarkedAlt className="text-3xl text-green-500" />,
            title: "Track Your Journey",
            description: "Mark your visited locations and create a personal travel map of your adventures."
        },
        {
            icon: <FaHeart className="text-3xl text-red-500" />,
            title: "Save Favorites",
            description: "Bookmark your favorite stories and create a collection of memorable moments."
        },
        {
            icon: <FaShareAlt className="text-3xl text-purple-500" />,
            title: "Connect & Share",
            description: "Share your travel stories with friends and family, inspiring others to explore."
        }
    ];

    const stats = [
        { number: "1000+", label: "Triply Stories" },
        { number: "50+", label: "Countries" },
        { number: "500+", label: "Happy Users" },
        { number: "24/7", label: "Support" }
    ];

    const team = [
        {
            name: "Mohit Sharma",
            role: "Founder & CEO",
            image: "../../../public/images/founder.jpg",
            bio: "Passionate traveler and tech enthusiast who believes every journey tells a story."
        },
        {
            name: "Mohit",
            role: "Lead Developer",
            image: "../../../public/images/developer.jpg",
            bio: "Full-stack developer with a love for creating seamless user experiences."
        },
        {
            name: "Shaan",
            role: "UX Designer",
            image: "../../../public/images/TriplyBrand.png",
            bio: "Creative designer focused on making travel storytelling beautiful and intuitive."
        }
    ];

    const technologies = [
        { name: "React", icon: "⚛️", color: "bg-blue-500" },
        { name: "Node.js", icon: "🟢", color: "bg-green-500" },
        { name: "MongoDB", icon: "🍃", color: "bg-green-600" },
        { name: "Express", icon: "🚀", color: "bg-gray-600" },
        { name: "Tailwind CSS", icon: "🎨", color: "bg-cyan-500" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const fadeInUp = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/*  */}
            <Navbar
                userInfo={userInfo}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={() => onSearchStory(searchQuery)}
                handleClearSearch={handleClearSearch}
            />
            {/* Hero Section */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative container mx-auto px-6 py-20">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            About <span className="text-yellow-300">Triply</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            We believe every journey has a story worth sharing.
                            Join thousands of travelers documenting their adventures around the world.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
                        >
                            Start Your Journey
                        </motion.button>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-20 left-10 text-4xl"
                >
                    ✈️
                </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute top-40 right-20 text-3xl"
                >
                    🌍
                </motion.div>
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-20 left-1/4 text-2xl"
                >
                    🗺️
                </motion.div>
            </motion.div>

            {/* Mission & Vision Section */}
            <motion.section
                className="py-20 container mx-auto px-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We're on a mission to connect travelers worldwide through the power of storytelling
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        variants={itemVariants}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To provide a platform where travelers can preserve their memories,
                            share their experiences, and inspire others to explore the world.
                            We believe every journey has the power to connect people and cultures.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="text-4xl mb-4">🔮</div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To become the world's leading platform for travel storytelling,
                            creating a global community of explorers who share, inspire,
                            and preserve the beauty of our diverse world.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                className="py-20 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="container mx-auto px-6">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Triply?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover the features that make us the perfect companion for your travel adventures
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <motion.section
                className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="container mx-auto px-6">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
                        <p className="text-xl opacity-90">Numbers that tell our story</p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-4xl md:text-5xl font-bold mb-2"
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-lg opacity-90">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Team Section */}
            <motion.section
                className="py-20 bg-gray-50"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="container mx-auto px-6">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The passionate people behind TravelStories
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{member.name}</h3>
                                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                                <p className="text-gray-600">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Technology Stack */}
            <motion.section
                className="py-20 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="container mx-auto px-6">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Built With Modern Technology</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We use cutting-edge technologies to deliver the best experience
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.1 }}
                                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="text-3xl mb-2">{tech.icon}</div>
                                <div className="font-semibold text-gray-800">{tech.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="container mx-auto px-6">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                        <p className="text-xl opacity-90 max-w-3xl mx-auto">
                            Have questions or want to collaborate? We'd love to hear from you!
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <FaEnvelope className="text-blue-400 text-xl" />
                                    <span>ms1361277@gmail.com</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaGlobe className="text-blue-400 text-xl" />
                                    <span>www.triply.com</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaUsers className="text-blue-400 text-xl" />
                                    <span>Join our community of travelers</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-semibold mb-6">Follow Us</h3>
                            <div className="flex space-x-4">
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="#"
                                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                    <FaTwitter className="text-white" />
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="#"
                                    className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                                >
                                    <FaLinkedin className="text-white" />
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    href="#"
                                    className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                                >
                                    <FaGithub className="text-white" />
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2024 Triply. All rights reserved.</p>
                    <p className="mt-2 text-gray-400">Made with ❤️ for travelers worldwide</p>
                </div>
            </footer>
        </div>
    );
};

export default About;