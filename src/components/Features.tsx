
import { 
  Search, 
  Zap, 
  Layers, 
  BarChart, 
  Star, 
  Edit 
} from "lucide-react";

const features = [
  {
    name: "AI Search Intent Analysis",
    description: "Our AI analyzes thousands of top-ranking pages to understand exactly what users are looking for when they search specific keywords.",
    icon: Search
  },
  {
    name: "Advanced Topic Research",
    description: "Discover untapped topics and questions your audience is asking, with popularity trends and competition metrics.",
    icon: Layers
  },
  {
    name: "SEO Content Briefs",
    description: "Generate comprehensive content briefs with recommendations for headings, keywords, word count, and topics to cover.",
    icon: Edit
  },
  {
    name: "Content Score Prediction",
    description: "Before you publish, get a predicted score of how well your content will rank for your target keywords.",
    icon: BarChart
  },
  {
    name: "AI Search Engine Optimization",
    description: "Specific recommendations to make your content more likely to be surfaced in AI search engines like Claude, ChatGPT, and Perplexity.",
    icon: Star
  },
  {
    name: "Real-time Content Assistant",
    description: "Get feedback and suggestions as you write to ensure your content is hitting all the key points needed to rank.",
    icon: Zap
  }
];

const Features = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-brand-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Better content, better rankings
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            MarketMind provides all the tools you need to create content that ranks high on both traditional and AI-powered search engines.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="pt-6 group">
                <div className="flow-root h-full rounded-lg bg-white/60 border border-gray-200 px-6 pb-8 shadow-md group-hover:shadow-lg group-hover:border-brand-200 transition-all duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-brand-500 p-3 shadow-lg gradient-button">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-brand-600 transition-colors">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
