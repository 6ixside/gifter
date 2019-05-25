(function gifter(){
	self = this;

	self.init = () =>{
		console.log("Gifter extension found");
	};

	self.launchPopUp = (config) =>{

	};

	window.addEventListener("message", (e) => {
		if(e.source != window)
			return;

		if(e.data.type && (e.data.type == "GIFTER_INIT")){
			self.launchPopUp({

			});
		}

		if(e.data.type && (e.data.type == "GIFTER_MESSAGE")){
			console.log("message received: " + e.data.text);

			/*Pass settings from gifter admin panel and verify user persona*/
			chrome.runtime.sendMessage(
				{message: e.data.text,
				 type: e.data.type},
				(res) => {
					console.log(res);
				}
			)
		}
	});

	return {};
})();