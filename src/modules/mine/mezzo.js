import React from 'react';


export default class MineMezzo {
  constructor() {
  }




  getView() {
    return MineGameView;
  }

}


const MineGameView = () => {
  return (
    <div> look I am a respectable GameView for a respectable Mine </div>
  );

}

// class MineGameView extends React.Component {
// }
