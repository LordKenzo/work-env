console.log('Hello World');
if (1 == 1) {
  console.log('ciao');
}
function test(arg: number) {
  return arg + 1;
}
test(2);

const t = (aneme: number) => aneme;

t(2);

class Pippo {
  private __name: string;
  protected _cognome: string;

  constructor() {
    this.__name = 'Lorenzo';
    this._cognome = 'Asd';
  }

  nome() {
    return this.__name;
  }
}

const p = new Pippo();
p.nome();
