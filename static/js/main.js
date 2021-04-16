var atmostexture=[];

var earthtexture=undefined;
var earthbumtexture=undefined;
var earthspeculartexture=undefined;

var cloudtexture=undefined;

const listener = new THREE.AudioListener();


function setpercentage(percent){
    loadingbar=document.querySelector('.loader');
    loadingtext=document.querySelector('.percentageload');
    // console.log(loadingbar);
    loadingbar.style.width=percent.toString()+"%";
    loadingtext.innerHTML=percent.toString();
}

function textureloader(){

    
    atmostexture.push(new THREE.TextureLoader().load('static/images/space_front.png'));
    setpercentage(5);
    atmostexture.push(new THREE.TextureLoader().load('static/images/space_back.png'));
    setpercentage(10);
    atmostexture.push(new THREE.TextureLoader().load('static/images/space_up.png'));
    setpercentage(15);
    atmostexture.push(new THREE.TextureLoader().load('static/images/space_down.png'));
    setpercentage(20);
    atmostexture.push(new THREE.TextureLoader().load('static/images/space_left.png'));
    setpercentage(25);
    atmostexture.push(new THREE.TextureLoader().load('static/images/space_right.png'));
    setpercentage(30);

    setpercentage(35);
    earthtexture=new THREE.TextureLoader().load('static/images/earthmap.jpg');
    setpercentage(45);
    earthbumptexture=new THREE.TextureLoader().load('static/images/earthbump.jpg');
    setpercentage(55);
    earthspeculartexture=new THREE.TextureLoader().load('static/images/earthspec.jpg');
    setpercentage(65);
   


    setpercentage(75);
    cloudtexture=new THREE.TextureLoader().load('static/images/earthclouds.jpg');
    setpercentage(100);
    const sound = new THREE.Audio( listener );

    // const audioLoader = new THREE.AudioLoader();
    // audioLoader.load( 'static/sound/background.mp3', function( buffer ) {
    //     sound.setBuffer( buffer );
    //     sound.setLoop( true );
    //     sound.setVolume( 0.5 );
    //     sound.play();
    // });
}

window.onload=()=>{

    setpercentage(0);
    const container=document.querySelector('.container');
    container.style.right="110%";

    const horizontalwindow=document.querySelector('.horizontal-container');
    horizontalwindow.addEventListener('wheel',(eve)=>{
        horizontalwindow.scrollLeft+=eve.deltaY;
    });

    
    setTimeout(() => {

        textureloader(); 

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
        console.log(atmostexture);
        for(var x of atmostexture){
            console.log(x);
            material.push(new THREE.MeshPhongMaterial({map:x,side:THREE.BackSide}));
        }
        var space=new THREE.Mesh(geometry,material);
        scene.add(space);

        const earthgeometry = new THREE.SphereGeometry(100,100,100);
        const earthmaterial = new THREE.MeshPhongMaterial({
            map:earthtexture,
            bumpMap:earthbumtexture,
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

        
        camera.add( listener );

        container.style.right="0%";

        velocityx=0;
        velocityy=0.01;

        window.onmousemove=(event)=>{
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

    }, 
    3000);
}