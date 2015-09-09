angular.module('starter.controllers', [])


.controller('RootCtrl', function($scope, $rootScope, $cordovaNetwork, $ionicPopup, $ionicLoading, $ionicPlatform, $state, $window, $timeout, $sce, $cordovaToast, DataService) {
	//
	// $rootScope.webservicesUri = "https://intradomus.net/app/ws.php";


	// ===========================================================================
	// FONCTIONS UTILES
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// Gestionnaire de données persistantes
	// $rootScope.globalData
	$scope.saveGlobalData = function(){
		$window.localStorage.setItem("globalData",angular.toJson($rootScope.globalData));
	}

	$scope.initGlobalData = function(){
		var gd = $window.localStorage.getItem("globalData");
		if(gd && gd!="undefined"){
			$rootScope.globalData = angular.fromJson($window.localStorage.getItem("globalData"));
		}else{
			$rootScope.globalData={};
		}
	}
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// Check network
	$scope.isOnline = function(){
		return $cordovaNetwork.isOnline();
	}
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// LIENS EXTERNES
	// ouvre les liens http
	$scope.openLink = function(link){
		if(!$scope.isOnline()){
			$cordovaToast.showLongCenter($scope.trads.checkNetwork).then(function(success) {});
		}else{
			console.warn(link)
			$window.open(link,'_blank','location=yes');
		}
	}

	// ouvre les mailto et les fichiers
	$scope.openSys = function(link){
		if(!$scope.isOnline()){
			$cordovaToast.showLongCenter($scope.trads.checkNetwork).then(function(success) {});
		}else{
			$window.open(link,'_system');
		}
	}
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// LOGIN
	$scope.initAuth = function(){
		$rootScope.auth = {"connecte":0};

		if($window.localStorage.getItem("auth")){
			$rootScope.auth = angular.fromJson($window.localStorage.getItem("auth"));
		}
		console.log("*** initAuth")
		console.warn($rootScope.auth)
	}

	// logout
	$scope.logout = function(){
		$window.localStorage.setItem("auth","");
		$rootScope.auth = {"connecte":0};
	}

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	// ALERTE
	$scope.alerte = function(title, content, doAfter) {
		var doAfter = doAfter || function(){};
	  var alertPopup = $ionicPopup.alert({
	    title: title,
	    template: content,
	    buttons: [{text:$scope.trads.ok,type: 'button-positive'}]
	  });
	  alertPopup.then(doAfter);
 	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 	// PRELOADER 
	$scope.showPreloader = function(){
		$ionicLoading.show({
		    animation: 'fade-in',
		    showBackdrop: false,
		    maxWidth: 200,
		    showDelay: 100
		});
	}
	//
	$scope.hidePreloader = function(){
		$timeout(function(){ $ionicLoading.hide(); },200);
		$ionicLoading.hide();
	}

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// INJECTION DE CODE HTML
	$scope.trustAsHtml = function(val){
		return $sce.trustAsHtml(val);
	}

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// GOTO 
	$scope.goto = function(label, params){
		var params = params || {};
		console.log('*** --> GOTO LABEL : '+label)
		$state.go(label,params);
	}

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// retourne les traductions 
	$scope.getTrads = function(){
		// Récupération du json
			DataService.getTrads().then(
				function(data){
					console.log("*** Trads Loaded *** "+$rootScope.lang)
					$scope.trads = data;
				},
				function(error){
					console.error(error)
				}
			);
	}
	
	
	// ===========================================================================
	// Ready
	$ionicPlatform.ready(
		function(){
			console.log('RootCtrl ready')
			// $scope.getTrads();

			// Push
			// $scope.register();

			//
			// $scope.initAuth();

			$scope.initGlobalData();
		}
	);





	

/*
	// =========================================================================== BOF PUSH

	// Register
  $scope.register = function () {
  	console.log("*** Register");
	  var config = null;
	  console.log("isAndroid: "+ionic.Platform.isAndroid())
      console.log("isIOS: "+ionic.Platform.isIOS())

	  if(ionic.Platform.isAndroid()) {
		  config = {
		 		"senderID": "963073513419" // Utiliser le n° de projet dans https://console.developers.google.com/
		  };
	  }else if (ionic.Platform.isIOS()) {
		  config = {
			  "badge": "true",
			  "sound": "true",
			  "alert": "true"
		  }
	  }

  	$cordovaPush.register(config).then(
			function (deviceToken) {
				console.log("Register success " + deviceToken);
				// ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
				if(ionic.Platform.isIOS()) {
					// $scope.regid = result;
					$rootScope.globalData.regid = deviceToken;
					$scope.saveGlobalData();
					$scope.storeDeviceToken();
				}
			},
			function (err) {
				console.log("Register error " + err)
			});

  }

  // Notification Received
  $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
		console.warn('$cordovaPush:notificationReceived')
		console.log(JSON.stringify([notification]));

		if (ionic.Platform.isAndroid()) {
			handleAndroid(notification);
		}else if (ionic.Platform.isIOS()) {
			handleIOS(notification);
		}
  });

  // Android Notification Received Handler
  function handleAndroid(notification) {
	  // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
	  //             via the console fields as shown.
	  console.warn("::: handleAndroid")
		console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);

	  // Enregistrement du token
	  if (notification.event == "registered") {
		  // $scope.regid = notification.regid;
			$rootScope.globalData.regid =  notification.regid;
			$scope.saveGlobalData();
		  $scope.storeDeviceToken();

		// Réception de message
	  }else if (notification.event == "message") {

		 	console.warn(notification.payload);
		 	if(notification.payload.code){
				$cordovaVibration.vibrate(300);
				$rootScope.code = notification.payload.code;

				if(notification.payload.ttl) $timeout($scope.clearCode, notification.payload.ttl*1000);

				$scope.goto('tab.connect');
			}

	  }else if (notification.event == "error"){
  	 	$cordovaToast.showLongBottom('Push notification error event');
	  }else{
	  	$cordovaToast.showLongBottom('Push notification handler - Unprocessed Event');
	  }
  }


	// IOS Notification Received Handler
	function handleIOS(notification) {
	  console.log(notification)
	  // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
	  // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
	  // the notification when this code runs (weird).
	  if (notification.foreground == "1") {
		  // Play custom audio if a sound specified.
		  //if (notification.sound) {
		  //var mediaSrc = $cordovaMedia.newMedia(notification.sound);
		  //mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
		  //}



		  if(notification.alert){
				console.warn(notification);
			 	if(notification.code){
					$cordovaVibration.vibrate(300);
					$rootScope.code = notification.code;

					if(notification.ttl) $timeout($scope.clearCode, notification.ttl*1000);

					$scope.goto('tab.connect');
				}
		  }

	  // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
	  // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
	  // the data in this situation.
	  } else {
		  if (notification.badge) {

		  }
		}
	}

  // type:  Platform type (ios, android etc)
  $scope.storeDeviceToken = function() {
  	console.log('*** storeDeviceToken')
		if($rootScope.globalData.regid) $window.localStorage.setItem("token", $rootScope.globalData.regid);

  }

// =========================================================================== EOF PUSH
*/


})

.controller('HomeCtrl', function($scope) {

})
.controller('PageCtrl', function($scope) {

})
;
