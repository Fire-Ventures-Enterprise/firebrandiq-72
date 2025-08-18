import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Upload, Image } from "lucide-react";

export default function BrandAssets() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Assets</h1>
          <p className="text-muted-foreground">
            Manage your brand colors, fonts, logos, and visual assets.
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Palette className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Define your brand color palette</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logos & Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Upload and manage logos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <span className="text-2xl font-bold block mb-2">Aa</span>
              <p className="text-muted-foreground text-sm">Define brand fonts</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}