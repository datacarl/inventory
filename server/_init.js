Inventory = new Meteor.Collection('inventory');
Services = new Meteor.Collection('services');

if (!Inventory.find().count()) {
  Inventory.insert({
    'name': 'Lampa',
    'atBoat' : 1,
    'atHome' : 2,
    'total': function() {
      return this.atBoat + this.atHome;
    },
  });
  Inventory.insert({
    'name': 'Slang',
    'atBoat' : 1,
    'atHome' : 2,
  });
}

Meteor.publish('inventory', function() {
  return Inventory.find();
});

Meteor.publish('services', function() {
  return Services.find();
});
