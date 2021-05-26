/**
 * track what is present on this island
 */
_storageKey = "myislandv1";
const _emptyIsland = {
    'name': "",
    'hemisphere': "",
    'nativeFruit': "",
    'turnipPrice': "",
    'bugs': [],
    'fish': [],
    'sea-creatures': [],
    'editedOn': false,
    'dodo': false
};
_myisland = _emptyIsland;
_mylink = "";
_emptyIslandLink = false;

function loadIsland(){
    _emptyIslandLink = LZString.compressToEncodedURIComponent(JSON.stringify(_emptyIsland));
    // - load from window fragment
    if(window.location.hash) {
        var fragment = window.location.hash.substring(1);        
        var decompressed = LZString.decompressFromEncodedURIComponent(fragment);
        if(decompressed) _myisland = JSON.parse(decompressed);
        saveIsland();
    }
    // - or from local storage
    else if (typeof(Storage) !== "undefined") {
        var stored = window.localStorage.getItem(_storageKey);
        if( stored ) _myisland = JSON.parse( stored );
    }
    
    _updateMyLink();

}

function saveIsland()
{
    _myisland.editedOn = new Date().toISOString();
    var asString = JSON.stringify(_myisland);
    if (typeof(Storage) !== "undefined") {
        window.localStorage.setItem(_storageKey,  asString);
    }
    _updateMyLink();
}

function _updateMyLink()
{
    var asString = JSON.stringify(_myisland);
    var buttons = document.querySelectorAll("a.share");
    _mylink = LZString.compressToEncodedURIComponent(asString);
    for(var i = 0; i < buttons.length; i ++ ) {
        var button = buttons[i];        
        if(_mylink != _emptyIslandLink){
            button.setAttribute("href", "/shared/#" + _mylink);
            button.classList.remove("hidden");
        }
    }

}

/**
 * Triggers to update the _myisland config
 * - clickable events on the critters to add to storage
 */
document.addEventListener("DOMContentLoaded",function(){
    loadIsland();
    // -- clickable items
    var saveable = document.querySelectorAll(".shareable .mine .critter-tile");
    
    for(var i = 0; i < saveable.length; i ++ )
    {
        const item = saveable[i];
        const type = item.getAttribute("data-type");
        const id = item.getAttribute("data-id");
        // add class if stored
        var alreadyPresent = _myisland[type].indexOf(id);
        if(alreadyPresent >= 0) item.classList.add("caught");

        item.addEventListener("click", function(e){
            e.preventDefault();            
            var index = _myisland[type].indexOf(id);
            // remove
            if( index >= 0 ) _myisland[type].splice(index, 1);
            // add
            else _myisland[type].push(id);
            item.classList.toggle("caught");
            // update island in local storage
            saveIsland();
            
        });
    }

    // -- form data
    var formItems = document.querySelectorAll("form.island-data input, form.island-data select");
    for(var i = 0; i < formItems.length; i ++ )
    {
        const field = formItems[i];
        const fieldName = field.getAttribute("name");
        var stored = _myisland[fieldName];
        if(stored) field.value = stored;

        field.addEventListener("input", function(e){
            var val = e.target.value;
            _myisland[fieldName] = val;
            saveIsland();
        });
    }

    /**
     * share links trigger mobile share options
     */
    var items = document.querySelectorAll("a.share");
    for(var i = 0; i < items.length; i ++ )
    {
        const btn = items[i];
        btn.addEventListener('click', function (e) {
            if (navigator.share) {
                e.preventDefault();
                var shareData = {
                    title: _myisland.name,
                    text: _myisland.name + ' - My Animal Crossing Island!',
                    url: 'https://myisland.club/shared/#' + _mylink
                };
                try {
                    navigator.share(shareData)
                    
                } catch(err) {
                    console.error( err );
                }
            }
        });
    }

});