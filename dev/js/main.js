function ButtonGenerator($, Options) {
    var
        defaultSelectors = {
            resultButton: '#button'
            , formSend: '.form-send'
            , htmlCode: '#html-code'
            , cssCode: '#css-code'
            , emailInput: '.form-send__email'
            , optionsBlock: '.options'
        }
        , elements = {}
    ;

    function setElements(oSelectors) {
        $.each(oSelectors, function(key, val) {
            elements[key] = $(val);
        });
    }

    function run(settings) {
        settings = settings || {};
        settings.selectors = settings.selectors || {};

        settings.selectors = $.extend({}, defaultSelectors, settings.selectors);
        setElements(settings.selectors);

        settings.draw = (settings.draw && $.isArray(settings.draw)) ?
            settings.draw : Options.getSupportOptions();

        Options.initialize(settings.draw, elements);
    }

    return {
        run: run
    }
}

$(function() {
    var App, settings;

    settings = {};
    App = ButtonGenerator(jQuery, Options);

    App.run(settings);
});