import { LegalDocument, legalMetadata } from "@/components/editorial/LegalDocument";

export function generateMetadata() {
  return legalMetadata("conditions");
}

export default function TermsPage() {
  return <LegalDocument slug="conditions" />;
}
