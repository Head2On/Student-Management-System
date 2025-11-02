"use client";
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(2);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const faqs: FAQ[] = [
    {
      question: 'How do I change my account mail?',
      answer: 'Yes of course, just send us an email at contact@bookapp.com with a little reason of why you want to cancel your subscription and you will get a refund between 1-2 business days.'
    },
    {
      question: 'How can I change my payment method?',
      answer: 'Yes of course, just send us an email at contact@bookapp.com with a little reason of why you want to cancel your subscription and you will get a refund between 1-2 business days.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Contact Form:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@bookapp.com');
    alert('Email copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-16 px-4">
      <div className="max-w-4xl mx-auto font-light">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            We&apos;re Always Here
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-red-600">To Help </span>
            <span className="text-orange-500">You</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Do you need some help with something or do
          </p>
          <p className="text-gray-600 text-lg">
            you have questions on some features?
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {expandedIndex === index ? (
                  <Minus size={20} className="text-gray-600 flex-shrink-0" />
                ) : (
                  <Plus size={20} className="text-gray-600 flex-shrink-0" />
                )}
              </button>
              {expandedIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="text-center mb-12 text-black">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Have any other questions?
          </h2>
          <p className="text-gray-600 mb-4">
            Don&apos;t hesitate to send us an email with your
          </p>
          <p className="text-gray-600 mb-2">
            enquiry or statement at:
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="font-semibold text-gray-900">contact@bookapp.com</span>
            <button
              onClick={copyEmail}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <span>copy</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Or Send Us a Message</h3>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="What can we help you with?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}