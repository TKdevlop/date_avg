function construct_mini_arr(from_date, to_date) {
  var mini_List = [];
  for (var i = 0; i < data.length; i++) {
    if (new Date(data[i].date) >= new Date(from_date)) {
      if (data[i].actual_rpm !== "-") {
        data[i].index = i;
        mini_List.push(data[i]);
      }
    }
    if (new Date(data[i].date) >= new Date(to_date)) {
      break;
    }
  }
  if (mini_List.length === 0) return [];
  
  if (data[mini_List[0].index-1]) {
    if (data[mini_List[0].index - 1].actual_rpm !== "-") {
      mini_List.unshift(data[mini_List[0].index - 1]);
    }
  }
  return mini_List;
}

function get_consumption(from_date, to_date) {
  var mini_List = construct_mini_arr(from_date, to_date);
  var total_time = moment(to_date).diff(moment(from_date), "minutes") / 60;
  var time =0;
  console.log(mini_List);
  if (mini_List.length <= 1) {
    return "No Consumption is available for the given time period";
  }
  for(var i =0; i<mini_List.length; i++){
      if(i===0){
        var minutes_left = moment(mini_List[0].date).diff(moment(from_date), "minutes")/60;
          //when previous element is not present or marked "-"
        if(minutes_left < 0) continue;
      
          time+=minutes_left 
      }
     else if (i === mini_List.length - 1) {
        minutes_left = moment(to_date).diff(mini_List[i-1].date, "minutes")/60;
      var actual_time =  moment(mini_List[i].date).diff(mini_List[i-1].date, "minutes")/60; 
       console.log(i,mini_List[i].date, to_date,minutes_left,actual_time);
       //when last element rpm is "-"
        if (total_time < minutes_left) minutes_left = total_time;

        // console.log(total_time,previous_time)
        time += minutes_left;
        break;
      }
      else {
         minutes_left = moment(mini_List[i].date).diff(moment(mini_List[i-1].date), "minutes")/60;
         time += minutes_left;  
           console.log(minutes_left);
      }
  }
  console.log("total",time)
}
get_consumption("2019-10-31 01:00:00+00:00", "2019-10-31 10:00:00+00:00");
