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
  apiKey: "AIzaSyDzDHpsWpGbIxXc6boCFiXJa6ZTAiRIlcI",
  authDomain: "amir5cs022.firebaseapp.com",
  projectId: "amir5cs022",
  storageBucket: "amir5cs022.firebasestorage.app",
  messagingSenderId: "762490470175",
  appId: "1:762490470175:web:b793b64be078c531be3a2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initially sorts the table with movie_name
let currentSortField = "movie_name";
let currentSortDirection = "asc";

// Loads the movies with sorting
function loadMovies(sortField = "movie_name", sortDirection = "asc") {
  currentSortField = sortField;
  currentSortDirection = sortDirection;

  // Get a live data snapshot (i.e. auto-refresh) of our Reviews collection
  const q = query(collection(db, "Movies"), orderBy(sortField, sortDirection));
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

    // Display review count
    $('#mainTitle').html(snapshot.size + " Movie reviews in the list");
  });
}

// Add button pressed
$("#addButton").click(async function() {
  // To make sure all the fields are filled
  if ($("#movieName").val() == "" || $("#movieDirector").val() == "" || $("#movieRelease").val() == "" || $("#movieRating").val() == "") {
    alert("Please fill out all fields before adding a movie.");
  } else {
    // Add review to Firestore collection
    await addDoc(collection(db, "Movies"), {
      movie_name: $("#movieName").val().trim(),
      movie_director: $("#movieDirector").val().trim(),
      movie_release: $("#movieRelease").val(),
      movie_rating: parseInt($("#movieRating").val())
    });

    // Reset form
    $("#movieName").val('');
    $("#movieDirector").val('');
    $("#movieRelease").val('');
    $("#movieRating").val('1');
  }
});

// Edit button pressed
$(document).on("click", ".editBtn", function() {
  const docId = $(this).data('id');
  const row = $(this).closest("tr");

  const Movie = row.find('td').eq(0).text();
  const Director = row.find('td').eq(1).text();

  $('#editedName').val(Movie);
  $('#editedDirector').val(Director);

  $('#editModal').modal('show');

  // Save changes button pressed
  $("#saveChangesBtn").off("click").on("click", async function() {
    const updatedName = $("#editedName").val().trim();
    const updatedDirector = $("#editedDirector").val().trim();
    const updatedDate = $("#editedRelease").val().trim();
    const updatedRating = parseInt($("#editedRating").val());
    
// Makes sure all the fields are filled before submiting
      if (!updatedName || !updatedDirector || !updatedDate || isNaN(updatedRating)) {
      alert("Please fill out all fields before saving changes.");
      return; 
    }

    await updateDoc(doc(db, "Movies", docId), {
      movie_name: updatedName,
      movie_director: updatedDirector,
      movie_release: updatedDate,
      movie_rating: updatedRating
    });
    $('#editModal').modal('hide');
  });
});

// Delete button pressed
$(document).on("click", ".deleteBtn", async function() {
  const docId = $(this).data('id');
  await deleteDoc(doc(db, "Movies", docId));
});

function toggleSort(field) {
  const direction = (currentSortField === field && currentSortDirection === "asc") ? "desc" : "asc";
  loadMovies(field, direction);
}

// Attach click events
$("#sortName").click(() => toggleSort("movie_name"));
$("#sortDirector").click(() => toggleSort("movie_director"));
$("#sortRelease").click(() => toggleSort("movie_release"));
$("#sortRating").click(() => toggleSort("movie_rating"));

// Initial load
loadMovies();
