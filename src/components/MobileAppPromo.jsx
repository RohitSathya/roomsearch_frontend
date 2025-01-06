import React from "react";
import { Card } from "@/components/ui/card";

const MobileAppPromo = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1033729/pexels-photo-1033729.jpeg?auto=compress&cs=tinysrgb&w=600')`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Find Your Dream Property With Just a
                <span className="block mt-2 bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">
                  Single Tap
                </span>
              </h2>
              
              <p className="mt-6 text-lg md:text-xl text-gray-100 leading-relaxed">
                Experience the future of property hunting with our intuitive mobile apps. 
                Available now for iOS and Android devices.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-10">
                <Card className="group hover:-translate-y-1 transition-all duration-300 bg-white/10 backdrop-blur-lg border-0">
                  <a href="#" className="flex items-center space-x-4 px-6 py-4">
                    <div className="rounded-full bg-white/20 p-3 group-hover:bg-white/30 transition-colors">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z"/>
                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Download on the</p>
                      <p className="text-lg font-semibold text-white">App Store</p>
                    </div>
                  </a>
                </Card>

                <Card className="group hover:-translate-y-1 transition-all duration-300 bg-white/10 backdrop-blur-lg border-0">
                  <a href="#" className="flex items-center space-x-4 px-6 py-4">
                    <div className="rounded-full bg-white/20 p-3 group-hover:bg-white/30 transition-colors">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96 2.694-1.586Zm-3.595 2.116L7.583 8.68 1.03 14.73c.201.202.416.371.647.5.78.435 1.575.435 2.355 0l6.595-3.74Zm-6.763.283c.241.129.494.236.76.317l5.766-5.766c.705-.704 1.205-1.505 1.472-2.264l-3.92-2.251-4.078 10.074Zm5.798-12.104 4.078 2.25c-.705-1.174-1.878-1.865-3.18-1.865-1.4 0-2.646.79-3.354 1.865l2.456-2.25Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Get it on</p>
                      <p className="text-lg font-semibold text-white">Google Play</p>
                    </div>
                  </a>
                </Card>
              </div>
            </div>

            {/* Right Content - Phone Mockups */}
            <div className="relative flex-1 flex justify-center items-center">
              <div className="relative w-full max-w-lg">
                {/* Decorative blur effects */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
                
                {/* Phone mockups */}
                <div className="relative space-y-4">
                  <div className="relative z-10 transform -rotate-12 transition-transform duration-500 hover:rotate-0">
                    <img
                      src="https://res.cloudinary.com/dpgf1rkjl/image/upload/v1735969383/xcjrdlyydq8u8rlygwtx.png"
                      alt="Mobile app preview 1"
                      className="w-64 rounded-3xl shadow-2xl"
                    />
                  </div>
                  <div className="absolute top-32 left-32 z-20 transform rotate-12 transition-transform duration-500 hover:rotate-0">
                    <img
                      src="https://beyot.g5plus.net/main/wp-content/uploads/2016/12/iphone-black-207x545.png"
                      alt="Mobile app preview 2"
                      className="w-64 rounded-3xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPromo;
