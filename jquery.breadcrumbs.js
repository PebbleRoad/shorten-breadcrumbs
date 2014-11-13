/**
 * Plugin Name: TrimCrumbs
 * Author : Vinay@Pebbleroad
 * Date: 06/11/2014
 * Description: Trim bread crumbs
 */
;(function($, undefined){

    /**
     * Plugin name
     */
    
    var pluginName = 'trimcrumbs'


    /**
     * Events
     */
    
    var events = {
        BEFORE_INIT: 'trim:before_init',
        AFTER_TRIM: 'trim:after_trim',
        AFTER_DESTROY: 'trim:after_destroy',
        SHOW: 'trim:show'
    }

    /**
     * Default options
     * @type {Object}
     */
    var defaults = {
        length               : 3,
        dropdownClass        : 'crumb-dropdown',
        dropdownLinkClass    : 'crumb-dropdown-link',
        activeClass          : 'trimcrumbs-active',
        hasStartedClass      : 'trimcrumbs-started',
        dropdownIsShownClass : 'dropdown-is-shown',
        skip                 : 0
    }


    /**
     * [TrimCrumbs constructor]
     */
    function TrimCrumbs(el, options){

        var self = this

        this.el = el

        this.$el = $(el)

        /* Options */

        this.options = $.extend({}, defaults, options, this.$el.data())


        /* Plugin variables */

        this._$children = this.$el.children()
        
        this._total = this._$children.length


        /**
         * Add a click handler to dropdown link
         */
        
        this.$el.on('click', '.'+this.options.dropdownLinkClass, function(e){

            self.$el.toggleClass(self.options.dropdownIsShownClass)

            if(self.$el.hasClass(self.options.dropdownIsShownClass)){

                self.$el.trigger(events.SHOW);
            }

            e.preventDefault();
        })

        
        /**
         * Click events for dropdown
         */
        
        $('html').click(function(){

            $('.'+self.options.activeClass).removeClass(self.options.dropdownIsShownClass)
        })

        this.$el.on('click', function(e){
            e.stopPropagation();
        })
        

        /* Trim */

        this._trim();

        /* Return */

        return this

    }

    /**
     * Prototype
     */
    
    TrimCrumbs.prototype = {

        constructor: TrimCrumbs,

        _trim: function(){

            var self = this,
                length = parseInt(this.options.length),
                skip = parseInt(this.options.skip || 0);
            
            /* Validate */

            if((length + skip) >= this._total || length < 1) return;  

            /**
             * Trigger before init
             */
            
            this.$el.trigger(events.BEFORE_INIT);

            this.$el.addClass(this.options.hasStartedClass);
          
            
            /* Create dropdown */

            this._$dropdown = $('<div class="'+this.options.dropdownClass+'" />').insertAfter(this._$children.eq(skip));

            /* Append links */

            
            this._$children
                .slice(skip, this._total - length)
                .appendTo(this._$dropdown)

            /* Add dropdown link in the beginning of the list */

            this._$dropdownLink = $('<a href="#" class="'+this.options.dropdownLinkClass+'"><span class="visuallyhidden" title="Toggle Breadcrumbs">Toggle Breadcrumbs</span></a>').insertAfter(this._$dropdown)

            /**
             * Reverse the order of elements
             */
                        
            this._$dropdown.append(this._$dropdown.children().get().reverse());            

            /**
             * Add a class to the element
             */
            
            this.$el.addClass(this.options.activeClass);

            /**
             * Trigger after init
             */
            
            this.$el.trigger(events.AFTER_TRIM);

            this.$el.removeClass(this.options.hasStartedClass);

        }
    }


    /**
     * Public methods
     */
    
    var methods = {

        hide: function(){

            this.$el.removeClass(this.options.dropdownIsShownClass);
        },

        refresh: function(options){

            /* Destroy  */

            this.destroy(true);

            /* Options */

            if(options) this.options = $.extend({}, this.options, options);

            /* Trim */                        

            this._trim();

        },

        destroy: function(isRefresh){

            /* Reverse the order of elements */

            this._$dropdown.append(this._$dropdown.children().get().reverse());

            /* Unwrap children */

            this._$dropdown.children().unwrap();

            /* Remove active class */

            this.$el.removeClass('trimcrumbs-active');

            /* Check if its a refresh or a full destroy */

            if(isRefresh !== !1) this._$dropdownLink.remove();

            /**
             * Trigger after init
             */
            
            this.$el.trigger(events.AFTER_DESTROY);

        }
    }

    /**
     * Extend Prototype
     */
    
    TrimCrumbs.prototype = $.extend({}, TrimCrumbs.prototype, methods)


    /**
     * jQuery plugin
     */
    
    $.fn.trimcrumbs = function(options){

        return this.each(function(){

            var $element = $(this),
                trimcrumbs = $element.data(pluginName)


            if(typeof options == "string" && trimcrumbs  && methods.hasOwnProperty(options) ){

                trimcrumbs[options].apply(trimcrumbs)

            }else{


                if(!trimcrumbs) $element.data('trimcrumbs', new TrimCrumbs(this, options))

            }

        })

    }

})(jQuery)