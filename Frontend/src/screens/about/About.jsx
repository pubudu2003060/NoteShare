import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Share2,
  Target,
  Heart,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
  Globe,
  Shield,
  Zap,
  Award,
} from "lucide-react";

const About = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const features = [
    {
      icon: <Share2 className="h-8 w-8 text-blue-600" />,
      title: "Easy Sharing",
      description:
        "Share your notes with classmates and study groups effortlessly. Create public or private groups for targeted collaboration.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Collaborative Learning",
      description:
        "Join study groups, participate in discussions, and learn from peers across different educational levels.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: "Organized Knowledge",
      description:
        "Keep your notes organized with tags, categories, and smart search functionality to find what you need quickly.",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Secure Platform",
      description:
        "Your data is protected with enterprise-grade security. Control who sees your content with granular privacy settings.",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Active Users",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "50K+",
      label: "Notes Shared",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      number: "500+",
      label: "Study Groups",
      icon: <Share2 className="h-6 w-6" />,
    },
    { number: "99.9%", label: "Uptime", icon: <Zap className="h-6 w-6" /> },
  ];

  const faqs = [
    {
      question: "What is NoteShare?",
      answer:
        "NoteShare is a collaborative platform designed for students and learners to share, organize, and discover educational content. Whether you're in primary school, university, or pursuing lifelong learning, NoteShare helps you connect with peers and access quality study materials.",
    },
    {
      question: "How do I create a study group?",
      answer:
        "Creating a study group is easy! Navigate to 'My Groups' from the sidebar, click 'Create New Group', fill in the details like group name, description, and tags, then choose whether it's public or private. You can invite members via email or let others discover your public group.",
    },
    {
      question: "Is my content safe and private?",
      answer:
        "Absolutely! We take privacy seriously. You have full control over who can see your content. Private groups are only accessible to invited members, and we use industry-standard encryption to protect your data. You can also delete your content at any time.",
    },
    {
      question: "Can I access NoteShare on mobile devices?",
      answer:
        "Yes! NoteShare is fully responsive and works seamlessly on desktop, tablet, and mobile devices. You can access your notes and participate in discussions from anywhere.",
    },
    {
      question: "How do I find relevant study groups?",
      answer:
        "Use our smart search feature on the home page. You can search by keywords, filter by public/private groups, and browse by tags. The platform will show you groups that match your interests and educational level.",
    },
    {
      question: "Is NoteShare free to use?",
      answer:
        "Yes! NoteShare is completely free for all students and learners. We believe knowledge sharing should be accessible to everyone, regardless of their financial situation.",
    },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <BookOpen className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About NoteShare
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Empowering learners worldwide through collaborative knowledge
            sharing and community-driven education
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <Star className="h-5 w-5 text-yellow-400 inline mr-2" />
              <span className="font-semibold">Trusted by thousands</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <Award className="h-5 w-5 text-green-400 inline mr-2" />
              <span className="font-semibold">100% Free</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
                <Target className="h-12 w-12 text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Democratizing Education
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed">
                  We believe that quality education should be accessible to
                  everyone. NoteShare breaks down barriers by creating a
                  platform where students from all backgrounds can share
                  knowledge, collaborate on projects, and learn from each
                  other's experiences.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
                <Heart className="h-12 w-12 text-red-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Building Community
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed">
                  Learning is more effective when it's collaborative. Our
                  platform fosters a supportive community where students can
                  connect, share insights, and grow together through meaningful
                  academic relationships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Platform Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                      <div className="text-blue-600 dark:text-blue-400">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Key Features
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Discover what makes NoteShare the perfect platform for
              collaborative learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-lg">
              Everything you need to know about NoteShare
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 dark:border-slate-700 last:border-b-0"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <div className="text-blue-600 dark:text-blue-400 ml-4">
                      {expandedFaq === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have More Questions?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            We're here to help! Reach out to our team for support, feedback, or
            just to say hello.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <span>support@noteshare.com</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              <span>Live Chat Support</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-3">
              <Globe className="h-5 w-5" />
              <span>Community Forum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
