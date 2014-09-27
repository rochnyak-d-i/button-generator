var Option;

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

Option = function(name, prefix, value) {
    this.name = name;
    this.prefixes = prefix ? prefix : false;
    this.value = value || '';
    this.type = (this.name === 'text') ? 'text' : 'style';
}
Option.prototype.getValue = function() {
    var value = this.value;

    if(this.type !== 'text') {
        value = getValue(value);
    }

    return value;
}
Option.prototype.setValue = function(value) {
    this.value = value;
}
Option.prototype.getStyle = function() {
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