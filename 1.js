var mode = {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    bird_number: 5,
    bird_array: [],
    killed: 0,
    speed: 20,
    images: {
        plane: 'img/plane.png',
        plane_crash: 'img/plane-baboom.png',
        gun: 'img/gunimage.png',
        gun_fire: 'img/gun-image-fire.gif'
    }
}

function Bird() {
    this.speed = Math.random()*mode.speed/5 + 1;
    this.direction = Math.random() - 0.5;
    this.size = Math.random()*40 + 60;
    this.status = 'alive',
    this.position = {
        top: Math.random()*(mode.innerHeight - 350) + 20,
        left: this.direction > 0 ? 0 : mode.innerWidth - this.size
    };
}

(function init() {
    fillBirds();
    draw();
    setInterval(() => {
        move();
    }, 25)
})()

function fillBirds() {
    for (let i=0; i<mode.bird_number; i++) {
      mode.bird_array.push(new Bird());
    }
}

function move() {
    let status = 'kill';
    mode.bird_array.map((item, index) => {
        const leftPrev = mode.bird_array[index].position.left,
              direct = (item.direction > 0) ? 1 : -1,
              leftNew = `${parseFloat(leftPrev) + direct*item.speed}px`;
        
        document.getElementById(`bird${index}`).style.left = leftNew;
        mode.bird_array[index].position.left = leftNew;
        
        if (item.status !== 'killed') {
            status = 'play';
        }
    
        if ((parseFloat(leftNew) > mode.innerWidth || parseFloat(leftNew) < 0 - item.size) && item.status !== 'killed') {
            mode.bird_array = [];
            alert('Lose');
            document.location.reload(true);
        }
    })
    
    if (status === 'kill') {
        mode.bird_array = [];
        mode.speed += 1;
        fillBirds();
        draw();
    }
}

function draw() {
    let inner = '';
    mode.bird_array.map((item, index) => {
        let style = '';
        style += `width:${item.size}px;`;
        style += `height:${item.size}px;`;
        style += `left:${item.position.left}px;`;
        style += `top:${item.position.top}px;`;
        style += `transform: scale(${item.direction > 0 ? 1 : -1}, 1);`;
        inner += `<img src="${mode.images.plane}" 
                     data-plane="${index}"
                     class="bird" 
                     id="bird${index}" 
                     style="${style}">`;
        });
    birds.innerHTML = inner;
}

function shot(event) {
    if (audioshot.currentTime === 0) {
        document.getElementById('gun').src = mode.images.gun_fire;
        
        if (event.target.dataset.plane) {
            kill(event.target.dataset.plane);
        }
        
        audioshot.play();
        setTimeout(() => {
            audioshot.load();
            document.getElementById('gun').src = mode.images.gun;
        }, audioshot.duration * 1000)
    }
}

function gunMoving(event) {
    document.getElementById('gun').style.left = `${event.pageX}px`;
}

function kill(plane) {
    mode.killed += 1;
    counter.innerHTML = mode.killed;
    document.getElementById(`bird${plane}`).src = mode.images.plane_crash;
    setTimeout(() => {
        mode.bird_array[plane].status = 'killed';
        document.getElementById(`bird${plane}`).style.display = 'none';
    }, 200);
}

window.addEventListener('click', shot, false);
window.addEventListener('mousemove', gunMoving, false);