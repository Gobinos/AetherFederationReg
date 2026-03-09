import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

export const BulletinForm = ({ onBulletinAdded }: { onBulletinAdded: () => void }) => {
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
    auteur: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { titre, contenu, auteur } = formData;

    if (!titre || !contenu || !auteur) {
      toast.error("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("Bulletins").insert([
        { 
          titre, 
          contenu, 
          auteur,
          date_publication: new Date().toISOString()
        },
      ]);

      if (error) throw error;

      toast.success("Article publié avec succès !");
      setFormData({ titre: "", contenu: "", auteur: "" });
      onBulletinAdded();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/10 mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Publier un Article au Bulletin Officiel</CardTitle>
        <CardDescription>Cet article sera visible par tous les utilisateurs</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre de l'article</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auteur">Auteur / Signature</Label>
            <Input
              id="auteur"
              value={formData.auteur}
              onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
              required
              placeholder="Ex: Secrétariat Général"
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contenu">Contenu</Label>
            <Textarea
              id="contenu"
              value={formData.contenu}
              onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
              required
              rows={5}
              className="bg-white"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-300" 
            disabled={loading}
          >
            {loading ? "Publication en cours..." : "Publier l'article"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};
