window.addEventListener("message", (e) => {
	console.log("received message");
	
	if(e.source != window)
		return;

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