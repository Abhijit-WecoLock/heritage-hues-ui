import { cn } from "@/lib/utils";
import heroImage from "@/assets/heritage-museum-hero.jpg";

interface HeroImageProps {
  className?: string;
  alt?: string;
}

const HeroImage = ({ className, alt = "Heritage City Museum" }: HeroImageProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-br from-heritage-brown via-heritage-terracotta to-heritage-olive",
        className
      )}
    >
      {/* Hero Image */}
      <img 
        src={heroImage}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Content overlay */}
      <div className="relative z-10 p-8 text-white flex items-end h-full">
        <div className="text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Heritage City Museum</h2>
          <p className="text-lg opacity-90">Discover 5000 years of human history</p>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;