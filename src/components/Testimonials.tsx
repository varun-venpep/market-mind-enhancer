
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Strategist, TechCrunch",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote: "MarketMind has completely transformed our content creation process. We're producing higher quality articles in half the time, and our organic traffic has increased by 43% in just 3 months."
  },
  {
    name: "Michael Chen",
    role: "SEO Manager, Shopify",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote: "The AI search intent analysis gives us insights that would take days to compile manually. Our team can now focus on creating exceptional content instead of endless research."
  },
  {
    name: "Jessica Williams",
    role: "Marketing Director, Hubspot",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    quote: "We've tried every content optimization tool out there, and MarketMind is by far the most comprehensive. It's like having an expert SEO consultant guiding every piece of content we create."
  }
];

const Testimonials = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-14">
          <h2 className="text-base text-brand-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by content leaders
          </p>
        </div>
        
        <div className="mt-10">
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex flex-col h-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      className="h-12 w-12 rounded-full"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 flex-grow italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
