function updateCollection(e, object, collection, ints) {
    console.log(e, object, collection, ints);
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
  details: function() {
    return Session.get('inventoryId');
  }
});

Template.mainTable.helpers({
  inventory: function() { return Inventory.find(); },
  mainTableSize: function() {
    return Session.get('inventoryId') ? 'span6' : 'span12';
  },
});

Template.mainTable.events({
  'keyup input': function(e, tmpl) {
      console.log('here');
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
    Session.set('inventoryId', this._id);
  },
});

Template.details.helpers({
  inventory: function() {
    return Inventory.findOne(Session.get('inventoryId'));
  },
  upcomingServices: function() {
    return Services.find({
      inventoryId: Session.get('inventoryId'),
      completed: false,
    });
  },
  completedServices: function() {
    return Services.find({
        inventoryId: Session.get('inventoryId'),
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
      inventoryId : Session.get('inventoryId'),
      completed : false,
      createdAt : Date.now(),
      action : '',
      description : '',
    });
  },
});

Template.services.helpers({
  services: function() {
    var services = Services.find({
      completed: false,
    }).fetch();
    _.each(services, function(service) {
      service.inventory = Inventory.findOne(service.inventoryId);
    });
    return services;
  },
});
