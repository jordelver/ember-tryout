var App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend();
App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});

App.Router = Ember.Router.extend({
  enableLogging: true,
  root: Ember.Route.extend({
    contributors: Ember.Route.extend({
      route: '/',
      showContributor: Ember.Route.transitionTo('aContributor'),
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet('allContributors', App.Contributor.find());
      }
    }),
    aContributor: Ember.Route.extend({
      route: '/:githubUserName',
      connectOutlets: function(router, context){
        router.get('applicationController').connectOutlet('oneContributor', context);
      }
    })
  })
})

App.AllContributorsController = Ember.ArrayController.extend({});
App.AllContributorsView = Ember.View.extend({
  templateName: 'contributors'
});

App.Contributor = Ember.Object.extend({});
App.Contributor.reopenClass({
  allContributors: [],
  find: function() {
    $.ajax({
      url: 'https://api.github.com/repos/emberjs/ember.js/contributors',
      dataType: 'jsonp',
      context: this,
      success: function(response) {
        response.data.forEach(function(contributor) {
          this.allContributors.addObject(App.Contributor.create(contributor))
        }, this)
      }
    });

    return this.allContributors;
  }
});

App.OneContributorView = Ember.View.extend({
  templateName: 'a-contributor'
});
App.OneContributorController = Ember.ObjectController.extend();

App.initialize();
