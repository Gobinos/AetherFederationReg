import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

export const AnnuaireForm = ({ onPersonAdded }: { onPersonAdded: () => void }) => {
  const [formData, setFormData] = useState({
    nom: "",
    ville: "",
    date_naissance: "",
    contact: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { nom, ville, date_naissance, contact, description } = formData;

    if (!nom || !ville || !date_naissance || !contact || !description) {
      toast.error("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("Annuaire").insert([
        { 
          nom, 
          ville, 
          date_naissance, 
          contact,
          description 
        },
      ]);

      if (error) throw error;

      toast.success("Personne ajoutée à l'annuaire !");
      setFormData({ nom: "", ville: "", date_naissance: "", contact: "", description: "" });
      onPersonAdded();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Ajouter à l'annuaire</CardTitle>
        <CardDescription>Remplissez les informations de la personne</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact (Tél/Email)</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
                className="bg-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description / Notes</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-white"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full mt-4 bg-primary hover:bg-primary/90 transition-all duration-300" 
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Enregistrer dans l'annuaire"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};
