var
    listOptions = {}
    , Options
;

/* блок объявлени создания опшенов */
listOptions.text = new Option('text', 'Текст', false, 'button');

listOptions.fSize = new Option('font-size', 'Размер', false, 24);
listOptions.fSize.max = 48;
listOptions.fSize.min = 1;

listOptions.bRadius = new Option('border-radius', 'Закругленность', false, 5);
listOptions.bRadius.max = 20;

listOptions.bSize = new Option('border-width', 'Толщина рамки', false, 1);
listOptions.bSize.max = 50;

listOptions.bStyle = new Option(
    'border-style', 'Стиль рамки', false, 'solid',
    ['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
);

listOptions.bColor = new Option('border-color', 'Цвет рамки', false, '#000');
listOptions.color = new Option('color', 'Цвет текста', false, '#000');
listOptions.background = new Option('background-color', 'Цвет фона', false, '#fff');

listOptions.bShadow = new Option('box-shadow', 'Тень', ['webkit', 'moz'], {
    inset: '',
    x: 0,
    y: 0,
    blur: 0,
    spread: 0,
    color: '#fff'
});
/* /блок объявлени создания опшенов */


//конторллер опшенов
Options = (function() {
    var options = {};

    /**
     * регистрация опшена
     * @param  {Object} oOption
     */
    function register(oOption) {
        if(oOption instanceof Option) {
            var name = oOption.name;
            options[name] = oOption;
        }
    }

    /**
     * инициализация (вызывается при запуске приложеия)
     * @param  {Array} drawing    массив опшенов которые стоит добавить в приложения(по-умолчанию - все зарегестрированные)
     * @param  {Object} oElements элементы приложения
     */
    function initialize(drawing, oElements) {
        var
            supports = getSupportOptions()
            , button = oElements.resultButton.get(0)
            , butId = oElements.resultButton.attr('id')
            , oStyle = {}
        ;

        /**
         * вызывается при изменении текста кнопки
         * @param  {Event} ev
         * @param  {Object} option
         */
        function onChangeText(ev, option) {
            oElements.resultButton.text(option.value);
            oElements.htmlCode.val(button.outerHTML);
        }

        /**
         * вызывается при изменении стилей кнопки
         * @param  {Event} ev
         * @param  {Object} option
         */
        function onChangeStyle(ev, option) {
            var style = '';

            oElements.resultButton.css(option.name, option.getValue());
            oStyle[option.name] = option.getStyle();

            $.each(oStyle, function(name, sStyle) {
                style += sStyle;
            });

            style = '#' + butId + ' {\n' + style + '}';
            oElements.cssCode.val(style);
        }


        /**
         * создание представления опшена, добавление обработчиков
         */
        $.each(supports, function(index, val) {
            if(drawing.indexOf(val) === -1)
                return;

            var
                viewClass = viewFactory(val)
                , view = new viewClass(options[val])
            ;

            view.render(oElements.optionsBlock);

            if(options[val].type === 'text') {
                view.setUpListener(onChangeText);
            } else {
                view.setUpListener(onChangeStyle);
            }

            view.changeData();
        });
    }

    function getSupportOptions() {
        return $.keys(options);
    }

    return {
        registerOptions: function(options) {
            $.each(options, function(keyName, oOption) {
                register(oOption);
            });
        },
        registerOption: register,
        getSupportOptions: getSupportOptions,
        initialize: initialize
    }
})();

Options.registerOptions(listOptions);











