jquery-when-always
==========

jQuery plugin to allow always and fail for $.when-like statements to resolve similar to done.  All defers wait for full-set completion until the master defer (@see $.when) is resolved/rejected.

## Basic Usage
When-always can be used as a requirejs module or standard script include.  

If used with requirejs, when-always will return the required instance of jquery that has been augmented for convenience.

```
    var jqueryWhenAlways = require("jquery-when-always/jquery-always");

    or

    <script src="jquery-when-always/jquery-when-always.js" /></script>

```