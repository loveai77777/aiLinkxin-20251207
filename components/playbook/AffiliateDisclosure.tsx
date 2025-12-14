interface AffiliateDisclosureProps {
  customText?: string | null;
}

/**
 * Affiliate disclosure component
 * Shows default text or custom override if provided
 * Designed to be subtle and not visually loud
 */
export default function AffiliateDisclosure({
  customText,
}: AffiliateDisclosureProps) {
  const text =
    customText ||
    "Some links in this guide may be affiliate links. This does not affect the price you pay.";

  return (
    <p className="text-xs text-gray-500 italic mb-4">{text}</p>
  );
}




