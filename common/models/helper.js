/**
 * @file helper.js
 * @description Helper functionality to apply on the models.
 * 
 * @since 14th Sep 2018
 * @author Nagendra Singh
 * @license None
 */

module.exports.disableAllMethods = function disableAllMethods(model, methodsToExpose){
    if(model && model.sharedClass){
        methodsToExpose = methodsToExpose || [];

        var modelName = model.sharedClass.name;
        var methods = model.sharedClass.methods();
        var relationMethods = [];
        var hiddenMethods = [];
        var notHiddenMethods = [];

        try {
            Object.keys(model.definition.settings.relations).forEach(function(relation)	{
                relationMethods.push({ name: '__findById__' + relation, isStatic: false });
                relationMethods.push({ name: '__destroyById__' + relation, isStatic: false });
                relationMethods.push({ name: '__updateById__' + relation, isStatic: false });
                relationMethods.push({ name: '__exists__' + relation, isStatic: false });
                relationMethods.push({ name: '__link__' + relation, isStatic: false });
                relationMethods.push({ name: '__get__' + relation, isStatic: false });
                relationMethods.push({ name: '__create__' + relation, isStatic: false });
                relationMethods.push({ name: '__update__' + relation, isStatic: false });
                relationMethods.push({ name: '__destroy__' + relation, isStatic: false });
                relationMethods.push({ name: '__unlink__' + relation, isStatic: false });
                relationMethods.push({ name: '__count__' + relation, isStatic: false });
                relationMethods.push({ name: '__delete__' + relation, isStatic: false });
            });
        } catch(err) {
            console.log(err);
        }

        methods.concat(relationMethods).forEach(function(method) {
            var methodName = method.name;
            if(methodsToExpose.indexOf(methodName) < 0)	{
                hiddenMethods.push(methodName);
                model.disableRemoteMethodByName(methodName, method.isStatic);
            } else{
                notHiddenMethods.push(methodName);
            }
        });

        if(hiddenMethods.length > 0) 	{
            console.log('\nRemote mehtods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
        }
        //console.log(JSON.stringify(model.definition.settings));
        // if(relationMethods.length > 0) 	{
        //     console.log('\nRemote mehtods Not hidden for', modelName, ':', relationMethods.join(', '), '\n');
        // }
    }
};