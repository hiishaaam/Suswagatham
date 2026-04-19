export const demoEvent: Required<NonNullable<TemplateProps['eventDetails']>> & { functions: string[], groom: any, bride: any } = {
  coupleNames: "Rahul & Priya",
  date: "December 12, 2025",
  venue: "Gokulam Palace, Thrissur, Kerala",
  photoUrl: "",
  functions: ["Nischayam", "Wedding", "Reception"],
  groom: { name: "Rahul Menon", father: "Mr. K.R. Menon" },
  bride: { name: "Priya Nair", father: "Mr. S.K. Nair" },
};

export interface TemplateProps {
  isPreview?: boolean;
  eventDetails?: {
    coupleNames: string;
    date: string;
    venue: string;
    photoUrl?: string;
  };
}
