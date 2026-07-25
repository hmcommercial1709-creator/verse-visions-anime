/**
 * Character Relationships
 * -----------------------
 * Directed edges between characters. Rendered on character pages via
 * the content registry.  Only add relationships that are canonical or
 * clearly established in the source material — do NOT infer.
 */

export type RelationshipKind =
  | "ally"
  | "rival"
  | "family"
  | "mentor"
  | "student"
  | "enemy"
  | "teammate"
  | "romantic-interest"
  | "organization";

export type CharacterRelationship = {
  from: string; // character slug
  to: string; // character slug
  kind: RelationshipKind;
  note: string;
  publicationStatus?: "draft" | "review" | "published" | "archived";
};

export const characterRelationships: CharacterRelationship[] = [
  {
    from: "naruto-uzumaki",
    to: "sasuke-uchiha",
    kind: "rival",
    note: "Team 7's central rivalry — mirrored childhoods, opposite conclusions.",
  },
  {
    from: "naruto-uzumaki",
    to: "kakashi-hatake",
    kind: "student",
    note: "Team 7's jonin sensei; Kakashi treats Naruto as Minato's son long before Naruto learns why.",
  },
  {
    from: "kakashi-hatake",
    to: "naruto-uzumaki",
    kind: "mentor",
    note: "The teacher whose lesson about teammates outlives every fight in the series.",
  },
  {
    from: "sakura-haruno",
    to: "sasuke-uchiha",
    kind: "romantic-interest",
    note: "Her early crush deepens into a decade-long commitment the show treats with more weight than most shonen romances.",
  },
];

export function relationshipsFor(characterSlug: string) {
  return characterRelationships.filter(
    (r) => r.from === characterSlug || r.to === characterSlug,
  );
}
