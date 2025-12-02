import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Waves, Thermometer, Droplets, Fish, ArrowRight, Zap } from "lucide-react";
import aquastreamLogo from "@/assets/aquastream-logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-aqua-gradient opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={aquastreamLogo} alt="AquaStream" className="h-10 w-10 rounded-xl" />
            <span className="text-2xl font-bold text-gradient">AquaStream</span>
          </div>
          <Link to="/dashboard">
            <Button className="rounded-full px-6">
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            Smart Aquarium Monitoring
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Monitor Your Aquarium
            <span className="block text-gradient mt-2">Effortlessly</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real-time monitoring of temperature, pH levels, and water quality. 
            Control your fish feeder and water pump from anywhere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-elevated hover:shadow-glow-pump transition-shadow">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto">
          <FeatureCard
            icon={Thermometer}
            title="Temperature Monitoring"
            description="Track water temperature in real-time to ensure optimal conditions for your fish."
            color="text-sensor-temp"
          />
          <FeatureCard
            icon={Droplets}
            title="pH Level Tracking"
            description="Monitor pH levels with automatic alerts when values go outside safe ranges."
            color="text-sensor-ph"
          />
          <FeatureCard
            icon={Waves}
            title="TDS Measurement"
            description="Keep track of total dissolved solids to maintain crystal clear water."
            color="text-sensor-tds"
          />
        </div>

        {/* Control Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
          <FeatureCard
            icon={Fish}
            title="Smart Fish Feeder"
            description="Feed your fish remotely with a single tap. Never miss feeding time again."
            color="text-control-feeder"
          />
          <FeatureCard
            icon={Droplets}
            title="Water Pump Control"
            description="Control water circulation and filtration directly from your dashboard."
            color="text-control-pump"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          © 2024 AquaStream. Smart aquarium monitoring system.
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => (
  <div className="glass-card p-6 space-y-4 hover:shadow-elevated transition-shadow duration-300">
    <div className={`inline-flex p-3 rounded-xl bg-muted ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

export default Landing;
