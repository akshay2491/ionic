angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope,$rootScope) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.$watch('settings.logout',function(newVal,oldVal){
  	if(newVal)
  	{
  		$rootScope.logout();
  	}
  })
 
})

.controller('mainCtrl',function($scope,$rootScope,$location,$ionicSideMenuDelegate){

	
	console.log('main')
	$rootScope.currentUser = null;
	$rootScope.currentTripMemebers = [];
	$rootScope.friendList = [];
	$rootScope.tripSummary = [];
	Parse.initialize("Bl66NOMwA7tRfb7MlOIOaRhrMPz9jP9znTCbOsOP", "L43adggR803mrSPL53rm137XO9tCONWL1k0lokpJ");
	console.log($rootScope.currentUser)
	$rootScope.currentUser = Parse.User.current();
	console.log($rootScope.currentUser);

	$rootScope.users = [{id:1,name:'Akshay',image:'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',isIncluded:false},
	{id:2,name:'Twinkle',image:'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',isIncluded:false},
	{id:3,name:'Ebrahim',image:'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',isIncluded:false},
	{id:4,name:'Abhi',image:'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',isIncluded:false},
	{id:5,name:'Twinkle',image:'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',isIncluded:false},
	{id:6,name:'Twinkle',image:'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',isIncluded:false},
	{id:7,name:'rushabh',image:'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',isIncluded:false}];


	$rootScope.logout = function()
	{
		Parse.User.logOut();
	    $location.path('/login');
	    $rootScope.currentUser = null;
	}

	$rootScope.getFriends = function()
	{
		var query = new Parse.Query("Friends");
		query.equalTo("parentId",Parse.User.current().id);
		query.find({
      success: function(results)
      { 
      	var temp = results[0].attributes.FriendsId;
        for(var i = 0 ;i<temp.length;i++)
        {
        	var queryNew = new Parse.Query('User');
        	queryNew.equalTo("objectId",temp[i]);
        	queryNew.find({
        		success: function(user)
        		{ console.log(user)
        			$rootScope.friendList.push(user[0]);
        		}
        	})
        }
      },
      error: function(results, error)
      {
        console.log(error);
      }
    });
	}

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

/*	 $scope.$on('$stateChangeStart', function(next, current)
  	{   console.log($rootScope.currentUser);
  		console.log($location.path())
  		if($rootScope.currentUser != null && $location.path() == '/login' )
	    { console.log('in')
	      $location.path('tab/dash');
	      return;
	    }
	    if($rootScope.currentUser == null && $location.path() == '/login' )
	    { 
	      
	      return;
	    }
  	});*/
	
})

.controller('loginCtrl',function($scope,$rootScope,$ionicLoading,$ionicPopup,$state){
	$rootScope.currentUser = null;
	$scope.Register = function(form)
	{	

		var user = new Parse.User();
	    user.set("email", form.email);
	    user.set("name", form.fname);
	    user.set("username", form.username);
	    user.set("password", form.password);

	    $ionicLoading.show({
     			 template: 'Registering...'
    			});
	    user.signUp(null, {
	      success: function(user)
	      {
	        /*$rootScope.currentUser = user;*/
	        $ionicLoading.hide();
	        $location.path('/login')
	        console.log(user)
	      },
	      error:function(user, error){
	      	$ionicLoading.hide();
	      	console.log(error)
	        switch(error.code)
	        {
	          case 202:
	          $scope.errorMsg = "A user with that name already exists!"
	          break;
	          case 203:
	          $scope.errorMsg = "A user with this email already exists!"
	          break;
	          case 125:
	          $scope.errorMsg = "Invalid email address!"
	          break;
	          case 159:
	          $scope.errorMsg = "Cannot access server. Please try again later."
	          break;
	          default:
	          $scope.errorMsg = "There was a problem registering your account. Please try again later."
	          break;
	        }
	         $ionicPopup.alert({
	         	title:$scope.errorMsg,
	         	okText:'OK'
	         });
	        //$scope.$apply();
	      }
	    });
	}

	$scope.loginUser = function(form)
	{	
		$ionicLoading.show({
     			 template: 'Loading...'
    			});
		Parse.User.logIn(form.username,form.password,{
			success:function(user){
				$ionicLoading.hide();
				$rootScope.getFriends();
				$rootScope.currentUser = user;
				$state.go("main");
				$scope.$apply();
			},
			error:function(user,error){
				$ionicLoading.hide();
		        switch(error.code)
		        {
		          case 101:
		          $scope.errorMsg = "Incorrect username or password!"
		          break;
		          case 159:
		          $scope.errorMsg = "Cannot access server. Please try again later."
		          break;
		          default:
		          $scope.errorMsg = "There was a problem signing in. Please try again later."
		          break;
		        }
		        $ionicPopup.alert({
		        	title:$scope.errorMsg,
		        	okText:'OK'
		        });
		        $scope.$apply();
		      }
		})
	}
})

.controller('ApprovalCtrl',function($scope,$rootScope,$timeout,$location){

})

.controller('ContentController',function($scope,$rootScope,$ionicPopup,$ionicModal,$location,$state){
	console.log($rootScope.currentUser)
	  $scope.data = {
    items : []
  };

  var menuItems = ['Home','New Trip','Settings','Logout'];

    $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    console.log('hello')

   $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide()
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  });

  $scope.actionForMenu = function(option) {
  	if(option.label === 'Logout')
  	{
  		var myPopup =$ionicPopup.alert({
		        	title:'Do you want to logout?',
		        	buttons: [
      { text: 'Cancel' ,onTap: function(e) { return false; }},
      {text:'Ok', onTap:function(e) { return true;}}]
		        });
  		myPopup.then(function(res) {
  			if(res == false)
  			{
  				myPopup.close();
  			}
  			else
  			{
  				$rootScope.logout();	
  			}
 		 });
  		
  	}

  	if(option.label === 'Home')
  	{
  		$state.go('main.home');
  	}

  	if(option.label === 'New Trip')
  	{ 
		//$location.path('/main/newTripTemp');
		$state.go('main.newTripTemp');
  	}
  }
  
  for(var i = 0; i < menuItems.length; i++) {
    $scope.data.items.push({
      id : i,
      label : menuItems[i]
    })
  }
})

.controller('tripCtrl',function($scope,$rootScope,$location,$ionicModal,$rootScope,$state,$timeout){

	$scope.loading = false;
	//$scope.currentTripMemebers = [];
	 $ionicModal.fromTemplateUrl('templates/searchUser.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    console.log('hello')

   $scope.modal.show()
  }

    $scope.GetUser = function(user)
  {
    var query = new Parse.Query("User");
    query.equalTo("email",user);
    query.find({
      success: function(results)
      {
        console.log(results);
      },
      error: function(results, error)
      {
        console.log(error);
      }
    });
  };

  $scope.submitTripDetails = function(name) {
  	var temp = {};
  	$scope.loading = true;
  	temp.name = name;
  	temp.user = [];
  	temp.user = $rootScope.currentTripMemebers;
  	console.log(temp);
  	$rootScope.tripSummary.push(temp);
  	$timeout(function() {
  		$scope.loading = false;
  		$state.go('main.home');
  	}, 2000);
  	
  }
 
  $scope.addToTripMembers = function(user,index)
  {
  	console.log(index);
  	console.log($rootScope.users[index].isIncluded)
  	$rootScope.users[index].isIncluded = !$rootScope.users[index].isIncluded;
  	$rootScope.currentTripMemebers.push(user);
  }

  $scope.removeUserFromTrip = function(user)
  {
  	for(var i = 0 ; i< $rootScope.currentTripMemebers.length;i++)
  	{
  		if($rootScope.currentTripMemebers[i].id == user.id)
  		{
  			$rootScope.currentTripMemebers.splice(i,1);
  			$rootScope.users[user.id-1].isIncluded = !$rootScope.users[user.id-1].isIncluded;
  		}
  	}
  }

  $scope.removeTripMembers = function(user)
  {  console.log(user)
  	 console.log($rootScope.currentTripMemebers)
  	for(var i =0 ;i<$rootScope.currentTripMemebers.length;i++)
  	{    
  		if($rootScope.currentTripMemebers[i].id == user.id)	
  			
  		$rootScope.currentTripMemebers.splice(i,1);
  		$rootScope.users[user.id-1].isIncluded = !$rootScope.users[user.id-1].isIncluded;
  	}
  	
  }

  $scope.closeModal = function() {
    $scope.modal.hide()
  }

  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  });

  $scope.friendGroup = function() {
  	console.log($rootScope.friendList);

  }

  $scope.friendGroup();

});








