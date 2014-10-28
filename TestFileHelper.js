//test create directory

function preparePath(path) {
	var pathArr,
		i;

	pathArr = path.split('/');
	
	/*
	if(path[path.length - 1] === '/') {
		pathArr.splice(pathArr.length - 1, 1);
	}
	*/

	for(i = 1; i < pathArr.length; i+=1) {
		pathArr[i] = pathArr[i-1].concat('/', pathArr[i]);
	}
}

function createDirectory(path) {
	var pathArr,
		i;

	pathArr = path.split('/');
	
	/*
	if(path[path.length - 1] === '/') {
		pathArr.splice(pathArr.length - 1, 1);
	}
	*/

	for(i = 1; i < pathArr.length; i+=1) {
		pathArr[i] = pathArr[i-1].concat('/', pathArr[i]);
	}
	
	function pCreateDir(dirEntry) {
		if(dirEntry !== undefined) {
			//prepareDirectoryCache(path);
		}

		if(pathArr.length !== 0) {			
			console.log(pathArr.splice(0, 1)[0]);
			pCreateDir();
		}
	}
	pCreateDir();
}

createDirectory('asd/fdh');