let storyModal = null;
const ANNIVERSARY = "2024-12-27";
const SLIDE_TEMPLATE =
  "<div class='slide'><p class='date'></p><div class='skeleton'></div><img class='image' loading='lazy' onload='loadImage(this)' /><p class='title'></p><p class='desc'></p></div>";

document.addEventListener("DOMContentLoaded", async function () {
  await loadContent().then(() => {
    document.querySelector(".container").classList.remove("do-not-show");
    document.querySelector(".container").classList.add("visible");
    document.querySelector(".loader").classList.add("do-not-show");
  });
});

async function loadContent() {
  // add date to DOM
  const date = document.querySelector("#date");
  date.innerHTML = getDate();

  // add days to DOM
  const days = document.querySelector("#counter");
  days.innerHTML = calculateDays(ANNIVERSARY);

  // init bootstrap modal
  storyModal = new bootstrap.Modal(document.getElementById("storyModal"));

  const storyParts = await fetch(
    "https://opensheet.elk.sh/1I2fIh00WDBIfBh7_WvHKqPhbi3Wugu3TyLjld6pMSxw/us"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error during fetching:", error);
      return null;
    });

  const slidesContainer = document.querySelector("#storySlides");
  storyParts.forEach((storyPart, i) => {
    const slide = document.createElement("div");
    slide.classList.add("carousel-item");
    if (i == 0) {
      slide.classList.add("active");
    }
    slide.innerHTML = SLIDE_TEMPLATE;

    slide.querySelector(".date").innerHTML = storyPart.date;
    slide.querySelector(".title").innerHTML = storyPart.title;
    slide.querySelector(".desc").innerHTML = storyPart.description;
    slide.querySelector(".image").src = storyPart.image;

    slidesContainer.appendChild(slide);
  });
}

function loadImage(image) {
  image.previousElementSibling.style.display = "none";
}

function openStory() {
  storyModal.show();
}

function getDate() {
  const current = new Date();
  const year = current.getFullYear();
  const month = current.getMonth() + 1;
  const day = current.getDate();

  return `${day}/${month < 10 ? "0" + month : month}/${year}`;
}

function calculateDays(date) {
  const current = new Date();
  const target = new Date(date);
  const difference = Math.abs(current.getTime() - target.getTime());
  const count = Math.floor(difference / 86400000);

  return count;
}
