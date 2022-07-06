// Store for all of the jobs in progress
var notes = {};

// add new note
async function addNote() {
    console.log('addNote:');
    const note = document.querySelector("#note").value;
    const data = {note};
    let result = await fetch('/api/note', {
    method: 'POST', 
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
    });
    let res = await result.json();
    console.log('addNote:');
    console.log(res);
    document.querySelector("#output").innerHTML = JSON.stringify(res);
}

async function getNotes() {
  //var jobid=e.target.getAttribute("data-jobid");
  let result = await fetch('/api/note');
  let notes = await result.json();
  console.log(notes);
  //document.querySelector("#output").innerHTML = JSON.stringify(res);
  const ul = document.createElement("ul");
  notes.forEach(note => {
    var s = document.createElement("strong");
    s.innerText=note;
    var li = document.createElement("li");
    li.appendChild(s);    
    ul.appendChild(li);  
  });  
  document.getElementById("output").appendChild(ul);  
}//

// Attach click handlers and kick off background processes
window.onload = function() {
  document.querySelector("#getnotes").addEventListener("click", getNotes);
  document.querySelector("#addnote").addEventListener("click", addNote);
};
