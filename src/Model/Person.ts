

export class Person  {

    postionX: number;
    postionY: number;
    name: string;
    id: string;
    partner: Person[];
    children: Person[];

      constructor(positionX: number, positionY: number, name: string, id: string) {
            this.postionX = positionX;
            this.postionY = positionY;
            this.name = name;
            this.id = id;
            this.partner = [];
            this.children = [];
        }

    addPartner(partner: Person) {
        if (!this.partner.some(p => p.id === partner.id)) {
            this.partner.push(partner);
        }
    }

    addChild(child: Person) {
        if (!this.children.some(c => c.id === child.id)) {
            this.children.push(child);
        }
    }   
    getPosition() {
        return { x: this.postionX, y: this.postionY };
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.id;
    }
}