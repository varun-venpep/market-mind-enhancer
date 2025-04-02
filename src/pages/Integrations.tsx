
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export default function Integrations() {
  const integrations = [
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect your Shopify store to optimize product listings and enhance SEO performance.",
      icon: ShoppingBag,
      url: "/dashboard/shopify",
      status: "available"
    },
    {
      id: "wordpress",
      name: "WordPress",
      description: "Integrate with WordPress sites to analyze and optimize content for better search visibility.",
      icon: Package,
      url: "#",
      status: "coming-soon"
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Integrations</h1>
            <p className="text-muted-foreground mt-1">
              Connect your website platforms and e-commerce stores for automated SEO optimization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="hover-card transition-all duration-200 border-muted/40">
              <CardHeader className="bg-muted/5">
                <CardTitle className="flex items-center gap-2">
                  <integration.icon className="h-5 w-5 text-primary" />
                  {integration.name}
                </CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end bg-muted/5 border-t p-4">
                {integration.status === "available" ? (
                  <Button asChild>
                    <Link to={integration.url} className="gap-2">
                      Connect
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="gap-2">
                    Coming Soon
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
