angular.module('controllers').controller('LoginController', function($scope, $http, $location, Auth, $rootScope) {
	$scope.user = {};
	$scope.login = function() {
		Auth.login({
			username : $scope.user.username,
			password : $scope.user.password
		}, function(res) {
			$location.path('/home');
		}, function(err) {
			toastr.error("The email or password you entered is incorrect.");
			$location.url('/');
		});
	};
});
