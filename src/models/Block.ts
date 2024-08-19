export class Block {
    value: number;
    color: string = "#000000";

    constructor(value: number) {
        this.value = value;
        this.updateColor();
    }

    setDoubleValue() {
        this.value *= 2;
        this.updateColor();
    }

    updateColor() {
        switch (this.value) {
            case 2:
                this.color = "#eee4da";
                break;
            case 4:
                this.color = "#ece0c6";
                break;
            case 8:
                this.color = "#f2b179";
                break;
            case 16:
                this.color = "#f59563";
                break;
            case 32:
                this.color = "#f57c5f";
                break;
            case 64:
                this.color = "#f75d3b";
                break;
            case 128:
                this.color = "#edce71";
                break;
            case 256:
                this.color = "#edcd60";
                break;
            case 512:
                this.color = "#ecc850";
                break;
            case 1024:
                this.color = "#ecc850";
                break;
            case 2048:
                this.color = "#eec43f";
                break;
            default:
                this.color = "#000000";
                break;
        }
    }
}