//var http = require('http');
   var schedule = require('node-schedule');
   var notesService = require('../../common/services/notesService');
//module.exports = function(app) {
    
   
   var j = schedule.scheduleJob('*/1 * * * *', function(){
     console.log('Background Job!');
     notesService.getReminderByDateTimeNotesListService(function(err,result){
         if(err){
            // console.log(err);
         }
         else{
            // console.log(result);
         }
     })
   });
//};