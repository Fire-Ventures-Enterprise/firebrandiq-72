import { useState } from "react";
import { Building2, ChevronDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Mock data for now
const mockBrands = [
  { id: "1", name: "TechStartup Inc", industry: "Technology" },
  { id: "2", name: "Green Coffee Co", industry: "Food & Beverage" },
  { id: "3", name: "Fitness First", industry: "Health & Fitness" },
];

export function BrandSelector() {
  const [selectedBrand, setSelectedBrand] = useState(mockBrands[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">{selectedBrand.name}</div>
              <div className="text-xs text-muted-foreground">{selectedBrand.industry}</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Select Brand</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {mockBrands.map((brand) => (
          <DropdownMenuItem
            key={brand.id}
            onClick={() => setSelectedBrand(brand)}
            className="flex items-center gap-2 py-2"
          >
            <Building2 className="h-4 w-4" />
            <div>
              <div className="font-medium">{brand.name}</div>
              <div className="text-xs text-muted-foreground">{brand.industry}</div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 text-primary">
          <Plus className="h-4 w-4" />
          Create New Brand
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}