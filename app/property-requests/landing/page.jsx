"use client";
import React, { useState, useEffect } from "react";
import {
  BellRing,
  Filter,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
  Play,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Never Miss a Lead",
    desc: "Get instant WhatsApp alerts for property requests in your preferred locations.",
    icon: BellRing,
    color: "text-primary-600",
    bgColor: "bg-primary-50",
    delay: "0s",
  },
  {
    title: "Targeted Notifications",
    desc: "Only receive requests that match your selected states, LGAs, and listing types.",
    icon: Filter,
    color: "text-primary-600",
    bgColor: "bg-primary-50",
    delay: "0.2s",
  },
  {
    title: "Easy to Use",
    desc: "Sign up in minutes and start receiving leads directly on your whatsapp.",
    icon: Smartphone,
    color: "text-primary-600",
    bgColor: "bg-primary-50",
    delay: "0.4s",
  },
];

const testimonials = [
  {
    name: "Chinedu, Lagos Agent",
    quote:
      "I closed 3 deals in my first month using Property Request Alerts. The WhatsApp notifications are a game changer!",
    avatar: "C",
    deals: "3 deals closed",
  },
  {
    name: "Aisha, Abuja Realtor",
    quote:
      "I love how I only get requests that matter to me. No more sifting through irrelevant leads!",
    avatar: "A",
    deals: "5x more leads",
  },
];

const stats = [
  { label: "Active Agents", value: "150+", icon: Users },
  { label: "Leads Generated", value: "1K+", icon: TrendingUp },
  { label: "Success Rate", value: "87%", icon: Zap },
];

export default function PropertyRequestLanding() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStartTrialBtn = () => {
    router.push(`/property-requests/register`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Hero Section with Your Signature Animated Blob Background */}
      <section
        className="relative py-28 lg:py-32 z-0 overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        {/* Animated blurred gradient blob background - matching your style */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full z-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #5a47fb 0%, #eae6fc 80%)",
            filter: "blur(120px)",
            opacity: 0.45,
            animation: "float 12s ease-in-out infinite",
          }}
        />

        {/* Subtle secondary blob */}
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full z-0"
          style={{
            background:
              "radial-gradient(circle at 70% 60%, #eae6fc 0%, #5a47fb 60%)",
            filter: "blur(100px)",
            opacity: 0.25,
            animation: "float-reverse 14s ease-in-out infinite",
          }}
        />

        {/* Abstract floating particles - matching your design */}
        <div
          className="absolute top-24 left-1/4 w-16 h-16 rounded-full bg-primary-500/20 z-10"
          style={{ animation: "particle-float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-32 right-1/3 w-10 h-10 rounded-full bg-primary-500/15 z-10"
          style={{ animation: "particle-float-2 10s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 right-24 w-8 h-8 rounded-full bg-primary-500/10 z-10"
          style={{ animation: "particle-float-3 9s ease-in-out infinite" }}
        />

        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-20">
          {/* Left: Text Content */}
          <div
            className={`lg:w-1/2 text-left transform transition-all duration-800 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <div className="mb-12">
              {/* Trust Badge */}
              <div
                className={`inline-flex items-center gap-2 bg-white/60 backdrop-blur-md text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary-200/50 shadow-lg transform transition-all duration-800 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: "0.2s" }}
              >
                <Zap className="w-4 h-4" />
                Join 150+ Successful Agents
              </div>

              <h1
                className={`font-raleway text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight transform transition-all duration-800 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ color: "#08253f", transitionDelay: "0.4s" }}
              >
                Never Miss a Property Request{" "}
                <span
                  className="font-nasalization"
                  style={{ color: "#5a47fb" }}
                >
                  Again!
                </span>
              </h1>

              <p
                className={`font-raleway text-lg sm:text-xl opacity-80 max-w-xl lg:mx-0 transform transition-all duration-800 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ color: "#08253f", transitionDelay: "0.6s" }}
              >
                Join hundreds of agents getting instant WhatsApp alerts for new
                property requests in their area. Be the first to connect with
                motivated clients and grow your business.
              </p>
            </div>

            {/* Glassmorphism CTA Card - matching your search form style */}
            <div
              className={`relative z-10 w-full max-w-3xl sm:max-w-xl md:max-w-2xl lg:max-w-none bg-white/60 shadow-xl rounded-2xl p-6 border border-gray-200 backdrop-blur-md transform transition-all duration-800 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                boxShadow: "0 8px 32px 0 rgba(90,71,251,0.08)",
                transitionDelay: "0.8s",
              }}
            >
              <div className="text-center mb-4">
                <h3
                  className="font-raleway text-xl font-semibold mb-2"
                  style={{ color: "#08253f" }}
                >
                  Get Started Today
                </h3>
                <p className="text-sm opacity-70" style={{ color: "#08253f" }}>
                  Choose your plan and start receiving leads instantly
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={handleStartTrialBtn}
                >
                  Start Free Trial
                </button>
                <button className="flex-1 bg-white/80 hover:bg-white text-primary-600 px-6 py-4 rounded-xl font-semibold border border-primary-200 transition-all duration-300 transform hover:scale-105 shadow-md">
                  Learn More
                </button>
              </div>

              {/* Trust indicators */}
              <div
                className="flex justify-center items-center gap-6 text-xs opacity-70 mt-4"
                style={{ color: "#08253f" }}
              >
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  21-day free trial
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>

          {/* Right: Video Section - matching your video component */}
          <div
            className={`lg:w-1/2 w-full max-w-lg mx-auto lg:mx-0 transform transition-all duration-800 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            }`}
            style={{ transitionDelay: "1s" }}
          >
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-black/80 border border-primary-100"
              style={{ boxShadow: "0 8px 32px 0 rgba(90,71,251,0.12)" }}
            >
              {!showVideo ? (
                <>
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <img
                      src="https://img.youtube.com/vi/cJJYhN-JSWc/maxresdefault.jpg"
                      alt="How Property Request Alerts work"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <div
                          className="absolute inset-0 bg-white/30 rounded-full"
                          style={{
                            animation: "pulse-ring 2s ease-in-out infinite",
                          }}
                        />
                        <div className="relative w-20 h-20 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl border border-white/20">
                          <Play className="w-10 h-10 ml-1 text-white drop-shadow-sm" />
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/cJJYhN-JSWc?autoplay=1"
                      title="How Property Request Alerts work"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <button
                      onClick={() => setShowVideo(false)}
                      className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Diagonal SVG divider - matching your design */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
          <svg
            viewBox="0 0 1920 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-24"
          >
            <polygon points="0,100 1920,0 1920,100" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <div className="py-16 relative overflow-hidden">
        {/* Subtle background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200/50 transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: "#08253f" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm opacity-70"
                  style={{ color: "#08253f" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Options with Glassmorphism */}
      <div className="max-w-5xl mx-auto mt-20 px-4 relative">
        <h2
          className={`font-raleway text-3xl font-bold text-center mb-12 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ color: "#08253f" }}
        >
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Trial Card */}
          <div
            className={`group relative bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200/50 transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{
              transitionDelay: "0.3s",
              boxShadow: "0 8px 32px 0 rgba(90,71,251,0.08)",
            }}
          >
            <div className="absolute top-4 right-4">
              <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                POPULAR
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>

              <h3 className="font-raleway text-2xl font-bold text-primary-700 mb-3">
                Free Trial
              </h3>
              <p
                className="text-sm mb-6 opacity-80"
                style={{ color: "#08253f" }}
              >
                Try Property Request Alerts free for 21 days. Experience the
                power of instant notifications with no commitment.
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-600">₦0</span>
                <span
                  className="text-sm ml-2 opacity-70"
                  style={{ color: "#08253f" }}
                >
                  No card required
                </span>
              </div>

              <button
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={handleStartTrialBtn}
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Premium Card */}
          <div
            className={`group relative bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200/50 transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{
              transitionDelay: "0.5s",
              boxShadow: "0 8px 32px 0 rgba(90,71,251,0.08)",
            }}
          >
            <div className="absolute top-4 right-4">
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                BEST VALUE
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="font-raleway text-2xl font-bold text-green-700 mb-3">
                Special Agent
              </h3>
              <p
                className="text-sm mb-6 opacity-80"
                style={{ color: "#08253f" }}
              >
                Unlock unlimited alerts, priority support, and exclusive
                features. Perfect for serious agents who want to close more
                deals.
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-green-600">
                  ₦3,500
                </span>
                <span
                  className="text-base font-normal opacity-70"
                  style={{ color: "#08253f" }}
                >
                  /month
                </span>
                <div
                  className="text-sm opacity-70"
                  style={{ color: "#08253f" }}
                >
                  Cancel anytime
                </div>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto mt-24 px-4">
        <h3
          className={`font-raleway text-3xl font-bold text-center mb-16 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ color: "#08253f" }}
        >
          Why Choose Property Request Alerts?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center transform transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-200/50 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                } ${hoveredFeature === index ? "ring-2 ring-primary-400" : ""}`}
                style={{
                  transitionDelay: feature.delay,
                  boxShadow: "0 8px 32px 0 rgba(90,71,251,0.08)",
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>

                <h4
                  className="font-raleway text-xl font-bold mb-4 group-hover:text-primary-600 transition-colors"
                  style={{ color: "#08253f" }}
                >
                  {feature.title}
                </h4>
                <p
                  className="leading-relaxed opacity-80"
                  style={{ color: "#08253f" }}
                >
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto mt-24 px-4 mb-20">
        <h3
          className={`font-raleway text-3xl font-bold text-center mb-12 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ color: "#08253f" }}
        >
          Success Stories
        </h3>

        <div
          className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 overflow-hidden border border-gray-200/50"
          style={{ boxShadow: "0 8px 32px 0 rgba(90,71,251,0.08)" }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-green-600"></div>

          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                currentTestimonial === index
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 absolute inset-0 translate-x-full"
              }`}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold" style={{ color: "#08253f" }}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {testimonial.deals}
                  </div>
                </div>
              </div>

              <blockquote
                className="font-raleway text-lg italic leading-relaxed opacity-90"
                style={{ color: "#08253f" }}
              >
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentTestimonial === index
                    ? "bg-primary-600"
                    : "bg-gray-300"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-16 overflow-hidden">
        {/* Animated background similar to hero */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full z-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #5a47fb 0%, #eae6fc 80%)",
            filter: "blur(100px)",
            opacity: 0.3,
            animation: "float 10s ease-in-out infinite",
          }}
        />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div
            className="bg-white/60 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-gray-200/50"
            style={{ boxShadow: "0 8px 32px 0 rgba(90,71,251,0.12)" }}
          >
            <h2
              className="font-raleway text-4xl font-bold mb-4"
              style={{ color: "#08253f" }}
            >
              Ready to Transform Your Business?
            </h2>
            <p
              className="font-raleway text-xl mb-8 opacity-80"
              style={{ color: "#08253f" }}
            >
              Join successful agents who are already growing their business with
              instant property alerts.
            </p>

            <button
              className="group bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={handleStartTrialBtn}
            >
              <span className="flex items-center gap-3">
                Start Your Free Trial Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.08) translate(20px, 10px);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.1) translate(-30px, -20px);
          }
        }

        @keyframes particle-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(10px, -18px) scale(1.1);
          }
        }

        @keyframes particle-float-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-8px, 12px) scale(1.15);
          }
        }

        @keyframes particle-float-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(6px, -10px) scale(1.2);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
