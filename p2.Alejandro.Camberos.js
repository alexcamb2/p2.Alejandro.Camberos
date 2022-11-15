//Top row of rectangles
let rectangles = [];
let x = 555, xr = 530;
let y = 130, yr = 470;
let w = 180, wr = 150;
let h = 150, hr = 400;
let c = 30;

let circles = [];
let cx = 1030;
let cy = 660;
let cd = 70;
let cd2 = 70;

//other variables
let capture;
let lbk_desc;
let lbk_temp;
let ntemp, ntemp1, ntemp2;
let minu = 0;





function preload(){
  loadJSON("news.json", newsData);
  loadJSON("weather.json", lbkData);
}

function setup(){
  createCanvas(displayWidth,displayHeight-111);
  colorMode(HSB,360,0,100);
  rectMode(CENTER);
  noFill();
  
  stroke(207,7,99);
  for (let i = 0; i < 3; i++){
    rectangles[i] = new Rectangle (x,y,w,h,c);
    x = x + 210;
  } 
  rectangles[3] = new Rectangle(xr,yr,wr,hr,c);
  for (let i = 0; i < 4; i++){
    circles[i] = new Circle (cx,cy,cd,cd2);
    cy = cy - 90;
  } 
  capture = createCapture(VIDEO);
  capture.hide();
  
}

function draw() {
  
  background(230,50,15);
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(207,7,99); 
  tint(255, 80); 
  image(capture, 427, 40, 680, 680);
  ct = int(millis()/1000);
 

  //Start of the main background
  strokeWeight(20);
  rect(width/2,height/2, 700, 700,30);
  for (let i = 0; i < rectangles.length; i++){
    rectangles[i].show(mouseX,mouseY);
  } 
  for (let i = 0; i < circles.length; i++){
    circles[i].show(mouseX,mouseY);
  } 

  // //calender
  strokeWeight(2);
  textSize(40);
  let d = day();
  let m = month();
  text(m + "-" + d, rectangles[0].x-50,rectangles[0].y-25);
  textSize(15);
  strokeWeight(.7);
  text("• Brunch @ 11:40 AM",rectangles[0].x+70,rectangles[0].y+40, 300,100);
  text("• Test @ 1:30 PM",rectangles[0].x+70,rectangles[0].y+60, 300,100);
  text("• Dinner @ 6:30 PM",rectangles[0].x+70,rectangles[0].y+80, 300,100);

  //clock
  strokeWeight(2);
  textSize(40);
  var hr = hour(); 
  var sec = second(); 
  var min = minute(); 
  var mer = hr < 12 ? "AM" : "PM"; 
  sec = formatting(sec);
  min = formatting(min); 
  hr = formatting(hr%12); 
  text(hr + ":" + min + ":" + sec, rectangles[1].x-80, rectangles[1].y);
  text(mer, rectangles[1].x, rectangles[1].y+60);
 
  //weather
  strokeWeight(2);
  textSize(20);
  text("Lubbock", rectangles[2].x-65,rectangles[2].y-35);
  textSize(40)
  text(round(lbk_temp) + "° C", rectangles[2].x-25,rectangles[2].y+15);
  //image(lbk_desc, rectangles[2].x, rectangles[2].y-35, 70, 70);

  //Personalization stuff
  strokeWeight(2);
  textSize(20);
  text("NEWS ", rectangles[3].x-35,rectangles[3].y-160);  
  textSize(15)
  strokeWeight(.5)
  text("• " + ntemp + "...",rectangles[3].x,rectangles[3].y-90,100,100);
  text("• " + ntemp1 + "...",rectangles[3].x,rectangles[3].y+15,100,100);
  text("• " + ntemp2 + "...",rectangles[3].x,rectangles[3].y+120,100,100);

  //Vitals (Circles)
  //Sleep
  strokeWeight(0.5);
  textSize(15);
  text("Light \nSleep",circles[0].x-18, circles[0].y+2);
  let tp = 1 - circles[0].rand/(PI*2);
  tp = tp * 100;
  text(round(tp) + "%", circles[0].x-12, circles[0].y-13);

  //weight
  strokeWeight(0.5);
  textSize(15);
  text("pounds",circles[1].x-22, circles[1].y+15);
  tp = 1 - circles[1].rand/(PI*2);
  let fx = tp * 200;
  textSize(20);
  text(round(fx), circles[1].x-15, circles[1].y);

  //Steps
  strokeWeight(0.5);
  textSize(20);
  text("steps",circles[2].x-22, circles[2].y+15);
  tp = 1 - circles[2].rand/(PI*2);
  let sx = tp * 1000
  text(round(sx) , circles[2].x-15, circles[2].y-5);
  
  //Mirror Time
  strokeWeight(0.5);
  textSize(15);
  
  text("Time:",circles[3].x-17, circles[3].y-5);
  if(ct % 60 == 0 && ct > 1){
    frameRate(1);
    minu = minu + 1;
  }
  else if (ct > 60 ){
    ct = ct % 60;
    frameRate(30);
  }
  text(minu + ":" + nf(ct,2,0) ,circles[3].x-17, circles[3].y+15 )
}

function mousePressed(){
  for (i = 0; i < rectangles.length; i++) {
    rectangles[i].pressed(mouseX,mouseY);
    circles[i].pressed(mouseX, mouseY);
  }
}

function mouseReleased(){
  for (i = 0; i < rectangles.length; i++) {
    rectangles[i].notPressed();
    circles[i].notPressed();
  }
}
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
    this.rollover = false;
  }
  
  show(px, py) {
    if (this.dragging) {
      this.x = px + this.offsetX;
      this.y = py + this.offsetY;
    }

    stroke(255);
    noFill();
    strokeWeight(3);
    rect(this.x, this.y, this.w, this.h, this.c);
  }

  pressed(px, py) {
    if (px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h) {
      this.dragging = true;
      this.offsetX = this.x - px-10;
      this.offsetY = this.y - py+10;
    }
  }

  notPressed() {
      this.dragging = false;
  }
}

class Circle {
  constructor(cx, cy, cd, cd2) {
    this.x = cx;
    this.y = cy;
    this.d = cd;
    this.dd = cd2;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
    this.rollover = false;
    this.rand = random(0, PI);
    this.sx = random(0,1000);
  }
  
  show(px, py) {
    if (this.dragging) {
      this.x = px + this.offsetX;
      this.y = py + this.offsetY;
    }
    
    stroke(152,62,40);
    noFill();
    strokeWeight(3);
    arc(this.x, this.y, this.d, this.dd,0,this.rand);
    stroke(255)
    noFill();
    arc(this.x,this.y,this.d,this.dd,this.rand,0);
  }

  pressed(px, py) {
    if (dist(this.x, this.y, mouseX, mouseY) < (this.d+this.dd)/2) {
      this.dragging = true;
      this.offsetX = this.x - px-10;
      this.offsetY = this.y - py+10;
    }
  }

  notPressed() {
      this.dragging = false;
  }
}

function formatting(num){
  if (int(num) < 10){
    return "0" + num;
  }
  return num;
}

function lbkData(data){
  // Get current temperature
  lbk_temp = data.main.temp;
  //lbk_desc = loadImage("https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
}

function newsData(data){
  ntemp = data.articles[0].title;
  ntemp1 = data.articles[1].title;
  ntemp2 = data.articles[3].title;
}
