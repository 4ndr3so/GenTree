
import React from "react";
import { DrawChildrenLines } from "../DrawChildrenLines";
import { drawPartnerLines } from "../drawPartnerLines";
import { CircleInfo } from "../CircleInfo";
import type { Person } from "../../../Model/Person";

export function RenderFamilyTree(people: Person[]): React.JSX.Element[] {
    console.log("RenderFamilyTree", people);
  return [
    ...DrawChildrenLines(people),
    ...drawPartnerLines(people),
    ...people.map((p) => (
      <CircleInfo
        key={p.id}
        text={p.name}
        x={p.postionX}
        y={p.postionY}
        radius={25}
      />
    )),
  ];
}
