// Initialize Firebase
var config = {
    apiKey: "AIzaSyDgs5xSSqc-JrHmoSEY1swjOkEUsBDVoOM",
    authDomain: "traintime-e60cb.firebaseapp.com",
    databaseURL: "https://traintime-e60cb.firebaseio.com",
    projectId: "traintime-e60cb",
    storageBucket: "",
    messagingSenderId: "780301526621"
  };
  firebase.initializeApp(config);

  // Test connection with Database
  var db = firebase.database();
  
  // Variables for all inputs
  var trainName,
    destination,
    trainTime,
    trainInterval;
  
  
  // on click function that submits the variables to the database using .ref().push() instead of .set
  $("#submit-train").on("click", function () {
    event.preventDefault();
  
    // Get values of the different database assets
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    trainTime = $("#train-time").val().trim();
    trainInterval = $("#train-interval").val().trim();
    
    db.ref().push({
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      trainInterval: trainInterval,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
  
  })
  
  // create listener to catch changes in the database
  db.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
    // Variable to store response from database
    var sv = snapshot.val();
  
    // Building a new row to print information to the page
    var row = $("<div class=row></div>");
    var col1 = $("<div class=col-md-4></div>");
    var col2 = $("<div class=col-md-2></div>");
    var col3 = $("<div class=col-md-2></div>");
    var col4 = $("<div class=col-md-2></div>");
    var col5 = $("<div class=col-md-2></div>");
    var hr = $("<hr>");
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  
  
  // Process when the next arrival train will come
  
  // Get train's first time, user time, and interval time
  
  // get first Train time, is it greater than current time? if not add interval time, is that time greater than current time? if not, keep adding until it is greater. Once it is greater, that is the next arrival time.
  
    // Putting current time & Train TIme into format I can work with
    var currentTime = momentify(moment().format("HH:mm:ss"));
    var nextArrival = momentify(sv.trainTime);
  
    // Comparing current time against next arrival until I have surpased the current time
    while (currentTime >= nextArrival){
  
      // Notice I'm using interval time from the firebase object created
      nextArrival.add(sv.trainInterval, 'minutes');
    };
  
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
    // Calculating "Minutes Away" field
  
    // Take current time and next arrival time. Get difference of these two times
  
    // Print the difference
    
    var minutesAway = moment(nextArrival).diff(currentTime, "minutes");
  
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
    // Process of printing Values to the screen
    col1.text(sv.trainName);
    col2.text(sv.destination);
    col3.text(sv.trainInterval);
    col4.text(nextArrival.format("hh:mm a"));
    col5.text(minutesAway);
  
    // Process of printing Values to the screen
    row.append(col1);
    row.append(col2);
    row.append(col3);
    row.append(col4);
    row.append(col5);
    row.append(hr);
  
    // Printing Values to the screen
    $("#employee-data").append(row);
  
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  
  
  // This function takes time in a string format (ie. "01:00:00") and properly applies moment functionality to it using "HH:mm:ss" format to it. Meaning it will be 24 hour time.
  function momentify (time) {
    var date = time;
    var format = "HH:mm:ss";
    return moment(date, format);
  }