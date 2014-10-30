Ext.define('App.util.FileHelper', {
	singleton: true,
	
	config: {
	},
	
	constructor: function(config) {
		this.initConfig(config);
		
		var fileSystem = null,
			directoryEntryCache = {};
	
		function init(success) {
			if(fileSystem === null) {
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
					fileSystem = fs;
					success();
				}, fileSystemFail);
			} else {
				success();
			}
		}
		
		function emptyFn() {
		}
		
		function fileSystemFail(error) {
			console.log('Failed to request file system: ', error.code);
			//console.log(evt);
		}		
		
		function directoryLookupFail(error) {
			console.log('Cannot find a directory: ', error.code);
		}
		
		function directoryCreateFail(error) {
			console.log('Cannot create or find a folder: ', error.code);
		}
		
		function fileLookupCreateFail(error) {
			console.log('Cannot find or create a file: ', error.code);
		}
		
		function fileEntryFail(error) {
			console.log('Cannot get a file: ', error.code);
		}
		
		function simpleFail(evt) {
			console.error(evt);
		}
		
		function getDirectoryEntry(path, success, fail) {
			if(typeof path == 'string' && path.length !== 0) {
				if(! (success instanceof Function) ) {
					success = emptyFn;
				}
				if(! (fail instanceof Function) ) {
					fail = simpleFail;
				}
				
				if(directoryEntryCache[path] !== undefined) {
					success(directoryEntryCache[path].instance);
					
					console.log("Caching the same folder");
					return;
				}
				
				(function(path, success, fail) {
					init(function() {
						fileSystem.root.getDirectory(path, {create: false, exclusive: false}, function(directoryEntry) {
							directoryEntryCache[path] = {};
							directoryEntryCache[path].instance = directoryEntry;
							
							console.log(directoryEntry.name);
							
							success(directoryEntry);
						}, directoryLookupFail);
					});
				})(path, success, fail);
			} else {
				console.log("incorrect type of argument path: ", path);
			}
		}
		
		function getDirectoryFilePaths(directoryPath, success, fail) {
		    (function(directoryPath, success, fail) {
				getDirectoryEntry(directoryPath, function(directoryEntry) {
					var directoryReader = directoryEntry.createReader();
					directoryReader.readEntries(function(entries) {
						var i,
							length = entries.length,
							fileEntriesArr = [],
							filePathsArr = [],
							currentDirectoryEntryObj;
							
						for(directoryPath in directoryEntryCache) {
							if(directoryEntryCache[directoryPath].instance.fullPath === directoryEntry.fullPath) {
								currentDirectoryEntryObj = directoryEntryCache[directoryPath];
								
								break;
							}
						}
						
						for(i = 0; i < length; i+=1) {
							if(entries[i].isFile) {
								fileEntriesArr.push(entries[i]);
								filePathsArr.push(entries[i].name);
								
								console.log(entries[i].name);
							}
						}
						
						currentDirectoryEntryObj.fileEntries = fileEntriesArr;
						currentDirectoryEntryObj.filePaths = filePathsArr;
						
						if(success instanceof Function) {
							success(filePathsArr);
						}
						
					}, (fail instanceof Function) ? fail : simpleFail);
				}, fail);
			})(directoryPath, success, fail);
		}
		
		function readDirectory(directoryPath, success, fail) {
			(function(directoryPath, success, fail) {
				getDirectoryEntry(directoryPath, function(directoryEntry) {
					var directoryReader = directoryEntry.createReader();
					directoryReader.readEntries(function(entries) {
						var i,
							length = entries.length,
							fileEntriesArr = [],
							filePathsArr = [],
							currentDirectoryEntryObj;
							
						for(directoryPath in directoryEntryCache) {
							if(directoryEntryCache[directoryPath].instance.fullPath === directoryEntry.fullPath) {
								currentDirectoryEntryObj = directoryEntryCache[directoryPath];
								
								break;
							}
						}
						
						for(i = 0; i < length; i+=1) {
							if(entries[i].isFile) {
								fileEntriesArr.push(entries[i]);
								filePathsArr.push(entries[i].name);
								
								console.log(entries[i].name);
							}
						}
						
						currentDirectoryEntryObj.fileEntries = fileEntriesArr;
						currentDirectoryEntryObj.filePaths = filePathsArr;
						
						if(success instanceof Function) {
							success(fileEntriesArr);
						}
						
					}, (fail instanceof Function) ? fail : simpleFail);
				}, fail);
			})(directoryPath, success, fail);
		}
		
		/*
		function getFileEntriesFromCache(directoryPath) {
			var fileEntries = [];
			if(directoryEntryCache[directoryPath] !== undefined) {
				fileEntries = directoryEntryCache[directoryPath].fileEntries.
			}
			
			return fileEntries;
		}
		*/
		function createDirectory(path, success, fail) {
			if(typeof path == 'string' && path.length !== 0) {
				if(! (success instanceof Function) ) {
					success = emptyFn;
				}
				if(! (fail instanceof Function) ) {
					fail = simpleFail;
				}
				
				if(directoryEntryCache[path] !== undefined) {
					success(directoryEntryCache[path].instance);
					
					return;
				}
				
				(function(path, success, fail) {
					init(function() {
						fileSystem.root.getDirectory(path, {create: true}, function(directoryEntry) {
							directoryEntryCache[path] = {};
							directoryEntryCache[path].instance = directoryEntry;
							
							console.log('success creating directory');
							
							success(directoryEntry);
						}, directoryCreateFail);
					});
				})(path, success, fail);
			} else {
				console.log("incorrect type of argument path: ", path);
			}
		}
			
		function readAsDataUrl(file, success, fail) {
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				success(evt.target.result);
			}
			reader.onerror = fail;
			
			reader.readAsDataURL(file);
		}
		
		function readAsText(file, success, fail) {
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				success(evt.target.result);
			}
			reader.onerror = fail;
			
			reader.readAsText(file);
		}
		
		function readFileAsDataUrl(path, success, fail) {
			if(typeof path == 'string' && path.length !== 0) {
				if(! (success instanceof Function) ) {
					success = emptyFn;
				}
				if(! (fail instanceof Function) ) {
					fail = simpleFail;
				}
				
				(function(path, success, fail) {
					init(function() {
						fileSystem.root.getFile(path, null, function(fileEntry) {
							fileEntry.file(function(file) {
								readAsDataUrl(file, success, fail);
							}, fileEntryFail);
						}, fileLookupCreateFail);
					});
				})(path, success, fail);
			} else {
				console.log("incorrect type of argument path: ", path);
			}
		}
		
		function readFileAsText(path, success, fail) {
			if(typeof path == 'string' && path.length !== 0) {
				if(! (success instanceof Function) ) {
					success = emptyFn;
				}
				if(! (fail instanceof Function) ) {
					fail = simpleFail;
				}
				
				(function(path, success, fail){
					init(function() {
						fileSystem.root.getFile(path, null, function(fileEntry) {
							fileEntry.file(function(file) {
								readAsText(file, success, fail);
							}, fileEntryFail);
						}, fileLookupCreateFail);
					});
				})(path, success, fail);
			} else {
				console.log("incorrect type of argument path: ", path);
			}
		}
		
		function createFile(path, content, success, fail) {
			if(typeof path == 'string' && path.length !== 0) {
				if(typeof content !== 'string') {
					content = '';
				}
				if(! (success instanceof Function) ) {
					success = emptyFn;
				}
				if(! (fail instanceof Function) ) {
					fail = simpleFail;
				}
				
				(function(name, content, success, fail) {
					init(function() {
						fileSystem.root.getFile(path, {create: true, exclusive: false}, function(fileEntry) {
							fileEntry.createWriter(function(writer) {
								writer.onwriterend = (function(fileEntry) {
									success(fileEntry);
								})(fileEntry);
								writer.write(content);
							}, fail);
						}, fileLookupCreateFail);
					});
				})(path, content, success, fail);
			} else {
				console.log("incorrect type of argument path: ", path);
			}
		}
		
		function writeArrayBuffer(path, data, success, fail) {
			if(typeof path == 'string' && path.length !== 0) {
				if(! (data instanceof ArrayBuffer) ) {
					data = '';
				}
				if(! (success instanceof Function) ) {
					success = emptyFn;
				}
				if(! (fail instanceof Function) ) {
					fail = simpleFail;
				}
				
				init(function() {
					fileSystem.root.getFile(path, {create: true, exclusive: false}, function(fileEntry) {
						fileEntry.createWriter(function(writer) {
							writer.onwriterend = (function(fileEntry) {
								success(fileEntry);
							})(fileEntry);
							writer.write(data);
						}, fail);
					}, fileLookupCreateFail);
				});
			} else {
				console.log("incorrect type of argument path: ", path);
			}
		}
		
		function removeFile(path, success, fail) {
			if(typeof path == 'string' && path.length !== 0) {
				if(! (success instanceof Function) ) {
					success = emptyFn;
				}
				if(! (fail instanceof Function) ) {
					fail = simpleFail;
				}
				
				(function(path, success, fail) {
					init(function() {
						fileSystem.root.getFile(path, null, function(fileEntry) {
							fileEntry.remove(success, fail);
						}, fileLookupCreateFail);
					});
				})(path, success, fail);
			} else {
				console.log("incorrect type of argument path: ", path);
			}
		}
		
		function readEntryAsText(fileEntry, success, fail) {
			if(fileEntry instanceof FileEntry) {
				(function(fileEntry, success, fail) {
					fileEntry.file(function(file) {
						readAsText(file, success, fail);
					}, fileEntryFail);
				})(fileEntry, success, fail);
			} else {
				console.log('incorrect type of fileEntry: ', fileEntry);
			}
		}
		
		function moveFile(sourceName, parent, newName, success, fail) {
			if(! (typeof sourceName == 'string' && sourceName.length !== 0) ) {
				console.error('incorrect type of sourceName: ', sourceName);
				return;
			}
			
			if(! (typeof parent == 'string' && parent.length !== 0) ) {
				console.error('incorrect type of parent: ', parent);
				return;
			}
			
			if(! (typeof newName == 'string' && newName.length !== 0) ) {
				console.error('incorrect type of newName: ', newName);
				return;
			}
			
			if(! (success instanceof Function) ) {
				success = emptyFn;
			}
			
			if(! (fail instanceof Function) ) {
				fail = simpleFail;
			}
			
			init(function() {
				fileSystem.root.getFile(sourceName, null, function(fileEntry) {
					fileSystem.root.getDirectory(parent, {create: true, exclusive: false}, function(directoryEntry) {						
						fileEntry.moveTo(directoryEntry, newName, success, fail);
					}, directoryLookupFail);
				}, fileLookupCreateFail);
			});
		}
		
		function pGetFile(path, options, success, fail) {
			fileSystem.root.getFile(path, options, success, fail);
		}
		
		function getFile(path, options, success, fail) {
			init(function() {
				pGetFile(path, options, success, fail);
			});
		}
		
		function createFile(path, success, fail) {
			getFile(path, {create: true}, success, fail);
		}
		
		function pGetDirectory(path, options, success, fail) {
			var pathArr,
				i;
			
			if(options.create === true) {
				pathArr = path.split('/');
			
				for(i = 1; i < pathArr.length; i+=1) {
					pathArr[i] = pathArr[i-1].concat('/', pathArr[i]);
				}
				
				function pCreateDir(dirEntry) {
					if(dirEntry !== undefined) {
						//prepareDirectoryCache(path);
					}
				
					if(pathArr.length !== 0) {
						fileSystem.root.getDirectory(pathArr.splice(0, 1)[0], options, pCreateDir, fail);
					} else {
						success(dirEntry);
					}
				}
				pCreateDir();
			} else {
				fileSystem.root.getDirectory(path, options, success, fail);
			}
		}
		
		function getDirectory(path, options, success, fail) {
			init(function() {
				pGetDirectory(path, options, success, fail);
			});
		}
		
		function createDirectory(path, success, fail) {
			getDirectory(path, {create: true}, success, fail);
		}
		
		function pMoveFile(sourceName, parent, newName, success, fail) {
			pGetFile(sourceName, null, function(fileEntry) {
				pGetDirectory(parent, {create: true, exclusive: false}, function(directoryEntry) {
					fileEntry.moveTo(directoryEntry, newName, success, fail);
				});
			});
		}
		
		function moveFile(sourceName, parent, newName, success, fail) {
			init(function() {
				pMoveFile(sourceName, parent, newName, success, fail);
			});
		}
		
		this.readAsDataUrl = readFileAsDataUrl;
		this.readAsText = readFileAsText;
		this.readEntryAsText = readEntryAsText;
		this.createFile = createFile;
		this.removeFile = removeFile;
		
		this.getDirectory = getDirectoryEntry;
		this.readDirectory = readDirectory;
		this.getFilePaths = getDirectoryFilePaths;
		this.createDirectory = createDirectory;
		this.moveFile = moveFile;
		this.writeArrayBuffer = writeArrayBuffer;
		//this.getFileEntriesFromCache = getFileEntriesFromCache;
	}
});