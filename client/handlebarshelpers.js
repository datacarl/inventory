Handlebars.registerHelper('getDate', function(context) {
  var date = new Date(context),
      now = Date.now(),
      oneDay = 24*60*60*1000, // hours*minutes*seconds*milliseconds
      diffDays = Math.round(Math.abs((now - date.getTime())/(oneDay)));

  if (diffDays < 1) return "Today";

  if (diffDays == 1) return "Yesterday";

  if (diffDays < 4)  return diffDays + " days ago";

  return date.getFullYear() + '-'
         + ('0' + (date.getMonth()+1)).slice(-2) + '-'
         + ('0' + date.getDate()).slice(-2)
});
