var UI = require('ui');
var ajax = require('ajax');

var activeThing;
var thingList;

var main = new UI.Card({
  title: 'Home Pebble',
  subtitle: 'Control your home from your wrist!'
});

var actionCard = new UI.Card();
actionCard.on('click', function(e) {
  actionCard.body('Status: ...');
  takeAction(activeThing);
});


main.show();

// Retrieve things to control
ajax(
  {url: 'http://10.0.0.16:3000/things', type: 'json', cache: false},
  function(data){
    thingList = new UI.Menu({
      sections: [{
        items: data.things.map(function(thing) {
          return {title: thing.name, subtitle: thing.action};
        })
      }]
    });
    thingList.on('select', function(e) {
      activeThing = {
        index: e.itemIndex,
        title: e.item.title,
        subtitle: e.item.subtitle
      };
      takeAction(activeThing);
    });

    // Now that thingList is ready, add main click handler
    main.on('click', function(e) {
      thingList.show();
    });

  }, function(error) {
    console.log('error: ', error);
  }
);

function takeAction(activeThing) {
  ajax(
    {url: 'http://10.0.0.16:3000/action/'+activeThing.index, type: 'json', cache: false },
    function(data){
      actionCard.title(activeThing.title);
      actionCard.subtitle(activeThing.subtitle);
      actionCard.body('Status: ' + data.status);
      actionCard.show();
    }, function(error) {
      console.log('error: ', error);
      actionCard.body('Communication Error');
    }
  );  
}
