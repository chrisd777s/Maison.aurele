import { LegalDocument, legalMetadata } from "@/components/editorial/LegalDocument";

export function generateMetadata() {
  return legalMetadata("retours");
}

export default function ReturnsPage() {
  return <LegalDocument slug="retours" />;
}
