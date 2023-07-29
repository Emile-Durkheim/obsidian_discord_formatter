function isDiscordMessage(doc){
	if(doc.body.firstChild.nodeName != 'OL'){
		return false;
	}

	const ol = doc.body.firstChild;

	return (
			ol['dataset']["listId"] == "chat-messages" && 
			/scrollerInner/.test(ol.className)
	);
}

function test(doc){
    console.log(isDiscordMessage(doc));
}
