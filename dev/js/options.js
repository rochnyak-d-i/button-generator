var
    listOptions = {}
    , Options
;

Options = (function() {
    var
        supports = []
        , options = {}
    ;

    function register(oOption) {
        if(oOption instanceof Option) {
            var name = oOption.name;
            options[name] = oOption;
            supports.push(name);
        }
    }

    function initialize(drawing, oElements) {
        $.each(supports, function(index, val) {
            if(drawing.indexOf(val) === -1)
                return;
            //options[val]
        });
    }

    return {
        registerOptions: function(options) {
            $.each(options, function(keyName, oOption) {
                register(oOption);
            });
        },
        registerOption: register,
        getSupportOptions: function() {
            return supports;
        },
        initialize: initialize
    }
})();

listOptions.text = new Option('text');
listOptions.bRadius = new Option('border-radius', false, 0);
listOptions.bSize = new Option('border-width', false, 1);
listOptions.bShadow = new Option('box-shadow', ['webkit', 'moz'], {
    inset: '',
    x: 0,
    y: 0,
    blur: 0,
    spread: 0,
    color: '#fff'
});
//BoxShadow.getStyle = function() {filter}

Options.registerOptions(listOptions);











