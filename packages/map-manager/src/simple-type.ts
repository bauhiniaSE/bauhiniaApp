export interface TestInterface {
  val: string;
  num: number;
}

class Greeting {
  public greet(): void {
    console.log('Hello World!!!');
  }
}

var obj = new Greeting();
obj.greet();
