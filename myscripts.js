// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";


// Add SDKs for Firebase products that you want to use
import { Firestore,
getFirestore,
onSnapshot,
query,
collection,
orderBy,
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
tableRows += '</tr>';
});
$('#reviewList').append(tableRows);


// Display review count
$('#mainTitle').html(snapshot.size + " Movie reviews in the list");
});