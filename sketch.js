/// Text Morpher
/// Version 9
/// Tutorial Version
/// by Ed Cavett
/// November 2021...

/// Using two lines of text,
/// move the points from one
/// line to describe the other
/// using interpolated collation.
/// Include methods for displaying the
/// current date and time.

let morpher;
let msg = [];
let myFont;

function preload() {
  // myFont = loadFont('paraaminobenzoic.ttf');
  // myFont = loadFont('Retroica.ttf');
  myFont = loadFont("Hyperspace.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  msg.push("Liebe Isa");
  msg.push("Happy Birthday");
  msg.push("Spirituelle Erleuchtung");
  msg.push("Gute Nerven für die Kids");
  msg.push("Bssrl von Pips");
  // msg.push("CLOCK");
  // msg.push("DATE");

  morpher = new morphMaker();
  strokeCap(SQUARE);
  background(0, 255);
}

function draw() {
  background(0, 255);
  morpher.update();
}

function morphMaker() {
  this.size = 8;
  this.speed = 0.03;
  this.close = 0.5;
  this.msgswitch = 0;
  this.offset = random(1000);
  this.dart = [];
  this.timeIs = "";
  this.dateIs = "";
  
  let dartSize = 550;

  
  /// Setup the moving points, increase their scale,
  /// and set to center.
  let centerX = 0;
  let centerWidth = width / 2;
  for (let i = 0; i < dartSize; i++) {
    this.dart.push(createVector(this.size,this.size));
    this.dart[i].x += centerWidth;
    this.dart[i].y += height / 2;
  }
  /// Setup the target points, increase their scale,
  /// and center-justify locations.
  this.target = myFont.textToPoints(msg[0], 0, 0, 10, {
    sampleFactor: 2,
    simplifyThreshold: 0.0,
  });
  
  /// Scale up the target points.
  /// Find the width of the target output.
  centerX = 0;
  for (let i = 0; i < this.target.length; i++) {
    this.target[i].x *= this.size;
    this.target[i].y *= this.size;
    if (centerX < this.target[i].x) {
      centerX = this.target[i].x;
    }
  }
  /// Center-justify the target output.
  centerWidth = width / 2 - centerX / 2;
  for (let i = 0; i < this.target.length; i++) {
    this.target[i].x += centerWidth;
    this.target[i].y += height / 2;
  }

  
  /// Animate the morphing object.
  /// Switch text and cycle through messages.
  /// Repeat processes.
  this.update = function () {
    this.offset += 0.05;
    for (let i = 0; i < this.dart.length; i++) {
      let findi = floor(
        map(i, 0, this.dart.length - 1, 0, this.target.length - 1)
      );

      if (i > 0) {
        let dlen = dist(
          this.dart[i].x,
          this.dart[i].y,
          this.dart[i - 1].x,
          this.dart[i - 1].y
        );
        if (dlen < this.size * 1.5) {
          let colr = map(
            noise((i + 500) * 0.01, frameCount * 0.05),
            0,
            1,
            -50,
            305
          );
          stroke(colr, 0, 255, 255);
          strokeWeight(2);
          if (noise(i * 0.02, this.offset) < 0.5) {
            stroke(0, colr, 255, 255);
            strokeWeight(5);
          }

          line(
            this.dart[i].x,
            this.dart[i].y,
            this.dart[i - 1].x,
            this.dart[i - 1].y
          );
        }
      }

      this.dart[i].x = lerp(
        this.dart[i].x,
        this.target[findi].x,
        this.speed
      );
      this.dart[i].y = lerp(
        this.dart[i].y,
        this.target[findi].y,
        this.speed
      );
      let dlen = dist(
        this.dart[i].x,
        this.dart[i].y,
        this.target[findi].x,
        this.target[findi].y
      );
      if (i === this.dart.length - 1) {
        if (dlen < this.close) {
          this.restart();
        }
      }

      if (noise((i + 200) * 0.05, this.offset) < 0.5) {
        if (random() < 0.001) {
          let sparkz = random(1, 2);
          for (n = 0; n < 10; n++) {
            push();
            translate(this.dart[i].x, this.dart[i].y);
            let Lrnd = random(-this.size * sparkz, 0);
            let Rrnd = random(0, this.size * sparkz);
            let rotrnd = random(-PI, PI);
            rotate(rotrnd);
            stroke(255, 255);
            strokeWeight(1);
            line(Lrnd, 0, Rrnd, 0);
            pop();
          }
        }
      }
    }
  };

  /// Switch text lines in the message list.
  /// Test for date, time display message.
  /// Get date/time, if needed.
  /// Setup target points with new text.
  /// Return to update method with new target locations.
  this.restart = function () {
    this.msgswitch += 1;
    if (this.msgswitch > msg.length - 1) {
      this.msgswitch = 0;
    }

    let m = msg[this.msgswitch];
    if (m === "CLOCK") {
      this.readClock();
      m = this.timeIs;
    }
    if (m === "DATE") {
      this.readDate();
      m = this.dateIs;
    }
    this.target = myFont.textToPoints(m, 0, 0, 10, {
      sampleFactor: 2,
      simplifyThreshold: 0.0,
    });
    
    let centerX = 0;
    let centerY = 0;
    for (let i = 0; i < this.target.length; i++) {
      this.target[i].x *= this.size;
      this.target[i].y *= this.size;
      if (centerX < this.target[i].x) {
        centerX = this.target[i].x;
      }
      if (centerY > this.target[i].y) {
        centerY = this.target[i].y;
      }
    }

    let centerWidth = width / 2 - centerX / 2; //random(0,width-centertext);
    let centerHeight = random(centerY * -2, height + centerY);
    for (let i = 0; i < this.target.length; i++) {
      this.target[i].x += centerWidth;
      this.target[i].y += height / 2; //centerHeight;
    }
  };

  /// Format raw time data into text string.
  this.readClock = function () {
    let sec = str(0);
    let min = str(0);
    let hou = str(0);
    if (second() < 10) {
      sec += str(second());
    } else {
      sec = str(second());
    }
    if (minute() < 10) {
      min += str(minute());
    } else {
      min = str(minute());
    }
    if (hour() > 12) {
      hou = str(hour() - 12);
    } else {
      hou = str(hour());
    }
    if (hou === "0") {
      hou = "12";
    }
    let mer = "";
    if (hour() < 11) {
      mer = "AM";
    } else {
      mer = "PM";
    }
    this.timeIs = hou + char(58) + min + " " + mer;
  };
  
  /// Format numerical date into text string.
  this.readDate = function () {
    let mnth = month();
    let mname = [
      "JANUARY",
      "FEBRARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ];
    let dy = day();
    this.dateIs = mname[mnth - 1] + " " + dy;
  };
}

/// Provide a way to view the output in full screen
/// mode.  Click the canvas to switch modes.
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
