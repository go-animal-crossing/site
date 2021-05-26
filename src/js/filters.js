/**
 * AUTOMATED TIME FILTERS
 */
var date = new Date();

_filterState = {
    'type' : false,
    'hemisphere' : false,
    'is': false,
    'caught': false
};

function applyFilterState()
{
    var selector = ".filter__item";
    var notSelector = ".filter__item";

    if(_filterState.type){
        selector = selector + ".type-" + _filterState.type;
    }
    if(_filterState.hemisphere){
        selector = selector + ".hemi-" + _filterState.hemisphere + "-1";
    }
    if(_filterState.is) {
        if(_filterState.hemisphere) selector = selector + ".is-" + _filterState.is + "-" + _filterState.hemisphere + "-1"; 
        else selector = selector + ".is-" + _filterState.is + "-1";
    }
    if(_filterState.caught) {
        selector = selector + ".caught";
    }

    var show = document.querySelectorAll(selector);
    var hide = document.querySelectorAll(notSelector);

    for(var i = 0; i < hide.length; i ++) hide[i].style.display = 'none';
    for(var i = 0; i < show.length; i ++) show[i].style.display = 'block';   
}


document.addEventListener("DOMContentLoaded",function(){
    var filterItems = document.querySelectorAll(".filter__item");
    console.log("Have filter items:", filterItems.length)
    
    if(filterItems.length > 0) {
        applyFilterState();
        // triggers
        var triggers = document.querySelectorAll(".filter__trigger");
        for(var i = 0; i < triggers.length; i ++ )
        {
            const trigger = triggers[i];
            trigger.addEventListener("click", function(e){
                var type = trigger.getAttribute("data-filter-key");
                var value = trigger.getAttribute("data-filter-value");
                var group = trigger.getAttribute("data-filter-group");
                var others = document.querySelectorAll("."+group);
                
                for(var i = 0; i < others.length; i ++) others[i].classList.remove('selected');
                trigger.classList.add('selected');

                _filterState[type] = value;
                applyFilterState();
                e.preventDefault();
            });
        }
        


    }

    
});


