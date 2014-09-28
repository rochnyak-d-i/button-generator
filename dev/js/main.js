function ButtonGenerator($, Options) {
    var
        defaultSelectors = {
            resultButton: '#button'
            , formSend: '.form-send'
            , htmlCode: '#html-code'
            , cssCode: '#css-code'
            , emailInput: '.form-send__email'
            , sendButton: '.form-send__button'
            , errorsBlock: '.form-send__errors'
            , successBlock: '.form-send__success'
            , optionsBlock: '.options'
        }
        , elements = {}
        , patternEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    ;

    /**
     * кеширует элементы приложения
     * @param {Object} oSelectors селекторы для элементов
     */
    function setElements(oSelectors) {
        $.each(oSelectors, function(key, val) {
            elements[key] = $(val);
        });
    }

    /**
     * инициализация формы отправки
     */
    function initForm() {
        elements.formSend.on('submit', sendForm);
    }

    /**
     * событие отправки формы
     * @param  {Event} ev
     */
    function sendForm(ev) {
        ev.preventDefault();

        var form = $(this);

        if(!validateForm())
            return false;

        elements.sendButton.prop('disabled', true);

        //отправка данных на сервер
        var strData = form.serialize();
        $.ajax({
            url: form.attr('action')
            , type: form.attr('method')
            , dataType: 'json'
            , data: strData
        })
        .done(function(data, status, xhr) {
            elements.errorsBlock.empty();
            elements.successBlock.empty();

            if(data.ERRORS){
                $.each(data.ERRORS, function(index, error) {
                    elements.errorsBlock.append($('<p>').text(error));
                });
            }else{
                elements.successBlock.append(data.SUCCESS);
            }
        })
        .always(function() {
            form.find('.has-error, .has-success').removeClass('has-error has-success');
            elements.sendButton.prop('disabled', false);
        });
    }

    /**
     * валидация формы
     */
    function validateForm() {
        var valid = true;

        $.each([elements.emailInput, elements.htmlCode, elements.cssCode], function(index, input) {
            var
                val = input.val()
                , errMsg = '';
            ;

            if(val.length === 0) {
                errMsg = 'Поле не должно быть пустым';
            }
            if(input.is(elements.emailInput) && !patternEmail.test(val)) {
                errMsg = 'Не валидный email';
            }

            if(errMsg.length !== 0) {
                //навешивание тултипа и сразу его открытие
                input.tooltip({
                    items: input
                    , show: "fold"
                    , content: errMsg
                    , position: { my: "left", at: "right" }
                    , create: function() {
                        input.addClass('has-error').removeClass('has-success');
                        input.one('keydown', removeError);
                    }
                }).tooltip('open');

                valid = false;
            } else {
                input.removeAttr('title');
                input.addClass('has-success').removeClass('has-error');
            }
        });

        return valid;
    }

    /**
     * удаляет тултип у поля не прошедшего валидацию
     * @param  {Event} ev
     */
    function removeError(ev) {
        $(this).tooltip('destroy').removeClass('has-error');
    }

    /**
     * запуск приложения
     * @param  {Object} settings настройки приложения
     */
    function run(settings) {
        settings = settings || {};
        settings.selectors = settings.selectors || {};

        settings.selectors = $.extend({}, defaultSelectors, settings.selectors);
        setElements(settings.selectors);

        settings.draw = (settings.draw && $.isArray(settings.draw)) ?
            settings.draw : Options.getSupportOptions();

        Options.initialize(settings.draw, elements);
        initForm();
    }

    return {
        run: run
        , stop: function() {}
    }
}

$(function() {
    var App, settings;

    settings = {};
    App = ButtonGenerator(jQuery, Options);

    App.run(settings);
});