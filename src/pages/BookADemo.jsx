import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VscCalendar, VscWatch, VscMail, VscPerson, VscDeviceMobile, VscArrowLeft } from 'react-icons/vsc';
import toast from 'react-hot-toast';

const BookADemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Demo request submitted successfully! We\'ll contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-richblack-900 text-white">
      {/* Header */}
      <div className="bg-richblack-800 border-b border-richblack-700">
        <div className="w-11/12 max-w-maxContent mx-auto py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-richblack-300 hover:text-yellow-25 transition-colors duration-200">
            <VscArrowLeft className="text-lg" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-4 text-center">
            Book a <span className="text-yellow-25">Demo</span>
          </h1>
          <p className="text-richblack-300 text-center mt-2 max-w-2xl mx-auto">
            Experience our platform firsthand with a personalized demo. Our experts will walk you through 
            all the features and answer any questions you have.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 max-w-4xl mx-auto py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-richblack-800 p-8 rounded-xl border border-richblack-700">
            <h2 className="text-2xl font-semibold mb-6 text-yellow-25">Request Demo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-richblack-200 text-sm font-medium mb-2">
                    <VscPerson className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-25 transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-richblack-200 text-sm font-medium mb-2">
                    <VscMail className="inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-25 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                                     <label className="block text-richblack-200 text-sm font-medium mb-2">
                     <VscDeviceMobile className="inline mr-2" />
                     Phone Number
                   </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-25 transition-colors duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-richblack-200 text-sm font-medium mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-25 transition-colors duration-200"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-richblack-200 text-sm font-medium mb-2">
                    <VscCalendar className="inline mr-2" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-25 transition-colors duration-200"
                  />
                </div>
                
                <div>
                                     <label className="block text-richblack-200 text-sm font-medium mb-2">
                     <VscWatch className="inline mr-2" />
                     Preferred Time *
                   </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-25 transition-colors duration-200"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-richblack-200 text-sm font-medium mb-2">
                  Additional Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-25 transition-colors duration-200"
                  placeholder="Tell us about your specific needs or questions..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-25 text-richblack-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-richblack-900 border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Request Demo'
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700">
              <h3 className="text-xl font-semibold mb-4 text-yellow-25">What to Expect</h3>
              <ul className="space-y-3 text-richblack-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-25 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Personalized walkthrough of our platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-25 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Live demonstration of key features</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-25 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Q&A session with our experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-25 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Customized recommendations for your needs</span>
                </li>
              </ul>
            </div>

            <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700">
              <h3 className="text-xl font-semibold mb-4 text-yellow-25">Demo Duration</h3>
              <p className="text-richblack-300 mb-4">
                Our demos typically last 30-45 minutes, giving you plenty of time to explore 
                the platform and get all your questions answered.
              </p>
              <p className="text-richblack-300">
                We'll schedule the demo at a time that works best for you and your team.
              </p>
            </div>

            <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700">
              <h3 className="text-xl font-semibold mb-4 text-yellow-25">Contact Information</h3>
              <div className="space-y-2 text-richblack-300">
                <p>📧 Email: demo@eduvate.com</p>
                <p>📞 Phone: +1 (555) 123-4567</p>
                <p>⏰ Available: Mon-Fri, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookADemo;
