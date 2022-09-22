let zBereich;

function setup() {
    //createCanvas(800, 600);
    //background(0); Ohne background() = "transparent"!!
    zBereich = createCanvas(windowWidth / 4, windowHeight / 4);
    //windowWidth und windowHeight sind die Werte des Browserfensters und
    //werden von dort (API) abgefragt
    zBereich.position(0, 0); //Links oben
    //zBereich.style('z-index', '-1'); // Verschiebung auf der z-Achse

}

function draw() {
    noStroke();
    fill(255, 50);
    circle(mouseX, mouseY, 24);
}

function mousePressed() {
    background(0);
}