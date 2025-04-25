
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="text-2xl font-bold gradient-text mb-4">MarketMind</div>
              <p className="text-gray-500 mb-4 max-w-md">
                Advanced AI tools for SEO content research, optimization, and ranking on both traditional and AI-powered search engines.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-brand-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-brand-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/features" className="text-base text-gray-500 hover:text-brand-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-base text-gray-500 hover:text-brand-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/integrations" className="text-base text-gray-500 hover:text-brand-600">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link to="/changelog" className="text-base text-gray-500 hover:text-brand-600">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/blog" className="text-base text-gray-500 hover:text-brand-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-base text-gray-500 hover:text-brand-600">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-base text-gray-500 hover:text-brand-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-base text-gray-500 hover:text-brand-600">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-brand-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-500 hover:text-brand-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-base text-gray-500 hover:text-brand-600">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-brand-600">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} MarketMind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
