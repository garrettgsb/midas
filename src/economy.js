
import MineMezzo from './modules/mine/mezzo.js';

import ResourcePool from './resourcePool.js';

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
    ];
  }

  getSidebarItems() {
    // TODO: return all ESOs?
    // TODO: maybe some consistent sorting pattern?
    return this.esos;
  }

  getMapItems() {
    // TODO: return whatever ESOs have a location?
    return this.esos;
  }

  addNewDamnThing(thingName) {
    throw new Error("not implemented");
    // TODO: big list of addable shit.  maybe ends up being Realtor code?
  }


}


class IndustryESO {
  constructor(bullshit) {
    //super();
    this.rp = new ResourcePool();
    if (bullshit === 'mine') {
      this.mezzo = new MineMezzo();
      this.name = "Mine";
      this.buttonLabel = "Mine";
      this.id = (''+Math.random()).slice(2);
      this.color = '#BB3399';
      this.icon = '☢️';
      this.pos = { x: 860, y: 340 };
    }
  }


  getView() {
    return this.mezzo.getView();
  }
}




