/**
 * Neoplasticism.
 * Generates art in the style of Piet Mondrian
 * Press r for a new random piece
 * Press t for a random piece with random colour palette
 */
// Import the library
//import nice.palettes;

//// Declare the main ColorPalette object
//ColorPalette palette;


let monColor = [];

let debounceTime = 100;
let lastTime = 0;
let runFlag = true;

//1.777777 for 16:9
//1.333333 for 4:3
//1        for square
let aspectRatio = 1;//.7777777777;
let wX = 1200;
let wY = 900;
let max_depth = 5;
let border_width = 10;
let safety_margin = 2;

let seed_val;

function makeSlider(n, min, max, default_pos) {
  let slider;
  slider = createSlider(min, max, default_pos);
  slider.position(wX + 100, 50 * n);
  slider.style('width', '80px');
  return slider;
}

function generateRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(random(0, 1) * 16)];
  }
  return color;
}

function generateRandomPalette() {
  var palette = [];
  for (var i = 0; i < 6; i++) {
    palette[i] = generateRandomColor();
  }
  return palette;
}

function setup() {
  createCanvas(wX + 200, wY);
  border_slider = makeSlider(1, 1, 50, 10);
  depth_slider = makeSlider(2, 1, 12, 5);
  safety_margin_slider = makeSlider(3, -100, 100, 2);
  colour_palette_toggle = makeSlider(4, 0, 1, 0);
  seed_val= floor(random(0, 100000));
  console.log('Initial seed ', seed_val);
  monColor[0] = '#E5BC04'; // Y
  monColor[1] = '#B61E03'; // R
  monColor[2] = '#4678A5'; // B
  monColor[3] = '#000000'; // W
  monColor[4] = '#FFFFFF'; // B


  rectMode(CENTER);
  //palette = new ColorPalette(this);

  //size(wX, wY);
  background(255);
  fill(0);
  noSmooth();
  background(255);
  fill(0);
  rect(wX / 2, wY / 2, wX, wY);
  drawCells();
}

function keyPressed() {
  if ((keyCode === RIGHT_ARROW)) {
    seed_val = floor(random(0, 100000));
    console.log('redrawing with seed val ', seed_val);
  }
  return false; // prevent any default behaviour
}

function draw() {
  //if ((keyCode === LEFT_ARROW) & (millis() - lastTime > debounceTime)) {
  //if (key == 't') {
  //  let numPalettes = palette.getPaletteCount();
  //  let palette_number = floor(random(0, numPalettes));
  //  monColor=palette.getPalette(palette_number);
  //  print("Using palette number: ", palette_number, "\n");
  //  background(255);
  //  fill(0);
  //  rect(width/2, height/2, width, height);
  //  drawCells();
  //}
  //else if (key == 's') {
  //    saveFrame();
  //  }

  //  lastTime = millis();
  border_width = border_slider.value();
  max_depth = depth_slider.value();
  safety_margin = safety_margin_slider.value();
  colour_palette_random = colour_palette_toggle.value();

  randomSeed(seed_val);
  palette = generateRandomPalette()
    if (colour_palette_random == 1) {
    monColor = palette
  } else {
    monColor[0] = '#E5BC04'; // Y
    monColor[1] = '#B61E03'; // R
    monColor[2] = '#4678A5'; // B
    monColor[3] = '#000000'; // W
    monColor[4] = '#FFFFFF'; // B
  }
  background(255);
  //print("Using standard Palette ");
  //print("\n");
  fill(0);
  //console.log(width, wX, height, wY)
  rect(wX / 2, wY / 2, wX, wY);

  drawCells();
}

function drawCells() {
  fill(monColor[floor(random(3))]);
  noStroke();
  //randomSeed(22);
  let B = [wX - border_width / 2, wY - border_width / 2];
  let A = [border_width / 2, border_width / 2];
  split_sq2(A, B, 0);
}



function colour_picker() {
  return (monColor[floor(random(5))]);
}

function weighted_decider(depth) {
  // More likely at depth 1, more likely false at depth = max_depth
  let d = depth - 1;
  let decider = random(0, 100);
  let min = 20;
  let frac = float(d) / float(max_depth);
  let threshold = min + frac * (100 - min);
  //print("Current depth ", d, " Threshold: ", threshold, "\n");
  if (decider >= threshold) {
    return true;
  }
  return false;
}

function decider() {
  let decision = random(0, 100);
  if (decision >= 50) {
    return false;
  }
  return true;
}

function split_sq2(A, B, depth) {
  //print("\n");
  //print("\n");
  if (depth > max_depth) {
    //print("max depth hit, returning\n");
    return;
  }
  //print('called split with ', A, B, depth);

  // x1, y1, x2, y2
  let x1 = A[0];
  let y1 = A[1];
  let x2 = B[0];
  let y2 = B[1];
  //print(x1, ",", y1, " --> ", x2, ",", y2, "\n");
  // Choose a direction to split (Vert/Horz)
  let dir = decider();
  //print("Chose dir "+dir+ "   \n");

  // Choose the divpoint
  let w, h, mid_x, mid_y;
  let x3, x4, y3, y4;
  let divpoint;
  mid_x = (x1 + x2) / 2;
  mid_y = (y1 + y2) / 2;
  w = x2 - x1;
  h = y2 - y1;
  //print("midpoint: ", mid_x, ",", mid_y, "");
  //print("\n");
  //print("dimensions: ", w, ",", h, "");
  //print("\n");

  // Fill the current square
  let colour = colour_picker();
  //print("Chose colour "+colour+" as fill \n");
  fill(colour);
  rect(mid_x, mid_y, (w - border_width) + safety_margin, (h - border_width) + safety_margin);

  // Set colour back to black for borders
  fill(0);

  // Split the box
  if (dir) {
    divpoint = floor(random(h / 3, 2 * h / 3));

    rect(x1 + w / 2, y1 + divpoint, w, border_width);
    //print(x1 + w/2, ", ", y1+divpoint, ", ", h, ", ", border_width, "\n");

    // Co-ords of new boxes
    x3 = x1;
    x4 = x2;
    y3 = y1 + divpoint;
    y4 = y1 + divpoint;
  } else {

    divpoint = floor(random(w / 3, 2 * w / 3));

    rect(x1 + divpoint, y1 + h / 2, border_width, h);
    //print(x1 + divpoint, ", ", y1+h/2, ", ", border_width, ", ", w, "\n");

    // Co-ords of new boxes
    y3 = y1;
    y4 = y2;
    x3 = x1 + divpoint;
    x4 = x1 + divpoint;
  }
  //print("Divpoint was ", divpoint, " split in direction ", dir);
  //print("\n");

  // increment depth
  depth = depth + 1;

  // Co-ords for next possible calls
  let C = [x3, y3];
  let D = [x4, y4];

  // Call this func again for each half, based on probability and depth
  let call_left = weighted_decider(depth);
  let call_right = weighted_decider(depth);
  if (call_left) {
    //print("Calling left\n");
    split_sq2(A, D, depth);
  }
  if (call_right) {
    //print("Calling right\n");
    split_sq2(C, B, depth);
  }
}
