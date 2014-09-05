export default function(type, methodName, methodParams) {
    methodParams = methodParams || [];
    if (!methodParams.join) {
        methodParams = Array.prototype.slice.call(methodParams);
    }

    var name = type.toString();

    if (!methodName) {
        return name;
    }

    name += '.' + methodName;
    name += '(' + methodParams.map(JSON.stringify).join(', ') + ')';

    return name;
}
