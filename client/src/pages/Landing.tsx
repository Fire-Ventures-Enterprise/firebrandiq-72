import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  BarChart3, 
  Brain, 
  CheckCircle, 
  Eye, 
  Globe, 
  Heart, 
  MessageSquare, 
  Play, 
  Shield, 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  ChevronDown
} from 'lucide-react';

export function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Leverage advanced AI to analyze brand sentiment, identify trends, and generate actionable insights from social media data."
    },
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "Track brand mentions, competitor activity, and industry conversations across all major social platforms 24/7."
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Measure engagement, reach, and ROI with comprehensive analytics dashboards and automated reporting."
    },
    {
      icon: Zap,
      title: "Smart Content Generation",
      description: "Create compelling, psychology-driven content optimized for each platform with AI-powered writing assistance."
    },
    {
      icon: Shield,
      title: "Brand Protection",
      description: "Detect potential brand risks, negative sentiment, and crisis situations before they escalate."
    },
    {
      icon: Users,
      title: "Competitor Analysis",
      description: "Stay ahead with detailed competitor tracking, benchmark analysis, and market positioning insights."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Inc",
      content: "FirebrandIQ transformed our social media strategy. We've seen a 300% increase in engagement and saved 15 hours per week on content creation.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Brand Manager",
      company: "InnovateCorp",
      content: "The AI-powered insights helped us identify a potential PR crisis early and manage it effectively. Absolutely game-changing for brand protection.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Thompson",
      role: "CEO",
      company: "GrowthLab",
      content: "The competitor analysis features gave us the edge we needed to outperform our rivals. ROI has increased by 250% since implementation.",
      rating: 5,
      avatar: "ET"
    }
  ];

  const stats = [
    { value: "10M+", label: "Social Posts Analyzed" },
    { value: "500+", label: "Brands Protected" },
    { value: "99.9%", label: "Uptime Reliability" },
    { value: "24/7", label: "Real-Time Monitoring" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 3 social accounts",
        "Basic sentiment analysis",
        "Weekly reports",
        "Email support",
        "Brand mention alerts"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "per month",
      description: "Ideal for growing businesses and agencies",
      features: [
        "Up to 10 social accounts",
        "Advanced AI insights",
        "Daily reports & analytics",
        "Priority support",
        "Competitor tracking",
        "Content generation",
        "Crisis management"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "per month",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited social accounts",
        "Custom AI models",
        "Real-time dashboards",
        "Dedicated support",
        "Advanced integrations",
        "White-label options",
        "Custom reporting",
        "API access"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">FirebrandIQ</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Reviews</a>
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-700 border-blue-200">
              🚀 AI-Powered Brand Intelligence Platform
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Transform Your Brand's
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Digital Presence
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI to monitor, analyze, and optimize your brand's social media presence. 
              Get actionable insights, protect your reputation, and drive meaningful engagement across all platforms.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex justify-center items-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Setup in 5 minutes
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-bounce"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-purple-100 text-purple-700 border-purple-200">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to dominate social media
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools designed to elevate your brand's digital presence and drive measurable results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Integration */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Connect All Your Social Platforms
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Seamlessly integrate with major social media platforms to get a complete view of your brand's online presence.
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-12 mb-16">
            <Twitter className="h-8 w-8 text-blue-400" />
            <Instagram className="h-8 w-8 text-pink-500" />
            <Facebook className="h-8 w-8 text-blue-600" />
            <Linkedin className="h-8 w-8 text-blue-700" />
            <Globe className="h-8 w-8 text-slate-600" />
          </div>
          
          <Card className="max-w-4xl mx-auto border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Unified Dashboard
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Monitor all your social media accounts from one central dashboard. Track performance, 
                    manage content, and respond to engagement across platforms without switching between tools.
                  </p>
                  <Button>
                    Connect Your Accounts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">Connected Platforms</span>
                      <Badge className="bg-white/20">4 Active</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Twitter className="h-4 w-4" />
                          <span>@yourbrand</span>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Instagram className="h-4 w-4" />
                          <span>@yourbrand</span>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Linkedin className="h-4 w-4" />
                          <span>Your Brand</span>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-green-100 text-green-700 border-green-200">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Loved by brands worldwide
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join hundreds of successful brands that trust FirebrandIQ to manage their digital presence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-orange-100 text-orange-700 border-orange-200">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Choose your growth plan
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Flexible pricing that scales with your business. Start free and upgrade as you grow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-500 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full mb-6 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to transform your brand's digital presence?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of brands who trust FirebrandIQ to protect, monitor, and grow their online presence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Input 
              placeholder="Enter your email address" 
              className="max-w-sm bg-white text-slate-900 border-0"
            />
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8">
              Start Free Trial
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Free 14-day trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Cancel anytime
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              24/7 support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FirebrandIQ</span>
              </div>
              <p className="text-slate-400 mb-4">
                AI-powered brand intelligence platform for modern businesses.
              </p>
              <div className="flex space-x-4">
                <Twitter className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-slate-800 mb-8" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center text-slate-400">
            <p>&copy; 2024 FirebrandIQ. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}