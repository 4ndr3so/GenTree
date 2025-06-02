// utils/serializePeople.ts

import type { Person } from "../../../Model/Person";


export function serializePeople(people: Person[]): any[] {
  const serialized: any[] = [];
  const seen = new Set<string>();

  for (const p of people) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);

    serialized.push({
      id: p.id,
      name: p.name,
      postionX: p.postionX,
      postionY: p.postionY,
      isRoot: p.getIsRoot(),
      relacion: {
        currentPartner: p.relacion.getCurrentPartner()?.id ?? null,
        exPartners: p.relacion.getExPartners().map(e => e.id),
        children: p.relacion.getChildren().map(c => c.id),
        parents: p.relacion.getParents().map(p => p?.id ?? null)
      }
    });
  }

  return serialized;
}
