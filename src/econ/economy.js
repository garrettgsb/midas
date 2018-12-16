import autobind from 'autobind-decorator';

import MineMezzo from 'MODULES/mine/mezzo.js';

import Location from 'ECON/location.js';
import ResourcePool from 'ECON/resourcePool.js';
import Vendor from 'ECON/vendor.js';
import RPOT from 'LIB/rpot';

//      // Mock map objects
//      // These were previously used to populate the list of dummy ESOs, in case we want that //      again.
//      items: [
//        { id: 12345, pos: { x: 150, y: 280 }, color: '#3399BB', icon: '🏠',
//          clickAction: () => this.changeModalTo(12345),
//          buttonLabel: 'A house' // We probably don't actually have a house
//        },
//        { id: 333, pos: { x: 460, y: 140 }, color: '#99BB33', icon: '⛪️',
//          clickAction: () => this.changeModalTo(333),
//          buttonLabel: 'A church' // We probably don't actually have a church
//        },
//        { id: 9000, pos: { x: 860, y: 440 }, color: '#BB3399', icon: '☢️',
//          clickAction: () => this.changeModalTo(9000),
//          buttonLabel: 'Mine',
//          modal: MineModal,
//        },
//      ],

export default class Economy {
  constructor() {
    this.esos = [
      new IndustryESO('mine'),
      // new IndustryESO('market'),
    ];
    this.rpot = new RPOT({period_ms: 1000});
    for (let eso of this.esos) {
      this.rpot.subscribe(eso.tick);
    }
    window.economy = this;
  }

  getById(id) {
    return this.esos.find(eso => eso.id === id);
  }

  getSidebarItems() {
    // TODO: maybe some consistent sorting pattern?
    return this.esos;
  }

  getMapItems() {
    return this.esos.filter(eso => eso.loc);
  }

  addNewDamnThing(thingName) {
    // The hypothesis here is that there ends up being a list here of addable ESOs.
    // Like maybe this morphs into the Realtor.  Then again, maybe everything is pre-added.
    // Whatever.
    throw new Error("not implemented");
  }


}


class IndustryESO {
  constructor(bullshit) {
    //super();
    this.rp = new ResourcePool();
    this.loc = new Location({x: 860, y: 340});
    if (bullshit === 'mine') {
      this.mezzo = new MineMezzo(this);
      this.name = "Mine";
      this.buttonLabel = "Mine";
      this.id = (''+Math.random()).slice(2);
      this.color = '#BB3399';
      this.icon = '☢️';
    } else if (bullshit === 'market') {
      this.mezzo = new MineMezzo(this);     // TODO: oh, boof, I need a whole new mezzo here
      this.loc = new Location({x: 150, y: 280});
      this.name = "Market (broken)";
      this.buttonLabel = "Market (broken)";
      this.id = (''+Math.random()).slice(2);
      this.color = '#3399BB';
      this.icon = '🏠';
      this.vend = new Vendor();
    }
  }

  @autobind
  tick(todoT, totalT, deltaT) {  // returns scrapsT
    return this.mezzo.overworldTick(todoT, totalT, deltaT);
  }


  getView() {
    return this.mezzo.getView();
  }
}




