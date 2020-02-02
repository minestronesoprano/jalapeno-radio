var renderer, scene, camera, pepper;
var ww = window.innerWidth, wh = window.innerHeight;

function init(){
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(ww, wh);
	document.body.appendChild( renderer.domElement );
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(50, ww/wh, 0.1, 10000);
	camera.position.set(0,0,50);
	camera.lookAt(0,0,0)
	scene.add(camera);

	//Add a light in the scene
	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	directionalLight.position.set( 200, 10, 350 );
	directionalLight.lookAt(new THREE.Vector3(0,0,0));
	scene.add( directionalLight );

	//Load the obj file
	loadOBJ();
}

function loadOBJ(){
	var manager = new THREE.LoadingManager();
	manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
		console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	};
	manager.onLoad = function ( ) {
		console.log( 'Loading complete!');
	};
	manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
		console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	};
	manager.onError = function ( url ) {
		console.log( 'There was an error loading ' + url );
	};

	var material = new THREE.MeshLambertMaterial( { color: 0x00ff00, emissive: 0x00AA00 } );

	var loader = new THREE.OBJLoader(manager);
	// load a resource
	loader.load(
		'pepper/pepper.obj',
		//called when loading is done
		function( mesh ){
			//mesh.rotation.x = Math.PI/2;
			//Go through all children of the loaded object and search for a Mesh
			mesh.traverse( function ( child ) {
				//This allow us to check if the children is an instance of the Mesh constructor
				if(child instanceof THREE.Mesh){
					child.material = material;
					//Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
					child.geometry.computeVertexNormals();
				}
			});
			//Add the 3D object in the scene
			pepper = mesh;
			scene.add(pepper);
			renderer.render(scene, camera);
		},
		// called when loading is in progresses
		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		// called when loading has errors
		function ( error ) {
			console.log( 'An error happened' );
		}
	)
	animate();
};

var rotation_x = 0.01;
var rotation_y = 0.02;
var rotation_z = 0.03;

var move_x = 0.1;
var move_y = 0.1;

var scale = 4.0;

var animate = function () {
	requestAnimationFrame( animate );

	pepper.rotation.x += rotation_x;
	pepper.rotation.y += rotation_y;
	pepper.rotation.y += rotation_z;

	if (pepper.position.x > ww/40) {
		move_x = -Math.abs(move_x);
		pepper.position.x = ww/40;
	}
	if (pepper.position.y > wh/40) {
		move_y = -Math.abs(move_y);
		pepper.position.y = wh/40;
	} 

	if (pepper.position.x < -ww/40) {
		move_x = Math.abs(move_x);
		pepper.position.x = -ww/40;	
	} 
	if (pepper.position.y < -wh/40) {
		move_y = Math.abs(move_y);
		pepper.position.y = -wh/40;
	}

	pepper.position.x += move_x;
	pepper.position.y += move_y;

	pepper.scale = scale;

	renderer.render( scene, camera );
}

init();