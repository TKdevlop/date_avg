 var consumptions = {
   foc: 0,
   distance: 0,
   avg_speed: 0,
   avg_rpm: 0,
   avg_wind_force: 0,
   avg_wave_height: 0,
   avg_swell_height: 0
 };
 var avgArr = [];
function construct_mini_arr(from_date, to_date) {
  var mini_List = [];
  for (var i = 0; i < data.length; i++) {
    if (new Date(data[i].date) > new Date(from_date)) {
      if (mini_List.length === 0) {
        if (i !== 0) {
          if (data[i - 1].actual_rpm !== "-") {
            mini_List.push(data[i - 1]);
          }
        } else {
          if (data[i].actual_rpm !== "-") {
            mini_List.push(data[i]);
          }
        }
      }
      if (data[i].actual_rpm !== "-") {
        mini_List.push(data[i]);
      }
    }
    if (new Date(data[i].date) >= new Date(to_date)) {
      if (data[i+1]) {
        if (data[i+1].actual_rpm !== "-") {
          mini_List.push(data[i+1]);
        }
      }
      break;
    }
  }
 return mini_List
}
 function getConsumtions(from_date, to_date) {
     var mini_List = construct_mini_arr(from_date, to_date);
     if(mini_List.length === 1){
         var timeDiff = moment(mini_List[0].date).diff(moment(to_date), "minutes") / 60;

     }
   for (var i = 0; i < mini_List.length; i++) {
     if (i === 0) {
       if (new Date(mini_List[i].date) <= new Date(from_date)) continue;
       else {
         avgArr.push({
           time:
             moment(mini_List[i].date).diff(moment(from_date), "minutes") / 60,
           speed: mini_List[i].actual_speed,
           rpm: mini_List[i].actual_rpm,
           wind_force: mini_List[i].wind_force,
           wave_height: mini_List[i].wave_height,
           swell_height: mini_List[i].swell_height
         });
       }
       var noOfRemaingHours =moment(mini_List[i].date).diff(moment(from_date), "minutes") / 60;
       var distance_covered = mini_List[i].distance;
       var hours = distance_covered / mini_List[i].actual_speed;
       if (noOfRemaingHours > hours) {
         if (parseFloat(mini_List[i].foc) !== "NaN") {
           consumptions["foc"] += parseFloat(mini_List[i].foc);
         }
         if (parseFloat(mini_List[i].distance) !== "NaN") {
           consumptions["distance"] += parseFloat(mini_List[i].distance);
         }
       } else {
         var newDistance = noOfRemaingHours * mini_List[i].actual_speed;
         var newFoc = (mini_List[i].foc / hours) * noOfRemaingHours;
         if (parseFloat(mini_List[i].distance) !== "NaN") {
           consumptions["distance"] += newDistance;
         }
         if (parseFloat(mini_List[i].foc) !== "NaN") {
           consumptions["foc"] += newFoc;
         }
       }
     } else if (i === mini_List.length - 1) {   
      if (moment(to_date).diff(moment(mini_List[i - 1].date), "minutes") < 0) continue;

       avgArr.push({
         time: parseFloat(
           moment(to_date).diff(moment(mini_List[i - 1].date), "minutes") / 60
         ),
         speed: mini_List[i].actual_speed,
         rpm: mini_List[i].actual_rpm,
         wind_force: mini_List[i].wind_force,
         wave_height: mini_List[i].wave_height,
         swell_height: mini_List[i].swell_height
       });
       var noOfRemaingHours = moment(to_date).diff(moment(mini_List[i - 1].date), "minutes") / 60;
       var distance_covered = mini_List[i].distance - mini_List[i - 1].distance;
       var hours = distance_covered / mini_List[i].actual_speed;
       if (noOfRemaingHours > hours) {
         if (parseFloat(mini_List[i].foc) !== "NaN") {
           consumptions["foc"] += parseFloat(mini_List[i].foc);
         }
         if (parseFloat(mini_List[i].distance) !== "NaN") {
           consumptions["distance"] +=
             parseFloat(mini_List[i].distance) - consumptions["distance"];
         }
       } else {
         var newDistance = noOfRemaingHours * mini_List[i].actual_speed;
         var newFoc = (mini_List[i].foc / hours) * noOfRemaingHours;
         if (parseFloat(mini_List[i].distance) !== "NaN") {
           consumptions["distance"] += newDistance;
         }
         if (parseFloat(mini_List[i].foc) !== "NaN") {
           consumptions["foc"] += parseFloat(mini_List[i].foc);
         }
       }
     } else {
       if (new Date(mini_List[i].date) > new Date(to_date)) {
         var a = moment(mini_List[i].date);
         var b = moment(to_date);
         var noOfRemaingHours = a.diff(b, "minutes") / 60;
         var use_time = moment(mini_List[i].date).subtract(
           noOfRemaingHours * 60,
           "minutes"
         );
         var distance_covered =
           mini_List[i].distance - mini_List[i - 1].distance;
         var hours = distance_covered / mini_List[i].actual_speed;
         var fuelUsedPerHour = distance_covered / mini_List[i].actual_speed;
         avgArr.push({
           time: ((use_time.diff(moment(mini_List[i].date), 'minutes')) / 60),
           // (moment(mini_List[i].date).diff(moment(mini_List[i - 1].date), 'minutes') / 60),
           speed: mini_List[i].actual_speed,
           rpm: mini_List[i].actual_rpm,
           wind_force: mini_List[i].wind_force,
           wave_height: mini_List[i].wave_height,
           swell_height: mini_List[i].swell_height
         });
         if (noOfRemaingHours > hours) {
           if (parseFloat(mini_List[i].foc) !== "NaN") {
             consumptions["foc"] += parseFloat(mini_List[i].foc);
           }
           if (parseFloat(mini_List[i].distance) !== "NaN") {
             if (mini_List.length === 1) {
             }
             consumptions["distance"] +=
               parseFloat(mini_List[i].distance) -
               parseFloat(mini_List[i - 1].distance);
           }
         } else {
           var newDistance = noOfRemaingHours * mini_List[i].actual_speed;
           var newFoc = (mini_List[i].foc / hours) * noOfRemaingHours;
           if (parseFloat(mini_List[i].distance) !== "NaN") {
             consumptions["distance"] += newDistance;
           }
           if (parseFloat(mini_List[i].foc) !== "NaN") {
             consumptions["foc"] += parseFloat(mini_List[i].foc);
           }
         }
       } else {
         if (parseFloat(mini_List[i].foc) !== "NaN") {
           consumptions["foc"] += parseFloat(mini_List[i].foc);
         }
         if (parseFloat(mini_List[i].distance) !== "NaN") {
           consumptions["distance"] +=
             parseFloat(mini_List[i].distance) -
             parseFloat(mini_List[i - 1].distance);
         }

         if (parseFloat(mini_List[i].actual_speed) !== "NaN") {
           console.log("mini_List[i - 1]", mini_List[i - 1]);
           avgArr.push({
             time:
               moment(mini_List[i].date).diff(
                 moment(mini_List[i - 1].date),
                 "minutes"
               ) / 60,
             speed: mini_List[i].actual_speed,
             rpm: mini_List[i].actual_rpm,
             wind_force: mini_List[i].wind_force,
             wave_height: mini_List[i].wave_height,
             swell_height: mini_List[i].swell_height
           });
         }
       }
     }
   }
 }

 function get_aks_consumption(from_date,to_date){
   var required_elements = construct_mini_arr(from_date,to_date)
    
   from_date = moment(from_date)
   to_date = moment(to_date)
   required_keys = {
     "foc"            : null,
     "steaming_hours" : null,
     "req_steaming_hours" : null,
     "actual_speed"   : "steaming_hours",
     "actual_rpm"     :  null,
     "wind_force"     : "steaming_hours",
     "swell_height"   : "steaming_hours",
     "wave_height"    : "steaming_hours"
    }
    //below loop is to add time slot in all the elements of the list
   for(var i=0;i<required_elements.length;i++){
        if (i==0){
          
          required_elements[i].steaming_hours =moment(required_elements[i + 1].date).diff(moment(required_elements[i].date),"minutes") / 60;
          required_elements[i].req_steaming_hours = (moment(required_elements[i].date).diff(from_date,"minutes"))/60;
        }
        else if (i!=required_elements.length-1){
            required_elements[i].steaming_hours = (moment(required_elements[i + 1].date).diff(moment(required_elements[i].date),"minutes")) / 60;
            required_elements[i].req_steaming_hours = required_elements[i].time_slot;
        }
        else{
          // console.log(i)
          required_elements[i].steaming_hours = (required_elements[i].distance-required_elements[i-1].distance)/required_elements[i].actual_speed
          required_elements[i].req_steaming_hours = (moment(required_elements[i].date).diff(to_date, "minutes")) / 60;
        }
        if (required_elements[i].req_steaming_hours < 0) {
          required_elements[i].req_steaming_hours =required_elements[i].steaming_hours+required_elements[i].req_steaming_hours 
        }
        console.log(required_elements[i])
        final_figures= {}
        for(var key in required_keys){
          
          dic_value = required_keys[key]
          if (dic_value==null ){
            
            if (key in final_figures) {
                
              final_figures[key] += required_elements[i][key]/required_elements[i]["steaming_hours"]*required_elements[i]["req_steaming_hours"];
            } else {
              final_figures[key] = required_elements[i][key]/required_elements[i]["steaming_hours"]*required_elements[i]["req_steaming_hours"];
            }
            console.log(required_elements[i][key],"=====",key);
          }
          else{
            //  console.log(key, "======", required_elements[i][key],"------",required_elements[i][dic_value]);
            if (key in final_figures) {
              final_figures[key] += (required_elements[i][key] * required_elements[i][dic_value]);
            } else {
              final_figures[key] = (required_elements[i][key] * required_elements[i][dic_value]);
            }
            
          }
        }
    }
    console.log(final_figures); 

 }
get_aks_consumption("2019-10-31 01:00:00+00:00", "2019-10-31 03:00:00+00:00");
