var viewFactory = (function() {
    var
        views = {}
        , cache = {}
        , template
        , nameMap = {
            'border-radius': 'stylePx'
            , 'border-width': 'stylePx'
            , 'border-color': 'color'
            , 'background': 'color'
        }
    ;

    template = '<div class="option">' +
                    '<div class="option__name"></div>' +
                    '<div class="option__value"></div>' +
                '</div>';

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

    views.stylePx = {
        setEvents: function() {
            var self = this;

            self.element.on("slide", $.proxy(self.changeSlide, self));
        },
        changeSlide: function(ev, ui) {
            var
                self = this
                //, value = self.element.slider( "option", "value" )
                , value = ui.value
            ;

            self.option.setValue(value)
            self.changeData();
        },
        create: function() {
            var
                self = this
                , sliderOpt = {
                    orientation: "horizontal",
                    range: "min",
                    value: self.option.value
                }
            ;
            if(self.option.max) {
                sliderOpt.max = self.option.max;
            }

            self.element = $('<div>').slider(sliderOpt);
        }
    }

    views.color = {
        setEvents: function() {
            var self = this;
        },
        create: function() {
            var self = this;
        }
    }

    views['box-shadow'] = {
        setEvents: function() {
            var self = this;
        },
        create: function() {
            var self = this;
        }
    }

    return function(name) {
        name = nameMap[name] ? nameMap[name] : name;

        if(!views[name]) {
            throw new Error('представление для ' + name + ' не определено');
        }

        if(cache[name]) {
            return cache[name];
        }

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

        viewOption.prototype.render = function(parent) {
            var self = this;
            parent = (parent && $(parent).length) ? parent : $('body');

            self.block.find('.option__name').text(self.option.label);
            self.block.find('.option__value').append(self.element);

            parent.append(self.block);
        }

        viewOption.prototype.create = function() {
            throw new Error('метод create у представления ' + name + ' не определен');
        }

        viewOption.prototype.setEvents = function() {
            throw new Error('метод setEvents у представления ' + name + ' не определен');
        }

        viewOption.prototype.changeData = function() {
            var self = this;
            self.element.trigger('change_value', self.option);
        }

        viewOption.prototype.setUpListener = function(callback) {
            this.element.on('change_value', callback);
        }

        $.each(views[name], function(name, value) {
            viewOption.prototype[name] = value;
        });

        return cache[name] = viewOption;
    }
})();