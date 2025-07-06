"use client";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Globe,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Privacy Policy
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    How we protect and handle your data
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Last updated: {currentYear}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Your Privacy Matters
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                At Decatron, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our real estate platform and
                services.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Information We Collect
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Name, email address, phone number, and contact details
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Property preferences and search criteria</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Identity verification documents and information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Payment information and transaction history</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Property Information
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Property details, photos, and descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Location data and property addresses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Pricing information and availability</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Usage Information
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Device information and IP addresses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Browser type and operating system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Pages visited and time spent on our platform</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  How We Use Your Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Service Provision
                    </h4>
                    <p className="text-sm text-gray-700">
                      To provide and maintain our real estate platform, process
                      transactions, and facilitate property viewings.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Communication
                    </h4>
                    <p className="text-sm text-gray-700">
                      To send you updates, notifications, and respond to your
                      inquiries and support requests.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Personalization
                    </h4>
                    <p className="text-sm text-gray-700">
                      To personalize your experience and provide relevant
                      property recommendations.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Security
                    </h4>
                    <p className="text-sm text-gray-700">
                      To ensure platform security, prevent fraud, and comply
                      with legal obligations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Information Sharing
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share your information in the following
                  circumstances:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary-600">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Service Providers
                      </h4>
                      <p className="text-sm text-gray-700">
                        With trusted third-party service providers who assist us
                        in operating our platform, processing payments, and
                        providing customer support.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary-600">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Legal Requirements
                      </h4>
                      <p className="text-sm text-gray-700">
                        When required by law, court order, or government
                        regulation to protect our rights, property, or safety.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary-600">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Business Transfers
                      </h4>
                      <p className="text-sm text-gray-700">
                        In connection with a merger, acquisition, or sale of
                        assets, where your information may be transferred as
                        part of the business.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Data Security
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Security Measures
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Encryption of sensitive data in transit and at rest
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Regular security audits and vulnerability assessments
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Access controls and authentication mechanisms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Secure data centers and infrastructure</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Your Responsibilities
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Keep your account credentials secure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Log out when using shared devices</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Report any suspicious activity immediately</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Update your contact information regularly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Your Rights
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <h4 className="font-semibold text-primary-900 mb-2">
                      Access & Update
                    </h4>
                    <p className="text-sm text-primary-800">
                      Access, review, and update your personal information
                      through your account settings.
                    </p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <h4 className="font-semibold text-primary-900 mb-2">
                      Data Portability
                    </h4>
                    <p className="text-sm text-primary-800">
                      Request a copy of your data in a structured,
                      machine-readable format.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <h4 className="font-semibold text-primary-900 mb-2">
                      Deletion
                    </h4>
                    <p className="text-sm text-primary-800">
                      Request deletion of your personal information, subject to
                      legal requirements.
                    </p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <h4 className="font-semibold text-primary-900 mb-2">
                      Opt-out
                    </h4>
                    <p className="text-sm text-primary-800">
                      Opt out of marketing communications and certain data
                      processing activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Contact Us
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <p className="text-sm text-gray-700">
                      privacy@decatron.com
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Support
                    </h4>
                    <p className="text-sm text-gray-700">
                      support@decatron.com
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <p className="text-sm text-primary-800">
                    <strong>Note:</strong> We may update this Privacy Policy
                    from time to time. We will notify you of any material
                    changes by posting the new Privacy Policy on this page and
                    updating the "Last updated" date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
