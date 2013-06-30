Inventory = new Meteor.Collection('inventory', {
  'transform': function(doc) {
    doc.total = function() {
      return this.atBoat + this.atHome;
    }
    return doc;
  },
});

Services = new Meteor.Collection('services');

Meteor.subscribe('inventory');
Meteor.subscribe('services');
