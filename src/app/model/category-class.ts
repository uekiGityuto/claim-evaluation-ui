export class CategoryClass {

  highBgColor: boolean;
  middleBgColor: boolean;
  lowBgColor: boolean;

  constructor(high: string, middle: string, low: string, category: string) {
    this.highBgColor = false;
    this.middleBgColor = false;
    this.lowBgColor = false;

    if (category === high) {
      this.highBgColor = true;
    } else if (category === middle) {
      this.middleBgColor = true;
    } else if (category === low) {
      this.lowBgColor = true;
    }
  }

}
