import type { GlossaryTerm } from "@packages/shared-types";

export function applyGlossary(text: string, terms: GlossaryTerm[]) {
  let output = text;
  for (const term of terms) {
    output = output.replaceAll(term.source, term.target);
  }
  return output;
}
