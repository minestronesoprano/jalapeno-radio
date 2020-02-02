var renderer, scene, camera, banana;

function init(){

	var ww = window.innerWidth, wh = window.innerHeight;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(ww, wh);
	document.body.appendChild( renderer.domElement );
	//document.body.appendChild( renderer.domElement );
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(50,ww/wh, 0.1, 10000 );
	camera.position.set(0,0,500);
	scene.add(camera);

	//Add a light in the scene
	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	directionalLight.position.set( 0, 0, 350 );
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

	var loader = new THREE.OBJLoader(manager);
	// load a resource
	loader.load(
		'pepper/pepper.obj',
		//called when loading is done
		addPepper
		// called when loading is in progresses
		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		// called when loading has errors
		function ( error ) {
			console.log( 'An error happened' );
		}
	)
};



var addPepper = function(pepper){
	console.log("addpepper")
	//Go through all children of the loaded object and search for a Mesh
	pepper.traverse( function ( child ) {
		//This allow us to check if the children is an instance of the Mesh constructor
		if(child instanceof THREE.Mesh){
			child.material.color = new THREE.Color(0X00FF00);
			//Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
			child.geometry.computeVertexNormals();
		}
	});
	//Add the 3D object in the scene
	scene.add(pepper);
	renderer.render(scene, camera);
};

init();
