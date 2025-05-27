import type { PersonNode } from "../../../types/types";


export class CreateConection  {

    
     linex:number;
     liney:number;
     isConnected:boolean;
     radius:number;

      constructor(sourceNode: PersonNode,radius:number) {
            this.linex= sourceNode.x;
            this.liney= sourceNode.y;
            this.isConnected = !!sourceNode.connection;
            this.radius = radius;
            console.log(radius)
        }

    getLinePoints() {
        if (this.isConnected) {
            return [this.linex+this.radius, this.liney, 250, this.liney];
        }
        return null;
    }
}
