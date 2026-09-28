import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/landing/Logo";
import { useConfig } from "@/lib/useConfig";
import { ArrowLeft } from "lucide-react";

interface LegalContent {
  title: string;
  sections: { heading: string; body: string[] }[];
}

function buildContent(email: string): Record<string, LegalContent> {
  return {
    "mentions-legales": {
      title: "Mentions légales",
      sections: [
        {
          heading: "Éditeur du site",
          body: [
            "Ce site est édité par [Nom ou raison sociale de l'éditeur], [forme juridique], [adresse postale], [SIRET]. Directeur de la publication : [Nom].",
            `Contact : ${email}`,
          ],
        },
        {
          heading: "Hébergement",
          body: ["Ce site est hébergé par [Nom de l'hébergeur], [adresse], [téléphone]."],
        },
        {
          heading: "Propriété intellectuelle",
          body: [
            "L'ensemble des contenus du site (textes, visuels, guide numérique) est protégé par le droit d'auteur. Toute reproduction sans autorisation écrite est interdite.",
          ],
        },
        {
          heading: "Nature du contenu",
          body: [
            "Ce site propose du contenu de bien-être et de développement personnel. Il ne constitue pas un avis médical, psychologique, juridique ou financier.",
          ],
        },
      ],
    },
    confidentialite: {
      title: "Politique de confidentialité",
      sections: [
        {
          heading: "Données collectées",
          body: [
            "Lors de votre inscription, nous collectons votre prénom et votre adresse e-mail, avec votre consentement explicite, afin de vous envoyer votre lecture personnalisée gratuite et des communications liées au guide.",
            "Lors d'un achat, les informations de paiement sont traitées exclusivement par Stripe, notre prestataire de paiement sécurisé. Nous ne stockons jamais vos données bancaires.",
          ],
        },
        {
          heading: "Utilisation des données",
          body: [
            "Vos données servent uniquement à : l'envoi de votre lecture gratuite, la communication autour du guide, et la gestion de votre commande. Elles ne sont ni vendues, ni cédées à des tiers à des fins commerciales.",
          ],
        },
        {
          heading: "Vos droits (RGPD)",
          body: [
            "Vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition sur vos données. Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque e-mail.",
            `Pour exercer vos droits : ${email}`,
          ],
        },
        {
          heading: "Conservation",
          body: [
            "Vos données sont conservées le temps nécessaire à la relation commerciale, puis supprimées ou anonymisées.",
          ],
        },
      ],
    },
    cgv: {
      title: "Conditions générales de vente",
      sections: [
        {
          heading: "Produit",
          body: [
            "Le Guide de l'Abondance Intérieure est un produit numérique au format PDF, téléchargeable immédiatement après confirmation du paiement. Il s'agit d'un support de développement personnel, sans promesse de résultat particulier.",
          ],
        },
        {
          heading: "Prix et paiement",
          body: [
            "Le prix affiché sur la page de vente est un prix unique, en euros, toutes taxes comprises. Le paiement s'effectue en une seule fois via la plateforme sécurisée Stripe (carte bancaire, Apple Pay lorsque disponible). Aucun abonnement n'est souscrit.",
          ],
        },
        {
          heading: "Livraison",
          body: [
            "Le guide est mis à disposition par téléchargement immédiat sur la page de confirmation, accessible après paiement validé.",
          ],
        },
        {
          heading: "Droit de rétractation",
          body: [
            "Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement avec votre accord exprès. Notre politique de remboursement (voir page dédiée) reste toutefois applicable.",
          ],
        },
      ],
    },
    remboursement: {
      title: "Politique de remboursement",
      sections: [
        {
          heading: "Notre engagement",
          body: [
            "Nous souhaitons que ce guide vous soit réellement utile. Si, après lecture et application sincère des exercices, vous estimez qu'il ne vous a rien apporté, vous pouvez demander un remboursement intégral dans les 30 jours suivant votre achat.",
          ],
        },
        {
          heading: "Comment faire une demande",
          body: [
            `Écrivez-nous simplement à ${email} en indiquant l'adresse e-mail utilisée lors de l'achat. Nous vous répondons avec bienveillance, sans justification compliquée ni formulaire interminable.`,
          ],
        },
        {
          heading: "Délai de traitement",
          body: [
            "Les remboursements sont traités sous 5 à 10 jours ouvrés, via le même moyen de paiement que celui utilisé lors de l'achat.",
          ],
        },
      ],
    },
  };
}

export default function Legal() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, "") || "mentions-legales";
  const config = useConfig();
  const content = buildContent(config.contact_email)[slug] ?? buildContent(config.contact_email)["mentions-legales"];

  return (
    <div className="grain min-h-screen bg-cream" data-testid={`legal-page-${slug}`}>
      <header className="border-b border-line bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <Link to="/" data-testid="legal-logo-link"><Logo /></Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 font-sans text-sm text-muted-warm transition-colors hover:text-ink"
            data-testid="legal-back-home"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <h1 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl" data-testid="legal-title">
          {content.title}
        </h1>
        <div className="mt-10 space-y-10">
          {content.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-heading text-xl tracking-tight text-ink">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-base leading-relaxed text-muted-warm">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-14 border-t border-line pt-8 text-xs leading-relaxed text-muted-warm/80">
          Ce site propose du contenu de bien-être et de développement personnel. Il ne constitue pas
          un avis médical, psychologique, juridique ou financier.
        </p>
      </main>
    </div>
  );
}
