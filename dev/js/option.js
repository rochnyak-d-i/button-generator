var Option = (function() {
    var _Option;

    /**
     * @param  {mixed} value
     */
    function getValue(value) {
        if($.isNumeric(value)) {
            value += 'px';
        } else if($.isArray(value)) {
            value = value.join('px ');
        } else if($.isPlainObject(value)) {
            var rValue = '';
            $.each(value, function(key, val) {
                rValue += getValue(val) + ' ';
            });

            value = rValue;
        }

        return value;
    }

    /**
     * модель опшена
     * @param  {String} @name   имя
     * @param  {String} label   метка
     * @param  {Array} prefix   массив префиксов для опшена
     * @param  {mixed} value    значение по-умолчанию
     * @param  {Array} arValues возможные значения
     */
    _Option = function(name, label, prefix, value, arValues) {
        this.name = name;
        this.prefixes = prefix ? prefix : false;
        this.defaultValue = this.value = value || '';
        this.label = label || this.name;
        this.type = (this.name === 'text') ? 'text' : 'style';
        this.arValues = arValues ? arValues : false;
    }

    /**
     * возвращает строковое значение опшена
     * @return {String}
     */
    _Option.prototype.getValue = function() {
        var value = this.value;

        if(this.type !== 'text') {
            value = getValue(value);
        }

        return value;
    }

    _Option.prototype.setValue = function(value) {
        if($.isPlainObject(this.value)) {
            this.value = $.extend({}, this.value, value);
        } else {
            if($.isArray(this.arValues) && this.arValues.indexOf(value) === -1)
                return false;

            this.value = value;
        }
    }

    /**
     * возвращает стили для опшена
     * @return {String}
     */
    _Option.prototype.getStyle = function() {
        if(this.type !== 'style')
            return;

        var
            style = ''
            , rule = ''
        ;
        style = rule = this.name + ': ' + this.getValue() + ';\r\n';

        if(this.prefixes && $.isArray(this.prefixes)) {
            $.each(this.prefixes, function(index, val) {
                style += '-' + val + '-' + rule;
            });
        }

        return style;
    }

    return _Option;
})();