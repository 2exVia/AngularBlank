// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])



app.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    
    // Langue 
  	$rootScope.lang = 'en';
    
  });
});



app.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
  // note that you can also chain configs
  $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
  
  // Navigation
  $stateProvider
  .state('home', {
	    url: '/home',
      templateUrl: 'Home.html',
      controller: 'HomeCtrl'
	  })

	.state('page1', {
    url: '/page1',
    templateUrl: 'Page1.html',
    controller: 'PageCtrl'
	});

  
	 // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tunnel');
  $urlRouterProvider.otherwise('/home');
});
