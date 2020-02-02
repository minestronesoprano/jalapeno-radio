var renderer, scene, camera;
var ww = window.innerWidth, wh = window.innerHeight;

var peppers = [];

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
			for (var i = 0; i <= 10; i++) {
				var pepper = {
					obj: mesh.clone(),
					x_mod: Math.random() < 0.5 ? 1 : -1,
					y_mod: Math.random() < 0.5 ? 1 : -1
				}
				peppers.push(pepper);
				scene.add(pepper.obj);

				peppers[i].obj.position.x = (Math.random() * (ww/20)) - (ww/40);
				peppers[i].obj.position.y = (Math.random() * (wh/20)) - (wh/40);
				peppers[i].obj.rotation.x = Math.random();
				peppers[i].obj.rotation.y = Math.random();
				peppers[i].obj.rotation.z = Math.random();
			}
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

	for (var i = peppers.length - 1; i >= 0; i--) {
		var pepper = peppers[i];

		pepper.obj.rotation.x += rotation_x;
		pepper.obj.rotation.y += rotation_y;
		pepper.obj.rotation.y += rotation_z;

		if (pepper.obj.position.x > ww/40) {
			pepper.x_mod = -1;
			pepper.obj.position.x = ww/40;
		}
		if (pepper.obj.position.y > wh/40) {
			pepper.y_mod = -1;
			pepper.obj.position.y = wh/40;
		} 

		if (pepper.obj.position.x < -ww/40) {
			pepper.x_mod = 1;
			pepper.obj.position.x = -ww/40;	
		} 
		if (pepper.obj.position.y < -wh/40) {
			pepper.y_mod = 1;
			pepper.obj.position.y = -wh/40;
		}

		pepper.obj.position.x += move_x * pepper.x_mod;
		pepper.obj.position.y += move_y * pepper.y_mod;

		pepper.obj.scale = scale;
	}

	renderer.render( scene, camera );
}

init();