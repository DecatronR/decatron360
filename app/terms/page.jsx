"use client";
import {
  ArrowLeft,
  FileText,
  Scale,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TermsAndConditions = () => {
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
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Terms & Conditions
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Legal terms governing the use of our platform
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
                  <Scale className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Agreement to Terms
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Decatron's real estate platform, you
                agree to be bound by these Terms and Conditions. These terms
                govern your use of our services, including property listings,
                transactions, and platform features. If you do not agree with
                any part of these terms, please do not use our services.
              </p>
            </div>
          </div>

          {/* Definitions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Definitions
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "Platform"
                    </h4>
                    <p className="text-sm text-gray-700">
                      Refers to the Decatron website, mobile applications, and
                      related services.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">"User"</h4>
                    <p className="text-sm text-gray-700">
                      Any individual or entity accessing or using our platform
                      services.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "Property"
                    </h4>
                    <p className="text-sm text-gray-700">
                      Real estate listings, including houses, apartments, and
                      commercial properties.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "Transaction"
                    </h4>
                    <p className="text-sm text-gray-700">
                      Any rental, purchase, or sale agreement facilitated
                      through our platform.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "Agent"
                    </h4>
                    <p className="text-sm text-gray-700">
                      Licensed real estate professionals using our platform to
                      list properties.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "Content"
                    </h4>
                    <p className="text-sm text-gray-700">
                      All information, images, and materials posted on the
                      platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  User Responsibilities
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Account Registration
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Provide accurate and complete information during
                        registration
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Maintain the security of your account credentials
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Notify us immediately of any unauthorized account access
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        You must be at least 18 years old to create an account
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Prohibited Activities
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <XCircle className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Posting false or misleading property information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Harassing or discriminating against other users
                      </span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Attempting to circumvent platform security measures
                      </span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Using the platform for illegal or unauthorized purposes
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Property Listings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Property Listings & Content
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Listing Accuracy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-orange-900 mb-2">
                        Agent Responsibilities
                      </h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>
                          • Ensure all property information is accurate and
                          current
                        </li>
                        <li>
                          • Provide high-quality, authentic property photographs
                        </li>
                        <li>• Disclose any known property defects or issues</li>
                        <li>• Maintain up-to-date pricing and availability</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-orange-900 mb-2">
                        Platform Disclaimers
                      </h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• We do not verify the accuracy of all listings</li>
                        <li>
                          • Property availability may change without notice
                        </li>
                        <li>• Users should conduct their own due diligence</li>
                        <li>
                          • We reserve the right to remove inaccurate listings
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Content Guidelines
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        All content must be legal, appropriate, and
                        non-discriminatory
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Property images must be authentic and not misleading
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Contact information must be accurate and up-to-date
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        We reserve the right to moderate and remove
                        inappropriate content
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions & Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Transactions & Payments
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Payment Terms & Markup Fees
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Service Fees
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            Inspection Fee: Decatron charges a markup of{" "}
                            <strong>10% to 15%</strong> on inspection fees,
                            depending on the property and location.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            Transaction Contract Markup: For each successful
                            transaction contract, a <strong>3%</strong> markup
                            is applied to the total contract value.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            All fees are disclosed before payment and are
                            subject to change with notice.
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Payment Processing
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            Payments are processed through secure third-party
                            providers
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            Refunds are processed according to our refund policy
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            All transactions are subject to applicable taxes
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Transaction Disclaimers
                  </h3>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <ul className="space-y-2 text-yellow-800">
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>
                          We facilitate transactions but are not a party to
                          rental or purchase agreements
                        </span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>
                          Users are responsible for conducting their own legal
                          and financial due diligence
                        </span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>
                          We recommend consulting with legal and financial
                          professionals before transactions
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* E-Signature Compliance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  E-Signature Compliance
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700">
                  Decatron enables users to sign documents electronically. By
                  using our e-signature features, you acknowledge and agree to
                  the following:
                </p>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      <strong>Intent to Sign:</strong> You demonstrate a clear
                      intention to sign by clicking "I agree," typing your name,
                      drawing a signature, or using our certified e-signature
                      service.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      <strong>Consent to Do Business Electronically:</strong> By
                      using our platform, you and all parties to a transaction
                      consent to conduct business electronically, as required by
                      law and as outlined in this agreement.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      <strong>Association of Signature with Document:</strong>{" "}
                      Each e-signature is securely linked to the specific
                      document being signed. We maintain an audit trail that
                      includes metadata such as timestamps, signers' details,
                      and IP addresses.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      <strong>Record Retention:</strong> Signed documents are
                      stored securely and are accessible for future reference.
                      You may download signed PDFs at any time. We retain
                      records in compliance with applicable laws.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      <strong>Legal Validity in Nigeria and Africa:</strong>{" "}
                      E-signatures on Decatron are legally recognized under the
                      Nigerian Evidence Act 2011 (Section 93) and are generally
                      enforceable across Africa, provided the above requirements
                      are met. We recommend you consult local counsel for
                      specific legal advice.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Intellectual Property
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Platform Rights
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          Decatron owns all platform technology and branding
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          Users retain ownership of their property content
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          We may use anonymized data for platform improvement
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      User Content
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          Users grant us license to display their content
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          Content must not infringe on third-party rights
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          We may remove content that violates our terms
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Limitation of Liability
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Important Disclaimers
                  </h3>
                  <ul className="space-y-2 text-red-800">
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        We are not liable for any direct, indirect, or
                        consequential damages
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Our liability is limited to the amount paid for our
                        services
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        We do not guarantee the accuracy of property information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Users are responsible for their own legal and financial
                        decisions
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Termination & Changes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Account Termination
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>You may terminate your account at any time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        We may suspend or terminate accounts for violations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Termination does not affect completed transactions
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Terms Updates
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>We may update these terms from time to time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Users will be notified of significant changes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>
                        Continued use constitutes acceptance of new terms
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Governing Law */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Contact & Governing Law
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Legal Inquiries
                        </h4>
                        <p className="text-sm text-gray-700">
                          legal@decatron.com
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          General Support
                        </h4>
                        <p className="text-sm text-gray-700">
                          support@decatron.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Governing Law
                    </h3>
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                      <p className="text-sm text-primary-800">
                        These terms are governed by the laws of the Federal
                        Republic of Nigeria. Any disputes shall be resolved in
                        the courts of Nigeria, and both parties agree to submit
                        to the jurisdiction of these courts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <p className="text-sm text-primary-800">
                    <strong>Note:</strong> These Terms and Conditions constitute
                    a legally binding agreement. By using our platform, you
                    acknowledge that you have read, understood, and agree to be
                    bound by these terms. If you have any questions, please
                    contact us before using our services.
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

export default TermsAndConditions;
