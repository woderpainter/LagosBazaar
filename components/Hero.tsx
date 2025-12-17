import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { generateMarketingImage } from '../services/geminiService';

export const Hero: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHeroImage = async () => {
      // Avoid regenerating if we already have it in session storage to save time/quota on nav
      const cached = sessionStorage.getItem('lagos_bazaar_hero');
      if (cached) {
          setHeroImage(cached);
          return;
      }

      setLoading(true);
      const prompt = "Front view of a modern Nigerian marketplace called 'LagosBazaar', vibrant and colorful storefront, African style decorations, people shopping and walking around, stalls with hair products, beauty items, electronics, and clothing, sunny day, lively atmosphere, urban Lagos background, high detail, realistic, wide angle, warm and welcoming vibe, cinematic lighting, realistic textures, 8k resolution";
      
      const image = await generateMarketingImage(prompt);
      if (image) {
          setHeroImage(image);
          sessionStorage.setItem('lagos_bazaar_hero', image);
      }
      setLoading(false);
    };

    fetchHeroImage();
  }, []);

  return (
    <div className="relative bg-naija-green overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-naija-green sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Welcome to</span>{' '}
                <span className="block text-naija-accent xl:inline">LagosBazaar.</span>
              </h1>
              <p className="mt-3 text-base text-green-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                The heartbeat of Nigerian commerce. From the finest Adire to the latest gadgets, experience the vibrant energy of Lagos market online.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a href="#featured" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-naija-green bg-white hover:bg-gray-50 md:py-4 md:text-lg">
                    Shop Now
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-800 hover:bg-green-900 md:py-4 md:text-lg">
                    View Deals <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-green-900 relative">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-white space-x-2">
                <Sparkles className="animate-spin h-6 w-6 text-naija-accent" />
                <span className="text-sm font-medium">Generating LagosBazaar View...</span>
            </div>
        )}
        <img
          className={`h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
          src={heroImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"}
          alt="LagosBazaar Marketplace"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-naija-green via-naija-green/50 to-transparent lg:via-transparent"></div>
      </div>
    </div>
  );
};
