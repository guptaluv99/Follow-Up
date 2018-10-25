var exambazaar = angular.module('exambazaar', ['ngMaterial', 'ngMessages','ui.router', 'ui-notification']);

exambazaar.service('followUpService', ['$http', function ($http) {
   this.fetchAll = function(){
       return $http.get('/api/followups/fetchAll');
   };
    this.query = function(queryString){
       return $http.get('/api/followups/query/'+ queryString,{queryString:queryString});
   };
    this.newFollowUp = function(reqForm){
       return $http.post('/api/followups/newFollowUp', reqForm);
   };
    this.updateFollowUp = function(reqForm){
       return $http.post('/api/followups/updateFollowUp', reqForm);
   };
}]);

exambazaar.controller('followUpCtrl',[ '$scope', '$http', 'followUpService', 'Notification', function($scope,$http, followUpService, Notification){
    
    $scope.showAddForm = false;
    $scope.showNewForm = false;
    
    $scope.selectedItemChange = selectedItemChange;
   function selectedItemChange(item) {
       $scope.followUp = item;
   }
   $scope.querySearch = function(query){
       
       if(query && query.length > 2){
           return followUpService.query(query).then(function(response){
               console.log(response.data);
               $scope.followUps = response.data;
               if(response.data.length<1){
                   console.log('No such');
                   Notification.error({message: 'No such', delay: 5000, positionY: 'bottom', positionX: 'left'});
                   Notification.error({message: 'error'});
               }
               return response.data;
           });
       }else{
           Notification.error({message: 'error'});
           return [];
       }
   };
    
    $scope.addMore = function(refId){
        $scope.showAddForm = true;
        console.log(refId);
        $scope.refId = refId;
    }
    
    followUpService.fetchAll().then(function(response){
            $scope.allFollowUps = response.data;
        })
    
    $scope.addFollowUp = function(refId){
        var reqForm = {
            type: $scope.type,
            name: $scope.name,
            phone: $scope.phone,
            email: $scope.email,
            comment: $scope.comment,
            referredBy: refId
        };
        
        console.log($scope.nextFollowAt);
        
        if($scope.nextFollowAt)
            reqForm.nextFollowAt = $scope.nextFollowAt;
        
        if($scope.complete)
            reqForm.complete = $scope.complete;
        else
            reqForm.complete = false;
        
        console.log(reqForm);
        
        followUpService.newFollowUp(reqForm).success(function(data, status, headers){
            console.log(data);
            Notification.success({message: 'success', delay: 5000, positionY: 'bottom', positionX: 'left'});
        })
        .error(function (data, status, header, config) {
            console.log('Error ' + data + ' ' + status);
        });
    }
    
    $scope.newFollowUp = function(){
        
        if($scope.showAddForm){
            $scope.addFollowUp($scope.refId);
        }else{
            var reqForm = {
                type: $scope.type,
                name: $scope.name,
                phone: $scope.phone,
                email: $scope.email,
                comment: $scope.comment
            };

            console.log($scope.nextFollowAt);

            if($scope.nextFollowAt)
                reqForm.nextFollowAt = $scope.nextFollowAt;

            if($scope.complete)
                reqForm.complete = $scope.complete;
            else
                reqForm.complete = false;

            if($scope.followUp)
                reqForm.referredBy = $scope.followUp._id;

            console.log(reqForm);

            followUpService.newFollowUp(reqForm).success(function(data, status, headers){
                console.log(data);
                Notification.success({message: 'success', delay: 5000, positionY: 'bottom', positionX: 'left'});
            })
            .error(function (data, status, header, config) {
                console.log('Error ' + data + ' ' + status);
            });
        }
    }
    
    $scope.newFollow = function(){
        $scope.showNewForm = true;
    }
    
    $scope.updateFollowUp = function(thisId, nextFollowAt, complete){
        var reqForm = {
            _id: thisId,
            nextFollowAt: nextFollowAt,
            complete: complete
        }
        followUpService.updateFollowUp(reqForm).success(function(data, status, headers){
            console.log(data);
            Notification.success({message: 'success', delay: 5000, positionY: 'bottom', positionX: 'left'});
        })
        .error(function (data, status, header, config) {
            console.log('Error ' + data + ' ' + status);
        });
    }
}]);
    
    
    