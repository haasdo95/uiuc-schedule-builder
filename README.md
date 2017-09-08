# uiuc-schedule-builder
## 1. A Graphic(are you sure???) Representation
![screen shot 2017-09-03 at 12 13 28 am](https://user-images.githubusercontent.com/20941623/30000803-06972bd4-903e-11e7-9edd-0359b2fed1dd.png)

## 2. Usage

1. Run
			
		npm install
	
	for all the dependencies.
	
2. Run

		npm run build
		
	to invoke webpack and build project. All artifacts will be moved to /dist.
	
3. Run

		node server/app.js
		
	to start the server and listen on port 8888. Make sure you have internet connection. Otherwise you won't be able to connect to remote data base.