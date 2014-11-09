var UI = require('ui');
var ajax = require('ajax');

var thingList;
var things;

// Retrieve things to control and start UI
ajax(
  {url: 'http://10.0.0.16:3000/things', type: 'json'},
  function(data){
    things = data.things.map(function(thing) {
      return {
        title: thing.name,
        subtitle: 'Status: ' + thing.status
      };
    });

    thingList = new UI.Menu({
      sections: [{
        items: things
      }]
    });

    thingList.on('select', activateThing);
    thingList.show();

  }, function(error) {
    var errorCard = new UI.Card({
      title: 'Error',
      subtitle: 'There was an error communicating with Home Pebble'
    });
    errorCard.show();
  }
);

function activateThing(e) {
  ajax(
    {url: 'http://10.0.0.16:3000/activate/'+e.itemIndex, type: 'json', cache: false },
    function(data){
      things[e.itemIndex].subtitle = 'Status: ' + data.status;
      thingList.items(0, things);
    }, function(error) {
      things[e.itemIndex].subtitle = 'Status: Error communicating';
      thingList.items(0, things);
    }
  );  
}
