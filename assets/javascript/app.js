$(document).ready(function () {
    console.log("I'm Ready!")

    $('.timepicker').timepicker()


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDgCmAO-NUTz2cmUYqfQXKWNcotfvRJ4dU",
        authDomain: "my-train-scheduler-2d0c8.firebaseapp.com",
        databaseURL: "https://my-train-scheduler-2d0c8.firebaseio.com",
        projectId: "my-train-scheduler-2d0c8",
        storageBucket: "my-train-scheduler-2d0c8.appspot.com",
        messagingSenderId: "296685287633"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    $(document).on('click', '.submit', function () {

        event.preventDefault();

        var train = $('#train').val().trim();
        var destination = $('#card_travel').val().trim();
        var startTime = $('#calendar_today').val();
        var freq = $('#timer').val()

        if (train != "" && destination != "" && startTime != "" && freq != "") {
    
            database.ref().push({
                name: train,
                destination: destination,
                time: startTime,
                frequency: freq,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            $('#train-form')[0].reset();
        } else{
            M.toast({html: 'Invalid Submission'})
        }

    });
    database.ref().on('child_added', function(childSnapshot) {

        var childName = childSnapshot.val().name
        var childDestination = childSnapshot.val().destination
        var childTime = childSnapshot.val().time
        var childFrequency = childSnapshot.val().frequency

        console.log("this is from the firebase: " +  childName);
        console.log("this is from the firebase: " + childDestination);
        console.log("this is from the firebase: " + childTime);
        console.log("this is from the firebase: " + childFrequency);

        var addRow = $('<tr>')
        var addName = $('<td>').attr('data-name', childName).text(childName)
        var addDestination = $('<td>').attr('data-name', childDestination).text(childDestination)
        var addFrequency = $('<td>').attr('data-name', childFrequency).text(childFrequency)

        //moment.js
        //convert start time
        var format = 'HH:mm a';
        var convertedFormat = moment(childTime, format).subtract(1, 'years');
        console.log('Converted Format: ' + convertedFormat)

        //logging current time
        var currentTime = moment();
        console.log('Current Time: ' + moment(currentTime).format('hh:mm a'));

        //getting difference between times
        var timeDifference = moment().diff(moment(convertedFormat), 'minutes');
        console.log('Difference in Time: '+ timeDifference);

        //check the remainder between the time diff and the frequency
        var timeRemaining = timeDifference % childFrequency;
        console.log('Time Remaining: ' + timeRemaining);

        //subtract the remainder from the frequency to find the time till the next train
        var timeUntil = childFrequency - timeRemaining;
        console.log('Minutes Until Next Train: ' + timeUntil);

        //Next Train
        var nextTrain = moment().add(timeUntil, 'minutes');
        console.log('Arrival Time: ' + moment(nextTrain).format('hh:mm a'));
        var nextTrainFormatted = moment(nextTrain).format('hh:mm a');

        //logging the next train time and minutes till train to the console
        var nextArrival = $('<td class="nextArrival">').text(nextTrainFormatted);
        var minutesAway = $('<td class="minutesAway">').text(timeUntil);

        addRow.append(addName, addDestination, addFrequency, nextArrival, minutesAway);
        $('.tbody').append(addRow);

        // setInterval(function(){
        //         $('.nextArrival').replaceWith(nextArrival);
        //         $('.minutesAway').replaceWith(minutesAway);
        // }, 1000 * 60);
    });

});