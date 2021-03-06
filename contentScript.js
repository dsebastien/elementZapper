// we keep track of the last right clicked element (so that we can zap images, etc)
var lastRightClickedElement = null;
document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        lastRightClickedElement = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	// got some zapping to do!
	if(request.message == "zap"){
		var selection = window.getSelection();
		var selectionEmpty = selection.rangeCount == 0;
		if(!selectionEmpty){
			try{
				if(selection.isCollapsed){ // just right clicked on a paragraph for example
					var parentOfSelection = selection.anchorNode.parentNode; 
					// todo improve: continue moving up until we find a container (e.g., div) so that we don't just zap small elements
					// risk: zap too violently ;-)
					parentOfSelection.removeChild(selection.anchorNode);
				}else{
					selection.deleteFromDocument(); // elements selected
				}
				selection.removeAllRanges(); // clear the selection
			}catch(err){
				// ignorance is bliss
			}
		}
		
		// in addition, to handle images, links, videos, etc:
		if(lastRightClickedElement != null){
			// todo improve: continue moving up until we find a container (e.g., div) so that we don't just zap small elements
			// risk: zap too violently ;-)
			try{
				lastRightClickedElement.parentNode.removeChild(lastRightClickedElement);
			}catch(err){
				// ignorance is bliss
			}
			lastRightClickedElement = null;
		}
	}
});

// good to know:
//debugger; // invokes Chrome's debugger here