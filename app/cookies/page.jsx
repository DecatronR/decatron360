"use client";
import { ArrowLeft, Cookie, Info, Settings, Shield, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

const CookiePolicy = () => {
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
                  <Cookie className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Cookie Policy
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    How we use cookies and similar technologies
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
          {/* What Are Cookies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  What Are Cookies?
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are stored on your device when
                you visit a website. They help us remember your preferences,
                enhance your experience, and analyze site usage. Cookies can be
                "session" cookies (which are deleted when you close your
                browser) or "persistent" cookies (which remain on your device
                for a set period).
              </p>
            </div>
          </div>

          {/* How We Use Cookies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  How We Use Cookies
                </h2>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>To remember your login and account preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>To keep your session secure and authenticated</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>To analyze site traffic and usage patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    To personalize your experience and show relevant content
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>To support marketing and advertising efforts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Types of Cookies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Types of Cookies We Use
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Essential Cookies
                    </h4>
                    <p className="text-sm text-gray-700">
                      Necessary for the operation of our platform, such as
                      authentication and security.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Performance Cookies
                    </h4>
                    <p className="text-sm text-gray-700">
                      Help us understand how visitors interact with our site by
                      collecting usage data.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Functional Cookies
                    </h4>
                    <p className="text-sm text-gray-700">
                      Enable enhanced functionality and personalization, such as
                      remembering preferences.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Marketing Cookies
                    </h4>
                    <p className="text-sm text-gray-700">
                      Used to deliver relevant ads and track the effectiveness
                      of our marketing campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Managing Your Cookie Preferences
                </h2>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    You can manage or disable cookies in your browser settings
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    Disabling cookies may affect your experience on our platform
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Some cookies are essential and cannot be disabled</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>For more information, refer to our Privacy Policy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Updates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Contact & Updates
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you have any questions about our Cookie Policy or data
                  practices, please contact us:
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
                    <strong>Note:</strong> We may update this Cookie Policy from
                    time to time. We will notify you of any material changes by
                    posting the new policy on this page and updating the "Last
                    updated" date.
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

export default CookiePolicy;
