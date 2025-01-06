import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ClientsSlider = () => {
  const clients = [
    "https://beyot.g5plus.net/main/wp-content/uploads/2016/11/partner-03.png",
    "https://beyot.g5plus.net/main/wp-content/uploads/2016/11/partner-02.png",
    "https://beyot.g5plus.net/main/wp-content/uploads/2016/11/partner-01.png",
    "https://beyot.g5plus.net/main/wp-content/uploads/2016/11/partner-14.png",
    "https://beyot.g5plus.net/main/wp-content/uploads/2016/11/partner-04.png",
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h3 className="text-lg text-gray-400 uppercase tracking-widest mb-2">
            We Always Have Trust
          </h3>
          <h2 className="text-3xl font-bold text-white">OUR CLIENTS</h2>
        </div>

        {/* Slider Section */}
        <Slider {...settings}>
          {clients.map((client, index) => (
            <div key={index} className="p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center h-28">
                <img
                  src={client}
                  alt={`Client ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ClientsSlider;
