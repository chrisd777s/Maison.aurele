import { LegalDocument, legalMetadata } from "@/components/editorial/LegalDocument";

export function generateMetadata() {
  return legalMetadata("confidentialite");
}

export default function PrivacyPage() {
  return <LegalDocument slug="confidentialite" />;
}
