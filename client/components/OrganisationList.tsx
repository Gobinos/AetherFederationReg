import { Organisation } from "@shared/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Trash2, User, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

interface OrganisationListProps {
  organisations: Organisation[];
  userLoggedIn: boolean;
  onRefresh: () => void;
}

export const OrganisationList = ({ organisations, userLoggedIn, onRefresh }: OrganisationListProps) => {
  const handleDelete = async (id: string) => {
    if (!userLoggedIn) {
      toast.error("Vous devez être connecté pour supprimer une organisation");
      return;
    }

    if (!confirm("Voulez-vous vraiment supprimer cette organisation ?")) return;

    try {
      const { error } = await supabase.from("Organisations").delete().eq("id", id);
      if (error) throw error;
      toast.success("Organisation supprimée avec succès !");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-primary/10 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-xl md:text-2xl font-bold text-primary flex items-center justify-between">
            Liste des Organisations
            <span className="text-sm font-normal text-muted-foreground bg-primary/5 px-3 py-1 rounded-full">
              {organisations.length} Organisation{organisations.length > 1 ? 's' : ''}
            </span>
          </CardTitle>
          <CardDescription>Consultez les organisations enregistrées</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organisations.map((org) => (
          <Card 
            key={org.id} 
            className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-primary/5 bg-white"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <User className="h-6 w-6" />
                </div>
                {userLoggedIn && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(org.id)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{org.nom}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary/60" />
                  <span>{org.ville}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/60" />
                  <span>Président: {org.president}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary/60" />
                  <span>{org.contact_president}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                  {org.description || "Aucune description fournie."}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {organisations.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border-dashed border-2 border-primary/10">
            <p className="text-muted-foreground">Aucune organisation trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
};
