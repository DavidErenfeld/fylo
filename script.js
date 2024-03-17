const uploadImage = document.getElementById("uploadImage");
const hiddenUploadBtn = document.getElementById("hiddenUploadBtn");
const usedStorage = document.getElementById("usedStorage");
const currentMemory = document.getElementById("currentMemory");
const availableSpace = document.getElementById("availableSpace");
const maxMemory = document.getElementById("maxMemory");
const imageList = document.getElementById("imageList");
const dangerText = document.getElementById("dangerText");
const gradient = document.getElementById("gradient");
const arr = JSON.parse(localStorage.getItem("photos"));

const updateDisplay = () => {
  gradient.style.width = `${
    parseFloat(localStorage.getItem("usedSpace"), 10).toFixed(2) * 10
  }%`;

  usedStorage.innerHTML = `${parseFloat(
    localStorage.getItem("usedSpace"),
    10
  )} MB`;

  currentMemory.innerHTML = `${parseFloat(
    localStorage.getItem("usedSpace"),
    10
  )} MB`;

  if (localStorage.getItem("availableSpace") === "10") {
    availableSpace.innerHTML = `${parseInt(
      localStorage.getItem("availableSpace")
    )} `;
  } else {
    availableSpace.innerHTML = `${parseFloat(
      localStorage.getItem("availableSpace"),
      10
    ).toFixed(2)} `;
  }
};

const showButtons = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const button = document.createElement("button");
    button.classList.add("my-button");
    let imageSize = arr[i].imageSize;
    let imageName = arr[i].imageName;
    button.innerText = `${imageSize}`;
    button.value = imageName;
    imageList.appendChild(button);
  }
};

// Event Listeners

uploadImage.addEventListener("click", function () {
  hiddenUploadBtn.click();
});

hiddenUploadBtn.addEventListener("change", function () {
  dangerText.classList.add("hidden");
  fileName = hiddenUploadBtn.value;
  extension = fileName.split(".").pop();
  const selectedFile = hiddenUploadBtn.files[0];
  const image = {
    imageName: selectedFile.name,
    imageSize: parseFloat((selectedFile.size / 1048576).toFixed(2)),
  };

  if (
    extension !== "jpg" &&
    extension !== "jpeg" &&
    extension !== "gif" &&
    extension !== "png"
  ) {
    alert("File format isn't supported");
  } else if (
    parseFloat(localStorage.getItem("availableSpace"), 10) <= 0 ||
    parseFloat(localStorage.getItem("usedSpace"), 10) + image.imageSize >= 10
  ) {
    dangerText.classList.remove("hidden");
  } else {
    const neuArr = JSON.parse(localStorage.getItem("photos")) || [];
    neuArr.push(image);
    localStorage.setItem("photos", JSON.stringify(neuArr));

    const button = document.createElement("button");
    button.classList.add("my-button");
    button.innerText = `${image.imageSize}`;
    button.value = image.imageName;
    document.getElementById("imageList").appendChild(button);

    let currentSize =
      parseFloat(localStorage.getItem("usedSpace"), 10) + image.imageSize;
    localStorage.setItem("usedSpace", currentSize.toString());

    localStorage.setItem(
      "availableSpace",
      (
        parseFloat(localStorage.getItem("availableSpace"), 10) - image.imageSize
      ).toFixed(2)
    );
    updateDisplay();
  }
});

imageList.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    const imageSizeToRemove = parseFloat(event.target.innerHTML, 10);
    const imageNameToRemove = event.target.value;

    localStorage.setItem(
      "availableSpace",
      parseFloat(localStorage.getItem("availableSpace"), 10) + imageSizeToRemove
    );

    if (
      parseFloat(localStorage.getItem("usedSpace"), 10) - imageSizeToRemove ===
      0
    ) {
      localStorage.setItem("usedSpace", 0);
    } else {
      localStorage.setItem(
        "usedSpace",
        (
          parseFloat(localStorage.getItem("usedSpace"), 10) - imageSizeToRemove
        ).toFixed(2)
      );
    }

    const arr = JSON.parse(localStorage.getItem("photos")) || [];
    const neuArr = arr.filter((i) => i.imageName !== imageNameToRemove);
    localStorage.setItem("photos", JSON.stringify(neuArr));
    updateDisplay();
    event.target.remove();
    dangerText.classList.add("hidden");
  }
});

updateDisplay();
showButtons(arr);
