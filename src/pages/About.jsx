import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiGlobe, FiShield, FiBriefcase, FiAward } from 'react-icons/fi';
import { FaBitcoin, FaEthereum, FaHandshake } from 'react-icons/fa';
import { SiChainlink } from 'react-icons/si';

function About() {
  const stats = [
    {
      value: '$250M+',
      label: 'Property Transactions',
      icon: FiDollarSign
    },
    {
      value: '15,000+',
      label: 'Active Investors',
      icon: FiUsers
    },
    {
      value: '45+',
      label: 'Countries Served',
      icon: FiGlobe
    },
    {
      value: '100%',
      label: 'Secure Transactions',
      icon: FiShield
    }
  ];

  const partners = [
    {
      name: 'Bitcoin',
      icon: FaBitcoin,
      color: 'text-orange-500'
    },
    {
      name: 'Ethereum',
      icon: FaEthereum,
      color: 'text-purple-500'
    },
    {
      name: 'Chainlink',
      icon: SiChainlink,
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="min-h-screen section-light">
      {/* Hero Section */}
      <section className="relative bg-secondary-900 dark:bg-secondary-950 text-white py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Revolutionizing Real Estate Investment
            </h1>
            <p className="text-xl text-secondary-200 dark:text-secondary-300">
              We're bridging the gap between traditional real estate and cryptocurrency,
              making property investment accessible, secure, and transparent through blockchain technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 icon-primary" />
                <div className="text-3xl font-bold text-heading mb-2">{stat.value}</div>
                <div className="text-body">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-secondary-900">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 text-heading">Our Mission</h2>
            <p className="text-lg text-body">
              To democratize real estate investment by leveraging blockchain technology,
              making property ownership accessible to investors worldwide through
              fractional ownership and cryptocurrency transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="icon-bg p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="w-8 h-8 icon-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-heading">Accessibility</h3>
              <p className="text-body">
                Making real estate investment available to everyone through fractional ownership
                and cryptocurrency payments.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="icon-bg p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 icon-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-heading">Security</h3>
              <p className="text-body">
                Ensuring secure transactions through blockchain technology and smart contracts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="icon-bg p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FiGlobe className="w-8 h-8 icon-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-heading">Global Reach</h3>
              <p className="text-body">
                Connecting property investors and opportunities worldwide through our platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white dark:bg-secondary-800">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-heading">Supported Cryptocurrencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <partner.icon className={`w-16 h-16 mx-auto mb-4 ${partner.color}`} />
                <h3 className="text-xl font-semibold text-heading">{partner.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-heading">Recognition & Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <FiAward className="w-12 h-12 mx-auto mb-4 icon-primary" />
              <h3 className="text-xl font-semibold mb-2 text-heading">Best Blockchain Innovation</h3>
              <p className="text-body">Real Estate Tech Awards 2024</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="feature-card"
            >
              <FiBriefcase className="w-12 h-12 mx-auto mb-4 icon-primary" />
              <h3 className="text-xl font-semibold mb-2 text-heading">Fastest Growing PropTech</h3>
              <p className="text-body">Forbes Innovation 2024</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="feature-card"
            >
              <FiShield className="w-12 h-12 mx-auto mb-4 icon-primary" />
              <h3 className="text-xl font-semibold mb-2 text-heading">Most Secure Platform</h3>
              <p className="text-body">Blockchain Security Excellence 2024</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;