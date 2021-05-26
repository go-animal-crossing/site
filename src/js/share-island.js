/**
 * Load island from url fragment
 */
_storageKeyShared = "sharedislandv1";
_sharedLink="";
_sharedIsland = false;
// meta object for stats
_meta = {
    all: {},
    caught: {},
    missing: {}
}
_fragment = window.location.hash;
function loadSharedIsland()
{
    var doc = document.querySelector('.page.loading');
    if(window.location.hash) {
        _fragment = window.location.hash.substring(1);        
        var decompressed = LZString.decompressFromEncodedURIComponent(_fragment);
        if(decompressed) _sharedIsland = JSON.parse(decompressed);
    
        var items = document.querySelectorAll("a.island-mine");
        for(var i = 0; i < items.length; i ++ )
        {
            var item = items[i];
            item.setAttribute('href', '/mine/#' + _fragment);
        }
        // wait a second to remove so the loading is visible and doesnt look like an error...
        setTimeout(function(){
            if(doc) doc.classList.remove('loading');
        }, 1000);
    }
    else if(doc) doc.classList.replace('loading', 'error');
}
// meta data counters
function addToMeta(type, id, caught)
{
    if(typeof _meta.all[type] == 'undefined') _meta.all[type] = 0;
    if(typeof _meta.caught[type] == 'undefined') _meta.caught[type] = 0;
    if(typeof _meta.missing[type] == 'undefined') _meta.missing[type] = [];
    _meta.all[type] ++;
    if(caught) _meta.caught[type] ++;
    else _meta.missing[type].push(id);
}

document.addEventListener("DOMContentLoaded",function(){
    loadSharedIsland();
    var items = document.querySelectorAll(".shared .critter-tile");
    var toCatch = document.querySelector(".to-catch .list");
    var missing = 0;
    var missingText = document.querySelector('.missing-text');
    var doc = document.querySelector('.page.shared');

    if(_sharedIsland && doc){
        document.querySelector('.island-name span').textContent = _sharedIsland.name.replace(/(<([^>]+)>)/gi, "");
        document.querySelector('.island-hemisphere span').textContent = _sharedIsland.hemisphere.replace(/(<([^>]+)>)/gi, "");;
        document.querySelector('.island-nativeFruit span').textContent = _sharedIsland.nativeFruit.replace(/(<([^>]+)>)/gi, "");;
        document.querySelector('.island-turnipPrice span').textContent = _sharedIsland.turnipPrice.replace(/(<([^>]+)>)/gi, "");;
        document.querySelector('.island-dodo span').textContent = _sharedIsland.dodo.replace(/(<([^>]+)>)/gi, "");;
        var date = new Date(_sharedIsland.editedOn);
        document.querySelector('.island-editedOn span').textContent = date.toLocaleDateString() + " at " + date.toLocaleTimeString();

        for(var i = 0; i < items.length; i ++ )
        {
            var item = items[i];
            var type = item.getAttribute("data-type");
            var id = item.getAttribute("data-id");

            var included = false;
            if(_sharedIsland && typeof _sharedIsland[type] != 'undefined') {
                included = _sharedIsland[type].includes(id);
            }
            if(!included){ 
                if(missing == 0) missingText.parentNode.removeChild(missingText);
                missing ++;
                item.parentNode.removeChild(item);
                item.setAttribute('class', 'grid__item critter-tile');
                toCatch.appendChild(item);                
            }
            addToMeta(type, id, included);
        }

        // show meta data
        document.querySelector('.island-bugs span').textContent = _meta.caught.bugs + " / " + _meta.all.bugs;
        document.querySelector('.island-fish span').textContent = _meta.caught.fish + " / " + _meta.all.fish;
        document.querySelector('.island-sea-creatures span').textContent = _meta.caught['sea-creatures'] + " / " + _meta.all['sea-creatures'];
    }

});


