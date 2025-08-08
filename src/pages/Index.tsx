import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Brand Intelligence
          </Badge>
          <h1 className="text-6xl font-bold tracking-tight">
            BrandBuilder Pro
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your brand management with AI-driven insights, sentiment analysis, and social media optimization
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/insights">View AI Demo</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Get personalized action items powered by machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Smart content optimization</li>
                <li>• Automated competitor analysis</li>
                <li>• Performance predictions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>
                Real-time brand sentiment tracking across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Advanced NLP processing</li>
                <li>• Multi-platform monitoring</li>
                <li>• Trend predictions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Social Intelligence</CardTitle>
              <CardDescription>
                Optimize your social media strategy with AI insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Engagement optimization</li>
                <li>• Audience analytics</li>
                <li>• Content recommendations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
