console.log('Hello World')


// get a reference to the form
// anytime you see 'document', that is client-side javascript
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/shouts' : 'https://shouting-api.now.sh'
const shoutsElement = document.querySelector('.shouts');
const loadMoreButton = document.querySelector('#loadMoreButton');
// hide the loading element
loadingElement.style.display = '';

// global variables to be modified by button
let skip = 0;
let limit = 4;

listAllShouts();
loadMoreButton.addEventListener('click', loadMore);
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

function loadMore() {
  skip+= limit;
  listAllShouts(false);
}
function listAllShouts(reset = true) {
  if (reset) {
    shoutsElement.innerHTML = '';
    skip = 0;
  } else {
    window.scrollTo(0, document.body.scrollHeight);
  }
  fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
    .then(response => response.json())
    .then(result => {
      console.log(result)

      result.shouts.forEach(shout => {
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
      if (!result.meta.has_more) {
        loadMoreButton.style.visibility = 'hidden';
      } else {
        loadMoreButton.style.visibility = 'visible';
      }
    })
}
