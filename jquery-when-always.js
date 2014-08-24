/**
 * jQuery/Zepto plugin to allow always and fail for $.when-like statements
 * to resolve similar to done.  All defers wait for full-set completion until the
 * master defer (@see $.when) is resolved/rejected.
 * @param  {function} $ jQuery or Zepto
 *
 * @author  Russell Munson
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], function (jQuery) {
            return factory(jQuery);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var jQuery = require('jquery');
        module.exports = factory( jQuery );
    } else{
        factory(jQuery);
    }
})(this, function( jQuery ) {

    var defFilter=jQuery.Deferred().pipe ? 'pipe' : 'then',
        sliceArgs=Array.prototype.slice;
        //Zepto is  little finiky with it's extend, so suppy a start target
    jQuery.extend(jQuery,{
        whenAlways : function(){
            
            var args=sliceArgs.call(arguments,0),
                count=args.length,
                finalQueue=$.Callbacks("once"),
                finalVals=[],
                rejected=false,
                resFunc=function(originalDef,index){
                    return function(val){
                        var retArgs=arguments.length > 1 ? sliceArgs.call(arguments,0) : val; 
                        finalVals[index]=retArgs;
                        if(!(--count)){
                            finalQueue.fire()
                        }
                        return retArgs;
                    };
                },
                failFunc=function(originalDef,index){
                    return function(val){
                        var safeDef=$.Deferred(),
                            retArgs=arguments.length > 1 ? sliceArgs.call(arguments,0) : val ;
                        rejected=true;
                        finalVals[index]=retArgs;
                        if(!(--count)){
                            finalQueue.fire();
                            return retArgs;
                        }
                        finalQueue.add(function(){
                            safeDef.rejectWith(originalDef,retArgs);
                        });
                        return safeDef;
                    }
                };
            return $.when.apply(
                $.when,$.map(args,function(od,i){
                    return od && od[defFilter] ? od[defFilter](
                        //Success
                        resFunc(od,i),
                        //Fail
                        failFunc(od,i)
                    ) : (count--,finalVals[i]=od,od);
                })
            )[defFilter](null,function(){

                return $.Deferred().rejectWith(this,finalVals);
            });
        }
    });
    return jQuery;
});