const uploadImage = document.getElementById("uploadImage");
const hiddenUploadBtn = document.getElementById("hiddenUploadBtn");
const usedStorage = document.getElementById("usedStorage");
const currentMemory = document.getElementById("currentMemory");
const availableSpace = document.getElementById("availableSpace");
const maxMemory = document.getElementById("maxMemory");
const imageList = document.getElementById("imageList");
const dangerText = document.getElementById("dangerText");
const gradient = document.getElementById("gradient");
const photosArr = JSON.parse(localStorage.getItem("photos")) || [];

const InitializeLocalStorageIfEmpty = () => {
  !localStorage.getItem("usedSpace") && localStorage.setItem("usedSpace", "0");
  !localStorage.getItem("availableSpace") &&
    localStorage.setItem("availableSpace", "10");
  !JSON.parse(localStorage.getItem("photos")) &&
    localStorage.setItem("photos", JSON.stringify([]));
};

const getItemFromLocalStorageInFloat = (itemName) => {
  const parsedItem = parseFloat(localStorage.getItem(itemName), 10);
  return parsedItem;
};

const updateAndConversionLocalStorageValue = (itemName) => {
  const localItem = localStorage.getItem(itemName);
  const parsedItem = localItem ? parseFloat(localItem, 10) : 0;
  const item = Number.isInteger(parsedItem)
    ? parsedItem.toString()
    : parsedItem.toFixed(2);
  return item;
};

const updateDisplay = () => {
  const usedSpace = updateAndConversionLocalStorageValue("usedSpace");
  const freeSpace = updateAndConversionLocalStorageValue("availableSpace");
  const barWidth = usedSpace * 10;
  availableSpace.innerHTML = `${freeSpace} `;
  gradient.style.width = `${barWidth}%`;
  usedStorage.innerHTML = `${usedSpace} MB`;
  currentMemory.innerHTML = `${usedSpace} MB`;
};

const uploadFile = () => {
  hiddenUploadBtn.click();
};

const createButton = () => {
  const button = document.createElement("button");
  button.classList.add("my-button");
  return button;
};

const putValuesInButton = (button, image) => {
  button.innerText = `${image.imageSize} MB`;
  button.value = image.imageName;
  return button;
};

const appendImageDetailsToLocalStorage = (image) => {
  const neuArr = JSON.parse(localStorage.getItem("photos")) || [];
  const availableSpace = getItemFromLocalStorageInFloat("availableSpace");
  const usedSpace = getItemFromLocalStorageInFloat("usedSpace");
  localStorage.setItem("usedSpace", (usedSpace + image.imageSize).toFixed(2));
  localStorage.setItem(
    "availableSpace",
    (availableSpace - image.imageSize).toFixed(2)
  );
  neuArr.push(image);
  localStorage.setItem("photos", JSON.stringify(neuArr));
};

const appendImage = (image) => {
  const button = createButton();
  putValuesInButton(button, image);
  imageList.appendChild(button);
};

const removeImageSizeFromLocalStorage = (imageSizeToRemove) => {
  const availableSpace = getItemFromLocalStorageInFloat("availableSpace");
  const usedSpace = getItemFromLocalStorageInFloat("usedSpace");
  localStorage.setItem("availableSpace", availableSpace + imageSizeToRemove);
  usedSpace - imageSizeToRemove === 0
    ? localStorage.setItem("usedSpace", 0)
    : localStorage.setItem(
        "usedSpace",
        (usedSpace - imageSizeToRemove).toFixed(2)
      );
};

const removeImageFromLocalStorage = (imageNameToRemove) => {
  const arr = JSON.parse(localStorage.getItem("photos")) || [];
  const neuArr = arr.filter((item) => item.imageName !== imageNameToRemove);
  localStorage.setItem("photos", JSON.stringify(neuArr));
};

const removeImage = (image) => {
  const imageSizeToRemove = image.imageSize;
  const imageNameToRemove = image.imageName;
  removeImageSizeFromLocalStorage(imageSizeToRemove);
  removeImageFromLocalStorage(imageNameToRemove);
};

const createButtonsList = (imagesArr) => {
  imagesArr.forEach((item) => {
    appendImage(item);
  });
};

const initApp = () => {
  InitializeLocalStorageIfEmpty();
  createButtonsList(photosArr);
  updateDisplay();
};

hiddenUploadBtn.addEventListener("change", function () {
  dangerText.classList.add("hidden");
  const availableSpace = getItemFromLocalStorageInFloat("availableSpace");
  const usedSpace = getItemFromLocalStorageInFloat("usedSpace");
  const fileExtensionRegex = /\.(jpg|jpeg|gif|png)$/i;
  const fileName = hiddenUploadBtn.value;
  const selectedFile = hiddenUploadBtn.files[0];
  const image = {
    imageName: selectedFile.name,
    imageSize: parseFloat((selectedFile.size / 1048576).toFixed(2)),
  };
  if (!fileExtensionRegex.test(fileName)) {
    alert("File format isn't supported");
  } else if (availableSpace <= 0 || usedSpace + image.imageSize > 10) {
    dangerText.classList.remove("hidden");
  } else {
    appendImage(image);
    appendImageDetailsToLocalStorage(image);
    updateDisplay();
  }
});

imageList.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    const image = {
      imageSize: parseFloat(event.target.innerHTML, 10),
      imageName: event.target.value,
    };
    removeImage(image);
    updateDisplay();
    event.target.remove();
    dangerText.classList.add("hidden");
  }
});

initApp();
