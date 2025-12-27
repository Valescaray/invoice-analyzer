import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { FileText, Zap, Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Hero } from '../components/blocks/hero';
import { AuroraBackground } from '../components/ui/aurora-background';
import dashboardPreview from '../assets/images/dashboard_preview.png';
import upwardTrend from '../assets/images/upward_trend_graphic_1766610312927.png';

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process invoices in seconds with AI-powered extraction',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely',
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Get insights into your spending patterns',
    },
  ];

  const benefits = [
    'Extract data from PDFs and images automatically',
    'Organize and search your invoices effortlessly',
    'Track expenses across multiple currencies',
    'Generate detailed reports and analytics',
    'Export data in multiple formats',
    'Secure cloud storage',
  ];

  return (
    <AuroraBackground className="min-h-screen bg-neutral-100">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Invoice Analyzer</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10">
        <Hero
          pill={{
            text: "AI-Powered Invoice Processing",
            href: "/signup",
            icon: <FileText className="h-4 w-4" />,
            variant: "default",
            size: "md",
          }}
          content={{
            title: "Automate Your Invoice",
            titleHighlight: "Processing with AI",
            description:
              "Extract, organize, and analyze your invoices automatically. Save time and reduce errors with intelligent document processing.",
            primaryAction: {
              href: "/signup",
              text: "Get Started Free",
              icon: <ArrowRight className="h-4 w-4" />,
            },
            secondaryAction: {
              href: "/login",
              text: "View Demo",
            },
          }}
          preview={
            <Card className="overflow-hidden shadow-2xl border-0">
              <CardContent className="p-0">
                <img 
                  src={dashboardPreview} 
                  alt="Dashboard Preview" 
                  className="w-full h-full object-cover aspect-video"
                />
              </CardContent>
            </Card>
          }
        />
        </div>

        {/* Features Section */}
        <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your invoices efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        </div>

        {/* Benefits Section */}
        <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose Invoice Analyzer?
              </h2>
              <p className="text-lg text-muted-foreground">
                Our AI-powered platform makes invoice processing effortless, accurate, and fast.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="aspect-video bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg overflow-hidden flex items-center justify-center mt-6">
                      <img 
                        src={upwardTrend} 
                        alt="Upward Trend" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        </div>

        {/* CTA Section */}
        <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="bg-gradient-to-br from-primary-500 to-primary-700 border-0">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-primary-50 max-w-2xl mx-auto">
                Join thousands of businesses automating their invoice processing
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
        </div>

        {/* Footer */}
        <div className="relative z-10">
        <footer className="border-t bg-muted/50 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold">Invoice Analyzer</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automate your invoice processing with AI
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="#" className="hover:text-foreground">Features</Link></li>
                  <li><Link to="#" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link to="#" className="hover:text-foreground">API</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="#" className="hover:text-foreground">About</Link></li>
                  <li><Link to="#" className="hover:text-foreground">Blog</Link></li>
                  <li><Link to="#" className="hover:text-foreground">Careers</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="#" className="hover:text-foreground">Privacy</Link></li>
                  <li><Link to="#" className="hover:text-foreground">Terms</Link></li>
                  <li><Link to="#" className="hover:text-foreground">Security</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 Invoice Analyzer. All rights reserved.</p>
            </div>
          </div>
        </footer>
        </div>
    </AuroraBackground>
  );
};

export default Home;
