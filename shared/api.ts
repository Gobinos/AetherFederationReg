/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface Organisation {
  id: string;
  nom: string;
  ville: string;
  president: string;
  contact_president: string;
  description: string;
  created_at?: string;
}

export interface Personne {
  id: string;
  nom: string;
  ville: string;
  date_naissance: string;
  contact: string;
  description: string;
  created_at?: string;
}

export interface Bulletin {
  id: string;
  titre: string;
  contenu: string;
  date_publication: string;
  auteur: string;
}
