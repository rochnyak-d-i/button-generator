/**
 * фабрика отображений
 * @return {Function}
 */
var viewFactory = (function() {
    var
        views = {}
        , cache = {}
        , template
        , nameMap = {
            'border-radius': 'stylePx'
            , 'border-width': 'stylePx'
            , 'font-size': 'stylePx'
            , 'border-color': 'color'
            , 'background-color': 'color'
        }
    ;

    /**
     * шаблон обертки представления
     * @type {String}
     */
    template = '<div class="option">' +
                    '<div class="option__name"></div>' +
                    '<div class="option__value"></div>' +
                '</div>';

    /**
     * расширение для представления опшена-текста
     *
     * расширяет основной класс представлений
     */
    views.text = {
        setEvents: function() {
            var self = this;

            self.element.on('keyup', $.proxy(self.changeInput, self));
        },
        changeInput: function(ev) {
            var
                self = this
                , value = $.trim(self.element.val())
            ;

            if(!value) {
                self.element.val(self.option.defaultValue);
                self.element.trigger('keyup');
            } else {
                self.option.setValue(value)
            }

            self.changeData();
        },
        create: function() {
            var self = this;

            self.element = $('<input />');
            self.element.attr({
                name: self.option.name,
                value: self.option.value
            });
        }
    }

    /**
     * расширение для представлений со слайдером
     */
    views.stylePx = {
        setEvents: function() {
            var self = this;

            self.element.on("slide", $.proxy(self.changeSlide, self));
        },
        changeSlide: function(ev, ui) {
            var
                self = this
                , value = ui.value
            ;

            self.option.setValue(value)
            self.changeData();
        },
        create: function() {
            var
                self = this
                , sliderOpt = {
                    orientation: "horizontal"
                    , range: "min"
                    , value: self.option.value
                }
            ;
            if(self.option.max) {
                sliderOpt.max = self.option.max;
            }
            if(self.option.min) {
                sliderOpt.min = self.option.min;
            }

            self.element = $('<div>').slider(sliderOpt);
        }
    }

    /**
     * расширения для опшенов с цветами
     */
    views.color = {
        setEvents: function() {
            /*
            события select и init объявлены в методе create,
            т.к. api colorpicker'a не позволяет перенсти их сюда
            */
            var self = this;

            self.element.on('change', $.proxy(self.changeInput, self));
        },
        changeInput: function(ev) {
            var
                self = this
                , value = $(ev.target).val()
            ;

            if(!value) {
                self.element.val(self.option.defaultValue);
                self.element.trigger('change');
            } else {
                self.option.setValue(value)
            }

            self.changeData();
        },
        create: function() {
            var
                self = this
                , cpOpts = {
                    parts: ['map', 'bar', 'rgb']
                    , colorFormat: '#HEX'
                    , part: {
                        map: { size: 128 },
                        bar: { size: 128 }
                    }
                    , select: $.proxy(self.changeInput, this)
                    , init: $.proxy(self.changeInput, this)
                }
            ;

            self.element = $('<input>').val(self.option.value).colorpicker(cpOpts);
        }
    }

    /**
     * расширение для представления тени
     */
    views['box-shadow'] = {
        setEvents: function() {
            var self = this;

            self.insetElem.on('change', $.proxy(self.changeInset, self));
            self.colorElem.on('change', $.proxy(self.changeColor, self));
            $.each(['x', 'y', 'blur', 'spread'], function(index, name) {
                self[name + 'Elem'].on("slide", function(ev) {
                    self.changeSlide(ev, name);
                });
            });
        }
        , create: function() {
            var self = this;
            self.element = $('<div>');

            self.createInsetItem();
            self.createSlideItems();
            self.createColorItem();
        }
        , createInsetItem: function() {
            var self = this;

            self.insetElem = $('<input>', {type: 'checkbox'});
            if(self.option.value.inset === 'inset') {
                self.insetElem.prop('checked', true);
            }

            self.element.append(self.createSubName('inset'));
            self.element.append(self.insetElem);
        }
        , createSlideItems: function() {
            var self = this;

            $.each(['x', 'y', 'blur', 'spread'], function(index, name) {
                var elemName = name + 'Elem';

                self[elemName] = $('<div>', {'class': 'option__value__sub-value'});
                self[elemName].slider({
                    value: self.option.value[name]
                    , max: 20
                    , orientation: "horizontal"
                    , range: "min"
                });

                self.element.append(self.createSubName(name));
                self.element.append(self[elemName]);
            });
        }
        , createColorItem: function() {
            var self = this;

            self.colorElem = $('<input>').val(self.option.value.color).colorpicker({
                parts: ['map', 'bar', 'rgb']
                , colorFormat: '#HEX'
                , part: {
                    map: { size: 128 },
                    bar: { size: 128 }
                }
                , select: $.proxy(self.changeColor, this)
                , init: $.proxy(self.changeColor, this)
            });


            self.element.append(self.createSubName('color'));
            self.element.append(self.colorElem);
        }
        , createSubName: function(text) {
            return $('<div>', {'class': 'option__value__sub-name'}).text(text);
        }

        , changeInset: function(ev) {
            var
                self = this
                value = $(ev.target).prop('checked') ? 'inset' : ''
            ;

            self.option.value.inset = value;
            self.changeData();
        }
        , changeColor: function(ev) {
            var
                self = this
                , value = $(ev.target).val()
            ;

            if(!value) {
                self.colorElem.val(self.option.defaultValue.color);
                self.colorElem.trigger('change');
            } else {
                self.option.setValue({color: value})
            }

            self.changeData();
        }
        , changeSlide: function(ev, slideName) {
            var
                self = this
                , value = self[slideName + 'Elem'].slider("option", "value")
                , oSet = {}
            ;
            oSet[slideName] = value;

            self.option.setValue(oSet)
            self.changeData();
        }
    }

    /**
     * представление для стиля рамки
     */
    views['border-style'] = {
        setEvents: function() {
            var self = this;

            self.element.on('change', $.proxy(self.changeSelect, self));
        }
        , changeSelect: function(ev) {
            var self = this;
            self.option.value = self.element.find('option:selected').val();

            self.changeData();
        }
        , create: function() {
            var self = this;
            self.element = $('<select>');

            $.each(self.option.arValues, function(index, value) {
                var optEl = $('<option>', {value: value}).text(value);
                if(value === self.option.value) {
                    optEl.prop('selected', true);
                }

                self.element.append(optEl);
            });
        }
    }

    return function(name) {
        /**
         * используется карта имен для применения одного конструктора к разным опшенам
         */
        name = nameMap[name] ? nameMap[name] : name;

        if(!views[name]) {
            throw new Error('представление для ' + name + ' не определено');
        }

        if(cache[name]) {
            return cache[name];
        }

        /**
         * основной класс представления
         * @param  {Object} option
         */
        var viewOption = function(option) {
            var self = this;

            if(!(option instanceof Option)) {
                throw new Error('option должен быть объектом класса Option');
            }

            self.option = option;
            self.element = $();
            self.block = $(self.template);

            self.create();
            self.setEvents();
        }

        viewOption.prototype.template = template;

        /**
         * генерирует представление
         * @param  {Object} parent объект в который будет вставлен элемент
         */
        viewOption.prototype.render = function(parent) {
            var self = this;
            parent = (parent && $(parent).length) ? parent : $('body');

            self.block.find('.option__name').text(self.option.label);
            self.block.find('.option__value').append(self.element);

            parent.append(self.block);
        }

        /**
         * метод в котором необходимо создать элемент в this.element
         */
        viewOption.prototype.create = function() {
            throw new Error('метод create у представления ' + name + ' не определен');
        }

        /**
         * метод в котором должны быть объявлены события
         */
        viewOption.prototype.setEvents = function() {
            throw new Error('метод setEvents у представления ' + name + ' не определен');
        }

        /**
         * говорит об изменении опшена
         */
        viewOption.prototype.changeData = function() {
            var self = this;
            self.element.trigger('change_value', self.option);
        }

        /**
         * повесить слушатели на событие изменение опшена
         * @param {Function} callback
         */
        viewOption.prototype.setUpListener = function(callback) {
            this.element.on('change_value', callback);
        }

        /**
         * переопределение методов
         */
        $.each(views[name], function(name, value) {
            viewOption.prototype[name] = value;
        });

        return cache[name] = viewOption;
    }
})();