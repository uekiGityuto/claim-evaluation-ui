export class CategoryMatrixClass {

  highColor: boolean;
  middleColor: boolean;
  lowColor: boolean;

  constructor(high: string, middle: string, low: string, category: string) {
    this.highColor = false;
    this.middleColor = false;
    this.lowColor = false;

    if (category === high) {
      this.highColor = true;
    } else if (category === middle) {
      this.middleColor = true;
    } else if (category === low) {
      this.lowColor = true;
    }
  }

}
