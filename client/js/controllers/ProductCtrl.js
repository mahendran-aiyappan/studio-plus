var app = angular.module('ProductCtrl', []);

app.controller('ProductController', function($scope, $http, MenuConfig, modalService, Auth){
	
	$scope.formData = {
	    name: '',
	    code: '',
	    minQuantity: '',
	    price: '',
	    activeState: '',
	    deliveryDate: ''
	};

	$scope.fields = [{
	    name: 'name',
	    title: 'Name',
	    required: true,
	    placeholder: 'Enter product name',
	    selected: true,
	    type: {
	        view: 'text',
		    minLength:3,
		    maxLength:20
	    }
	},{
	    name: 'code',
	    title: 'Code',
	    required: true,
	    placeholder: 'Enter product code',
	    selected: true,
	    type: {
	        view: 'text',
		    minLength:3,
		    maxLength:20
	    }
	},{
	    name: 'minQuantity',
	    title: 'Min Quantity',
	    required: true,
	    placeholder: 'Enter product quantity',
	    selected: true,
	    type: {
	        view: 'number'
	    }
	},{
	    name: 'price',
	    title: 'Price',
	    required: true,
	    placeholder: 'Enter product price',
	    selected: true,
	    type: {
	        view: 'number'
	    }
	},{
	    name: 'activeState',
	    title: 'Active State',
	    required: false,
	    selected: true,
	    type: {
	        view: 'dropdown',
			options: [  
				{id: 0, name: 'Active'},  
				{id: 1, name: 'InActive'}  
			] 	        
	    }
	}	];

	$scope.form = {
	    insertForm: {
	        heading: 'Add new products',
	        submitLabel: 'Send For Approval',
	        cancelLabel: 'Cancel'
	    },
	    updateForm: {
	        heading: 'Update products',
	        submitLabel: 'Send For Approval',
	        cancelLabel: 'Cancel',
			searchLabel: 'Search'	    	
	    },
	    listForm: {
	    	heading: 'Products List'
	    },
	    deleteForm: {
	    	heading: 'Delete Product',
	    	submitLabel: 'Delete',
	        cancelLabel: 'Cancel',
	        searchLabel: 'Search'
	    }
	};

	$scope.accessLevels = Auth.accessLevels;
	$scope.myFields = [];

	intialize = function(){
		for (var i in $scope.fields) {
			$scope.myFields.push($scope.fields[i].name);
		}
	}

	intialize();

	$scope.changeColumns = function(value, i) {
	    var index = $scope.myFields.indexOf(value);
	    if (index === -1) {
	        $scope.myFields.splice(i,0,value);
	    } else {
	        $scope.myFields.splice(index, 1);
	    }
	}

	//FIXME: Pass param as product to retrive only those menu items
	MenuConfig.getAll(function(response){
		for (var i = 0; i < response.length; i++) {
			if (response[i].id==='Product'){
				$scope.menus = response[i].items;
				break;
			}
		};
	});

	$http.get('/api/products')
		.success(function(data) {
			$scope.listItems = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	$scope.create = function() {
		$http.post('/api/products', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				toastr.success('Product added successfully');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		
	};

	$scope.update = function() {
		$http.put('/api/products', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				toastr.success('Product updated successfully');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		
	};
	
	$scope.delete = function() {
		$scope.formData.activeState='Deleted';
		$http.put('/api/products', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				toastr.success('Product deleted successfully');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.search = function(){
		var modalOptions = {
            headerText: 'Search Product',
            bodyText: 'Select a product to update',
            dataItems: $scope.listItems
        };

        modalService.showModal({}, modalOptions).then(function (result) {
            $scope.formData = angular.copy(result[0]);
        });
	};

});
