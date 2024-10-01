function setup() {
  leinwand = createCanvas(windowWidth, windowHeight);
  leinwand.position(0,0); //Links oben
  leinwand.style("z-index","-1");
  fill(0,0,100,20);
  noStroke();
  //background(221,160,221);
}

function draw() {
  
  circle(mouseX,mouseY,20);
}