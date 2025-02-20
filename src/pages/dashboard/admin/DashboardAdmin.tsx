
import { adminMenuItems } from "@/constants/adminMenu";
import { MenuCard } from "@/components/admin/MenuCard";

const DashboardAdmin = () => {
  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary">
          Painel Administrativo
        </h2>
        <p className="text-muted-foreground">
          Acesse todas as funcionalidades administrativas do sistema
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {adminMenuItems.map((item) => (
          <MenuCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
