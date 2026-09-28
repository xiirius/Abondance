# PRD — Le Guide de l'Abondance Intérieure

## Problème initial (brut)
Landing page de vente premium, apaisante et rassurante en français pour un ebook « Le Guide de l'Abondance Intérieure » (8,90 €). Tunnel : pop-up obligatoire de capture (prénom + e-mail + consentement RGPD) → page de vente complète personnalisée → paiement Stripe → page de remerciement avec téléchargement PDF. Public : francophones 40-55 ans, développement personnel / spiritualité douce. Aucune technique de pression. Vouvoiement. Couleurs crème/beige/vert sauge/or discret. Interface d'admin simple (prix, e-mail contact, inscrits). Pages légales complètes.

## Architecture
- Frontend : React 19 + Vite + Tailwind v4 (`frontend/src/`), pages : Home (landing), Merci (post-paiement), Admin, Legal (4 routes). Motion (framer-motion) + Lenis pour le scroll fluide.
- Backend : FastAPI (`backend/server.py`) — leads, config publique, admin (mot de passe), Stripe Checkout + webhook + statut, téléchargement PDF vérifié par paiement.
- Base : MongoDB (`leads`, `settings`, `payment_transactions`).
- PDF : `backend/downloads/guide.pdf` (démo, remplaçable).

## Personas
- Visiteur 40-55 ans : arrive pour la lecture gratuite, découvre le guide sans pression.
- Éditeur (admin) : suit inscrits/ventes, modifie prix et e-mail de contact, remplace le PDF.

## Implémenté (28/09/2026)
- Pop-up de capture obligatoire (prénom, e-mail, consentement) avec validation et stockage MongoDB.
- Page de vente complète personnalisée « Bienvenue [Prénom] » : hero cinétique, livre 3D, marquee éditorial, sections Pourquoi / Bénéfices / Contenu / À qui / Engagement honnête / Prix / FAQ / Footer légal.
- Paiement Stripe Checkout réel (sandbox test, SMP — Stripe gère la TVA), webhook `/api/stripe/webhook`, polling de statut.
- Page /merci : confirmation, téléchargement du PDF vérifié côté serveur (403 si non payé).
- Page /admin (mot de passe `abondance2026`) : stats, liste inscrits + export CSV, ventes, édition prix + e-mail contact.
- 4 pages légales : mentions légales, confidentialité, CGV, remboursement (garantie 30 jours).
- E-mails : AUCUN envoi (choix utilisateur — à brancher plus tard).

## Vérifié
- curl : leads (400 sans consentement), config, admin (401 mauvais mdp), checkout Stripe réel, statut, download 403 non payé / 200 payé.
- Navigateur : parcours complet pop-up → hero personnalisé → Stripe (carte 4242) → /merci → bouton téléchargement → PDF reçu. Vue mobile OK. Admin OK.
- `yarn typecheck` propre.

## Backlog priorisé
- P0 : remplacer le PDF de démo par le vrai guide ; personnaliser les mentions légales ([placeholders] éditeur/hébergeur) ; claimer le sandbox Stripe (lien dans test_credentials.md) avant mise en production.
- P1 : envoi réel des e-mails (lecture gratuite + confirmation d'achat) via Resend ou Brevo ; connexion Mailchimp/Brevo/ConvertKit pour les leads.
- P2 : upload du PDF depuis l'admin ; modification des titres/textes depuis l'admin ; statistiques de conversion.

## Prochaines tâches
1. Remplacer `backend/downloads/guide.pdf` par le guide final.
2. Compléter les pages légales avec les informations réelles de l'éditeur.
3. Claimer le compte Stripe pour les paiements réels.
4. Brancher l'envoi d'e-mails quand l'utilisateur est prêt.
