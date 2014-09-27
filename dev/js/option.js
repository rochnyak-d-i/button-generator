var Option = (function() {
    var _Option;

    function getValue(value) {
        if($.isNumeric(value)) {
            value += 'px';
        } else if($.isArray(value)) {
            value = value.join('px ');
        } else if($.isPlainObject(value)) {
            $.each(value, function(key, val) {
                value += getValue(val) + ' ';
            });
        }

        return value;
    }

    _Option = function(name, label, prefix, value) {
        this.name = name;
        this.prefixes = prefix ? prefix : false;
        this.defaultValue = this.value = value || '';
        this.label = label || this.name;
        this.type = (this.name === 'text') ? 'text' : 'style';
    }
    _Option.prototype.getValue = function() {
        var value = this.value;

        if(this.type !== 'text') {
            value = getValue(value);
        }

        return value;
    }
    _Option.prototype.setValue = function(value) {
        this.value = value;
    }
    _Option.prototype.getStyle = function() {
        if(this.type !== 'style')
            return;

        var
            style = ''
            , rule = ''
        ;
        style = rule = this.name + ': ' + this.getValue() + ';\r\n';

        if(this.prefix && $.isArray(this.prefix)) {
            $.each(function(index, val) {
                style += val + '-' + rule;
            });
        }

        return style;
    }

    return _Option;
})();