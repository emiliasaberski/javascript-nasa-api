import apiKey from "./api-key.js"; //För att dölja min API-key om man jobbar mot github

const roverApi = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2024-1-21&api_key=${apiKey}`;

fetch(roverApi)
    .then(response => response.json())
    .then(data => {
        const marsPhotos = data.photos.slice(0, 15); //Begränsar antalet objekt som visas till de första 15 i arrayen
        const photoContainer = document.querySelector('#photo-container')

        if(marsPhotos.length !== 0){ //Om antalet objekt i arrayen skiljer sig från 0 loopas arrayen och visar datan från spaceCard
            marsPhotos.forEach(photo => {
                const newCard = spaceCard(photo)
                photoContainer.append(newCard)
            });
        }else {
            window.alert('Det finns ingen data'); //Är det 0 objekt visas alert meddelande
        }

    }).catch(error => window.alert(`Detta är felet ${error}`)) //Fångar upp och visar vad det är för fel 

    function spaceCard(photo){ // Funktion för att skapa korten med datan från arrayen
        
        //Skapar en div med class .card
        const card = document.createElement('div')
        card.classList.add('card')

        //Skapar ett img-element som plockar img_src och id från objektet i arrayen
        const img = document.createElement('img')
        img.src = photo.img_src
        img.alt = photo.id

        //Skapar en p-tag som plockar earth_date från objektet i arrayen
        const earthDate = document.createElement('p')
        earthDate.textContent = photo.earth_date

        //Skapar en h3-tag som plockar name från rover objektet i arrayen
        const roverName = document.createElement('h3')
        roverName.textContent = photo.rover.name

    //Append så att det vi hämtat i funktionen syns i vår browser
    card.append(roverName, img, earthDate)

    return card;
    }

    //Koden för att kunna ändra light mode
    const switchBtn = document.querySelector('#toggle');
    const bodyRef = document.querySelector('body');
    const darkModeKey = 'dark-theme';
    const darkModeValue = 'active';

    console.log(bodyRef);

    //Om dark-theme finns i vår local storage ska enableDarkMode köras annars körs disableDarkMode
    if (localStorage.getItem(darkModeKey)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    //När togglen klickas körs toggleDarkMode
    switchBtn.addEventListener('click', () => {
        toggleDarkMode();
    });
    
    //Om bodyn innehåller class="dark" körs disableDarkMode annars körs enableDarkMode
    function toggleDarkMode() {
        if (bodyRef.classList.contains('dark')) {
            console.log("Innehåller dark");
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    function disableDarkMode() {
        switchBtn.checked = false; //Togglen är inte "checked"
        const lightText = document.querySelector('#light-text')
        const lightTextMode = document.createElement('p')
        lightTextMode.textContent = 'Switch to dark mode' //I diven light-text läggs det till en p-tag med texten "Switch to dark mode"
        lightText.innerHTML = '' //Rensar tidiagre innehåll i diven
        bodyRef.classList.remove('dark'); //Ta bort klassen .dark från bodyn
        removeLocalStorage(); //Kör funktionen removeLocalStorage

        lightText.append(lightTextMode) //Append så att p-taggen syns i browsern
    }

    
    function enableDarkMode() {
        switchBtn.checked = true; //Togglen är "checked"
        const lightText = document.querySelector('#light-text')
        const lightTextMode = document.createElement('p')
        lightTextMode.textContent = 'Switch to light mode' //I diven light-text läggs det till en p-tag med texten "Switch to light mode"
        lightText.innerHTML = '' //Rensar tidiagre innehåll i diven
        bodyRef.classList.add('dark'); //Lägger till klassen .dark från bodyn
        setLocalStorage(); //Kör funktionen setLocalStorage
        
        lightText.append(lightTextMode) //Append så att p-taggen syns i browsern
    }
    
    function setLocalStorage() {
        localStorage.setItem(darkModeKey, darkModeValue); //Lägger till darkModeKey och darkModeValue i local storage
    }
    
    function removeLocalStorage() {
        localStorage.removeItem(darkModeKey); //Tar bort dakrModeKey (och också darkModeValue) från local storage
    }


    //Funktion för att kontrollera längden på namnet som skrivs in i input-fältet
    const checkNameLength = () => {
        const nameInput = document.querySelector('#nameInput').value; //Hämtar värdet i input-fältet
        const submitButton = document.querySelector('#submitBtn');
        const errorContainer = document.querySelector('.error-container');
    
        if (nameInput.length >= 3) { 
            submitButton.disabled = false; //Om det är 3 eller FLER tecken i inputfältet är knappen klickbar
            if (errorContainer) {
                errorContainer.remove(); //Rensar error-container
            }
        } else {
            submitButton.disabled = true; //Om det är FÄRRE än 3 tecken i inputfältet är knappen disabled
            const error = document.createElement('div');
            error.classList.add('error-container');
            const errorTxt = document.createElement('p');
            errorTxt.textContent = 'Skriv minst 3 tecken';

            error.append(errorTxt); //Error meddelandet ska visas

            const nameInputField = document.querySelector('#nameInput');
            nameInputField.parentNode.insertBefore(error, nameInputField.nextSibling);

            if (errorContainer) {
                errorContainer.remove(); //Rensar error-container
            }
        }
    }

    document.querySelector('#nameInput').addEventListener('input', checkNameLength); 

    document.querySelector('#nameForm').addEventListener('submit', () => {
        event.preventDefault();
        let name = document.querySelector('#nameInput').value;

        // Spara namnet till local storage
        localStorage.setItem('userName', name);

        // Visa namnet
        document.querySelector('#output').innerText = name;

        // Rensar input-fältet
        document.querySelector('#nameInput').value = "";

        document.querySelector('#submitBtn').disabled = true;

    });

    // Funktion som kollar om det finns något namn i local storage när sidan laddas och visar det i span med id output
    window.onload = () => {
        document.querySelector('#submitBtn').disabled = true;
        let savedName = localStorage.getItem('userName');
        if (savedName) {
            document.querySelector('#output').innerText = savedName;
        }
    };