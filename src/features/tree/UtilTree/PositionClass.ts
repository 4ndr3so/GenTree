import { Person } from "../../../Model/Person";

export type TipoRelacion = "pareja" | "hijo" | "root" | "expareja" | "padre";
type RelationType = "brothers" | "partnerBrothers" | "brothersFamily";
type Position = { x: number; y: number };

export class PositionClass {
    private people: Person[] = [];
    private canvasWidth: number;


    constructor(canvasWidth = window.innerWidth) {
        this.canvasWidth = canvasWidth;

    }

    public addPeople(person: Person): void {

        this.people.push(person);
        console.log("Person added:", this.people);
    }
    public posicionar(persona: Person, newRelation: TipoRelacion): Position {
        switch (newRelation) {
            case "root":
                return this.posicionarRoot(persona);
            case "pareja":
                return this.posicionarPareja(persona);
            case "hijo":
                return this.posicionarHijo(persona);
            default:
                throw new Error(`Unknown relationship type: ${newRelation}`);
        }
    }

    public posicionarRoot(persona: Person): Position {
        const x = this.canvasWidth / 2;
        const y = 100;
        return { x, y };
    }

    public posicionarPareja(persona: Person): Position {
        const currentPartner = persona.relacion.getCurrentPartner();
        if (currentPartner) {

            const x = currentPartner.positionX + 100;
            const y = currentPartner.positionY;
            persona.setPosition(x, y);
            return { x: persona.positionX, y: persona.positionY };
        }
        return { x: persona.positionX, y: persona.positionY };
    }


    public posicionarHijo(persona: Person): Position {
        const [p1, p2] = persona.relacion.getParents();
        const centroX = p1 && p2
            ? (p1.positionX + p2.positionX) / 2
            : (p1?.positionX || p2?.positionX || window.innerWidth / 2);
        const baseY = (p1?.positionY || p2?.positionY || 100) + 100;
        return { x: centroX, y: baseY };
    }

    public posicionarExPareja(persona: Person): Person {
        const ex = persona.relacion.getExPartners()[0];
        const x = (ex?.positionX ?? persona.positionX) + 500;
        const y = ex?.positionY ?? persona.positionY;
        persona.setPosition(x, y);
        return persona;
    }

    public posicionarPadre(persona: Person): Person {
        const hijo = persona.relacion.getChildren()[0];
        if (hijo?.getIsRoot()) {
            const { x, y } = hijo.getPosition();
            persona.setPosition(x - 50, y - 100);
        }
        return persona;
    }

    public detectarPrimeraColision(personas: Person[], tolerancia = 50): { nodoA: [Person, Person] } | null {
        console.log("Detecting collision among personas:", personas.length);
        for (let i = 0; i < personas.length; i++) {
            const a = personas[i];
            const posA = a.getPosition();

            for (let j = i + 1; j < personas.length; j++) {
                const b = personas[j];
                const posB = b.getPosition();
                const dx = Math.abs(posA.x - posB.x);
                const dy = Math.abs(posA.y - posB.y);

                if (dx <= tolerancia && dy <= tolerancia) {
                    return { nodoA: [a, b] };
                }
            }
        }
        return null;
    }



    private getRelationType(a: Person, b: Person): RelationType {
        const [aParent1, aParent2] = a.relacion.getParents();
        const [bParent1, bParent2] = b.relacion.getParents();

        const sameParents = aParent1 && bParent1 && aParent1.id === bParent1.id &&
            aParent2 && bParent2 && aParent2.id === bParent2.id;

        if (sameParents) return "brothers";

        //look for partners, should be brothers?
        const partnerA = a.relacion.getCurrentPartner();
        const partnerB = b.relacion.getCurrentPartner();
        let aIsPartner = false;
    

        if (aParent1) {
           //if has parents, is not the partner
           let aIsPartner = a.relacion.getSiblings().some(sibling => {
            if (sibling.id === partnerB?.id) {
                 //look foor the siblings and compare to the partner
              return true
            }
          });
          if (aIsPartner) {
            return "partnerBrothers";
          }
        }
        if (bParent1) {
           //if has parents, is not the partner
         let bIsPartner= b.relacion.getSiblings().some(sibling => {
            if (sibling.id === partnerA?.id) {
                //look foor the siblings and compare to the partner
              return true
            }
          });
          if (bIsPartner) {
            return "partnerBrothers";
          }
        }

        return "brothersFamily";
    }

    public resolveCollision(people: Person[], nodeColision: Person[]): Person[] {
        //it is necesary to make a copy??
        //let copyPeople = this.clonarArregloDePersonas(people);

        const [a, b] = nodeColision;

        const relation = this.getRelationType(a, b);
        console.log("Resolving collision between:", a, b, "Relation type:", relation);
        switch (relation) {
            case "brothers":
                //get the parents of the collission nodes
                const [p1, p2] = a.relacion.getParents();
                //organize acording to their parents
              return this.reorganizarHijosConRelaciones([p1, p2]);
  
            case "partnerBrothers":
                // if they have parents, is not the partner
                if(!a.relacion.getParents()){
                    return this.posicionarParejaCollision(a, people);
                }else {
                    return this.posicionarParejaCollision(b, people);
                }
                
                break;
            case "brothersFamily":
                // use standard spacing
                console.log("Handling brothersFamily collision");
                break;
        }
       
        return people
    }

    public reorganizarHijosConRelaciones(
        
        parents: [Person | null, Person | null],
        includeNew?: Person
    ): Person[] {
        //get the parents
        const [p1, p2] = parents;
        //get all the children of the parents
        const rawChildren = [
            ...(p1?.relacion.getChildren() ?? []),
            ...(p2?.relacion.getChildren() ?? []),
            ...(includeNew ? [includeNew] : []),
        ];
        //order and remove duplicates by birthDate
        const hijosUnicos = Array.from(
            new Map(rawChildren.map((p) => [p.birthDate, p])).values()
        ).sort((a, b) => a.birthDate.localeCompare(b.birthDate));

        if (hijosUnicos.length === 0) return [];
        //ubique the center of the parents
        const centroX =
            p1 && p2
                ? (p1.positionX + p2.positionX) / 2
                : p1?.positionX || p2?.positionX || window.innerWidth / 2;
        //base Y position for the children
        const baseY = (p1?.positionY || p2?.positionY || 100) + 100;
        const spacing = 100;

        const nodosVisuales: Person[] = [];
        for (const hijo of hijosUnicos) {
            nodosVisuales.push(hijo);
            const pareja = hijo.relacion.getCurrentPartner();
            if (pareja) nodosVisuales.push(pareja);
        }

        const totalWidth = (nodosVisuales.length - 1) * spacing;
        const startX = centroX - totalWidth / 2;

        const modified: Person[] = [];

        nodosVisuales.forEach((node, index) => {
            const newX = startX + index * spacing;
            const oldX = node.positionX;
            const dx = newX - oldX;

            node.setPosition(newX, baseY);
            this.shiftDescendants(node, dx, 0);
            modified.push(node);
        });
        
        return modified;
    }

    private posicionarParejaCollision(persona: Person, people: Person[]): Person[] {
        console.log("posicionarPareja:", persona.getFullName(), persona.positionX);
        const currentPartner = persona.relacion.getCurrentPartner();
        if (!currentPartner) {//should have a partner
            //just move the persona to the right
            persona.positionX=500;//should not happend
          return people
        }
    
        const refPos = currentPartner.getPosition();
        const siblings = currentPartner.relacion.getSiblings();
        const targetX = refPos.x + 100;
        const targetY = refPos.y;
        //verify egain the collision
        const collision = this.isPositionOccupiedBySibling(targetX, targetY, siblings);
        if (collision) {
          // Ordenar por birthDate
          const ordered = [...siblings, currentPartner].sort((a, b) =>
            (a.birthDate || "").localeCompare(b.birthDate || "")
          );
    
          // Buscar el índice del currentPartner usando ID
          const referenceIndex = ordered.findIndex(p => p.id === currentPartner.id);
    
          const affected = ordered.slice(0, referenceIndex + 1);
    
          affected.forEach(p => {
            const pos = p.getPosition();
            p.setPosition(pos.x - 100, pos.y);
            this.shiftDescendants(p, -100, 0);
          });
    
          persona.setPosition(refPos.x, refPos.y);
  
          return people;//all the people mutable
        }
    
        persona.setPosition(targetX, targetY);
        
     
        return people
      }

    private isPositionOccupiedBySibling(x: number, y: number, siblings: Person[]): boolean {

    return siblings.some(sibling => {
      const pos = sibling.getPosition();
      return pos.x === x && pos.y === y;
    });
  }
    public shiftDescendants(person: Person, dx: number, dy: number): void {
        const pareja = person.relacion.getCurrentPartner();
        const children = person.relacion.getChildren();

        if (pareja) {
            const pos = pareja.getPosition();
            pareja.setPosition(pos.x + dx, pos.y + dy);
        }

        for (const child of children) {
            const pos = child.getPosition();
            child.setPosition(pos.x + dx, pos.y + dy);
            this.shiftDescendants(child, dx, dy);
        }
    }

    public desplazarFamiliaAfectadaPure(person: Person, dx: number, people: Person[]): Person[] {
        const updatedMap = new Map<string, Person>();

        const clonePerson = (p: Person): Person => {
            if (updatedMap.has(p.id)) return updatedMap.get(p.id)!;
            const clone = new Person(p.firstName, p.lastName, p.id);
            clone.positionX = p.positionX;
            clone.positionY = p.positionY;
            clone.relacion = p.relacion;
            updatedMap.set(clone.id, clone);
            return clone;
        };

        const cloneAndShift = (p: Person) => {
            const c = clonePerson(p);
            c.setPosition(c.positionX + dx, c.positionY);
            return c;
        };

        cloneAndShift(person);
        const pareja = person.relacion.getCurrentPartner();
        if (pareja) cloneAndShift(pareja);
        person.relacion.getChildren().forEach(cloneAndShift);

        this.shiftDescendantsPure(person, dx, 0, updatedMap);
        if (pareja) this.shiftDescendantsPure(pareja, dx, 0, updatedMap);

        return people.map(p => updatedMap.get(p.id) || p);
    }

    public shiftDescendantsPure(person: Person, dx: number, dy: number, updatedMap: Map<string, Person>): void {
        const pareja = person.relacion.getCurrentPartner();
        const children = person.relacion.getChildren();

        if (pareja && updatedMap.has(pareja.id)) {
            const parejaClone = updatedMap.get(pareja.id)!;
            const pos = parejaClone.getPosition();
            parejaClone.setPosition(pos.x + dx, pos.y + dy);
        }

        for (const child of children) {
            if (updatedMap.has(child.id)) {
                const childClone = updatedMap.get(child.id)!;
                const pos = childClone.getPosition();
                childClone.setPosition(pos.x + dx, pos.y + dy);
                this.shiftDescendantsPure(childClone, dx, dy, updatedMap);
            }
        }
    }



    public detectarColision(people: Person[], persona: Person): Person[] {
        const colision = this.detectarPrimeraColision(people);
        if (colision) {
            const [a, b] = colision.nodoA;
            let parent = a.id === persona.id ? b.relacion.getParents()[0] : a.relacion.getParents()[0];
            if (parent) {
                const dx = a.positionX < b.positionX ? -50 : 50;
                people = this.desplazarFamiliaAfectadaPure(parent, dx, people);
            }
        }
        return people;
    }



    private clonePerson(p: Person, updatedMap: Map<string, Person>): Person {
        if (updatedMap.has(p.id)) return updatedMap.get(p.id)!;

        const clone = new Person(p.firstName, p.lastName, p.id);
        clone.positionX = p.positionX;
        clone.positionY = p.positionY;
        clone.familyId = p.familyId;
        clone.gender = p.gender;
        updatedMap.set(clone.id, clone); // Prevent infinite recursion

        const rel = p.relacion;

        // Clone current partner
        const partner = rel.getCurrentPartner();
        if (partner) {
            console.log("Clonando pareja", partner);
            const partnerClone = this.clonePerson(partner, updatedMap);
            clone.relacion.setPartner(partnerClone);
        }

        // Clone ex-partners
        for (const ex of rel.getExPartners()) {
            const exClone = this.clonePerson(ex, updatedMap);
            clone.relacion.setExPartner(exClone);
        }

        // Clone parents
        const [parent1, parent2] = rel.getParents();
        if (parent1 && parent2) {
            const p1Clone = this.clonePerson(parent1, updatedMap);
            const p2Clone = this.clonePerson(parent2, updatedMap);
            clone.relacion.setParents(p1Clone, p2Clone);
        } else if (parent1) {
            const p1Clone = this.clonePerson(parent1, updatedMap);
            clone.relacion.setParent(p1Clone);
        } else if (parent2) {
            const p2Clone = this.clonePerson(parent2, updatedMap);
            clone.relacion.setParent(p2Clone);
        }

        // Clone children
        for (const child of rel.getChildren()) {
            const childClone = this.clonePerson(child, updatedMap);
            const otherParent = clone.relacion.getCurrentPartner() ?? new Person("Temp", "Temp", "temp");
            clone.relacion.addChild(childClone, otherParent);
        }

        return clone;
    }
    private clonarArregloDePersonas(personas: Person[]): Person[] {
        const map = new Map<string, Person>();
        return personas.map(p => this.clonePerson(p, map));
    }

}
