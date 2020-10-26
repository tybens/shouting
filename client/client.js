console.log('Hello World')


// get a reference to the form
// anytime you see 'document', that is client-side javascript
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/shouts' : 'https://shouting-api.now.sh'
const shoutsElement = document.querySelector('.shouts');
// hide the loading element
loadingElement.style.display = '';

listAllShouts();

// listen for submit event
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  const shout = {
    name,

    content
  };
  // hide the form
  form.style.display='none';
  // showing loadingspinner
  loadingElement.style.display = '';

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(shout),
    headers: {
      'content-type': 'application/json'
    }
  }).then(response => response.json()).then(createdShout => {
      form.style.display = '';
      loadingElement.style.display = 'none';
      listAllShouts();
    });

});

function listAllShouts() {
  shoutsElement.innerHTML = '';
  fetch(API_URL)
    .then(response => response.json())
    .then(shouts => {
      console.log(shouts)

      shouts.reverse() // show them in reverse order
      shouts.forEach(shout => {
        const tr = document.createElement('tr');

        const header = document.createElement('td');
        header.textContent = shout.name;

        const contents = document.createElement('td');
        contents.textContent = shout.content;

        const date = document.createElement('td');
        date.textContent = new Date(shout.created);

        tr.appendChild(header);
        tr.appendChild(contents);
        tr.appendChild(date);

        shoutsElement.append(tr)

      });
      loadingElement.style.display = 'none';
    })
}
