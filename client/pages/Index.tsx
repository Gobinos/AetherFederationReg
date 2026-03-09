import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Organisation, Bulletin, Personne } from "@shared/api";
import { AuthForm } from "@/components/AuthForm";
import { OrganisationForm } from "@/components/OrganisationForm";
import { OrganisationList } from "@/components/OrganisationList";
import { BulletinForm } from "@/components/BulletinForm";
import { BulletinList } from "@/components/BulletinList";
import { AnnuaireForm } from "@/components/AnnuaireForm";
import { AnnuaireList } from "@/components/AnnuaireList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw, LogOut, LayoutDashboard, PlusCircle, Building2, Newspaper, Users, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Index() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("organisations");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      // Refresh data on login/logout to handle RLS
      fetchOrganisations();
      fetchBulletins();
      fetchPersonnes();
    });

    fetchOrganisations();
    fetchBulletins();
    fetchPersonnes();

    return () => subscription.unsubscribe();
  }, []);

  const fetchPersonnes = async () => {
    try {
      console.log("Fetching from Annuaire...");
      const { data, error } = await supabase
        .from("Annuaire")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "PGRST204" || error.code === "PGRST205") {
          console.warn("Table 'Annuaire' non trouvée.");
          setPersonnes([]);
          return;
        }
        throw error;
      }
      setPersonnes(data || []);
    } catch (error: any) {
      console.error("Error fetching annuaire:", error);
    }
  };

  const fetchBulletins = async () => {
    try {
      console.log("Fetching bulletins from Supabase...");
      const { data, error } = await supabase
        .from("Bulletins")
        .select("*")
        .order("date_publication", { ascending: false });

      if (error) {
        if (error.code === "PGRST204" || error.code === "PGRST205") {
          console.warn("Table 'Bulletins' non trouvée. Elle doit être créée dans Supabase.");
          setBulletins([]);
          return;
        }
        throw error;
      }
      setBulletins(data || []);
    } catch (error: any) {
      console.error("Error fetching bulletins detail:", error);
      // Ne pas spammer l'utilisateur avec un toast si la table n'existe pas encore
    }
  };

  const fetchOrganisations = async () => {
    try {
      console.log("Fetching from Supabase...");
      const { data, error } = await supabase
        .from("Organisations")
        .select("*");

      if (error) {
        if (error.code === "PGRST204" || error.code === "PGRST205") {
          console.warn("Table 'Organisations' non trouvée. Elle doit être créée dans Supabase.");
          setOrganisations([]);
          return;
        }
        throw error;
      }
      setOrganisations(data || []);
    } catch (error: any) {
      console.error("Error fetching organisations detail:", error);
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        toast.error("Échec de la connexion à Supabase. Vérifiez si vous avez un bloqueur de publicités (Adblock) ou si le projet Supabase est accessible.");
      } else {
        toast.error(`Erreur de connexion : ${error.message || "Échec de l'appel réseau"}`);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-primary font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-white border-b border-primary/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Ff082825522c84f979aa50677f9c476fe%2F5dea03f3a1d3401381ea140e64e5b588"
              alt="Aether Federation Logo"
              className="h-10 w-auto object-contain"
            />
            <h1
              className="text-xl font-bold text-black tracking-tight"
              style={{ fontFamily: "Actor, sans-serif" }}
            >
              Aether Federation
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchOrganisations();
                fetchBulletins();
                fetchPersonnes();
                toast.info("Données actualisées");
              }}
              className="hidden sm:flex items-center gap-2 text-primary border-primary/20 hover:bg-primary/5"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Connecté: <span className="text-primary font-medium">{user.email}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Quitter
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowLoginForm(!showLoginForm)}
                className="bg-primary hover:bg-primary/90"
              >
                {showLoginForm ? "Fermer" : "Se connecter"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-2 rounded-xl border border-primary/5 shadow-sm">
            <div className="bg-slate-100 p-1 rounded-lg w-full sm:w-auto flex">
              <button
                onClick={() => {
                  setActiveTab("organisations");
                  setShowAddForm(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "organisations"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Building2 className="h-4 w-4" />
                Organisations
              </button>
              <button
                onClick={() => {
                  setActiveTab("bulletin");
                  setShowAddForm(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "bulletin"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Newspaper className="h-4 w-4" />
                Bulletin Officiel
              </button>
              <button
                onClick={() => {
                  setActiveTab("annuaire");
                  setShowAddForm(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "annuaire"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                Annuaire
              </button>
              <button
                onClick={() => {
                  setActiveTab("recherche");
                  setShowAddForm(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === "recherche"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Search className="h-4 w-4" />
                Recherche
              </button>
            </div>

            {user && (
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant={showAddForm ? "outline" : "default"}
                size="sm"
                className="w-full sm:w-auto shadow-sm"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {showAddForm ? "Masquer le formulaire" :
                 activeTab === "organisations" ? "Ajouter une organisation" :
                 activeTab === "annuaire" ? "Ajouter à l'annuaire" : "Rédiger un article"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className={`${user ? "lg:col-span-8" : "lg:col-span-12"} space-y-8`}>
              {!user && (
                <div className="max-w-2xl mx-auto mb-12 text-center space-y-4">
                  <h2 className="text-4xl font-extrabold text-slate-900">Bienvenue sur Aether Federation</h2>
                  <p className="text-lg text-slate-600">
                    Visualisez les organisations en toute simplicité.
                  </p>
                  {showLoginForm && (
                    <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                      <AuthForm onLogin={() => setShowLoginForm(false)} />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "organisations" && (
                <div className="m-0 space-y-6 animate-in fade-in duration-500">
                  {user && showAddForm && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <OrganisationForm onOrgAdded={() => {
                        fetchOrganisations();
                        setShowAddForm(false);
                      }} />
                    </div>
                  )}
                  <OrganisationList
                    organisations={organisations}
                    userLoggedIn={!!user}
                    onRefresh={fetchOrganisations}
                  />
                </div>
              )}

              {activeTab === "bulletin" && (
                <div className="m-0 space-y-6 animate-in fade-in duration-500">
                  {user && showAddForm && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <BulletinForm onBulletinAdded={() => {
                        fetchBulletins();
                        setShowAddForm(false);
                      }} />
                    </div>
                  )}
                  <BulletinList
                    bulletins={bulletins}
                    userLoggedIn={!!user}
                    onRefresh={fetchBulletins}
                  />
                </div>
              )}

              {activeTab === "annuaire" && (
                <div className="m-0 space-y-6 animate-in fade-in duration-500">
                  {user && showAddForm && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <AnnuaireForm onPersonAdded={() => {
                        fetchPersonnes();
                        setShowAddForm(false);
                      }} />
                    </div>
                  )}
                  <AnnuaireList
                    personnes={personnes}
                    userLoggedIn={!!user}
                    onRefresh={fetchPersonnes}
                  />
                </div>
              )}

              {activeTab === "recherche" && (
                <div className="m-0 space-y-8 animate-in fade-in duration-500">
                  <Card className="shadow-lg border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Recherche Globale
                      </CardTitle>
                      <CardDescription>Trouvez n'importe quelle information dans l'application</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher par nom, ville, titre, description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-12 text-lg bg-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {searchQuery.trim() !== "" ? (
                    <div className="space-y-12">
                      {/* Organisations search */}
                      {(() => {
                        const filteredOrgs = organisations.filter(org =>
                          org.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          org.president.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (org.description || "").toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return filteredOrgs.length > 0 && (
                          <section className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                              <Building2 className="h-5 w-5" />
                              Organisations ({filteredOrgs.length})
                            </h3>
                            <OrganisationList
                              organisations={filteredOrgs}
                              userLoggedIn={!!user}
                              onRefresh={fetchOrganisations}
                            />
                          </section>
                        );
                      })()}

                      {/* Annuaire search */}
                      {(() => {
                        const filteredPersonnes = personnes.filter(p =>
                          p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return filteredPersonnes.length > 0 && (
                          <section className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                              <Users className="h-5 w-5" />
                              Annuaire ({filteredPersonnes.length})
                            </h3>
                            <AnnuaireList
                              personnes={filteredPersonnes}
                              userLoggedIn={!!user}
                              onRefresh={fetchPersonnes}
                            />
                          </section>
                        );
                      })()}

                      {/* Bulletins search */}
                      {(() => {
                        const filteredBulletins = bulletins.filter(b =>
                          b.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.auteur.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return filteredBulletins.length > 0 && (
                          <section className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                              <Newspaper className="h-5 w-5" />
                              Bulletins ({filteredBulletins.length})
                            </h3>
                            <BulletinList
                              bulletins={filteredBulletins}
                              userLoggedIn={!!user}
                              onRefresh={fetchBulletins}
                            />
                          </section>
                        );
                      })()}

                      {organisations.filter(org => org.nom.toLowerCase().includes(searchQuery.toLowerCase()) || org.ville.toLowerCase().includes(searchQuery.toLowerCase()) || org.president.toLowerCase().includes(searchQuery.toLowerCase()) || (org.description || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       personnes.filter(p => p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.ville.toLowerCase().includes(searchQuery.toLowerCase()) || p.contact.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       bulletins.filter(b => b.titre.toLowerCase().includes(searchQuery.toLowerCase()) || b.contenu.toLowerCase().includes(searchQuery.toLowerCase()) || b.auteur.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                         <div className="text-center py-20 bg-white rounded-xl border-dashed border-2 border-primary/10">
                           <Search className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                           <p className="text-muted-foreground text-lg">Aucun résultat pour "{searchQuery}".</p>
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-primary/5 shadow-sm">
                      <Search className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">Entrez un terme de recherche pour commencer.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {user && (
              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-primary/5 p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5" />
                      Statut du Compte
                    </h3>
                    <div className="space-y-4">
                       <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Profil</p>
                          <p className="text-sm font-medium">{user.email}</p>
                       </div>

                       <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rôle</p>
                          <p className="text-sm font-medium text-slate-700">Utilisateur Authentifié</p>
                       </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-primary/5 text-center text-sm text-muted-foreground">
        <p>© 2026 Aether Federation</p>
      </footer>
    </div>
  );
}
