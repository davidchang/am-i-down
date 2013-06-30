'use strict';

angular.module('publicApp')
  .controller('MainCtrl', ['$scope', '$location', 'Auth', 'REST', function ($scope, $location, Auth, REST) {
      var emptyArray = [];

      Auth.isLoggedIn().then(function(loggedIn) {
        if(!loggedIn)
          $location.path( '/login' );
      });

      try {
        REST.getLists(function(res) {
          if(!res || !res.data || !res.data.lists)
            $scope.lists = [];
          else
            $scope.lists = res.data.lists;
          convertListsToNotes();
        });
      } catch(err) {
        $scope.lists = [];
        $scope.notes = {};
      }

      function convertListsToNotes() {
        $scope.notes = {};
        for(var i = 0; i < $scope.lists.length; ++i) {
          var list = $scope.lists[i];
          for(var j = 0; j < list.notes.length; ++j) {
            var note = list.notes[j];
            if(!$scope.notes[note.dayTime])
              $scope.notes[note.dayTime] = [];

            $scope.notes[note.dayTime].push({name: list.name, note: note.text});
          }
        }
      }

      function save() {
        console.log('saving data');
        console.log($scope.lists);

        REST.saveLists($scope.lists);
      }

      $scope.$on('saveListData', function() {
        save();
      });
      
      $scope.lastWeek = [];
      var d = new Date();
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
      for(var i = 0; i < 7; ++i && d.setDate(d.getDate() + 1)) {
        $scope.lastWeek.push( { date: d.getDate(), timestamp : d.valueOf(), selectedForNote: i == 6 } );
      }

      $scope.changeStatus = function(listObj, date) {
        var metric = _.findWhere($scope.lists, {name: listObj.name});
        var day = _.findWhere(metric.days, {dayTime: date.timestamp});
        var state = getClassColor(listObj, date);

        if(!state)
          metric.days.push({ dayTime: date.timestamp, good: true });
        else if(state == 'green')
          day.good = false;
        else {
          metric.days = _.reject(metric.days, function(day) {
            return day.dayTime == date.timestamp;
          });
        }

        save();
      }

      function getClassColor(listObj, date) {
        var day = _.findWhere(listObj.days, {dayTime: date.timestamp});
        return day ? day.good ? 'green' : 'red' : '';
      }

      $scope.getClass = function(listObj, date) {
        return 'box ' + getClassColor(listObj, date);
      }

      $scope.newMetricSubmit = function($event) {
        var newMetric = $scope.newMetric;
        if(newMetric.length) {

          if(_.findWhere($scope.lists, {name: newMetric})) {
            alert('List names must be unique');
            return;
          }
          
          $scope.lists.push({ name: newMetric, public: false, startDate: new Date() });
          save();

          $event.preventDefault();
          $event.target.blur();
          $scope.newMetric = '';
        }
      }

      $scope.selectedDay = _.last($scope.lastWeek);
      $scope.changeSelectedDay = function(day) {
        $scope.selectedDay = day;
      }

      $scope.metricChosen = undefined;
      $scope.setMetricChosen = function(listObj) {
        $scope.metricChosen = listObj;
      }

      $scope.saveNote = function() {
        if($scope.noteTextarea.length == 0)
          return;

        var listObj = _.findWhere($scope.lists, {name: $scope.metricChosen.name});
        var noteObj = _.findWhere(listObj.notes, {dayTime: $scope.selectedDay.timestamp});
        if(noteObj) {
          noteObj.realTime = new Date();
          noteObj.text = $scope.noteTextarea;
        }
        else
          listObj.notes.push({ realTime: new Date(), dayTime: $scope.selectedDay.timestamp, text: $scope.noteTextarea });

        $scope.metricChosen = undefined;
        $scope.noteTextarea = '';
    
        save();
        convertListsToNotes();
      }

      $scope.getNotesForSelectedDay = function() {
        return $scope.notes ? $scope.notes[$scope.selectedDay.timestamp] : emptyArray;
      }

      $scope.noteAlreadyTaken = function(listObj) {
        return $scope.notes ? _.findWhere($scope.notes[$scope.selectedDay.timestamp], {name: listObj.name}) : false;
      }

      $scope.saveNoteChanges = function(noteForDay) {
        var listWithNote = _.findWhere($scope.lists, {name: noteForDay.name});
        var specificNote = _.findWhere(listWithNote.notes, {dayTime: $scope.selectedDay.timestamp});
        specificNote.text = noteForDay.note;

        save();
        convertListsToNotes();
      }

      $scope.deleteNote = function(noteForDay) {
        if(!confirm("Are you sure you want to delete this note for " + noteForDay.name + "?"))
          return;

        var listWithNote = _.findWhere($scope.lists, {name: noteForDay.name});
        listWithNote.notes = _.reject(listWithNote.notes, function(i) {
          return i.dayTime == $scope.selectedDay.timestamp; 
        });

        save();
        convertListsToNotes();
      }
  }]);
