import { LegalDocument, legalMetadata } from "@/components/editorial/LegalDocument";

export function generateMetadata() {
  return legalMetadata("mentions");
}

export default function LegalNoticePage() {
  return <LegalDocument slug="mentions" />;
}
