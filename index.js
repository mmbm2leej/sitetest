const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

const image0 = new Image();
const image1 = new Image();

//image0.src = 'images/vendetta.jpg';
image0.src = 'images/sp00der.jpeg';
//image1.src = 'images/newvegas.png';


//doesnt show because js is very fast
//context.drawImage(image0,0,0);

let switcher = 1;
let counter = 0;
const myInterval = 10;
setInterval(function() {
    counter++;
    if (counter % myInterval === 0) switcher *= -1;

}, 1000); 
//ticks every 500 milliseconds
    

//shows image because its triggered on load event
image0.addEventListener('load', function() {
    
    //can take 5 arguments (image, x1, y1, x2, y2);

    //drawing needs to be here
    context.drawImage(image0,200,0);
    //context.drawImage(image1,320,100);

    const scannedImg = context.getImageData(0,0,canvas.width, canvas.height);

    const scannedData = scannedImg.data;

    
    

    //#region color filtering
    /*
    //skips by 4s, (red,green,blue,alpha) per 4
    for(let i = 0; i < scannedData.length; i += 4) {
        const total = scannedData[i] + scannedData[i+1] + scannedData[i+2];
        const avgColor = total/3;

        //scannedData[i] = avgColor - 80;
        //scannedData[i+1] = avgColor - 50;
        //scannedData[i+2] = avgColor + 100;

    }

    scannedImg.data = scannedData;
    context.putImageData(scannedImg,0,0);
*/
    //#endregion

    //#region Particle Effect

    //color value brightness mapping
    let particleArray = [];
    const particleCount = 7000;
    
    let mappedImg1 = [];
    const pixels = context.getImageData(0,0,canvas.width, canvas.height);
    
    for(let y = 0; y < canvas.height; ++y) {
        let currentRow = [];
        for(let x = 0; x < canvas.width; ++x) {
            const redVal = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const greenVal = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blueVal = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const brightness = calcBrightness(redVal, greenVal, blueVal);
            const currentCell = [
                cellBrightness = brightness,
                cellColor = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')'
            ];
            currentRow.push(currentCell);
        }
        mappedImg1.push(currentRow);
    }

    function calcBrightness(r,g,b) {
        return Math.sqrt(((r * r) * 0.3) + ((g * g) * 0.59) + ((b * b) * 0.12))/100;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.speed = 0;
            this.velocity = Math.random() * 3;
            this.size = (Math.random() * 2);
            this.angle = 0;
         
        }

        update() {
            if (mappedImg1[Math.floor(this.y)][Math.floor(this.x)]) {
                this.speed = mappedImg1[Math.floor(this.y)][Math.floor(this.x)][0];
            }

            let movement = (3 - this.speed) + this.velocity;
            if (switcher === 1) {
                context.globalCompositeOperation = 'source-over';
            }
            else {
                movement = -1 * (4 - this.speed) + this.velocity;
                context.globalCompositeOperation = 'lighter';
            }
            if (counter % 10 === 0) {
                this.x = Math.random() * canvas.width;
                this.y = 0;
            }
            this.x -= movement*0.5 + Math.sin(this.angle);
            this.y += Math.abs(movement) + Math.cos(this.angle) * 1;
            if ((this.y >= canvas.height) || (this.y < 0)) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }

            if ((this.x <= 0) || (this.x > canvas.width)) {
                this.x = Math.random() * canvas.width;
                this.y = 0;
            }
            this.angle+=this.speed/5;
            
       

        }

        draw() {
            context.beginPath();
            if (mappedImg1[Math.floor(this.y)][Math.floor(this.x)]) {
                context.fillStyle = mappedImg1[Math.floor(this.y)][Math.floor(this.x)][1];
            } else context.fillStyle = 'rgb(180,70,200)';
            
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fill();
        } 
    }


 
    function init() {
        for(let i = 0; i < particleCount; ++i) {
            
            particleArray.push(new Particle);
        }
    }

    init();

    function animate() {
        //context.drawImage(image0,0,0, canvas.width, canvas.height);
        context.globalAlpha = 0.05;
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect(0,0,canvas.width, canvas.height);
        //context.globalAlpha = 0.4;
        for(let i = 0; i < particleArray.length; ++i) {
            particleArray[i].update();
           // context.globalAlpha = Math.max(0.05,particleArray[i].speed * 0.75);
           context.globalAlpha = particleArray[i].speed;
            particleArray[i].draw();
        }
        
        requestAnimationFrame(animate);
        console.log("FRAME UPDATED");
    }
    animate();



    //#endregion


});

