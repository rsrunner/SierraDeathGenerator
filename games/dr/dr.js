function makeGIF(context){
	//shameless copy of baddudes.js
	var encoder = new GIFEncoder()
	var framerate = 1000/30
	var x1pause = framerate*5
	encoder.setRepeat(0)
	encoder.setDelay(framerate)
	encoder.start()
	var source = $("textarea#sourcetext")
	var fulltext = source.val()
	for (var i=0;i<=fulltext.length;i++) {
		var before = fulltext.slice(0,i);
		var after = fulltext.slice(i)
		source.val(before)
		renderText(false)
		var anyfont = after.match(/^\[.*?\]/)
		if(after.match(/^  /)){
			i+=2;
		}
		if(anyfont && anyfont[0]){
			i+=anyfont[0].length;
		}
		//emulate ^1 character
		if(before.match(/[.?!,]{1}$/)){
			encoder.setDelay(x1pause)
			encoder.addFrame(context)
		}
		else{
			encoder.setDelay(framerate)
			encoder.addFrame(context)
		}
	}
	encoder.setDelay(2000)
	encoder.addFrame(context)
	//twitter mp4 fix
	encoder.setDelay(framerate)
	encoder.addFrame(context)
	encoder.finish()
	return URL.createObjectURL(new Blob([new Uint8Array(encoder.stream().bin)], {type : "image/gif" } ))
}