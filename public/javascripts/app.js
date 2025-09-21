const $ = s => document.querySelector(s);
const formEl = $('#contact-form');
const nameEl = $('#name');
const emailEl = $('#email');
const phoneEl = $('#phone');
const listEl = $('#contact-list');
const toastEl = $('#toast');

function showToast(msg, type='info') {
  toastEl.textContent = msg;
  toastEl.className = 'fixed right-4 top-4 z-50 px-4 py-2 rounded-md shadow ' +
    (type==='error' ? 'bg-red-600' : type==='success' ? 'bg-green-600' : 'bg-zinc-800');
  toastEl.style.opacity = '1';
  setTimeout(() => { toastEl.style.opacity = '0'; }, 2000);
}

function tpl(c) {
  return `
    <div class="contact w-full sm:w-80 p-4 rounded-xl bg-zinc-800" data-id="${c._id}">
      <h2 class="text-lg font-semibold">${c.name}</h2>
      <p class="text-sm text-zinc-400">${c.email}</p>
      <p class="text-sm text-zinc-400">${c.phone}</p>
      <button class="delete-btn cursor-pointer mt-3 px-3 py-1 rounded-md bg-red-600">Delete</button>
    </div>
  `;
}


async function fetchContacts() {
  try {
    const res = await fetch('/contacts');
    const json = await res.json();
    if (!json.ok) return showToast(json.error || 'Fetch failed','error');
    listEl.innerHTML = json.data.length
      ? json.data.map(tpl).join('')
      : `<h3 class="text-zinc-500">No Contacts created yet…</h3>`;
  } catch {
    showToast('Network error','error');
  }
}

async function addContact(e) {
  e.preventDefault();
  const name = nameEl.value.trim();
  const email = emailEl.value.trim().toLowerCase();
  const phone = phoneEl.value.trim();
  if (name.length < 2) return showToast('Name too short','error');

  try {
    const res = await fetch('/contacts', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, phone })
    });
    const json = await res.json();

    if (!json.ok) {            // server-side validation/duplicates etc.
      return showToast(json.error || 'Add failed','error');
    }

    showToast('Contact added','success');
    formEl.reset();
    fetchContacts();
  } catch {
    showToast('Network error','error');
  }
}

async function deleteContact(id) {
  try {
    const res = await fetch(`/contacts/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) return showToast(json.error || 'Delete failed','error');
    showToast('Contact deleted','success');
    fetchContacts();
  } catch {
    showToast('Network error','error');
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.closest('.contact')?.dataset?.id;
    if (id) deleteContact(id);
  }
});

$('#refresh').addEventListener('click', () => {
  fetchContacts();
  showToast('Contacts loaded','success');
});

formEl.addEventListener('submit', addContact);

fetchContacts();
