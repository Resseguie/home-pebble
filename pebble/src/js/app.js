var UI = require('ui');
var ajax = require('ajax');

var thingList;
var things;

// Retrieve things to control and start UI
ajax(
  {url: 'http://10.0.0.16:3000/things', type: 'json'},
  function(data){
    // Create title/subtitle from returned things array
    things = data.things.map(function(thing) {
      return {
        title: thing.name,
        subtitle: 'Status: ' + thing.status
      };
    });

    // Create the menu
    thingList = new UI.Menu({
      sections: [{
        items: things
      }]
    });

    // Add a selection handler
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

// Toggle the selected device on and off
function activateThing(e) {
  ajax(
    {url: 'http://10.0.0.16:3000/activate/'+e.itemIndex, type: 'json', cache: false },
    function(data){
      // Update status text in the menu
      things[e.itemIndex].subtitle = 'Status: ' + data.status;
      thingList.items(0, things);
    }, function(error) {
      things[e.itemIndex].subtitle = 'Status: Error communicating';
      thingList.items(0, things);
    }
  );  
}