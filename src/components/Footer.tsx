import { Shield, Heart, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container-narrow section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="gradient-purple rounded-xl p-2">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">Fearless Femmes</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering women through safety, career growth, community support, and health awareness.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Safety", "Career", "Community", "Health"].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <div className="flex flex-col gap-2">
              {["Contact Us", "Volunteer", "Partner With Us", "FAQs"].map((item) => (
                <span key={item} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Emergency</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" /> Women Helpline: 181
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-accent" /> Emergency: 112
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" /> help@sheshield.org
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Fearless Femmes. Built with 💜 for women everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
