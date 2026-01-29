import {
  Truck,
  ShieldCheck,
  Headphones,
  RefreshCcw,
} from "lucide-react";
import { JSX } from "react";

interface Service {
  title: string;
  description: string;
  icon: JSX.Element;
}

const services: Service[] = [
  {
    title: "Fast Delivery",
    description: "Quick and reliable shipping on all orders.",
    icon: <Truck className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Secure Payments",
    description: "100% secure payment gateways for safe checkout.",
    icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "24/7 Support",
    description: "Our customer support is available anytime.",
    icon: <Headphones className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Easy Returns",
    description: "Simple and hassle-free return policy.",
    icon: <RefreshCcw className="w-10 h-10 text-blue-600" />,
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-indigo-950 dark:to-gray-900 text-white py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 leading-relaxed">
            We provide top-quality services to enhance your shopping experience.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Us?</h2>
          <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-8 leading-relaxed">
            We combine quality products, excellent customer service, and competitive prices to give you the best shopping experience possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-semibold">Trusted by 10,000+ customers</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-semibold">4.8★ Average Rating</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="font-semibold">Fast Worldwide Shipping</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
