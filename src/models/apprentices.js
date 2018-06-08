import autobind from 'autobind-decorator';

function generateApprenticeName() {
  const names = [
    'Dimshortz',
    'Ignu Atreiox',
    'Implexion',
    'Jim',
    'Laurel',
    'Nalfung',
    'Red Green',
    'Skoofandr',
    'Gerald',
    'Geraldo',
    'Geralt',
    'Gereld',
    'Gerold',
    'Gerrald',
    'جيرالد',
    'জেরাল্ড',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export default class Apprentice {

  constructor() {
    this.id = Math.random().toString();
    this.name = generateApprenticeName();
  }

  assign(actions) {
    this.actions = actions;
    this.act_index = 0;
  }

  get can_act() {
    return this.actions && this.actions.length;
  }

  @autobind
  act() {
    this.actions[this.act_index]();
    this.act_index = (this.act_index + 1) % this.actions.length;
  }

}

