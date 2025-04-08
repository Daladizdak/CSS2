// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";


// Add SDKs for Firebase products that you want to use
import { Firestore,
getFirestore,
onSnapshot,
query,
collection,
orderBy,
deleteDoc,
updateDoc,
doc,
addDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js'



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA065c8czE8dwdjZmer-pfN104xMAkfrr8",
  authDomain: "assignment-4a14e.firebaseapp.com",
  projectId: "assignment-4a14e",
  storageBucket: "assignment-4a14e.firebasestorage.app",
  messagingSenderId: "346473966556",
  appId: "1:346473966556:web:33d5ade95f8e1325ab7d19"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





// Get a live data snapshot (i.e. auto-refresh) of our Reviews collection
const q = query(collection(db, "Movies"), orderBy("movie_name"));
const unsubscribe = onSnapshot(q, (snapshot) => {


// Empty HTML table
$('#reviewList').empty();



// Loop through snapshot data and add to HTML table
var tableRows = '';
snapshot.forEach((doc) => {
tableRows += '<tr>'; 
tableRows += '<td>' + doc.data().movie_name + '</td>';
tableRows += '<td>' + doc.data().movie_director + '</td>';
tableRows += '<td>' + doc.data().movie_release + '</td>';
tableRows += '<td>' + doc.data().movie_rating + '/5</td>';
tableRows += `<td><button class="btn btn-warning btn-sm editBtn" data-id="${doc.id}">Edit</button></td>`; 
tableRows += `<td><button class="btn btn-danger btn-sm deleteBtn" data-id="${doc.id}">Delete</button></td>`;  
tableRows += '</tr>';
});
$('#reviewList').append(tableRows);

  

//Edit buttn pressed
$(".editBtn").click( async function() {
    const docId = $(this).data('id');
    const row = $(this).closest("tr");
  
    const Movie = row.find('td').eq(0).text();
    const Director = row.find('td').eq(1).text();
  
    $('#editedName').val(Movie);
    $('#editedDirector').val(Director);

    $('#editModal').modal('show');

  $("#saveChangesBtn").click(async function() {
    const updatedName = $("#editedName").val().trim();
    const updatedDirector = $("#editedDirector").val().trim();
    const updatedDate = $("#editedRelease").val().trim();
    const updatedRating = parseInt($("#editedRating").val());

    await updateDoc(doc(db, "Movies", docId), {
    movie_name: updatedName,
    movie_director: updatedDirector,
    movie_release: updatedDate,
    movie_rating: updatedRating
        });
    $('#editModal').modal('hide');
  });
});

//Delet button pressed
$(".deleteBtn").click( async function() {
    const docId = $(this).data('id');
    await deleteDoc(doc(db, "Movies", docId));
  });

  
// Add button pressed
$("#addButton").click(function() {

    // To make sure all the fields are filled
    if ($("#movieName").val() == "" || $("#movieDirector").val() == "" || $("#movieRelease").val() == "" || $("#movieRating").val() == "") {
        alert("Please fill out all fields before adding a movie.");
    } else {
        // Add review to Firestore collection
        const docRef = addDoc(collection(db, "Movies"), {
            movie_name: $("#movieName").val().trim(),
            movie_director: $("#movieDirector").val().trim(),
            movie_release: $("#movieRelease").val(),
            movie_rating: parseInt($("#movieRating").val())
        });

    } 





// Reset form
$("#movieName").val('');
$("#movieDirector").val('');
$("#movieRelease").val('');
$("#movieRating").val('1');
});


// Display review count
$('#mainTitle').html(snapshot.size + " Movie reviews in the list");
});
