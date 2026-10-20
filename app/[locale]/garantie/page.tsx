import { LegalDocument, legalMetadata } from "@/components/editorial/LegalDocument";

export function generateMetadata() {
  return legalMetadata("garantie");
}

export default function WarrantyPage() {
  return <LegalDocument slug="garantie" />;
}
