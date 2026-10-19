/** Requêtes Storefront API. Les métadonnées propres à la Maison vivent sous l'espace `aurele`. */

const PRODUCT_FIELDS = `
  handle
  title
  description
  options { name optionValues { name } }
  variants(first: 100) {
    nodes { price { amount currencyCode } selectedOptions { name value } availableForSale }
  }
  metafields(identifiers: [
    { namespace: "aurele", key: "reference" }
    { namespace: "aurele", key: "collection" }
    { namespace: "aurele", key: "category" }
    { namespace: "aurele", key: "summary" }
    { namespace: "aurele", key: "stones" }
    { namespace: "aurele", key: "metal_weight_g" }
    { namespace: "aurele", key: "certificate" }
    { namespace: "aurele", key: "lead_time" }
    { namespace: "aurele", key: "provenance_code" }
    { namespace: "aurele", key: "visual_form" }
    { namespace: "aurele", key: "featured" }
    { namespace: "aurele", key: "size_kind" }
  ]) { key value }
`;

const COLLECTION_FIELDS = `
  handle
  title
  metafields(identifiers: [
    { namespace: "aurele", key: "order" }
    { namespace: "aurele", key: "tagline" }
    { namespace: "aurele", key: "stones_line" }
    { namespace: "aurele", key: "inspiration" }
    { namespace: "aurele", key: "signature_metal" }
  ]) { key value }
`;

export const PRODUCTS_QUERY = `
  query Products($language: LanguageCode, $query: String) @inContext(language: $language, country: CA) {
    products(first: 100, query: $query) { nodes { ${PRODUCT_FIELDS} } }
  }
`;

export const PRODUCT_QUERY = `
  query Product($language: LanguageCode, $handle: String!) @inContext(language: $language, country: CA) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections($language: LanguageCode) @inContext(language: $language, country: CA) {
    collections(first: 20) { nodes { ${COLLECTION_FIELDS} } }
  }
`;
