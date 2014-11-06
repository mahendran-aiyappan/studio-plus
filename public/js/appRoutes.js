angular.module('appRoutes', ['ngResource']).config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider, $httpProvider) {

	//================================================
	// Check if the user is connected
	//================================================
	var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
		// Initialize a new promise
		var deferred = $q.defer();

		// Make an AJAX call to check if the user is logged in
		$http.get('/loggedin').success(function(user) {
			// Authenticated
			if (user !== '0')
				$timeout(deferred.resolve, 0);

			// Not Authenticated
			else {
				//$rootScope.message = 'You need to log in.';
				$timeout(function() {
					deferred.reject();
				}, 0);
				// $location.url('/login');
				$location.url('/');
			}
		});

		return deferred.promise;
	};

	//================================================
	// Add an interceptor for AJAX errors
	//================================================
	 /*
	 $httpProvider.responseInterceptors.push(function($q, $location) {
			  return function(promise) {
				  return promise.then(
				  // Success: just return the response
				  function(response) {
					  return response;
				  },
				  // Error: check the error status to get only the 401
				  function(response) {
					  if (response.status === 401)
						  $location.url('/');
					  return $q.reject(response);
				  });
			  }
		  });*/
	 
	//================================================

	$routeProvider

	// home page
	.when('/', {
		 templateUrl : 'views/login.html',
		 controller : 'LoginController'
	}).when('/home', {
		templateUrl : 'views/home.html',
		controller : 'MainController',
		resolve : {
			loggedin : checkLoggedin
		}
	}).when('/products', {
		templateUrl : 'views/product.html',
		controller : 'ProductController',
		resolve : {
			loggedin : checkLoggedin
		}
	}).when('/signup', {
		templateUrl : 'views/signup.html',
		controller : 'SignupController'
	}).otherwise({
		redirectTo : '/'
	});

	$locationProvider.html5Mode(true);

}]).run(function($rootScope, $http) {
	// $rootScope.message = '';

	// Logout function is available in any pages
	$rootScope.logout = function() {
		// $rootScope.message = 'Logged out.';
		$http.post('/logout');
	};
});
