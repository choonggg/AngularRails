angular.module('flapperNews', ['ui.router', 'templates'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'home/_home.html',
          controller: 'MainCtrl',
          resolve: {
            postPromise: ['posts', function(posts){
              return posts.getAll();
            }]
          }
        })
        .state('posts', {
          url: '/posts/{id}',
          templateUrl: 'posts/_posts.html',
          controller: 'PostCtrl',
          resolve: {
            post: ['$stateParams', 'posts', function($stateParams, posts){
              return posts.get($stateParams.id);
            }]
          }
        });
      $urlRouterProvider.otherwise('home');
    }
  ])
  .factory('posts', [
    '$http',
    function($http){
      var urlBase = '/posts.json/';
      var upvote = '/upvote.json/';
      function getPostIdLink(a){
        var link = '/posts/' + a + '.json';
        return link;
      };

      var o = { posts: [] };
      o.getAll = function() {
        return $http.get(urlBase).success(function(data){
          angular.copy(data, o.posts);
        });
      };
      o.create = function(post){
        return $http.post(urlBase, post).success(function(data){
          o.posts.push(data);
        });
      };
      o.upvote = function(post){
        return $http.put('/posts/' + post.id + upvote)
          .success(function(data){
            post.upvotes += 1;
          });
      };
      o.get = function(id){
        return $http.get(getPostIdLink(id)).then(function(res){
          return res.data;
        });
      };
      o.addComment = function(id, comment){
        return $http.post('/posts/' + id + '/comments.json', comment);
      };
      o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post.id + '/comments/'+ comment.id + '/upvote.json')
          .success(function(data){
            comment.upvotes += 1;
          });
      };
      return o;
    }]);