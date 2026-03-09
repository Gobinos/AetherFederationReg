import { Bulletin } from "@shared/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Trash2, Calendar, User, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

interface BulletinListProps {
  bulletins: Bulletin[];
  userLoggedIn: boolean;
  onRefresh: () => void;
}

export const BulletinList = ({ bulletins, userLoggedIn, onRefresh }: BulletinListProps) => {
  const handleDelete = async (id: string) => {
    if (!userLoggedIn) {
      toast.error("Vous devez être connecté pour supprimer cet article");
      return;
    }

    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;

    try {
      const { error } = await supabase.from("Bulletins").delete().eq("id", id);
      if (error) throw error;
      toast.success("Article supprimé avec succès !");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {bulletins.map((article) => (
          <Card 
            key={article.id} 
            className="group hover:shadow-xl transition-all duration-300 border-primary/5 bg-white overflow-hidden"
          >
            <div className="h-2 bg-primary group-hover:h-3 transition-all duration-300" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                  {article.titre}
                </CardTitle>
                {userLoggedIn && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(article.id)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary/60" />
                  <span>{formatDate(article.date_publication)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary/60" />
                  <span>{article.auteur}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {article.contenu}
              </p>
            </CardContent>
          </Card>
        ))}

        {bulletins.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-dashed border-2 border-primary/10">
            <Newspaper className="h-12 w-12 text-primary/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Aucun article publié dans le bulletin officiel pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
