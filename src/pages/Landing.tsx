import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, Thermometer, Waves, Fish, Wifi, Shield, ArrowRight } from "lucide-react";
import aquastreamLogo from "@/assets/aquastream-logo.png";

const features = [
  {
    icon: Thermometer,
    title: "Real-time Monitoring",
    description: "Track temperature, pH, and TDS levels with live sensor data updates.",
  },
  {
    icon: Fish,
    title: "Smart Controls",
    description: "Control fish feeder and water pump remotely with one tap.",
  },
  {
    icon: Wifi,
    title: "Remote Access",
    description: "Monitor your aquarium from anywhere via secure cloud connection.",
  },
  {
    icon: Shield,
    title: "Automation",
    description: "Set up automated pH adjustments to maintain optimal water quality.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={aquastreamLogo} alt="AquaStream" className="h-10 w-10 rounded-xl shadow-glass" />
              <span className="text-2xl font-bold gradient-text">AquaStream</span>
            </div>
            <Link to="/auth">
              <Button className="btn-glass bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 animate-fade-in">
            <Droplets className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">IoT Aquarium Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Smart Control for Your
            <span className="gradient-text block mt-2">Aquarium</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Monitor water parameters, control feeding, and automate maintenance—all from your phone or computer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-elevated hover:shadow-glass hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="glass border-border/50 hover:bg-card text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-8 relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Temperature", value: "26.5°C", color: "text-sensor-temp" },
                { label: "pH Level", value: "7.2", color: "text-sensor-ph" },
                { label: "TDS", value: "245 ppm", color: "text-sensor-tds" },
              ].map((item) => (
                <div key={item.label} className="glass rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="h-40 glass rounded-xl flex items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Waves className="h-8 w-8 text-primary animate-shimmer" />
                <span className="text-lg">Live Camera Feed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Powerful features to keep your aquatic environment healthy and thriving.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="glass-card p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 relative z-10">
              Create your account and start monitoring your aquarium today.
            </p>
            <Link to="/auth" className="relative z-10">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-elevated hover:scale-105 transition-all duration-300">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 AquaStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
