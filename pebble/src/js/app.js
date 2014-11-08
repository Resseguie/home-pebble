var UI = require('ui');
var ajax = require('ajax');

var activeThing;
var thingList;

var activeTimeout;
var mainTimeout;

var main = new UI.Card({
  title: 'Home Pebble',
  subtitle: 'Control your home from your wrist!'
});

var activeCard = new UI.Card();
activeCard.on('click', function(e) {
  activeCard.body('Status: ...');
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
  clearTimeout(activeTimeout);
  clearTimeout(mainTimeout);

  ajax(
    {url: 'http://10.0.0.16:3000/action/'+activeThing.index, type: 'json', cache: false },
    function(data){
      activeCard.title(activeThing.title);
      activeCard.subtitle(activeThing.subtitle);
      activeCard.body('Status: ' + data.status);
      activeCard.show();

      // close active thing window
      activeTimeout = setTimeout(function() {
        activeCard.hide();
      }, 5000);

      // close whole app if no action
      mainTimeout = setTimeout(function() {
        thingList.hide();
        main.hide();
      }, 15000);

    }, function(error) {
      console.log('error: ', error);
      activeCard.body('Communication Error');
    }
  );  
}
