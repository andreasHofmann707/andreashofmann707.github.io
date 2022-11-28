const btnAddNumbers = document.querySelector(".btn-add-numbers");
const btnNewNumbers = document.querySelector(".btn-new-numbers");
const tabButtons = document.querySelectorAll('[role="tab"]');
const tabPanels = document.querySelectorAll('[role="tabpanel"]');
const tabs = document.querySelector(".tabs");
const background = document.querySelector(".background");
const btnsAddNumbers = document.querySelectorAll(".btn-add-numbers");
const btnsNewNumbers = document.querySelectorAll(".btn-new-numbers");
const divEuroMillionsNumbers = document.querySelector(
  ".lotto-numbers-wrapper.euro-millions"
);
const divSwissLottoNumbers = document.querySelector(
  ".lotto-numbers-wrapper.swiss-lotto"
);

// Numbers to show on page
let euroMillionsNumbers = [];
let swissLottoNumbers = [];

// Configuration for the lotto-numbers
const euroMillionsNumberConfiguration = {
  normal: {
    min: 1,
    max: 50,
    quantity: 5,
  },
  special: {
    min: 1,
    max: 12,
    quantity: 2,
  },
};

const swissLottoNumberConfiguration = {
  normal: {
    min: 1,
    max: 42,
    quantity: 6,
  },
  special: {
    min: 1,
    max: 6,
    quantity: 2,
  },
};

// // Returns an array with random numbers using the getRandomNumbers API
// const generateRandomNumber = async (min, max, quantity) => {
//   const apiUrl =
//     "https://europe-west6-default-285415.cloudfunctions.net/getRandomNumbers";
//   const requestBody = {
//     quantity: quantity,
//     rangeMax: max,
//     rangeMin: min,
//   };
//   const configuration = {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestBody),
//   };

//   const data = await fetch(apiUrl, configuration)
//     .then((res) => res.json())
//     .catch((error) => {
//       console.log(error);
//     });

//   return data;
// };

// Returns an array with random numbers when API isn't accessable
const generateOfflineRandomNumber = (min, max, quantity) => {
  const randomNumbers = [];

  while (randomNumbers.length != quantity) {
    const rndNumber = Math.floor(Math.random() * max + min);

    if (!randomNumbers.includes(rndNumber)) {
      randomNumbers.push(rndNumber);
    }
  }

  return randomNumbers;
};

// Generates the text for the array which
const generateLottoNumbersText = (numbers, lotto) => {
  let divsNormalNumbers = "";
  let divspecialNumbers = "";

  numbers.normal.forEach((number) => {
    divsNormalNumbers += `<div class="number normal">${number}</div>`;
  });

  numbers.special.forEach((number) => {
    divspecialNumbers += `<div class="number special ${lotto}">${number}</div>`;
  });

  return `
        <div class="number-row ${lotto}">
            <div class="lotto-numbers-normal">
                ${divsNormalNumbers}
            </div>
            <div class="lotto-numbers-special">
                ${divspecialNumbers}
            </div>
            <div class="button-wrapper-delete">
                <button class="btn-delete">Delete</button>
            </div>
        </div>
    `;
};

// Updates the Euro Million view depending on the array
const updateEuroMillionsView = () => {
  divEuroMillionsNumbers.innerHTML = "";

  euroMillionsNumbers.forEach((numbers) => {
    const text = generateLottoNumbersText(numbers, "euro-millions");
    divEuroMillionsNumbers.insertAdjacentHTML("beforeend", text);
  });
};

// Updates the Swiss Lotto view depending on the array
const updateSwissLottoView = () => {
  divSwissLottoNumbers.innerHTML = "";

  swissLottoNumbers.forEach((numbers) => {
    const text = generateLottoNumbersText(numbers, "swiss-lotto");
    divSwissLottoNumbers.insertAdjacentHTML("beforeend", text);
  });
};

// Method to update the views depending on the current tab
const updateView = (lotto) => {
  if (lotto === "euro-millions") {
    updateEuroMillionsView();
  } else if (lotto === "swiss-lotto") {
    updateSwissLottoView();
  } else {
    updateEuroMillionsView();
    updateSwissLottoView();
  }
};

// Gets the random number via API or if not possible via the offline number generator
const getRandomNumber = async (min, max, quantity) => {
  //   let numbersToAdd = await generateRandomNumber(min, max, quantity);
  let numbersToAdd = generateOfflineRandomNumber(min, max, quantity);

  //   if (numbersToAdd === undefined) {
  //     numbersToAdd = generateOfflineRandomNumber(min, max, quantity);
  //   }
  numbersToAdd.sort((a, b) => a - b);

  return numbersToAdd;
};

// Uses the getRandomNumber Method to return the normal and special number
const createNumbers = async (configuration) => {
  const normalNumbers = await getRandomNumber(
    configuration.normal.min,
    configuration.normal.max,
    configuration.normal.quantity
  );
  const specialNumbers = await getRandomNumber(
    configuration.special.min,
    configuration.special.max,
    configuration.special.quantity
  );

  return (randomNumbers = [{ normal: normalNumbers, special: specialNumbers }]);
};

// Function that handles the adding of the numbers
const addMoreNumbers = async (e) => {
  const element = e.currentTarget;
  let randomNumbers = [];

  if (element.closest(".euro-millions")) {
    randomNumbers = await createNumbers(euroMillionsNumberConfiguration);
    euroMillionsNumbers.push(...randomNumbers);
    updateView("euro-millions");
  } else if (element.closest(".swiss-lotto")) {
    randomNumbers = await createNumbers(swissLottoNumberConfiguration);
    swissLottoNumbers.push(...randomNumbers);
    updateView("swiss-lotto");
  } else {
    throw Error("Error with selected lotto with adding more numbers");
  }
};

// Function that changes the numbers
const newNumbers = async (e) => {
  const element = e.currentTarget;
  let newRandomNumbers = [];

  if (element.closest(".euro-millions")) {
    for (let i = 0; i < euroMillionsNumbers.length; i++) {
      newRandomNumbers = await createNumbers(euroMillionsNumberConfiguration);
      euroMillionsNumbers[i].normal = newRandomNumbers[0].normal;
      euroMillionsNumbers[i].special = newRandomNumbers[0].special;
    }
    updateView("euro-millions");
  } else if (element.closest(".swiss-lotto")) {
    for (let i = 0; i < swissLottoNumbers.length; i++) {
      newRandomNumbers = await createNumbers(swissLottoNumberConfiguration);
      swissLottoNumbers[i].normal = newRandomNumbers[0].normal;
      swissLottoNumbers[i].special = newRandomNumbers[0].special;
    }
    updateView("swiss-lotto");
  } else {
    throw Error("Error with selected lotto with new numbers");
  }
};

// Function that handles the tab switches
const handleTabClick = (e) => {
  tabButtons.forEach((tabButtons) => {
    tabButtons.setAttribute("aria-selected", false);
  });

  tabPanels.forEach((tabPanel) => {
    tabPanel.hidden = true;
  });

  e.currentTarget.setAttribute("aria-selected", true);
  const id = e.currentTarget.id;
  const currentTabPanel = tabs.querySelector(`[aria-labelledby=${id}]`);
  currentTabPanel.hidden = false;

  if (currentTabPanel.getAttribute("aria-labelledby") === "swiss-lotto") {
    background.classList.add("red");
  } else {
    background.classList.remove("red");
  }
};

// Returns the index if the values from the object and array matches
const getIndex = (object, numbers) => {
  for (let i = 0; i < numbers.length; i++) {
    let isNormalEqual = false;
    let isSpecialEqual = false;

    numbers[i].normal.forEach((number, index) => {
      number === object.normal[index]
        ? (isNormalEqual = true)
        : (isNormalEqual = false);
    });

    numbers[i].special.forEach((number, index) => {
      number === object.special[index]
        ? (isSpecialEqual = true)
        : (isSpecialEqual = false);
    });

    if (isNormalEqual && isSpecialEqual) {
      return i;
    }
  }
  return -1;
};

// Deletes the selected element in the array
const deleteElementInArray = (elementToDelete, lotto) => {
  let elementNumbers = { normal: [], special: [] };
  const divNormalNumbersWrapper = elementToDelete.querySelector(
    ".lotto-numbers-normal"
  );
  const divSpecialNumbersWrapper = elementToDelete.querySelector(
    ".lotto-numbers-special"
  );
  const divNormalLength = divNormalNumbersWrapper.children.length;
  const divSpecialLength = divSpecialNumbersWrapper.children.length;

  for (let i = 0; i < divNormalLength; i++) {
    elementNumbers.normal.push(
      parseInt(divNormalNumbersWrapper.children[i].textContent)
    );
  }

  for (let i = 0; i < divSpecialLength; i++) {
    elementNumbers.special.push(
      parseInt(divSpecialNumbersWrapper.children[i].textContent)
    );
  }

  if (lotto === "euro-millions") {
    const index = getIndex(elementNumbers, euroMillionsNumbers);
    if (index > -1) {
      euroMillionsNumbers.splice(index, 1);
    } else {
      throw Error("Index not found. Element not in Array");
    }
  } else if (lotto === "swiss-lotto") {
    const index = getIndex(elementNumbers, swissLottoNumbers);
    if (index > -1) {
      swissLottoNumbers.splice(index, 1);
    } else {
      throw Error("Index not found. Element not in Array");
    }
  } else {
    throw Error("Error with selected lotto. Not found");
  }
};

// Function that handles the process of deleting the element
const deleteLottoRow = (e) => {
  let elementToDelete;

  if (e.path[0].closest(".euro-millions")) {
    elementToDelete = e.path[0].closest(".number-row.euro-millions");
    deleteElementInArray(elementToDelete, "euro-millions");
  } else if (e.path[0].closest(".swiss-lotto")) {
    elementToDelete = e.path[0].closest(".number-row.swiss-lotto");
    deleteElementInArray(elementToDelete, "swiss-lotto");
  } else {
    throw Error("Error with selected lotto with new numbers");
  }
  updateView();
};

// Handles when the delete button is clicked
const handleDeleteButtonClick = (e) => {
  e.preventDefault();

  if (e.target.classList.contains("btn-delete")) {
    deleteLottoRow(e);
  }
};

tabButtons.forEach((tabButton) =>
  tabButton.addEventListener("click", handleTabClick)
);
btnsAddNumbers.forEach((btnAddNumbers) =>
  btnAddNumbers.addEventListener("click", addMoreNumbers)
);
btnsNewNumbers.forEach((btnNewNumbers) =>
  btnNewNumbers.addEventListener("click", newNumbers)
);
document.addEventListener("click", handleDeleteButtonClick);

// Display data on page load which are already in the array
updateView();
