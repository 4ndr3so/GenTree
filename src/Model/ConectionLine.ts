export class ConnectionLine {
    linex: number;
    liney: number;
    isConnected: boolean;
    radius: number;
    width: number = 2;

    constructor(linex: number, liney: number, isConnected: boolean, radius: number,width: number = 100) {
        if (radius <= 0) {
            throw new Error("Invalid radius");
        }
        this.linex = linex;
        this.liney = liney;
        this.isConnected = isConnected;
        this.radius = radius;
        this.width = width;
    }

    getLinePoints() {
        if (this.isConnected) {
            return [this.linex + this.radius, this.liney, this.linex + this.radius+this.width, this.liney];
        }
        return null;
    }

}