function previewPhoto(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        selectedPhoto = e.target.result;

        document.getElementById("photoPreview").innerHTML =
            `<img src="${selectedPhoto}" alt="Contact Photo">`;
    };

    reader.readAsDataURL(file);
}
// ================= CONTACT DATA =================

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];


// ================= PAGE LOAD =================

displayContacts();
updateStats();


// ================= OPEN MODAL =================

function openModal() {

    document.getElementById("contactModal").classList.add("show");

    document.getElementById("modalTitle").innerText =
        "Add New Contact";

    document.getElementById("contactForm").reset();

    document.getElementById("editId").value = "";
}


// ================= CLOSE MODAL =================

function closeModal() {

    document.getElementById("contactModal")
        .classList.remove("show");
}


// ================= SAVE CONTACT =================

document.getElementById("contactForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const favorite =
        document.getElementById("favorite").checked;

    const editId =
        document.getElementById("editId").value;


    // Validation

    if (name === "" || phone === "") {

        alert("Please enter name and phone number.");

        return;
    }


    // EDIT CONTACT

    if (editId !== "") {

        const index =
            contacts.findIndex(c => c.id == editId);

        contacts[index].name = name;
        contacts[index].phone = phone;
        contacts[index].email = email;
        contacts[index].address = address;
        contacts[index].favorite = favorite;

        showNotification("Contact updated successfully!");

    }

    // ADD CONTACT

    else {

        const newContact = {

    id: Date.now(),

    name: name,

    phone: phone,

    email: email,

    address: address,

    favorite: favorite,

    photo: selectedPhoto
};

        contacts.unshift(newContact);

        showNotification("Contact added successfully!");
    }


    saveContacts();

    displayContacts();

    updateStats();

    closeModal();

});


// ================= DISPLAY CONTACTS =================

function displayContacts(list = contacts) {

    const contactList =
        document.getElementById("contactList");

    contactList.innerHTML = "";


    if (list.length === 0) {

        contactList.innerHTML = `
            <div class="empty">
                <i class="fa-solid fa-address-book"></i>
                <h2>No Contacts Found</h2>
                <p>Add your first contact to get started.</p>
            </div>
        `;

        return;
    }


    list.forEach(contact => {

        const firstLetter =
            contact.name.charAt(0).toUpperCase();


        const card = document.createElement("div");

        card.className = "contact-card";


        card.innerHTML = `

           <div class="avatar">

    ${
        contact.photo
        ? `<img src="${contact.photo}" alt="${contact.name}">`
        : firstLetter
    }

</div>


            <div class="contact-info">

                <h3>
                    ${contact.name}

                    ${
                        contact.favorite
                        ? `<span class="favorite">
                            <i class="fa-solid fa-star"></i>
                           </span>`
                        : ""
                    }

                </h3>


                <div class="contact-details">

                    <span>
                        <i class="fa-solid fa-phone"></i>
                        ${contact.phone}
                    </span>


                    ${
                        contact.email
                        ? `
                        <span>
                            <i class="fa-solid fa-envelope"></i>
                            ${contact.email}
                        </span>
                        `
                        : ""
                    }

                </div>

            </div>


            <div class="actions">

                <button
                    class="action-btn call"
                    onclick="callContact('${contact.phone}')"
                    title="Call">

                    <i class="fa-solid fa-phone"></i>

                </button>


                <button
                    class="action-btn edit"
                    onclick="editContact(${contact.id})"
                    title="Edit">

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="action-btn delete"
                    onclick="deleteContact(${contact.id})"
                    title="Delete">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;


        contactList.appendChild(card);

    });


    document.getElementById("headingCount")
        .innerText = `(${list.length})`;
}


// ================= EDIT =================

function editContact(id) {

    const contact =
        contacts.find(c => c.id === id);

    if (!contact) return;


    document.getElementById("editId").value =
        contact.id;

    document.getElementById("name").value =
        contact.name;

    document.getElementById("phone").value =
        contact.phone;

    document.getElementById("email").value =
        contact.email;

    document.getElementById("address").value =
        contact.address;

    document.getElementById("favorite").checked =
        contact.favorite;
    // PHOTO
    contacts[index].photo = selectedPhoto;

    showNotification("Contact updated successfully!");

        // ===== PHOTO CODE =====

    selectedPhoto = contact.photo || "";

    if (selectedPhoto) {

        document.getElementById("photoPreview").innerHTML =
            `<img src="${selectedPhoto}" alt="${contact.name}">`;

    } else {

        document.getElementById("photoPreview").innerHTML =
            `<i class="fa-solid fa-camera"></i>`;
    }


    document.getElementById("modalTitle").innerText =
        "Edit Contact";


    document.getElementById("contactModal")
        .classList.add("show");
}


// ================= DELETE =================

function deleteContact(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this contact?");

    if (!confirmDelete) return;


    contacts =
        contacts.filter(contact => contact.id !== id);


    saveContacts();

    displayContacts();

    updateStats();

    showNotification("Contact deleted!");
}


// ================= CALL =================

function callContact(phone) {

    window.location.href =
        `tel:${phone}`;
}


// ================= SEARCH =================

function searchContacts() {

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    const filtered =
        contacts.filter(contact =>

            contact.name.toLowerCase().includes(search) ||

            contact.phone.includes(search) ||

            contact.email.toLowerCase().includes(search)

        );


    displayContacts(filtered);
}


// ================= FAVORITES =================

function showFavorites() {

    const favorites =
        contacts.filter(contact => contact.favorite);

    displayContacts(favorites);
}


// ================= STATISTICS =================

function updateStats() {

    document.getElementById("totalContacts")
        .innerText = contacts.length;


    const favorites =
        contacts.filter(contact => contact.favorite);

    document.getElementById("favoriteCount")
        .innerText = favorites.length;


    document.getElementById("recentCount")
        .innerText =
        Math.min(contacts.length, 3);
}


// ================= LOCAL STORAGE =================

function saveContacts() {

    localStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
    );
}


// ================= NOTIFICATION =================

function showNotification(message) {

    const notification =
        document.getElementById("notification");

    document.getElementById("notificationText")
        .innerText = message;


    notification.classList.add("show");


    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);
}


// ================= DARK MODE =================

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        isDark
    );
}


// Load Dark Mode

if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

    document.getElementById("darkToggle").checked =
        true;
}