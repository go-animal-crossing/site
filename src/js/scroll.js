document.addEventListener("DOMContentLoaded",function(){

    var buttons = document.querySelectorAll('a.button, a.to-top');
    for(var i = 0; i < buttons.length; i ++)
    {
        const button = buttons[i];
        button.addEventListener('click', function(e){
            var href = button.getAttribute('href');
            var anchor = href.substr(0, 1) == "#";
            if(anchor){
                e.preventDefault();
                var ele = document.getElementById( href.replace("#", '') );
                if(ele){
                    ele.scrollIntoView();
                    
                }
            }
        });
    }

})

