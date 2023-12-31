const generateForm = document.querySelector(".generate-form");
const ImageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

const userImageCarsd = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = ImageGallery.querySelector(".img-card")[index];
    const imgElemnt = imgCard.querySelector("img");

    //set the image sourse to the AI-Generated image Data
    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.base64_json}`;
    imgElemnt.src = aiGeneratedImg;

    // when the image is loaded remove the loarding class
    imgElemnt.onload = () => {
      imgCard.classList.remove("loading");
    };
  });
};

generateAiImages = async (userPrompt, userImageQuantity) => {
  try {
    //Send request to OpenAI API
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImageQuantity),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    if (!response.ok) throw new Error("Something went wrong");
    const { data } = await response.json();
    // console.log(data);
    userImageCarsd([...data]);
  } catch (error) {
    alert(error.message);
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();

  // get user input and image quantity
  const userPrompt = e.srcElement[0].value;
  const userImageQuantity = e.srcElement[1].value;

  // console.log(userPrompt, userImageQuantity);

  // Create HTML markup for image cards with loading state
  const imgCardMArkup = Array.from(
    { length: userImageQuantity },
    () =>
      ` <div class="img-card loading">
          <img src="assets/loader.svg" alt="image" />
          <a href="#" class="download-btn">
            <img src="assets//download.svg" alt="download icon" />
          </a>
        </div>`
  ).join("");

  // console.log(imgCardMArkup);
  ImageGallery.innerHTML = imgCardMArkup;

  generateAiImages(userPrompt, userImageQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
