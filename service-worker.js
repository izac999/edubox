const cachePrefix = "edubox-cache";
const cacheVersionNumber = 2; //la version del cache

const cacheStaticFiles  = cachePrefix + "-static-"  + cacheVersionNumber;
const cachesImgs        = cachePrefix + "-images-"  + cacheVersionNumber;

const allCache = [ cacheStaticFiles,
				   cachesImgs
				];
const offlineURL =  "core/index.php/offline_controlador/index";


self.addEventListener("install", function (event) {
	event.waitUntil(self.skipWaiting() );
	event.waitUntil(
		caches.open(cacheStaticFiles).then(function (cache) {
			return cache.addAll([
				offlineURL,
				"librerias/css/material/materialize.min.css",
				"librerias/css/material/fuente.css",
				"librerias/css/material/font/material-design-icons/Material-Design-Icons.woff",
				"librerias/css/material/font/material-design-icons/Material-Design-Icons-ie.woff",
				"librerias/css/material/font/material-design-icons/Material-Design-Icons-webkit.woff2",
				"librerias/css/material/font/material-design-icons/Material-Design-Icons.eot",
				"librerias/css/material/font/material-design-icons/Material-Design-Icons.ttf",
				"librerias/css/material/font/roboto/Roboto-Regular.ttf",
				"mthumb.php?src=files/upload/sistema/logo_instituto.png&w=64&h=64&zc=3"
			])
		}).then(function () {
			self.skipWaiting()
		})
	);
});



//gestionamos la versiones del caches
//si hay una nueva version , se eliminan las versiones viejas
self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cacheName.startsWith(cachePrefix)
					   && !allCache.includes(cacheName)
				}).map(function (cacheName) {
					return caches.delete(cacheName)
				})
			);
		})
	);
});


self.addEventListener('fetch', function (event) {
	const url = new URL(event.request.url)

	//si es la navegacion normal
	if(event.request.mode == "navigate") {
		const fetchData = fetch(event.request).catch(function () {
			//console.log("errr")
			return caches.match("/core/index.php/offline_controlador/index")
			/*return new Response("<center><h1>Sin conexión a internet </h1></center>",  
				{
					headers:{'Content-Type': 'text/html; charset=utf-8'}
				})*/
		});
		event.respondWith(fetchData)
		return;
	}

	
	/*if(url.pathname.startsWith("/librerias/") || url.pathname.startsWith("/files/")) {
		event.respondWith(
			caches.match(event.request.url).then(function (response) {
				return response || fetch(event.request);
			})
		);
	}*/



});
