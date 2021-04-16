
var atmostexture=[];

var earthtexture=undefined;
var earthbumptexture=undefined;
var earthspeculartexture=undefined;

var container=undefined;

var horizontalwindow=undefined;

var cloudtexture=undefined;

var listener=undefined;

var audio=undefined;

var curp=0;


function setpercentage(percent){
    loadingbar=document.querySelector('.loader');
    loadingtext=document.querySelector('.percentageload');
    // console.log(loadingbar);
    loadingbar.style.width=percent.toString()+"%";
    loadingtext.innerHTML=percent.toString();
}

function load_texture(src){
    return new Promise((res,rej)=>{
        new THREE.TextureLoader().load(src,data=>{curp+=10;setpercentage(curp);return res(data)},null,rej);
        // console.log(texture);
    });
}

function load_audio(src){
    return new Promise((res,rej)=>{
        new THREE.AudioLoader().load(src,data=>{return res(data)},null,rej);
    });
}

async function textureloader(){

    values=await Promise.all(
    [
        load_texture('static/images/space_front.png'),
        load_texture('static/images/space_back.png'),
        load_texture('static/images/space_up.png'),
        load_texture('static/images/space_down.png'),
        load_texture('static/images/space_left.png'),
        load_texture('static/images/space_right.png'),
        load_texture('static/images/earthmap.jpg'),
        load_texture('static/images/earthbump.jpg'),
        load_texture('static/images/earthspec.jpg'),
        load_texture('static/images/earthclouds.jpg'),
        load_audio( 'static/sound/background.mp3')
    ]);
    
    var cur=0;

    atmostexture.push(values[cur++]);
    setpercentage(5);
    atmostexture.push(values[cur++]);
    setpercentage(10);
    atmostexture.push(values[cur++]);
    setpercentage(15);
    atmostexture.push(values[cur++]);
    setpercentage(20);
    atmostexture.push(values[cur++]);
    setpercentage(25);
    atmostexture.push(values[cur++]);
    setpercentage(30);

    setpercentage(35);
    earthtexture = values[cur++];
    setpercentage(45);
    earthbumptexture= values[cur++];
    setpercentage(55);
    earthspeculartexture= values[cur++];
    setpercentage(65);
   


    setpercentage(75);
    cloudtexture= values[cur++];
    
    audio= values[cur++];
    setpercentage(100);
    init();
    
}


window.onload=()=>{

    setpercentage(0);
    container=document.querySelector('.container');
    container.style.right="110%";

    horizontalwindow=document.querySelector('.horizontal-container');
    horizontalwindow.addEventListener('wheel',(eve)=>{
        horizontalwindow.scrollLeft+=eve.deltaY;
    });


    setTimeout(() => {

        textureloader();

    }, 
    3000);
}

function init(){
    
    console.log("started")

    var canvas = document.querySelector('canvas');
    
    const scene =  new THREE.Scene();
    // scene.background = new THREE.Color("black");
    
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100000);

    const renderer = new THREE.WebGLRenderer({canvas:canvas,antialias:true});
    renderer.setSize(window.innerWidth,window.innerHeight);

    window.onresize=()=>{
        renderer.setSize(window.innerWidth,window.innerHeight);
    }
    
    var ambientlight=new THREE.AmbientLight(0xffffff,1);
    scene.add(ambientlight);

    // var directionallight=new THREE.DirectionalLight(0xffffff,0.5);
    // directionallight.position.set(0,0,1000);
    // scene.add(directionallight);

    // const spotLight = new THREE.SpotLight( 0xffffff , 1, 100000,10,0,2);
    // spotLight.position.set( 0,0, 300 );
    // scene.add(spotLight);

    
    const geometry = new THREE.BoxGeometry(10000,10000,10000);
    var material=[]
    // console.log(atmostexture);
    for(var x of atmostexture){
        // console.log(x);
        material.push(new THREE.MeshPhongMaterial({map:x,side:THREE.BackSide}));
    }
    var space=new THREE.Mesh(geometry,material);
    scene.add(space);

    const earthgeometry = new THREE.SphereGeometry(100,100,100);
    const earthmaterial = new THREE.MeshPhongMaterial({
        map:earthtexture,
        bumpMap:earthbumptexture,
        bumpScale:1,
        specularMap:earthspeculartexture,
        specular: new THREE.Color('grey')
    });
    const earth=new THREE.Mesh(earthgeometry,earthmaterial);
    scene.add(earth);

    const cloudgeometry = new THREE.SphereGeometry(102,102,102);
    const cloudmaterial = new THREE.MeshPhongMaterial({
        map:cloudtexture,
        transparent:true,
        opacity:0.6,
    });
    const cloud=new THREE.Mesh(cloudgeometry,cloudmaterial);
    earth.add(cloud);


    camera.position.set(0,0,250);
    // camera.position.set(0,52,0);

    
    listener = new THREE.AudioListener();
    const sound = new THREE.Audio( listener );
    sound.setBuffer( audio );
    sound.setLoop( true );
    sound.setVolume( 0.5 );
    camera.add(listener);

    // console.log(container);
    container.style.right="0%";

    velocityx=0;
    velocityy=0.01;

    window.onmousemove=(event)=>{
        if(!sound.isPlaying) sound.play();
        var xpos=event.clientX;
        var ypos=event.clientY;
        var relativex=xpos-window.innerWidth/2;
        var relativey=ypos-window.innerHeight/2;
        velocityy=relativex/20000;
        velocityx=relativey/20000;
    }

    var animate=()=>{
        requestAnimationFrame(animate);
        renderer.render(scene,camera);
        space.rotation.y+=0.01;
        earth.rotation.y+=velocityy;
        earth.rotation.x+=velocityx;
        camera.position.x=horizontalwindow.scrollLeft*0.01;
        camera.lookAt(0,0,0);
    }
    animate();

}