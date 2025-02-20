
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/constants/adminMenu";
import { useNavigate } from "react-router-dom";

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard = ({ item }: MenuCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.color} border-none`}
      onClick={() => navigate(item.path)}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/50 rounded-lg group-hover:bg-white/80 transition-colors">
            <item.icon className={`h-5 w-5 ${item.iconColor}`} />
          </div>
          <CardTitle className="text-lg">{item.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">
          {item.description}
        </CardDescription>
        <Button 
          variant="ghost" 
          className="w-full mt-4 bg-white/50 hover:bg-white/80 transition-colors"
        >
          Acessar
        </Button>
      </CardContent>
    </Card>
  );
};
