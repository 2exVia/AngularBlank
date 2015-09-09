angular.module('starter.services', [])


.factory('DataService', function($http, $q, $rootScope, $window) {

	// appelle le webservice
	var callWebservice = function(data){
		var deferred = $q.defer();
		console.info("*** callWebservice ***")
		console.info(data)

		if(data.action){
			$http({method: "JSONP", url: 'https://www.intradomus.net/app/ws.php?callback=JSON_CALLBACK',params:data}).
	      success(function(callback, status) {
	      	console.log(callback)
	      	if(data.action=="Connect"){
	      		if(callback.connecte==1){
							$window.localStorage.setItem("auth", angular.toJson(callback));
							deferred.resolve(callback);
						}else{
							deferred.reject(callback);
						}
					}else{
						deferred.resolve(callback);
					}
	      }).
	      error(function(data, status) {
	      	console.error(status)
					deferred.reject();
	    	}
			);
		}else{
			deferred.reject('data.action required');
		}
	  return deferred.promise;
	};

	// récupère les traductions UI json
	var getTrads = function(){
		var deferred = $q.defer();
		$http.get('data/ui-'+$rootScope.lang+'.json')
	  .success(function(data, status, headers, config) {
	    deferred.resolve(data);
	  })
	  .error(function(data, status, headers, config) {
	  	deferred.reject(status);
	  });
	  return deferred.promise;
	};




	return {
	  callWebservice : callWebservice,
	  getTrads : getTrads
  }
});
