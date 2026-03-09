import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

export const OrganisationForm = ({ onOrgAdded }: { onOrgAdded: () => void }) => {
  const [formData, setFormData] = useState({
    nom: "",
    ville: "",
    president: "",
    contact: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { nom, ville, president, contact, description } = formData;

    // Validation (déjà gérée par required mais au cas où)
    if (!nom || !ville || !president || !contact || !description) {
      toast.error("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("Organisations").insert([
        {
          nom,
          ville,
          president,
          contact_president: contact,
          description
        },
      ]);

      if (error) throw error;

      toast.success("Organisation ajoutée avec succès !");
      setFormData({ nom: "", ville: "", president: "", contact: "", description: "" });
      onOrgAdded();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Ajouter une organisation</CardTitle>
        <CardDescription>Remplissez les informations ci-dessous</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'organisation</Label>
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
              <Label htmlFor="president">Nom du Président</Label>
              <Input
                id="president"
                value={formData.president}
                onChange={(e) => setFormData({ ...formData, president: e.target.value })}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Président</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
                className="bg-white"
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="description">Description</Label>
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
            {loading ? "Envoi en cours..." : "Ajouter l'organisation"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};
