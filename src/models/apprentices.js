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
    'דזשעראַלד',
    '杰拉尔德',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export default class Apprentice {

  constructor(RPOT) {
    this.id = Math.random().toString();
    this.name = generateApprenticeName();
    this.lastTick = 0;
    this.tickLength = 1000;
    this.RPOT = RPOT;
    this.RPOT.subscribe(this);
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

  tick(now) {
      if (now > this.lastTick + this.tickLength) {
          this.lastTick = now;
          if (this.can_act) this.act();
          return true;
      }
      return false;
  }

}
