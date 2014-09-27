function ButtonGenerator($, Options) {
    var
        defaultSelectors = {
            resultButton: '#result-button',
            formSend: '.form-send',
            htmlCode: '#html-code',
            cssCode: '#css-code',
            emailInput: '.form-send__email'
        }
        , elements = {
            resultButton: null,
            formSend: null,
            htmlCode: null,
            cssCode: null,
            emailInput: null
        }
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
})


$(function() {
    $( ".slider-range" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127
    });
});