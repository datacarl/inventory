function updateCollection(e, object, collection, ints) {
    var target = e.target,
        value = target.value,
        attribute = target.attributes['data-attribute'].value,
        update = {};

    // Ensure values in ints list are saved as ints.
    if (ints && _.contains(ints, attribute)) {
      value = parseInt(value);
    }

    update[attribute] = value;

    collection.update(object._id, {$set : update});
}

Template.index.helpers({
  inventory: function() { return Inventory.find(); },
  mainTableSize: function() {
    return Session.get('inventory') ? 'span6' : 'span12';
  },
  details: function() {
    return Session.get('inventory');
  }

});

Template.index.events({
  'keyup input': function(e, tmpl) {
    updateCollection(e, this, Inventory, ['atBoat', 'atHome']);
  },
  'click #add': function(e, tmpl) {
    Inventory.insert({
      name : '',
      atBoat : 0,
      atHome : 0,
      details : '',
      total: function() {
        return this.atBoat + this.atHome;
      },
    });
  },
  'click tr.article': function(e, tmpl) {
    Session.set('inventory', this);
  },
});

Template.details.helpers({
  inventory: function() {
    return Session.get('inventory');
  },
  upcomingServices: function() {
    return Services.find({
      inventoryId: Session.get('inventory')._id,
      completed: false,
    });
  },
  completedServices: function() {
    return Services.find({
        inventoryId: Session.get('inventory')._id,
        completed: true,
      },
      {
        sort: {completedAt : 1}
      },
      {
        limit : 10
      }
    );
  }
});

Template.details.events({
  'keyup .inventory': function(e, tmpl) {
    updateCollection(e, this, Inventory, ['atBoat', 'atHome']);
  },
  'keyup .service': function(e, tmpl) {
    updateCollection(e, this, Services);
  },
  'click #complete-service': function(e, tmpl) {
    Services.update(this._id, {$set : {
        completedAt : Date.now(),
        completed : true,
      }
    });
  },
  'click #add-service': function(e, tmpl) {
    e.preventDefault();
    Services.insert({
      inventoryId : Session.get('inventory')._id,
      completed : false,
      createdAt : Date.now(),
      action : '',
      description : '',
    });
  },
});

Template.services.helpers({
  services: function() {
    return Services.find({
      completed: false,
    })
  },
});
