// utils/deserializePeopleArray.ts

import  { Person } from "../../../Model/Person";


export function deserializePeopleArray(data: any[]): Person[] {
  const map = new Map<string, Person>();
  const lookup: Record<string, any> = {};
  data.forEach(d => { lookup[d.id] = d });

  // Primera pasada: crear todas las instancias con datos actualizados
  for (const d of data) {
    if (!map.has(d.id)) {
      const p = new Person(
        d.firstName ?? '',
        d.lastName ?? '',
        d.id,
        d.gender ?? 'U',
        d.birthDate ?? '2000-01-01'
      );
      p.setPosition(d.postionX, d.postionY);
      p.setIsRoot(d.isRoot ?? false);
      if (d.familyId) p.familyId = d.familyId;
      if (d.gedcomId) p.gedcomId = d.gedcomId;
      map.set(d.id, p);
    }
  }

  // Segunda pasada: reconstruir relaciones
  for (const d of data) {
    const person = map.get(d.id)!;

    // Pareja actual
    if (d.relacion?.currentPartner && map.has(d.relacion.currentPartner)) {
      person.relacion.setPartner(map.get(d.relacion.currentPartner)!);
    }

    // Ex-parejas
    d.relacion?.exPartners?.forEach((exId: string) => {
      if (map.has(exId)) {
        person.relacion.setExPartner(map.get(exId)!);
      }
    });

    // Hijos
    d.relacion?.children?.forEach((childId: string) => {
      if (map.has(childId)) {
        const child = map.get(childId)!;
        const otherParent = person.relacion.getCurrentPartner() ?? person;
        person.relacion.addChild(child, otherParent);
      }
    });

    // Padres
    d.relacion?.parents?.forEach((parentId: string | null) => {
      if (parentId && map.has(parentId)) {
        person.relacion.setParent(map.get(parentId)!);
      }
    });
  }

  return Array.from(map.values());
}
