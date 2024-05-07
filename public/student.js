var imageSources = [
    "/personnage.png",
    "/personnage2.png",
    "/personnage3.png",
    "/personnage4.gif",
    "/personnage5.gif",
];

function selectRandomImageSource() {
    var randomIndex = Math.floor(Math.random() * imageSources.length);
    var randomImageSource = imageSources[randomIndex];
    return randomImageSource;
}

var imgElement = document.getElementById("randomImage");

var selectedImageSource = selectRandomImageSource();

imgElement.src = selectedImageSource;
