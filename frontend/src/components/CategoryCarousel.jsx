import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';
import { Code2, Megaphone, Palette, HeartPulse, DollarSign, PenTool } from 'lucide-react';

const categories = [
    { name: "Technology", jobs: "1,200+", icon: <Code2 /> },
    { name: "Marketing", jobs: "850+", icon: <Megaphone /> },
    { name: "Design", jobs: "640+", icon: <Palette /> },
    { name: "Healthcare", jobs: "980+", icon: <HeartPulse /> },
    { name: "Finance", jobs: "1,100+", icon: <DollarSign /> },
    { name: "Writing", jobs: "450+", icon: <PenTool /> },
    // Add more categories as needed
];

const CategoryCarousel = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Explore by <span className="text-purple-600">Category</span>
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Find the right job for you by browsing popular categories.
                    </p>
                </div>
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                    className="!pb-2 !px-10" // Add padding for navigation arrows
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={index}>
                            <Link to={`/jobs?category=${category.name}`} className="block group">
                                <div className="text-center p-8 border border-gray-200 rounded-2xl h-full group-hover:border-purple-300 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                    <div className="inline-flex items-center justify-center h-16 w-16 bg-purple-100 text-purple-600 rounded-full mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        {React.cloneElement(category.icon, { size: 32, strokeWidth: 1.5 })}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{category.jobs} Jobs</p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategoryCarousel;