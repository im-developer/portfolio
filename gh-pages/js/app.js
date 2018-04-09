(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

},{}],2:[function(require,module,exports){
"use strict";

var _sections = require("./sections");

var _text = require("./text");

try {
    require('bootstrap-sass');
} catch (e) {}

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function value(chunkSize) {
        var array = this;
        return [].concat.apply([], array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        }));
    }
});

// GET READY !
$(function () {

    $(".main").onepage_scroll({
        sectionContainer: "section", // sectionContainer accepts any kind of selector in case you don't want to use section
        easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
        animationTime: 500, // AnimationTime let you define how long each section takes to animate
        pagination: true, // You can either show or hide the pagination. Toggle true for show, false for hide.
        updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
        keyboard: true,
        loop: false,
        beforeMove: function beforeMove(index) {

            $("[data-section]").parent('li').removeClass('active');
            $("[data-section=\"" + index + "\"]").parent('li').addClass('active');

            $('[data-animate]').each(function () {
                var $class = $(this).data('animate');
                if ($class) $(this).removeClass($class);
                $(this).removeClass('animate');
            });

            if ($('.section-' + _sections.sections[index]).hasClass('dark')) {
                $('body').addClass('dark');
            } else {
                $('body').removeClass('dark');
            }

            $('.section-' + _sections.sections[index]).find('[data-animate]').each(function () {
                var _this = this;

                var $delay = $(this).data('delay');
                var $class = $(this).data('animate');

                if ($delay) {
                    setTimeout(function () {
                        $(_this).addClass('animate');
                    }, $delay * 1000);
                } else {
                    $(this).addClass('animate');
                }
                if ($class) {
                    var $classDelay = $(this).data($class + '-delay');
                    if ($classDelay) {
                        setTimeout(function () {
                            $(_this).addClass($class);
                        }, $classDelay * 1000);
                    } else {
                        $(this).addClass($class);
                    }
                }
            });
        }
    });

    // Animated Text Characters
    $('.text-animated').each(function () {
        (0, _text.TextAnimated)(this);
    });

    // Animated Text Words
    $('.word-animated').each(function () {
        (0, _text.WordAnimated)(this);
    });

    $(".blast").mouseenter(function () {
        var el = $(this);
        $(this).addClass('animated rubberBand');
        $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            el.removeClass('animated rubberBand');
        });
    });

    // Portfolio
    var renderPortfolio = function renderPortfolio(category) {
        var list = window.portfolioList.filter(function (item) {
            if (!category) return true;
            return item.category == category;
        }).chunk_inefficient(4);
        var html = '';
        for (var i in list) {
            html += '<div class=" swiper-slide"><div class="xrow">' + list[i].map(function (item, i) {
                return "\n                    <div class=\"col-md-3 col-xs-6 item\" style=\"margin: 0; padding: 0;\">\n                        <a data-fancybox=\"gallery\"  href=\"" + item.url + "\">\n                            <img style=\"width: 100%;height: 230px;\" src=\"" + item.image + "\" alt=\"\">\n                        </a>\n                        <a data-fancybox data-caption=\"" + item.title + " <br /> " + item.description + "\" href=\"" + item.url + "\" class=\"hover\">\n                            <div class=\"content\">\n                                <h2>" + item.title + "</h2>\n                                <p>" + item.sub_title + "</p>\n                            </div>\n                        </a>\n                    </div>";
            }).join('') + '</div></div>';
        }

        $('#portfolio-list').html(html);

        $("[data-fancybox]").fancybox({
            // Options will go here
        });

        new Swiper('.protfolio-container', {
            slidesPerView: 1
        });
    };

    if (window.portfolioList) {
        renderPortfolio();
    }

    $('.portfolio-categories li a').click(function () {
        $('.portfolio-categories li').removeClass('active');
        $(this).parent().addClass('active');

        var category = $(this).text();
        if (category == 'All') {
            // $('[data-cateogry]').show();
            renderPortfolio();
        } else {
            renderPortfolio(category);
            // $('[data-cateogry]').hide();
            // $(`[data-cateogry="${category}"]`).show().addClass('animate');
        }

        return false;
    });
});

$('.header-links a').click(function () {
    $('.main').moveTo($(this).data('section'));
    return false;
});

$(".owl-carousel").owlCarousel({
    responsive: {
        0: {
            items: 2
        },
        600: {
            items: 3,
            nav: false
        },
        1000: {
            items: 5,
            loop: false
        }
    }
});

var typed = new Typed(".element", {
    // Waits 1000ms after typing "First"
    strings: ["Web Developer.", "Backend Developer.", "UX Designer.", "Mobile Developer."],
    loop: true,
    typeSpeed: 50,
    backSpeed: 50
});

},{"./sections":3,"./text":4,"bootstrap-sass":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sections = exports.sections = {
    1: 'home',
    2: 'cards',
    3: 'services',
    4: 'portfolio',
    5: 'contact',
    6: 'social'
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var TextAnimated = exports.TextAnimated = function TextAnimated(ele) {
    var $text = $(ele).text();
    $(ele).html("");
    for (var i = 0; i < $text.length; i++) {
        if ($text.charAt(i) === " ") $(ele).append('<span>' + $text.charAt(i) + '</span>');else $(ele).append('<span class="blast">' + $text.charAt(i) + '</span>');
    }
};

var WordAnimated = exports.WordAnimated = function WordAnimated(ele) {
    var $text = $(ele).text().split(' ');
    $(ele).html("");
    for (var i = 0; i < $text.length; i++) {
        $(ele).append('<span class="blast word">' + $text[i] + '</span>');
    }
};

},{}]},{},[2])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYm9vdHN0cmFwLXNhc3MvYXNzZXRzL2phdmFzY3JpcHRzL2Jvb3RzdHJhcC5qcyIsInNyYy9zY3JpcHRzL2luZGV4LmpzIiwic3JjL3NjcmlwdHMvc2VjdGlvbnMuanMiLCJzcmMvc2NyaXB0cy90ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3owRUE7O0FBQ0E7O0FBRUEsSUFBSTtBQUNBLFlBQVEsZ0JBQVI7QUFDSCxDQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FBRTs7QUFFZCxPQUFPLGNBQVAsQ0FBc0IsTUFBTSxTQUE1QixFQUF1QyxtQkFBdkMsRUFBNEQ7QUFDeEQsV0FBTyxlQUFTLFNBQVQsRUFBb0I7QUFDdkIsWUFBSSxRQUFNLElBQVY7QUFDQSxlQUFPLEdBQUcsTUFBSCxDQUFVLEtBQVYsQ0FBZ0IsRUFBaEIsRUFDSCxNQUFNLEdBQU4sQ0FBVSxVQUFTLElBQVQsRUFBYyxDQUFkLEVBQWlCO0FBQ3ZCLG1CQUFPLElBQUUsU0FBRixHQUFjLEVBQWQsR0FBbUIsQ0FBQyxNQUFNLEtBQU4sQ0FBWSxDQUFaLEVBQWMsSUFBRSxTQUFoQixDQUFELENBQTFCO0FBQ0gsU0FGRCxDQURHLENBQVA7QUFLSDtBQVJ1RCxDQUE1RDs7QUFXQTtBQUNBLEVBQUUsWUFBWTs7QUFFVixNQUFFLE9BQUYsRUFBVyxjQUFYLENBQTBCO0FBQ3RCLDBCQUFrQixTQURJLEVBQ087QUFDN0IsZ0JBQVEsTUFGYyxFQUVOO0FBQ2hCLHVCQUFlLEdBSE8sRUFHRjtBQUNwQixvQkFBWSxJQUpVLEVBSUo7QUFDbEIsbUJBQVcsS0FMVyxFQUtKO0FBQ2xCLGtCQUFVLElBTlk7QUFPdEIsY0FBTSxLQVBnQjtBQVF0QixvQkFBWSxvQkFBUyxLQUFULEVBQWdCOztBQUV4QixnQ0FBb0IsTUFBcEIsQ0FBMkIsSUFBM0IsRUFBaUMsV0FBakMsQ0FBNkMsUUFBN0M7QUFDQSxtQ0FBb0IsS0FBcEIsVUFBK0IsTUFBL0IsQ0FBc0MsSUFBdEMsRUFBNEMsUUFBNUMsQ0FBcUQsUUFBckQ7O0FBRUEsY0FBRSxnQkFBRixFQUFvQixJQUFwQixDQUF5QixZQUFZO0FBQ2pDLG9CQUFNLFNBQVMsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLFNBQWIsQ0FBZjtBQUNBLG9CQUFLLE1BQUwsRUFBYyxFQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLE1BQXBCO0FBQ2Qsa0JBQUUsSUFBRixFQUFRLFdBQVIsQ0FBb0IsU0FBcEI7QUFDSCxhQUpEOztBQU1BLGdCQUFJLEVBQUUsY0FBYyxtQkFBUyxLQUFULENBQWhCLEVBQWlDLFFBQWpDLENBQTBDLE1BQTFDLENBQUosRUFBdUQ7QUFDbkQsa0JBQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsTUFBbkI7QUFDSCxhQUZELE1BRU87QUFDSCxrQkFBRSxNQUFGLEVBQVUsV0FBVixDQUFzQixNQUF0QjtBQUNIOztBQUVELGNBQUUsY0FBYyxtQkFBUyxLQUFULENBQWhCLEVBQWlDLElBQWpDLENBQXNDLGdCQUF0QyxFQUF3RCxJQUF4RCxDQUE2RCxZQUFZO0FBQUE7O0FBQ3JFLG9CQUFNLFNBQVMsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLE9BQWIsQ0FBZjtBQUNBLG9CQUFNLFNBQVMsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLFNBQWIsQ0FBZjs7QUFFQSxvQkFBSSxNQUFKLEVBQVk7QUFDUiwrQkFBVyxZQUFNO0FBQ2IsaUNBQVEsUUFBUixDQUFpQixTQUFqQjtBQUNILHFCQUZELEVBRUcsU0FBUyxJQUZaO0FBR0gsaUJBSkQsTUFJTztBQUNILHNCQUFFLElBQUYsRUFBUSxRQUFSLENBQWlCLFNBQWpCO0FBQ0g7QUFDRCxvQkFBSyxNQUFMLEVBQWM7QUFDVix3QkFBTSxjQUFjLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxTQUFTLFFBQXRCLENBQXBCO0FBQ0Esd0JBQUksV0FBSixFQUFpQjtBQUNiLG1DQUFXLFlBQU07QUFDYixxQ0FBUSxRQUFSLENBQWlCLE1BQWpCO0FBQ0gseUJBRkQsRUFFRyxjQUFjLElBRmpCO0FBR0gscUJBSkQsTUFJTztBQUNILDBCQUFFLElBQUYsRUFBUSxRQUFSLENBQWlCLE1BQWpCO0FBQ0g7QUFDSjtBQUNKLGFBckJEO0FBdUJIO0FBaERxQixLQUExQjs7QUFtREE7QUFDQSxNQUFFLGdCQUFGLEVBQW9CLElBQXBCLENBQXlCLFlBQVk7QUFDakMsZ0NBQWEsSUFBYjtBQUNILEtBRkQ7O0FBSUE7QUFDQSxNQUFFLGdCQUFGLEVBQW9CLElBQXBCLENBQXlCLFlBQVk7QUFDakMsZ0NBQWEsSUFBYjtBQUNILEtBRkQ7O0FBSUEsTUFBRSxRQUFGLEVBQVksVUFBWixDQUF1QixZQUFXO0FBQzlCLFlBQUksS0FBSyxFQUFFLElBQUYsQ0FBVDtBQUNBLFVBQUUsSUFBRixFQUFRLFFBQVIsQ0FBaUIscUJBQWpCO0FBQ0EsVUFBRSxJQUFGLEVBQVEsR0FBUixDQUFZLDhFQUFaLEVBQTRGLFlBQVU7QUFDbEcsZUFBRyxXQUFILENBQWUscUJBQWY7QUFDSCxTQUZEO0FBR0gsS0FORDs7QUFRQTtBQUNBLFFBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsUUFBRCxFQUFjO0FBQ2xDLFlBQU0sT0FBTyxPQUFPLGFBQVAsQ0FBcUIsTUFBckIsQ0FBNEIsZ0JBQVE7QUFDN0MsZ0JBQUksQ0FBQyxRQUFMLEVBQWUsT0FBTyxJQUFQO0FBQ2YsbUJBQU8sS0FBSyxRQUFMLElBQWlCLFFBQXhCO0FBQ0gsU0FIWSxFQUdWLGlCQUhVLENBR1EsQ0FIUixDQUFiO0FBSUEsWUFBSSxPQUFPLEVBQVg7QUFDQSxhQUFLLElBQU0sQ0FBWCxJQUFnQixJQUFoQixFQUFzQjtBQUNsQixvQkFDSSxrREFDQSxLQUFLLENBQUwsRUFBUSxHQUFSLENBQVksVUFBQyxJQUFELEVBQU8sQ0FBUCxFQUFhO0FBQ3JCLHdMQUV3QyxLQUFLLEdBRjdDLHlGQUd1RCxLQUFLLEtBSDVELDRHQUtxQyxLQUFLLEtBTDFDLGdCQUswRCxLQUFLLFdBTC9ELGtCQUtxRixLQUFLLEdBTDFGLHNIQU9rQixLQUFLLEtBUHZCLGtEQVFpQixLQUFLLFNBUnRCO0FBWUgsYUFiRCxFQWFHLElBYkgsQ0FhUSxFQWJSLENBREEsR0FlRSxjQWhCTjtBQWtCSDs7QUFFRCxVQUFFLGlCQUFGLEVBQXFCLElBQXJCLENBQTBCLElBQTFCOztBQUVBLFVBQUUsaUJBQUYsRUFBcUIsUUFBckIsQ0FBOEI7QUFDMUI7QUFEMEIsU0FBOUI7O0FBSUEsWUFBSSxNQUFKLENBQVksc0JBQVosRUFBb0M7QUFDaEMsMkJBQWU7QUFEaUIsU0FBcEM7QUFHSCxLQXBDRDs7QUFzQ0EsUUFBSSxPQUFPLGFBQVgsRUFBMEI7QUFDdEI7QUFDSDs7QUFFRCxNQUFFLDRCQUFGLEVBQWdDLEtBQWhDLENBQXNDLFlBQVk7QUFDOUMsVUFBRSwwQkFBRixFQUE4QixXQUE5QixDQUEwQyxRQUExQztBQUNBLFVBQUUsSUFBRixFQUFRLE1BQVIsR0FBaUIsUUFBakIsQ0FBMEIsUUFBMUI7O0FBRUEsWUFBTSxXQUFXLEVBQUUsSUFBRixFQUFRLElBQVIsRUFBakI7QUFDQSxZQUFJLFlBQVksS0FBaEIsRUFBdUI7QUFDbkI7QUFDQTtBQUNILFNBSEQsTUFHTztBQUNILDRCQUFnQixRQUFoQjtBQUNBO0FBQ0E7QUFDSDs7QUFFRCxlQUFPLEtBQVA7QUFDSCxLQWZEO0FBaUJILENBbklEOztBQXVJQSxFQUFFLGlCQUFGLEVBQXFCLEtBQXJCLENBQTJCLFlBQVk7QUFDbkMsTUFBRSxPQUFGLEVBQVcsTUFBWCxDQUFrQixFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsU0FBYixDQUFsQjtBQUNBLFdBQU8sS0FBUDtBQUNILENBSEQ7O0FBS0EsRUFBRSxlQUFGLEVBQW1CLFdBQW5CLENBQStCO0FBQzNCLGdCQUFhO0FBQ1QsV0FBRTtBQUNFLG1CQUFNO0FBRFIsU0FETztBQUlULGFBQUk7QUFDQSxtQkFBTSxDQUROO0FBRUEsaUJBQUk7QUFGSixTQUpLO0FBUVQsY0FBSztBQUNELG1CQUFNLENBREw7QUFFRCxrQkFBSztBQUZKO0FBUkk7QUFEYyxDQUEvQjs7QUFnQkEsSUFBSSxRQUFRLElBQUksS0FBSixDQUFVLFVBQVYsRUFBc0I7QUFDOUI7QUFDQSxhQUFTLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLEVBQXlDLGNBQXpDLEVBQXlELG1CQUF6RCxDQUZxQjtBQUc5QixVQUFNLElBSHdCO0FBSTlCLGVBQVcsRUFKbUI7QUFLOUIsZUFBVztBQUxtQixDQUF0QixDQUFaOzs7Ozs7OztBQy9LTyxJQUFNLDhCQUFXO0FBQ3BCLE9BQUcsTUFEaUI7QUFFcEIsT0FBRyxPQUZpQjtBQUdwQixPQUFHLFVBSGlCO0FBSXBCLE9BQUcsV0FKaUI7QUFLcEIsT0FBRyxTQUxpQjtBQU1wQixPQUFHO0FBTmlCLENBQWpCOzs7Ozs7OztBQ0FBLElBQU0sc0NBQWUsU0FBZixZQUFlLENBQUMsR0FBRCxFQUFTO0FBQ2pDLFFBQU0sUUFBUSxFQUFFLEdBQUYsRUFBTyxJQUFQLEVBQWQ7QUFDQSxNQUFFLEdBQUYsRUFBTyxJQUFQLENBQVksRUFBWjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ25DLFlBQUcsTUFBTSxNQUFOLENBQWEsQ0FBYixNQUFvQixHQUF2QixFQUNJLEVBQUUsR0FBRixFQUFPLE1BQVAsQ0FBYyxXQUFVLE1BQU0sTUFBTixDQUFhLENBQWIsQ0FBVixHQUE0QixTQUExQyxFQURKLEtBR0ksRUFBRSxHQUFGLEVBQU8sTUFBUCxDQUFjLHlCQUF3QixNQUFNLE1BQU4sQ0FBYSxDQUFiLENBQXhCLEdBQTBDLFNBQXhEO0FBQ1A7QUFDSixDQVRNOztBQVdBLElBQU0sc0NBQWUsU0FBZixZQUFlLENBQUMsR0FBRCxFQUFTO0FBQ2pDLFFBQU0sUUFBUSxFQUFFLEdBQUYsRUFBTyxJQUFQLEdBQWMsS0FBZCxDQUFvQixHQUFwQixDQUFkO0FBQ0EsTUFBRSxHQUFGLEVBQU8sSUFBUCxDQUFZLEVBQVo7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNuQyxVQUFFLEdBQUYsRUFBTyxNQUFQLENBQWMsOEJBQTZCLE1BQU0sQ0FBTixDQUE3QixHQUF3QyxTQUF0RDtBQUNIO0FBQ0osQ0FOTSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyohXG4gKiBCb290c3RyYXAgdjMuMy43IChodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbSlcbiAqIENvcHlyaWdodCAyMDExLTIwMTYgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxuaWYgKHR5cGVvZiBqUXVlcnkgPT09ICd1bmRlZmluZWQnKSB7XG4gIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeScpXG59XG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciB2ZXJzaW9uID0gJC5mbi5qcXVlcnkuc3BsaXQoJyAnKVswXS5zcGxpdCgnLicpXG4gIGlmICgodmVyc2lvblswXSA8IDIgJiYgdmVyc2lvblsxXSA8IDkpIHx8ICh2ZXJzaW9uWzBdID09IDEgJiYgdmVyc2lvblsxXSA9PSA5ICYmIHZlcnNpb25bMl0gPCAxKSB8fCAodmVyc2lvblswXSA+IDMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5IHZlcnNpb24gMS45LjEgb3IgaGlnaGVyLCBidXQgbG93ZXIgdGhhbiB2ZXJzaW9uIDQnKVxuICB9XG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0cmFuc2l0aW9uLmpzIHYzLjMuN1xuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jdHJhbnNpdGlvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNiBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDU1MgVFJBTlNJVElPTiBTVVBQT1JUIChTaG91dG91dDogaHR0cDovL3d3dy5tb2Rlcm5penIuY29tLylcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib290c3RyYXAnKVxuXG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgIFdlYmtpdFRyYW5zaXRpb24gOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICBNb3pUcmFuc2l0aW9uICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgT1RyYW5zaXRpb24gICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICB0cmFuc2l0aW9uICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfVxuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7IGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2UgLy8gZXhwbGljaXQgZm9yIGllOCAoICAuXy4pXG4gIH1cblxuICAvLyBodHRwOi8vYmxvZy5hbGV4bWFjY2F3LmNvbS9jc3MtdHJhbnNpdGlvbnNcbiAgJC5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgIHZhciBjYWxsZWQgPSBmYWxzZVxuICAgIHZhciAkZWwgPSB0aGlzXG4gICAgJCh0aGlzKS5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHsgY2FsbGVkID0gdHJ1ZSB9KVxuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgaWYgKCFjYWxsZWQpICQoJGVsKS50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCkgfVxuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIGR1cmF0aW9uKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAkKGZ1bmN0aW9uICgpIHtcbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25FbmQoKVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuXG5cbiAgICAkLmV2ZW50LnNwZWNpYWwuYnNUcmFuc2l0aW9uRW5kID0ge1xuICAgICAgYmluZFR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGRlbGVnYXRlVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhpcykpIHJldHVybiBlLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFsZXJ0LmpzIHYzLjMuN1xuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jYWxlcnRzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTYgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUxFUlQgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGRpc21pc3MgPSAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJ1xuICB2YXIgQWxlcnQgICA9IGZ1bmN0aW9uIChlbCkge1xuICAgICQoZWwpLm9uKCdjbGljaycsIGRpc21pc3MsIHRoaXMuY2xvc2UpXG4gIH1cblxuICBBbGVydC5WRVJTSU9OID0gJzMuMy43J1xuXG4gIEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBBbGVydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgICA9ICQodGhpcylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciAkcGFyZW50ID0gJChzZWxlY3RvciA9PT0gJyMnID8gW10gOiBzZWxlY3RvcilcblxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuYWxlcnQnKVxuICAgIH1cblxuICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnY2xvc2UuYnMuYWxlcnQnKSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XG4gICAgICAvLyBkZXRhY2ggZnJvbSBwYXJlbnQsIGZpcmUgZXZlbnQgdGhlbiBjbGVhbiB1cCBkYXRhXG4gICAgICAkcGFyZW50LmRldGFjaCgpLnRyaWdnZXIoJ2Nsb3NlZC5icy5hbGVydCcpLnJlbW92ZSgpXG4gICAgfVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHBhcmVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgcmVtb3ZlRWxlbWVudClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHJlbW92ZUVsZW1lbnQoKVxuICB9XG5cblxuICAvLyBBTEVSVCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWxlcnRcblxuICAkLmZuLmFsZXJ0ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWxlcnQuQ29uc3RydWN0b3IgPSBBbGVydFxuXG5cbiAgLy8gQUxFUlQgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFsZXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hbGVydCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFMRVJUIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpJywgZGlzbWlzcywgQWxlcnQucHJvdG90eXBlLmNsb3NlKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBidXR0b24uanMgdjMuMy43XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNidXR0b25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTYgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQlVUVE9OIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBCdXR0b24gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gJC5leHRlbmQoe30sIEJ1dHRvbi5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gIH1cblxuICBCdXR0b24uVkVSU0lPTiAgPSAnMy4zLjcnXG5cbiAgQnV0dG9uLkRFRkFVTFRTID0ge1xuICAgIGxvYWRpbmdUZXh0OiAnbG9hZGluZy4uLidcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgZCAgICA9ICdkaXNhYmxlZCdcbiAgICB2YXIgJGVsICA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgdmFsICA9ICRlbC5pcygnaW5wdXQnKSA/ICd2YWwnIDogJ2h0bWwnXG4gICAgdmFyIGRhdGEgPSAkZWwuZGF0YSgpXG5cbiAgICBzdGF0ZSArPSAnVGV4dCdcblxuICAgIGlmIChkYXRhLnJlc2V0VGV4dCA9PSBudWxsKSAkZWwuZGF0YSgncmVzZXRUZXh0JywgJGVsW3ZhbF0oKSlcblxuICAgIC8vIHB1c2ggdG8gZXZlbnQgbG9vcCB0byBhbGxvdyBmb3JtcyB0byBzdWJtaXRcbiAgICBzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgJGVsW3ZhbF0oZGF0YVtzdGF0ZV0gPT0gbnVsbCA/IHRoaXMub3B0aW9uc1tzdGF0ZV0gOiBkYXRhW3N0YXRlXSlcblxuICAgICAgaWYgKHN0YXRlID09ICdsb2FkaW5nVGV4dCcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICAgICRlbC5hZGRDbGFzcyhkKS5hdHRyKGQsIGQpLnByb3AoZCwgdHJ1ZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0xvYWRpbmcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoZCkucmVtb3ZlQXR0cihkKS5wcm9wKGQsIGZhbHNlKVxuICAgICAgfVxuICAgIH0sIHRoaXMpLCAwKVxuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoYW5nZWQgPSB0cnVlXG4gICAgdmFyICRwYXJlbnQgPSB0aGlzLiRlbGVtZW50LmNsb3Nlc3QoJ1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nKVxuXG4gICAgaWYgKCRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICB2YXIgJGlucHV0ID0gdGhpcy4kZWxlbWVudC5maW5kKCdpbnB1dCcpXG4gICAgICBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAncmFkaW8nKSB7XG4gICAgICAgIGlmICgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgJHBhcmVudC5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2UgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xuICAgICAgICBpZiAoKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpICE9PSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgICAkaW5wdXQucHJvcCgnY2hlY2tlZCcsIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgaWYgKGNoYW5nZWQpICRpbnB1dC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtcHJlc3NlZCcsICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG5cblxuICAvLyBCVVRUT04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYnV0dG9uJywgKGRhdGEgPSBuZXcgQnV0dG9uKHRoaXMsIG9wdGlvbnMpKSlcblxuICAgICAgaWYgKG9wdGlvbiA9PSAndG9nZ2xlJykgZGF0YS50b2dnbGUoKVxuICAgICAgZWxzZSBpZiAob3B0aW9uKSBkYXRhLnNldFN0YXRlKG9wdGlvbilcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYnV0dG9uXG5cbiAgJC5mbi5idXR0b24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5idXR0b24uQ29uc3RydWN0b3IgPSBCdXR0b25cblxuXG4gIC8vIEJVVFRPTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmJ1dHRvbi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYnV0dG9uID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQlVUVE9OIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJGJ0biA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKVxuICAgICAgUGx1Z2luLmNhbGwoJGJ0biwgJ3RvZ2dsZScpXG4gICAgICBpZiAoISgkKGUudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkpIHtcbiAgICAgICAgLy8gUHJldmVudCBkb3VibGUgY2xpY2sgb24gcmFkaW9zLCBhbmQgdGhlIGRvdWJsZSBzZWxlY3Rpb25zIChzbyBjYW5jZWxsYXRpb24pIG9uIGNoZWNrYm94ZXNcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIC8vIFRoZSB0YXJnZXQgY29tcG9uZW50IHN0aWxsIHJlY2VpdmUgdGhlIGZvY3VzXG4gICAgICAgIGlmICgkYnRuLmlzKCdpbnB1dCxidXR0b24nKSkgJGJ0bi50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIGVsc2UgJGJ0bi5maW5kKCdpbnB1dDp2aXNpYmxlLGJ1dHRvbjp2aXNpYmxlJykuZmlyc3QoKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9XG4gICAgfSlcbiAgICAub24oJ2ZvY3VzLmJzLmJ1dHRvbi5kYXRhLWFwaSBibHVyLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKS50b2dnbGVDbGFzcygnZm9jdXMnLCAvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpXG4gICAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY2Fyb3VzZWwuanMgdjMuMy43XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNjYXJvdXNlbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE2IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENBUk9VU0VMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRpbmRpY2F0b3JzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuY2Fyb3VzZWwtaW5kaWNhdG9ycycpXG4gICAgdGhpcy5vcHRpb25zICAgICA9IG9wdGlvbnNcbiAgICB0aGlzLnBhdXNlZCAgICAgID0gbnVsbFxuICAgIHRoaXMuc2xpZGluZyAgICAgPSBudWxsXG4gICAgdGhpcy5pbnRlcnZhbCAgICA9IG51bGxcbiAgICB0aGlzLiRhY3RpdmUgICAgID0gbnVsbFxuICAgIHRoaXMuJGl0ZW1zICAgICAgPSBudWxsXG5cbiAgICB0aGlzLm9wdGlvbnMua2V5Ym9hcmQgJiYgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSlcblxuICAgIHRoaXMub3B0aW9ucy5wYXVzZSA9PSAnaG92ZXInICYmICEoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSAmJiB0aGlzLiRlbGVtZW50XG4gICAgICAub24oJ21vdXNlZW50ZXIuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMucGF1c2UsIHRoaXMpKVxuICAgICAgLm9uKCdtb3VzZWxlYXZlLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmN5Y2xlLCB0aGlzKSlcbiAgfVxuXG4gIENhcm91c2VsLlZFUlNJT04gID0gJzMuMy43J1xuXG4gIENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04gPSA2MDBcblxuICBDYXJvdXNlbC5ERUZBVUxUUyA9IHtcbiAgICBpbnRlcnZhbDogNTAwMCxcbiAgICBwYXVzZTogJ2hvdmVyJyxcbiAgICB3cmFwOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgY2FzZSAzNzogdGhpcy5wcmV2KCk7IGJyZWFrXG4gICAgICBjYXNlIDM5OiB0aGlzLm5leHQoKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVyblxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmN5Y2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IGZhbHNlKVxuXG4gICAgdGhpcy5pbnRlcnZhbCAmJiBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICB0aGlzLm9wdGlvbnMuaW50ZXJ2YWxcbiAgICAgICYmICF0aGlzLnBhdXNlZFxuICAgICAgJiYgKHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgkLnByb3h5KHRoaXMubmV4dCwgdGhpcyksIHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1JbmRleCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdGhpcy4kaXRlbXMgPSBpdGVtLnBhcmVudCgpLmNoaWxkcmVuKCcuaXRlbScpXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmluZGV4KGl0ZW0gfHwgdGhpcy4kYWN0aXZlKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhY3RpdmUpIHtcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChhY3RpdmUpXG4gICAgdmFyIHdpbGxXcmFwID0gKGRpcmVjdGlvbiA9PSAncHJldicgJiYgYWN0aXZlSW5kZXggPT09IDApXG4gICAgICAgICAgICAgICAgfHwgKGRpcmVjdGlvbiA9PSAnbmV4dCcgJiYgYWN0aXZlSW5kZXggPT0gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpKVxuICAgIGlmICh3aWxsV3JhcCAmJiAhdGhpcy5vcHRpb25zLndyYXApIHJldHVybiBhY3RpdmVcbiAgICB2YXIgZGVsdGEgPSBkaXJlY3Rpb24gPT0gJ3ByZXYnID8gLTEgOiAxXG4gICAgdmFyIGl0ZW1JbmRleCA9IChhY3RpdmVJbmRleCArIGRlbHRhKSAlIHRoaXMuJGl0ZW1zLmxlbmd0aFxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5lcShpdGVtSW5kZXgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUudG8gPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgdmFyIHRoYXQgICAgICAgID0gdGhpc1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJykpXG5cbiAgICBpZiAocG9zID4gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpIHx8IHBvcyA8IDApIHJldHVyblxuXG4gICAgaWYgKHRoaXMuc2xpZGluZykgICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQub25lKCdzbGlkLmJzLmNhcm91c2VsJywgZnVuY3Rpb24gKCkgeyB0aGF0LnRvKHBvcykgfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmIChhY3RpdmVJbmRleCA9PSBwb3MpIHJldHVybiB0aGlzLnBhdXNlKCkuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUocG9zID4gYWN0aXZlSW5kZXggPyAnbmV4dCcgOiAncHJldicsIHRoaXMuJGl0ZW1zLmVxKHBvcykpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gdHJ1ZSlcblxuICAgIGlmICh0aGlzLiRlbGVtZW50LmZpbmQoJy5uZXh0LCAucHJldicpLmxlbmd0aCAmJiAkLnN1cHBvcnQudHJhbnNpdGlvbikge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZClcbiAgICAgIHRoaXMuY3ljbGUodHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLmludGVydmFsID0gY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCduZXh0JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCdwcmV2JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5zbGlkZSA9IGZ1bmN0aW9uICh0eXBlLCBuZXh0KSB7XG4gICAgdmFyICRhY3RpdmUgICA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJylcbiAgICB2YXIgJG5leHQgICAgID0gbmV4dCB8fCB0aGlzLmdldEl0ZW1Gb3JEaXJlY3Rpb24odHlwZSwgJGFjdGl2ZSlcbiAgICB2YXIgaXNDeWNsaW5nID0gdGhpcy5pbnRlcnZhbFxuICAgIHZhciBkaXJlY3Rpb24gPSB0eXBlID09ICduZXh0JyA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB2YXIgdGhhdCAgICAgID0gdGhpc1xuXG4gICAgaWYgKCRuZXh0Lmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuICh0aGlzLnNsaWRpbmcgPSBmYWxzZSlcblxuICAgIHZhciByZWxhdGVkVGFyZ2V0ID0gJG5leHRbMF1cbiAgICB2YXIgc2xpZGVFdmVudCA9ICQuRXZlbnQoJ3NsaWRlLmJzLmNhcm91c2VsJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCxcbiAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgfSlcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZGVFdmVudClcbiAgICBpZiAoc2xpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLnNsaWRpbmcgPSB0cnVlXG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5wYXVzZSgpXG5cbiAgICBpZiAodGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuJGluZGljYXRvcnMuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgdmFyICRuZXh0SW5kaWNhdG9yID0gJCh0aGlzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKClbdGhpcy5nZXRJdGVtSW5kZXgoJG5leHQpXSlcbiAgICAgICRuZXh0SW5kaWNhdG9yICYmICRuZXh0SW5kaWNhdG9yLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIHZhciBzbGlkRXZlbnQgPSAkLkV2ZW50KCdzbGlkLmJzLmNhcm91c2VsJywgeyByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKCQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3NsaWRlJykpIHtcbiAgICAgICRuZXh0LmFkZENsYXNzKHR5cGUpXG4gICAgICAkbmV4dFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgICRhY3RpdmUuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJG5leHQucmVtb3ZlQ2xhc3MoW3R5cGUsIGRpcmVjdGlvbl0uam9pbignICcpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKFsnYWN0aXZlJywgZGlyZWN0aW9uXS5qb2luKCcgJykpXG4gICAgICAgICAgdGhhdC5zbGlkaW5nID0gZmFsc2VcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgfSBlbHNlIHtcbiAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkbmV4dC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgIH1cblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENhcm91c2VsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuICAgICAgdmFyIGFjdGlvbiAgPSB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnID8gb3B0aW9uIDogb3B0aW9ucy5zbGlkZVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJywgKGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ251bWJlcicpIGRhdGEudG8ob3B0aW9uKVxuICAgICAgZWxzZSBpZiAoYWN0aW9uKSBkYXRhW2FjdGlvbl0oKVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5pbnRlcnZhbCkgZGF0YS5wYXVzZSgpLmN5Y2xlKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY2Fyb3VzZWxcblxuICAkLmZuLmNhcm91c2VsICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3IgPSBDYXJvdXNlbFxuXG5cbiAgLy8gQ0FST1VTRUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNhcm91c2VsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGhyZWZcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICB2YXIgJHRhcmdldCA9ICQoJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fCAoaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vIHN0cmlwIGZvciBpZTdcbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2Nhcm91c2VsJykpIHJldHVyblxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG4gICAgdmFyIHNsaWRlSW5kZXggPSAkdGhpcy5hdHRyKCdkYXRhLXNsaWRlLXRvJylcbiAgICBpZiAoc2xpZGVJbmRleCkgb3B0aW9ucy5pbnRlcnZhbCA9IGZhbHNlXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb25zKVxuXG4gICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgICR0YXJnZXQuZGF0YSgnYnMuY2Fyb3VzZWwnKS50byhzbGlkZUluZGV4KVxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlLXRvXScsIGNsaWNrSGFuZGxlcilcblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGNhcm91c2VsID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJGNhcm91c2VsLCAkY2Fyb3VzZWwuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNvbGxhcHNlLmpzIHYzLjMuN1xuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jY29sbGFwc2VcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNiBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIGpzaGludCBsYXRlZGVmOiBmYWxzZSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENPTExBUFNFIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENvbGxhcHNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuJHRyaWdnZXIgICAgICA9ICQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXScpXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gbnVsbFxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYXJlbnQpIHtcbiAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCwgdGhpcy4kdHJpZ2dlcilcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkgdGhpcy50b2dnbGUoKVxuICB9XG5cbiAgQ29sbGFwc2UuVkVSU0lPTiAgPSAnMy4zLjcnXG5cbiAgQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTiA9IDM1MFxuXG4gIENvbGxhcHNlLkRFRkFVTFRTID0ge1xuICAgIHRvZ2dsZTogdHJ1ZVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmRpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzV2lkdGggPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd3aWR0aCcpXG4gICAgcmV0dXJuIGhhc1dpZHRoID8gJ3dpZHRoJyA6ICdoZWlnaHQnXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIGFjdGl2ZXNEYXRhXG4gICAgdmFyIGFjdGl2ZXMgPSB0aGlzLiRwYXJlbnQgJiYgdGhpcy4kcGFyZW50LmNoaWxkcmVuKCcucGFuZWwnKS5jaGlsZHJlbignLmluLCAuY29sbGFwc2luZycpXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgYWN0aXZlc0RhdGEgPSBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIGlmIChhY3RpdmVzRGF0YSAmJiBhY3RpdmVzRGF0YS50cmFuc2l0aW9uaW5nKSByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBQbHVnaW4uY2FsbChhY3RpdmVzLCAnaGlkZScpXG4gICAgICBhY3RpdmVzRGF0YSB8fCBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJywgbnVsbClcbiAgICB9XG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVtkaW1lbnNpb25dKDApXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UgaW4nKVtkaW1lbnNpb25dKCcnKVxuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAudHJpZ2dlcignc2hvd24uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB2YXIgc2Nyb2xsU2l6ZSA9ICQuY2FtZWxDYXNlKFsnc2Nyb2xsJywgZGltZW5zaW9uXS5qb2luKCctJykpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbMF1bc2Nyb2xsU2l6ZV0pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8ICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0oKSlbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZSBpbicpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICBbZGltZW5zaW9uXSgwKVxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1t0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpID8gJ2hpZGUnIDogJ3Nob3cnXSgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkKHRoaXMub3B0aW9ucy5wYXJlbnQpXG4gICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInICsgdGhpcy5vcHRpb25zLnBhcmVudCArICdcIl0nKVxuICAgICAgLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGdldFRhcmdldEZyb21UcmlnZ2VyKCRlbGVtZW50KSwgJGVsZW1lbnQpXG4gICAgICB9LCB0aGlzKSlcbiAgICAgIC5lbmQoKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJHRyaWdnZXIpIHtcbiAgICB2YXIgaXNPcGVuID0gJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJylcblxuICAgICRlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gICAgJHRyaWdnZXJcbiAgICAgIC50b2dnbGVDbGFzcygnY29sbGFwc2VkJywgIWlzT3BlbilcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRyaWdnZXIpIHtcbiAgICB2YXIgaHJlZlxuICAgIHZhciB0YXJnZXQgPSAkdHJpZ2dlci5hdHRyKCdkYXRhLXRhcmdldCcpXG4gICAgICB8fCAoaHJlZiA9ICR0cmlnZ2VyLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgcmV0dXJuICQodGFyZ2V0KVxuICB9XG5cblxuICAvLyBDT0xMQVBTRSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhICYmIG9wdGlvbnMudG9nZ2xlICYmIC9zaG93fGhpZGUvLnRlc3Qob3B0aW9uKSkgb3B0aW9ucy50b2dnbGUgPSBmYWxzZVxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScsIChkYXRhID0gbmV3IENvbGxhcHNlKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jb2xsYXBzZVxuXG4gICQuZm4uY29sbGFwc2UgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jb2xsYXBzZS5Db25zdHJ1Y3RvciA9IENvbGxhcHNlXG5cblxuICAvLyBDT0xMQVBTRSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY29sbGFwc2Uubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNvbGxhcHNlID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuY29sbGFwc2UuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuXG4gICAgaWYgKCEkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIHZhciAkdGFyZ2V0ID0gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRoaXMpXG4gICAgdmFyIGRhdGEgICAgPSAkdGFyZ2V0LmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICB2YXIgb3B0aW9uICA9IGRhdGEgPyAndG9nZ2xlJyA6ICR0aGlzLmRhdGEoKVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBkcm9wZG93bi5qcyB2My4zLjdcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI2Ryb3Bkb3duc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE2IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIERST1BET1dOIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBiYWNrZHJvcCA9ICcuZHJvcGRvd24tYmFja2Ryb3AnXG4gIHZhciB0b2dnbGUgICA9ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXSdcbiAgdmFyIERyb3Bkb3duID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAkKGVsZW1lbnQpLm9uKCdjbGljay5icy5kcm9wZG93bicsIHRoaXMudG9nZ2xlKVxuICB9XG5cbiAgRHJvcGRvd24uVkVSU0lPTiA9ICczLjMuNydcblxuICBmdW5jdGlvbiBnZXRQYXJlbnQoJHRoaXMpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiAvI1tBLVphLXpdLy50ZXN0KHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciAkcGFyZW50ID0gc2VsZWN0b3IgJiYgJChzZWxlY3RvcilcblxuICAgIHJldHVybiAkcGFyZW50ICYmICRwYXJlbnQubGVuZ3RoID8gJHBhcmVudCA6ICR0aGlzLnBhcmVudCgpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhck1lbnVzKGUpIHtcbiAgICBpZiAoZSAmJiBlLndoaWNoID09PSAzKSByZXR1cm5cbiAgICAkKGJhY2tkcm9wKS5yZW1vdmUoKVxuICAgICQodG9nZ2xlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgICAgICAgID0gJCh0aGlzKVxuICAgICAgdmFyICRwYXJlbnQgICAgICAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG5cbiAgICAgIGlmICghJHBhcmVudC5oYXNDbGFzcygnb3BlbicpKSByZXR1cm5cblxuICAgICAgaWYgKGUgJiYgZS50eXBlID09ICdjbGljaycgJiYgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSAmJiAkLmNvbnRhaW5zKCRwYXJlbnRbMF0sIGUudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnaGlkZS5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICAgICAgJHBhcmVudC5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJC5FdmVudCgnaGlkZGVuLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfSlcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBjbGVhck1lbnVzKClcblxuICAgIGlmICghaXNBY3RpdmUpIHtcbiAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgISRwYXJlbnQuY2xvc2VzdCgnLm5hdmJhci1uYXYnKS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgbW9iaWxlIHdlIHVzZSBhIGJhY2tkcm9wIGJlY2F1c2UgY2xpY2sgZXZlbnRzIGRvbid0IGRlbGVnYXRlXG4gICAgICAgICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1iYWNrZHJvcCcpXG4gICAgICAgICAgLmluc2VydEFmdGVyKCQodGhpcykpXG4gICAgICAgICAgLm9uKCdjbGljaycsIGNsZWFyTWVudXMpXG4gICAgICB9XG5cbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnc2hvdy5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzXG4gICAgICAgIC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKVxuXG4gICAgICAkcGFyZW50XG4gICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpXG4gICAgICAgIC50cmlnZ2VyKCQuRXZlbnQoJ3Nob3duLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCEvKDM4fDQwfDI3fDMyKS8udGVzdChlLndoaWNoKSB8fCAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cblxuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBpZiAoIWlzQWN0aXZlICYmIGUud2hpY2ggIT0gMjcgfHwgaXNBY3RpdmUgJiYgZS53aGljaCA9PSAyNykge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMjcpICRwYXJlbnQuZmluZCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIHJldHVybiAkdGhpcy50cmlnZ2VyKCdjbGljaycpXG4gICAgfVxuXG4gICAgdmFyIGRlc2MgPSAnIGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYSdcbiAgICB2YXIgJGl0ZW1zID0gJHBhcmVudC5maW5kKCcuZHJvcGRvd24tbWVudScgKyBkZXNjKVxuXG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSByZXR1cm5cblxuICAgIHZhciBpbmRleCA9ICRpdGVtcy5pbmRleChlLnRhcmdldClcblxuICAgIGlmIChlLndoaWNoID09IDM4ICYmIGluZGV4ID4gMCkgICAgICAgICAgICAgICAgIGluZGV4LS0gICAgICAgICAvLyB1cFxuICAgIGlmIChlLndoaWNoID09IDQwICYmIGluZGV4IDwgJGl0ZW1zLmxlbmd0aCAtIDEpIGluZGV4KysgICAgICAgICAvLyBkb3duXG4gICAgaWYgKCF+aW5kZXgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwXG5cbiAgICAkaXRlbXMuZXEoaW5kZXgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgfVxuXG5cbiAgLy8gRFJPUERPV04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nLCAoZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmRyb3Bkb3duXG5cbiAgJC5mbi5kcm9wZG93biAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yID0gRHJvcGRvd25cblxuXG4gIC8vIERST1BET1dOIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5kcm9wZG93bi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uZHJvcGRvd24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBUFBMWSBUTyBTVEFOREFSRCBEUk9QRE9XTiBFTEVNRU5UU1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIGNsZWFyTWVudXMpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24gZm9ybScsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCkgfSlcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93bi1tZW51JywgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IG1vZGFsLmpzIHYzLjMuN1xuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jbW9kYWxzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTYgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gTU9EQUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIE1vZGFsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgICAgICAgPSBvcHRpb25zXG4gICAgdGhpcy4kYm9keSAgICAgICAgICAgICAgID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJGVsZW1lbnQgICAgICAgICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRkaWFsb2cgICAgICAgICAgICAgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5tb2RhbC1kaWFsb2cnKVxuICAgIHRoaXMuJGJhY2tkcm9wICAgICAgICAgICA9IG51bGxcbiAgICB0aGlzLmlzU2hvd24gICAgICAgICAgICAgPSBudWxsXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgICAgID0gbnVsbFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggICAgICA9IDBcbiAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdGUpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLmZpbmQoJy5tb2RhbC1jb250ZW50JylcbiAgICAgICAgLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdsb2FkZWQuYnMubW9kYWwnKVxuICAgICAgICB9LCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5WRVJTSU9OICA9ICczLjMuNydcblxuICBNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMzAwXG4gIE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBNb2RhbC5ERUZBVUxUUyA9IHtcbiAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICBzaG93OiB0cnVlXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgZSAgICA9ICQuRXZlbnQoJ3Nob3cuYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICh0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSB0cnVlXG5cbiAgICB0aGlzLmNoZWNrU2Nyb2xsYmFyKClcbiAgICB0aGlzLnNldFNjcm9sbGJhcigpXG4gICAgdGhpcy4kYm9keS5hZGRDbGFzcygnbW9kYWwtb3BlbicpXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICdbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLCAkLnByb3h5KHRoaXMuaGlkZSwgdGhpcykpXG5cbiAgICB0aGlzLiRkaWFsb2cub24oJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vbmUoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGF0LiRlbGVtZW50KSkgdGhhdC5pZ25vcmVCYWNrZHJvcENsaWNrID0gdHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdHJhbnNpdGlvbiA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoYXQuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICBpZiAoIXRoYXQuJGVsZW1lbnQucGFyZW50KCkubGVuZ3RoKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnQuYXBwZW5kVG8odGhhdC4kYm9keSkgLy8gZG9uJ3QgbW92ZSBtb2RhbHMgZG9tIHBvc2l0aW9uXG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgLnNob3coKVxuICAgICAgICAuc2Nyb2xsVG9wKDApXG5cbiAgICAgIHRoYXQuYWRqdXN0RGlhbG9nKClcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICB0aGF0LmVuZm9yY2VGb2N1cygpXG5cbiAgICAgIHZhciBlID0gJC5FdmVudCgnc2hvd24uYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICAgIHRyYW5zaXRpb24gP1xuICAgICAgICB0aGF0LiRkaWFsb2cgLy8gd2FpdCBmb3IgbW9kYWwgdG8gc2xpZGUgaW5cbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGUgPSAkLkV2ZW50KCdoaWRlLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKCF0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSBmYWxzZVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgICQoZG9jdW1lbnQpLm9mZignZm9jdXNpbi5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAucmVtb3ZlQ2xhc3MoJ2luJylcbiAgICAgIC5vZmYoJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnKVxuICAgICAgLm9mZignbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGRpYWxvZy5vZmYoJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkodGhpcy5oaWRlTW9kYWwsIHRoaXMpKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgdGhpcy5oaWRlTW9kYWwoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVuZm9yY2VGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KVxuICAgICAgLm9mZignZm9jdXNpbi5icy5tb2RhbCcpIC8vIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgZm9jdXMgbG9vcFxuICAgICAgLm9uKCdmb2N1c2luLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQgIT09IGUudGFyZ2V0ICYmXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50WzBdICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgICAgIXRoaXMuJGVsZW1lbnQuaGFzKGUudGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcykpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZXNjYXBlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmtleWJvYXJkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUud2hpY2ggPT0gMjcgJiYgdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93bikge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duKSB7XG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5icy5tb2RhbCcsICQucHJveHkodGhpcy5oYW5kbGVVcGRhdGUsIHRoaXMpKVxuICAgIH0gZWxzZSB7XG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdGhpcy4kZWxlbWVudC5oaWRlKClcbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGJvZHkucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKVxuICAgICAgdGhhdC5yZXNldEFkanVzdG1lbnRzKClcbiAgICAgIHRoYXQucmVzZXRTY3JvbGxiYXIoKVxuICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRkZW4uYnMubW9kYWwnKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVtb3ZlQmFja2Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYmFja2Ryb3AgJiYgdGhpcy4kYmFja2Ryb3AucmVtb3ZlKClcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5iYWNrZHJvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBhbmltYXRlID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID8gJ2ZhZGUnIDogJydcblxuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmJhY2tkcm9wKSB7XG4gICAgICB2YXIgZG9BbmltYXRlID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgYW5pbWF0ZVxuXG4gICAgICB0aGlzLiRiYWNrZHJvcCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgIC5hZGRDbGFzcygnbW9kYWwtYmFja2Ryb3AgJyArIGFuaW1hdGUpXG4gICAgICAgIC5hcHBlbmRUbyh0aGlzLiRib2R5KVxuXG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrKSB7XG4gICAgICAgICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkgcmV0dXJuXG4gICAgICAgIHRoaXMub3B0aW9ucy5iYWNrZHJvcCA9PSAnc3RhdGljJ1xuICAgICAgICAgID8gdGhpcy4kZWxlbWVudFswXS5mb2N1cygpXG4gICAgICAgICAgOiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG5cbiAgICAgIGlmIChkb0FuaW1hdGUpIHRoaXMuJGJhY2tkcm9wWzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuXG4gICAgICB0aGlzLiRiYWNrZHJvcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm5cblxuICAgICAgZG9BbmltYXRlID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFjaylcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFjaygpXG5cbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24gJiYgdGhpcy4kYmFja2Ryb3ApIHtcbiAgICAgIHRoaXMuJGJhY2tkcm9wLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAgIHZhciBjYWxsYmFja1JlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2tSZW1vdmUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2tSZW1vdmUoKVxuXG4gICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoZXNlIGZvbGxvd2luZyBtZXRob2RzIGFyZSB1c2VkIHRvIGhhbmRsZSBvdmVyZmxvd2luZyBtb2RhbHNcblxuICBNb2RhbC5wcm90b3R5cGUuaGFuZGxlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWRqdXN0RGlhbG9nKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5hZGp1c3REaWFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGFsSXNPdmVyZmxvd2luZyA9IHRoaXMuJGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICAhdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiBtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6IHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgIW1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRBZGp1c3RtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnVsbFdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkgeyAvLyB3b3JrYXJvdW5kIGZvciBtaXNzaW5nIHdpbmRvdy5pbm5lcldpZHRoIGluIElFOFxuICAgICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGZ1bGxXaW5kb3dXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpXG4gICAgfVxuICAgIHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpbmRvd1dpZHRoXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMubWVhc3VyZVNjcm9sbGJhcigpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBib2R5UGFkID0gcGFyc2VJbnQoKHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCksIDEwKVxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgJydcbiAgICBpZiAodGhpcy5ib2R5SXNPdmVyZmxvd2luZykgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCBib2R5UGFkICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIHRoaXMub3JpZ2luYWxCb2R5UGFkKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLm1lYXN1cmVTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7IC8vIHRoeCB3YWxzaFxuICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSAnbW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmUnXG4gICAgdGhpcy4kYm9keS5hcHBlbmQoc2Nyb2xsRGl2KVxuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aFxuICAgIHRoaXMuJGJvZHlbMF0ucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KVxuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aFxuICB9XG5cblxuICAvLyBNT0RBTCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24sIF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMubW9kYWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTW9kYWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMubW9kYWwnLCAoZGF0YSA9IG5ldyBNb2RhbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKF9yZWxhdGVkVGFyZ2V0KVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5zaG93KSBkYXRhLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLm1vZGFsXG5cbiAgJC5mbi5tb2RhbCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLm1vZGFsLkNvbnN0cnVjdG9yID0gTW9kYWxcblxuXG4gIC8vIE1PREFMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5tb2RhbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ubW9kYWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBNT0RBTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5tb2RhbC5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgICAgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICB2YXIgJHRhcmdldCA9ICQoJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fCAoaHJlZiAmJiBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSkpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB2YXIgb3B0aW9uICA9ICR0YXJnZXQuZGF0YSgnYnMubW9kYWwnKSA/ICd0b2dnbGUnIDogJC5leHRlbmQoeyByZW1vdGU6ICEvIy8udGVzdChocmVmKSAmJiBocmVmIH0sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG5cbiAgICBpZiAoJHRoaXMuaXMoJ2EnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAkdGFyZ2V0Lm9uZSgnc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uIChzaG93RXZlbnQpIHtcbiAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVybiAvLyBvbmx5IHJlZ2lzdGVyIGZvY3VzIHJlc3RvcmVyIGlmIG1vZGFsIHdpbGwgYWN0dWFsbHkgZ2V0IHNob3duXG4gICAgICAkdGFyZ2V0Lm9uZSgnaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkdGhpcy5pcygnOnZpc2libGUnKSAmJiAkdGhpcy50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9KVxuICAgIH0pXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uLCB0aGlzKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0b29sdGlwLmpzIHYzLjMuN1xuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jdG9vbHRpcFxuICogSW5zcGlyZWQgYnkgdGhlIG9yaWdpbmFsIGpRdWVyeS50aXBzeSBieSBKYXNvbiBGcmFtZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE2IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFRPT0xUSVAgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUb29sdGlwID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnR5cGUgICAgICAgPSBudWxsXG4gICAgdGhpcy5vcHRpb25zICAgID0gbnVsbFxuICAgIHRoaXMuZW5hYmxlZCAgICA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgICAgPSBudWxsXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuICAgIHRoaXMuJGVsZW1lbnQgICA9IG51bGxcbiAgICB0aGlzLmluU3RhdGUgICAgPSBudWxsXG5cbiAgICB0aGlzLmluaXQoJ3Rvb2x0aXAnLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgVG9vbHRpcC5WRVJTSU9OICA9ICczLjMuNydcblxuICBUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUb29sdGlwLkRFRkFVTFRTID0ge1xuICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgIHNlbGVjdG9yOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcbiAgICB0cmlnZ2VyOiAnaG92ZXIgZm9jdXMnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBkZWxheTogMCxcbiAgICBodG1sOiBmYWxzZSxcbiAgICBjb250YWluZXI6IGZhbHNlLFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICBzZWxlY3RvcjogJ2JvZHknLFxuICAgICAgcGFkZGluZzogMFxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZW5hYmxlZCAgID0gdHJ1ZVxuICAgIHRoaXMudHlwZSAgICAgID0gdHlwZVxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpXG4gICAgdGhpcy4kdmlld3BvcnQgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgJCgkLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KSA/IHRoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsIHRoaXMuJGVsZW1lbnQpIDogKHRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMudmlld3BvcnQpKVxuICAgIHRoaXMuaW5TdGF0ZSAgID0geyBjbGljazogZmFsc2UsIGhvdmVyOiBmYWxzZSwgZm9jdXM6IGZhbHNlIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdIGluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3IgJiYgIXRoaXMub3B0aW9ucy5zZWxlY3Rvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyAnICsgdGhpcy50eXBlICsgJyBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCEnKVxuICAgIH1cblxuICAgIHZhciB0cmlnZ2VycyA9IHRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KCcgJylcblxuICAgIGZvciAodmFyIGkgPSB0cmlnZ2Vycy5sZW5ndGg7IGktLTspIHtcbiAgICAgIHZhciB0cmlnZ2VyID0gdHJpZ2dlcnNbaV1cblxuICAgICAgaWYgKHRyaWdnZXIgPT0gJ2NsaWNrJykge1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxuICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9ICdtYW51YWwnKSB7XG4gICAgICAgIHZhciBldmVudEluICA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWVudGVyJyA6ICdmb2N1c2luJ1xuICAgICAgICB2YXIgZXZlbnRPdXQgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VsZWF2ZScgOiAnZm9jdXNvdXQnXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudEluICArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMuZW50ZXIsIHRoaXMpKVxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50T3V0ICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5sZWF2ZSwgdGhpcykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zLnNlbGVjdG9yID9cbiAgICAgICh0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgeyB0cmlnZ2VyOiAnbWFudWFsJywgc2VsZWN0b3I6ICcnIH0pKSA6XG4gICAgICB0aGlzLmZpeFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBUb29sdGlwLkRFRkFVTFRTXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAmJiB0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheSxcbiAgICAgICAgaGlkZTogb3B0aW9ucy5kZWxheVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgID0ge31cbiAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRzKClcblxuICAgIHRoaXMuX29wdGlvbnMgJiYgJC5lYWNoKHRoaXMuX29wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoZGVmYXVsdHNba2V5XSAhPSB2YWx1ZSkgb3B0aW9uc1trZXldID0gdmFsdWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVudGVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3VzaW4nID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpIHx8IHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSB7XG4gICAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5zaG93KSByZXR1cm4gc2VsZi5zaG93KClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSBzZWxmLnNob3coKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5pblN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5pblN0YXRlW2tleV0pIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5sZWF2ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c291dCcgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgcmV0dXJuXG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ291dCdcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ291dCcpIHNlbGYuaGlkZSgpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKHRoaXMuaGFzQ29udGVudCgpICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIHZhciBpbkRvbSA9ICQuY29udGFpbnModGhpcy4kZWxlbWVudFswXS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgdGhpcy4kZWxlbWVudFswXSlcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8ICFpbkRvbSkgcmV0dXJuXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgICAgdmFyICR0aXAgPSB0aGlzLnRpcCgpXG5cbiAgICAgIHZhciB0aXBJZCA9IHRoaXMuZ2V0VUlEKHRoaXMudHlwZSlcblxuICAgICAgdGhpcy5zZXRDb250ZW50KClcbiAgICAgICR0aXAuYXR0cignaWQnLCB0aXBJZClcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1kZXNjcmliZWRieScsIHRpcElkKVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgJHRpcC5hZGRDbGFzcygnZmFkZScpXG5cbiAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudC5jYWxsKHRoaXMsICR0aXBbMF0sIHRoaXMuJGVsZW1lbnRbMF0pIDpcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudFxuXG4gICAgICB2YXIgYXV0b1Rva2VuID0gL1xccz9hdXRvP1xccz8vaVxuICAgICAgdmFyIGF1dG9QbGFjZSA9IGF1dG9Ub2tlbi50ZXN0KHBsYWNlbWVudClcbiAgICAgIGlmIChhdXRvUGxhY2UpIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKGF1dG9Ub2tlbiwgJycpIHx8ICd0b3AnXG5cbiAgICAgICR0aXBcbiAgICAgICAgLmRldGFjaCgpXG4gICAgICAgIC5jc3MoeyB0b3A6IDAsIGxlZnQ6IDAsIGRpc3BsYXk6ICdibG9jaycgfSlcbiAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgICAgLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHRoaXMpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIgPyAkdGlwLmFwcGVuZFRvKHRoaXMub3B0aW9ucy5jb250YWluZXIpIDogJHRpcC5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdpbnNlcnRlZC5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgICB2YXIgcG9zICAgICAgICAgID0gdGhpcy5nZXRQb3NpdGlvbigpXG4gICAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgdmFyIG9yZ1BsYWNlbWVudCA9IHBsYWNlbWVudFxuICAgICAgICB2YXIgdmlld3BvcnREaW0gPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudCA9PSAnYm90dG9tJyAmJiBwb3MuYm90dG9tICsgYWN0dWFsSGVpZ2h0ID4gdmlld3BvcnREaW0uYm90dG9tID8gJ3RvcCcgICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgJiYgcG9zLnRvcCAgICAtIGFjdHVhbEhlaWdodCA8IHZpZXdwb3J0RGltLnRvcCAgICA/ICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgICYmIHBvcy5yaWdodCAgKyBhY3R1YWxXaWR0aCAgPiB2aWV3cG9ydERpbS53aWR0aCAgPyAnbGVmdCcgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICAmJiBwb3MubGVmdCAgIC0gYWN0dWFsV2lkdGggIDwgdmlld3BvcnREaW0ubGVmdCAgID8gJ3JpZ2h0JyAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRcblxuICAgICAgICAkdGlwXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKG9yZ1BsYWNlbWVudClcbiAgICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgfVxuXG4gICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgICAgdGhpcy5hcHBseVBsYWNlbWVudChjYWxjdWxhdGVkT2Zmc2V0LCBwbGFjZW1lbnQpXG5cbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gdGhhdC5ob3ZlclN0YXRlXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignc2hvd24uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgICAgdGhhdC5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PSAnb3V0JykgdGhhdC5sZWF2ZSh0aGF0KVxuICAgICAgfVxuXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgICR0aXBcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXQsIHBsYWNlbWVudCkge1xuICAgIHZhciAkdGlwICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgaGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIC8vIG1hbnVhbGx5IHJlYWQgbWFyZ2lucyBiZWNhdXNlIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpbmNsdWRlcyBkaWZmZXJlbmNlXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tdG9wJyksIDEwKVxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKVxuXG4gICAgLy8gd2UgbXVzdCBjaGVjayBmb3IgTmFOIGZvciBpZSA4LzlcbiAgICBpZiAoaXNOYU4obWFyZ2luVG9wKSkgIG1hcmdpblRvcCAgPSAwXG4gICAgaWYgKGlzTmFOKG1hcmdpbkxlZnQpKSBtYXJnaW5MZWZ0ID0gMFxuXG4gICAgb2Zmc2V0LnRvcCAgKz0gbWFyZ2luVG9wXG4gICAgb2Zmc2V0LmxlZnQgKz0gbWFyZ2luTGVmdFxuXG4gICAgLy8gJC5mbi5vZmZzZXQgZG9lc24ndCByb3VuZCBwaXhlbCB2YWx1ZXNcbiAgICAvLyBzbyB3ZSB1c2Ugc2V0T2Zmc2V0IGRpcmVjdGx5IHdpdGggb3VyIG93biBmdW5jdGlvbiBCLTBcbiAgICAkLm9mZnNldC5zZXRPZmZzZXQoJHRpcFswXSwgJC5leHRlbmQoe1xuICAgICAgdXNpbmc6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAkdGlwLmNzcyh7XG4gICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHByb3BzLnRvcCksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChwcm9wcy5sZWZ0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIG9mZnNldCksIDApXG5cbiAgICAkdGlwLmFkZENsYXNzKCdpbicpXG5cbiAgICAvLyBjaGVjayB0byBzZWUgaWYgcGxhY2luZyB0aXAgaW4gbmV3IG9mZnNldCBjYXVzZWQgdGhlIHRpcCB0byByZXNpemUgaXRzZWxmXG4gICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIGlmIChwbGFjZW1lbnQgPT0gJ3RvcCcgJiYgYWN0dWFsSGVpZ2h0ICE9IGhlaWdodCkge1xuICAgICAgb2Zmc2V0LnRvcCA9IG9mZnNldC50b3AgKyBoZWlnaHQgLSBhY3R1YWxIZWlnaHRcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB0aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShwbGFjZW1lbnQsIG9mZnNldCwgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgIGlmIChkZWx0YS5sZWZ0KSBvZmZzZXQubGVmdCArPSBkZWx0YS5sZWZ0XG4gICAgZWxzZSBvZmZzZXQudG9wICs9IGRlbHRhLnRvcFxuXG4gICAgdmFyIGlzVmVydGljYWwgICAgICAgICAgPSAvdG9wfGJvdHRvbS8udGVzdChwbGFjZW1lbnQpXG4gICAgdmFyIGFycm93RGVsdGEgICAgICAgICAgPSBpc1ZlcnRpY2FsID8gZGVsdGEubGVmdCAqIDIgLSB3aWR0aCArIGFjdHVhbFdpZHRoIDogZGVsdGEudG9wICogMiAtIGhlaWdodCArIGFjdHVhbEhlaWdodFxuICAgIHZhciBhcnJvd09mZnNldFBvc2l0aW9uID0gaXNWZXJ0aWNhbCA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J1xuXG4gICAgJHRpcC5vZmZzZXQob2Zmc2V0KVxuICAgIHRoaXMucmVwbGFjZUFycm93KGFycm93RGVsdGEsICR0aXBbMF1bYXJyb3dPZmZzZXRQb3NpdGlvbl0sIGlzVmVydGljYWwpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5yZXBsYWNlQXJyb3cgPSBmdW5jdGlvbiAoZGVsdGEsIGRpbWVuc2lvbiwgaXNWZXJ0aWNhbCkge1xuICAgIHRoaXMuYXJyb3coKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcsIDUwICogKDEgLSBkZWx0YSAvIGRpbWVuc2lvbikgKyAnJScpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JywgJycpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcblxuICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKVt0aGlzLm9wdGlvbnMuaHRtbCA/ICdodG1sJyA6ICd0ZXh0J10odGl0bGUpXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHQnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciAkdGlwID0gJCh0aGlzLiR0aXApXG4gICAgdmFyIGUgICAgPSAkLkV2ZW50KCdoaWRlLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgIGlmICh0aGF0LmhvdmVyU3RhdGUgIT0gJ2luJykgJHRpcC5kZXRhY2goKVxuICAgICAgaWYgKHRoYXQuJGVsZW1lbnQpIHsgLy8gVE9ETzogQ2hlY2sgd2hldGhlciBndWFyZGluZyB0aGlzIGNvZGUgd2l0aCB0aGlzIGBpZmAgaXMgcmVhbGx5IG5lY2Vzc2FyeS5cbiAgICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JylcbiAgICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICB9XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHRpcFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgY29tcGxldGUoKVxuXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmZpeFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICBpZiAoJGUuYXR0cigndGl0bGUnKSB8fCB0eXBlb2YgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpICE9ICdzdHJpbmcnKSB7XG4gICAgICAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgJGUuYXR0cigndGl0bGUnKSB8fCAnJykuYXR0cigndGl0bGUnLCAnJylcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgJGVsZW1lbnQgICA9ICRlbGVtZW50IHx8IHRoaXMuJGVsZW1lbnRcblxuICAgIHZhciBlbCAgICAgPSAkZWxlbWVudFswXVxuICAgIHZhciBpc0JvZHkgPSBlbC50YWdOYW1lID09ICdCT0RZJ1xuXG4gICAgdmFyIGVsUmVjdCAgICA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKGVsUmVjdC53aWR0aCA9PSBudWxsKSB7XG4gICAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBtaXNzaW5nIGluIElFOCwgc28gY29tcHV0ZSB0aGVtIG1hbnVhbGx5OyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8xNDA5M1xuICAgICAgZWxSZWN0ID0gJC5leHRlbmQoe30sIGVsUmVjdCwgeyB3aWR0aDogZWxSZWN0LnJpZ2h0IC0gZWxSZWN0LmxlZnQsIGhlaWdodDogZWxSZWN0LmJvdHRvbSAtIGVsUmVjdC50b3AgfSlcbiAgICB9XG4gICAgdmFyIGlzU3ZnID0gd2luZG93LlNWR0VsZW1lbnQgJiYgZWwgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudFxuICAgIC8vIEF2b2lkIHVzaW5nICQub2Zmc2V0KCkgb24gU1ZHcyBzaW5jZSBpdCBnaXZlcyBpbmNvcnJlY3QgcmVzdWx0cyBpbiBqUXVlcnkgMy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8yMDI4MFxuICAgIHZhciBlbE9mZnNldCAgPSBpc0JvZHkgPyB7IHRvcDogMCwgbGVmdDogMCB9IDogKGlzU3ZnID8gbnVsbCA6ICRlbGVtZW50Lm9mZnNldCgpKVxuICAgIHZhciBzY3JvbGwgICAgPSB7IHNjcm9sbDogaXNCb2R5ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA6ICRlbGVtZW50LnNjcm9sbFRvcCgpIH1cbiAgICB2YXIgb3V0ZXJEaW1zID0gaXNCb2R5ID8geyB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpIH0gOiBudWxsXG5cbiAgICByZXR1cm4gJC5leHRlbmQoe30sIGVsUmVjdCwgc2Nyb2xsLCBvdXRlckRpbXMsIGVsT2Zmc2V0KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRlZE9mZnNldCA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHJldHVybiBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQsICAgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgPyB7IHRvcDogcG9zLnRvcCAtIGFjdHVhbEhlaWdodCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgLSBhY3R1YWxXaWR0aCB9IDpcbiAgICAgICAgLyogcGxhY2VtZW50ID09ICdyaWdodCcgKi8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIH1cblxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgdmFyIGRlbHRhID0geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICAgIGlmICghdGhpcy4kdmlld3BvcnQpIHJldHVybiBkZWx0YVxuXG4gICAgdmFyIHZpZXdwb3J0UGFkZGluZyA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiB0aGlzLm9wdGlvbnMudmlld3BvcnQucGFkZGluZyB8fCAwXG4gICAgdmFyIHZpZXdwb3J0RGltZW5zaW9ucyA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICBpZiAoL3JpZ2h0fGxlZnQvLnRlc3QocGxhY2VtZW50KSkge1xuICAgICAgdmFyIHRvcEVkZ2VPZmZzZXQgICAgPSBwb3MudG9wIC0gdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbFxuICAgICAgdmFyIGJvdHRvbUVkZ2VPZmZzZXQgPSBwb3MudG9wICsgdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbCArIGFjdHVhbEhlaWdodFxuICAgICAgaWYgKHRvcEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMudG9wKSB7IC8vIHRvcCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wIC0gdG9wRWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChib3R0b21FZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQpIHsgLy8gYm90dG9tIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0IC0gYm90dG9tRWRnZU9mZnNldFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGVmdEVkZ2VPZmZzZXQgID0gcG9zLmxlZnQgLSB2aWV3cG9ydFBhZGRpbmdcbiAgICAgIHZhciByaWdodEVkZ2VPZmZzZXQgPSBwb3MubGVmdCArIHZpZXdwb3J0UGFkZGluZyArIGFjdHVhbFdpZHRoXG4gICAgICBpZiAobGVmdEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCkgeyAvLyBsZWZ0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCAtIGxlZnRFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0RWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy5yaWdodCkgeyAvLyByaWdodCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgKyB2aWV3cG9ydERpbWVuc2lvbnMud2lkdGggLSByaWdodEVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVsdGFcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZVxuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHRpdGxlID0gJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpXG4gICAgICB8fCAodHlwZW9mIG8udGl0bGUgPT0gJ2Z1bmN0aW9uJyA/IG8udGl0bGUuY2FsbCgkZVswXSkgOiAgby50aXRsZSlcblxuICAgIHJldHVybiB0aXRsZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VUlEID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIGRvIHByZWZpeCArPSB+fihNYXRoLnJhbmRvbSgpICogMTAwMDAwMClcbiAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcbiAgICByZXR1cm4gcHJlZml4XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiR0aXApIHtcbiAgICAgIHRoaXMuJHRpcCA9ICQodGhpcy5vcHRpb25zLnRlbXBsYXRlKVxuICAgICAgaWYgKHRoaXMuJHRpcC5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlICsgJyBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IScpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiR0aXBcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy50b29sdGlwLWFycm93JykpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSAhdGhpcy5lbmFibGVkXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmIChlKSB7XG4gICAgICBzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG4gICAgICBpZiAoIXNlbGYpIHtcbiAgICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZS5jbGljayA9ICFzZWxmLmluU3RhdGUuY2xpY2tcbiAgICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgc2VsZi5lbnRlcihzZWxmKVxuICAgICAgZWxzZSBzZWxmLmxlYXZlKHNlbGYpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgPyBzZWxmLmxlYXZlKHNlbGYpIDogc2VsZi5lbnRlcihzZWxmKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICB0aGlzLmhpZGUoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vZmYoJy4nICsgdGhhdC50eXBlKS5yZW1vdmVEYXRhKCdicy4nICsgdGhhdC50eXBlKVxuICAgICAgaWYgKHRoYXQuJHRpcCkge1xuICAgICAgICB0aGF0LiR0aXAuZGV0YWNoKClcbiAgICAgIH1cbiAgICAgIHRoYXQuJHRpcCA9IG51bGxcbiAgICAgIHRoYXQuJGFycm93ID0gbnVsbFxuICAgICAgdGhhdC4kdmlld3BvcnQgPSBudWxsXG4gICAgICB0aGF0LiRlbGVtZW50ID0gbnVsbFxuICAgIH0pXG4gIH1cblxuXG4gIC8vIFRPT0xUSVAgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy50b29sdGlwJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnLCAoZGF0YSA9IG5ldyBUb29sdGlwKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50b29sdGlwXG5cbiAgJC5mbi50b29sdGlwICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udG9vbHRpcC5Db25zdHJ1Y3RvciA9IFRvb2x0aXBcblxuXG4gIC8vIFRPT0xUSVAgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4udG9vbHRpcC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udG9vbHRpcCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogcG9wb3Zlci5qcyB2My4zLjdcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI3BvcG92ZXJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTYgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gUE9QT1ZFUiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFBvcG92ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdCgncG9wb3ZlcicsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBpZiAoISQuZm4udG9vbHRpcCkgdGhyb3cgbmV3IEVycm9yKCdQb3BvdmVyIHJlcXVpcmVzIHRvb2x0aXAuanMnKVxuXG4gIFBvcG92ZXIuVkVSU0lPTiAgPSAnMy4zLjcnXG5cbiAgUG9wb3Zlci5ERUZBVUxUUyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IuREVGQVVMVFMsIHtcbiAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgdHJpZ2dlcjogJ2NsaWNrJyxcbiAgICBjb250ZW50OiAnJyxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J1xuICB9KVxuXG5cbiAgLy8gTk9URTogUE9QT1ZFUiBFWFRFTkRTIHRvb2x0aXAuanNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBQb3BvdmVyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IucHJvdG90eXBlKVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQb3BvdmVyLkRFRkFVTFRTXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSAgID0gdGhpcy5nZXRUaXRsZSgpXG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKVxuXG4gICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpW3RoaXMub3B0aW9ucy5odG1sID8gJ2h0bWwnIDogJ3RleHQnXSh0aXRsZSlcbiAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpWyAvLyB3ZSB1c2UgYXBwZW5kIGZvciBodG1sIG9iamVjdHMgdG8gbWFpbnRhaW4ganMgZXZlbnRzXG4gICAgICB0aGlzLm9wdGlvbnMuaHRtbCA/ICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyA/ICdodG1sJyA6ICdhcHBlbmQnKSA6ICd0ZXh0J1xuICAgIF0oY29udGVudClcblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0IGluJylcblxuICAgIC8vIElFOCBkb2Vzbid0IGFjY2VwdCBoaWRpbmcgdmlhIHRoZSBgOmVtcHR5YCBwc2V1ZG8gc2VsZWN0b3IsIHdlIGhhdmUgdG8gZG9cbiAgICAvLyB0aGlzIG1hbnVhbGx5IGJ5IGNoZWNraW5nIHRoZSBjb250ZW50cy5cbiAgICBpZiAoISR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKCkpICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5oaWRlKClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKSB8fCB0aGlzLmdldENvbnRlbnQoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICByZXR1cm4gJGUuYXR0cignZGF0YS1jb250ZW50JylcbiAgICAgIHx8ICh0eXBlb2Ygby5jb250ZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICAgICAgby5jb250ZW50LmNhbGwoJGVbMF0pIDpcbiAgICAgICAgICAgIG8uY29udGVudClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy5hcnJvdycpKVxuICB9XG5cblxuICAvLyBQT1BPVkVSIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMucG9wb3ZlcicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJywgKGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ucG9wb3ZlclxuXG4gICQuZm4ucG9wb3ZlciAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnBvcG92ZXIuQ29uc3RydWN0b3IgPSBQb3BvdmVyXG5cblxuICAvLyBQT1BPVkVSIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnBvcG92ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnBvcG92ZXIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHNjcm9sbHNweS5qcyB2My4zLjdcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI3Njcm9sbHNweVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE2IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFNDUk9MTFNQWSBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gU2Nyb2xsU3B5KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRib2R5ICAgICAgICAgID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQgPSAkKGVsZW1lbnQpLmlzKGRvY3VtZW50LmJvZHkpID8gJCh3aW5kb3cpIDogJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICAgPSAkLmV4dGVuZCh7fSwgU2Nyb2xsU3B5LkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuc2VsZWN0b3IgICAgICAgPSAodGhpcy5vcHRpb25zLnRhcmdldCB8fCAnJykgKyAnIC5uYXYgbGkgPiBhJ1xuICAgIHRoaXMub2Zmc2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ICAgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgICA9IDBcblxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQub24oJ3Njcm9sbC5icy5zY3JvbGxzcHknLCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgICB0aGlzLnByb2Nlc3MoKVxuICB9XG5cbiAgU2Nyb2xsU3B5LlZFUlNJT04gID0gJzMuMy43J1xuXG4gIFNjcm9sbFNweS5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDEwXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmdldFNjcm9sbEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHQgfHwgTWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgICAgICAgICAgPSB0aGlzXG4gICAgdmFyIG9mZnNldE1ldGhvZCAgPSAnb2Zmc2V0J1xuICAgIHZhciBvZmZzZXRCYXNlICAgID0gMFxuXG4gICAgdGhpcy5vZmZzZXRzICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgID0gW11cbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcblxuICAgIGlmICghJC5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKSkge1xuICAgICAgb2Zmc2V0TWV0aG9kID0gJ3Bvc2l0aW9uJ1xuICAgICAgb2Zmc2V0QmFzZSAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKVxuICAgIH1cblxuICAgIHRoaXMuJGJvZHlcbiAgICAgIC5maW5kKHRoaXMuc2VsZWN0b3IpXG4gICAgICAubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRlbCAgID0gJCh0aGlzKVxuICAgICAgICB2YXIgaHJlZiAgPSAkZWwuZGF0YSgndGFyZ2V0JykgfHwgJGVsLmF0dHIoJ2hyZWYnKVxuICAgICAgICB2YXIgJGhyZWYgPSAvXiMuLy50ZXN0KGhyZWYpICYmICQoaHJlZilcblxuICAgICAgICByZXR1cm4gKCRocmVmXG4gICAgICAgICAgJiYgJGhyZWYubGVuZ3RoXG4gICAgICAgICAgJiYgJGhyZWYuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICAmJiBbWyRocmVmW29mZnNldE1ldGhvZF0oKS50b3AgKyBvZmZzZXRCYXNlLCBocmVmXV0pIHx8IG51bGxcbiAgICAgIH0pXG4gICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF0gfSlcbiAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5vZmZzZXRzLnB1c2godGhpc1swXSlcbiAgICAgICAgdGhhdC50YXJnZXRzLnB1c2godGhpc1sxXSlcbiAgICAgIH0pXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkgKyB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcbiAgICB2YXIgbWF4U2Nyb2xsICAgID0gdGhpcy5vcHRpb25zLm9mZnNldCArIHNjcm9sbEhlaWdodCAtIHRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0cyAgICAgID0gdGhpcy5vZmZzZXRzXG4gICAgdmFyIHRhcmdldHMgICAgICA9IHRoaXMudGFyZ2V0c1xuICAgIHZhciBhY3RpdmVUYXJnZXQgPSB0aGlzLmFjdGl2ZVRhcmdldFxuICAgIHZhciBpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT0gc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH1cblxuICAgIGlmIChzY3JvbGxUb3AgPj0gbWF4U2Nyb2xsKSB7XG4gICAgICByZXR1cm4gYWN0aXZlVGFyZ2V0ICE9IChpID0gdGFyZ2V0c1t0YXJnZXRzLmxlbmd0aCAtIDFdKSAmJiB0aGlzLmFjdGl2YXRlKGkpXG4gICAgfVxuXG4gICAgaWYgKGFjdGl2ZVRhcmdldCAmJiBzY3JvbGxUb3AgPCBvZmZzZXRzWzBdKSB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IG51bGxcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKClcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBvZmZzZXRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgYWN0aXZlVGFyZ2V0ICE9IHRhcmdldHNbaV1cbiAgICAgICAgJiYgc2Nyb2xsVG9wID49IG9mZnNldHNbaV1cbiAgICAgICAgJiYgKG9mZnNldHNbaSArIDFdID09PSB1bmRlZmluZWQgfHwgc2Nyb2xsVG9wIDwgb2Zmc2V0c1tpICsgMV0pXG4gICAgICAgICYmIHRoaXMuYWN0aXZhdGUodGFyZ2V0c1tpXSlcbiAgICB9XG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICB0aGlzLmNsZWFyKClcblxuICAgIHZhciBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgK1xuICAgICAgJ1tkYXRhLXRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCJdLCcgK1xuICAgICAgdGhpcy5zZWxlY3RvciArICdbaHJlZj1cIicgKyB0YXJnZXQgKyAnXCJdJ1xuXG4gICAgdmFyIGFjdGl2ZSA9ICQoc2VsZWN0b3IpXG4gICAgICAucGFyZW50cygnbGknKVxuICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgaWYgKGFjdGl2ZS5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICBhY3RpdmUgPSBhY3RpdmVcbiAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGFjdGl2ZS50cmlnZ2VyKCdhY3RpdmF0ZS5icy5zY3JvbGxzcHknKVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMuc2VsZWN0b3IpXG4gICAgICAucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsICcuYWN0aXZlJylcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScsIChkYXRhID0gbmV3IFNjcm9sbFNweSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uc2Nyb2xsc3B5XG5cbiAgJC5mbi5zY3JvbGxzcHkgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5zY3JvbGxzcHkuQ29uc3RydWN0b3IgPSBTY3JvbGxTcHlcblxuXG4gIC8vIFNDUk9MTFNQWSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uc2Nyb2xsc3B5ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZC5icy5zY3JvbGxzcHkuZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksICRzcHkuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRhYi5qcyB2My4zLjdcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI3RhYnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNiBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBUQUIgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUYWIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIC8vIGpzY3M6ZGlzYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICAgIHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAvLyBqc2NzOmVuYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICB9XG5cbiAgVGFiLlZFUlNJT04gPSAnMy4zLjcnXG5cbiAgVGFiLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUYWIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzICAgID0gdGhpcy5lbGVtZW50XG4gICAgdmFyICR1bCAgICAgID0gJHRoaXMuY2xvc2VzdCgndWw6bm90KC5kcm9wZG93bi1tZW51KScpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuZGF0YSgndGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgaWYgKCR0aGlzLnBhcmVudCgnbGknKS5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVyblxuXG4gICAgdmFyICRwcmV2aW91cyA9ICR1bC5maW5kKCcuYWN0aXZlOmxhc3QgYScpXG4gICAgdmFyIGhpZGVFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICB9KVxuICAgIHZhciBzaG93RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgIH0pXG5cbiAgICAkcHJldmlvdXMudHJpZ2dlcihoaWRlRXZlbnQpXG4gICAgJHRoaXMudHJpZ2dlcihzaG93RXZlbnQpXG5cbiAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8IGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRhcmdldCA9ICQoc2VsZWN0b3IpXG5cbiAgICB0aGlzLmFjdGl2YXRlKCR0aGlzLmNsb3Nlc3QoJ2xpJyksICR1bClcbiAgICB0aGlzLmFjdGl2YXRlKCR0YXJnZXQsICR0YXJnZXQucGFyZW50KCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICRwcmV2aW91cy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ2hpZGRlbi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgICAgfSlcbiAgICAgICR0aGlzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnc2hvd24uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBUYWIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lciwgY2FsbGJhY2spIHtcbiAgICB2YXIgJGFjdGl2ZSAgICA9IGNvbnRhaW5lci5maW5kKCc+IC5hY3RpdmUnKVxuICAgIHZhciB0cmFuc2l0aW9uID0gY2FsbGJhY2tcbiAgICAgICYmICQuc3VwcG9ydC50cmFuc2l0aW9uXG4gICAgICAmJiAoJGFjdGl2ZS5sZW5ndGggJiYgJGFjdGl2ZS5oYXNDbGFzcygnZmFkZScpIHx8ICEhY29udGFpbmVyLmZpbmQoJz4gLmZhZGUnKS5sZW5ndGgpXG5cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCc+IC5kcm9wZG93bi1tZW51ID4gLmFjdGl2ZScpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZW5kKClcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgZWxlbWVudFxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyByZWZsb3cgZm9yIHRyYW5zaXRpb25cbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnZmFkZScpXG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgICAgZWxlbWVudFxuICAgICAgICAgIC5jbG9zZXN0KCdsaS5kcm9wZG93bicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICAkYWN0aXZlLmxlbmd0aCAmJiB0cmFuc2l0aW9uID9cbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgbmV4dClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBuZXh0KClcblxuICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2luJylcbiAgfVxuXG5cbiAgLy8gVEFCIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLnRhYicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudGFiJywgKGRhdGEgPSBuZXcgVGFiKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50YWJcblxuICAkLmZuLnRhYiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRhYi5Db25zdHJ1Y3RvciA9IFRhYlxuXG5cbiAgLy8gVEFCIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQuZm4udGFiLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50YWIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBUQUIgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgUGx1Z2luLmNhbGwoJCh0aGlzKSwgJ3Nob3cnKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsIGNsaWNrSGFuZGxlcilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWZmaXguanMgdjMuMy43XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNhZmZpeFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE2IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFGRklYIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBBZmZpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIEFmZml4LkRFRkFVTFRTLCBvcHRpb25zKVxuXG4gICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLm9wdGlvbnMudGFyZ2V0KVxuICAgICAgLm9uKCdzY3JvbGwuYnMuYWZmaXguZGF0YS1hcGknLCAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcykpXG4gICAgICAub24oJ2NsaWNrLmJzLmFmZml4LmRhdGEtYXBpJywgICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCwgdGhpcykpXG5cbiAgICB0aGlzLiRlbGVtZW50ICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLmFmZml4ZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnVucGluICAgICAgICA9IG51bGxcbiAgICB0aGlzLnBpbm5lZE9mZnNldCA9IG51bGxcblxuICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpXG4gIH1cblxuICBBZmZpeC5WRVJTSU9OICA9ICczLjMuNydcblxuICBBZmZpeC5SRVNFVCAgICA9ICdhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tJ1xuXG4gIEFmZml4LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMCxcbiAgICB0YXJnZXQ6IHdpbmRvd1xuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gICAgID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHZhciB0YXJnZXRIZWlnaHQgPSB0aGlzLiR0YXJnZXQuaGVpZ2h0KClcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiB0aGlzLmFmZml4ZWQgPT0gJ3RvcCcpIHJldHVybiBzY3JvbGxUb3AgPCBvZmZzZXRUb3AgPyAndG9wJyA6IGZhbHNlXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkID09ICdib3R0b20nKSB7XG4gICAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwpIHJldHVybiAoc2Nyb2xsVG9wICsgdGhpcy51bnBpbiA8PSBwb3NpdGlvbi50b3ApID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgICAgcmV0dXJuIChzY3JvbGxUb3AgKyB0YXJnZXRIZWlnaHQgPD0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICB9XG5cbiAgICB2YXIgaW5pdGlhbGl6aW5nICAgPSB0aGlzLmFmZml4ZWQgPT0gbnVsbFxuICAgIHZhciBjb2xsaWRlclRvcCAgICA9IGluaXRpYWxpemluZyA/IHNjcm9sbFRvcCA6IHBvc2l0aW9uLnRvcFxuICAgIHZhciBjb2xsaWRlckhlaWdodCA9IGluaXRpYWxpemluZyA/IHRhcmdldEhlaWdodCA6IGhlaWdodFxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHNjcm9sbFRvcCA8PSBvZmZzZXRUb3ApIHJldHVybiAndG9wJ1xuICAgIGlmIChvZmZzZXRCb3R0b20gIT0gbnVsbCAmJiAoY29sbGlkZXJUb3AgKyBjb2xsaWRlckhlaWdodCA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pKSByZXR1cm4gJ2JvdHRvbSdcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFBpbm5lZE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5waW5uZWRPZmZzZXQpIHJldHVybiB0aGlzLnBpbm5lZE9mZnNldFxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpLmFkZENsYXNzKCdhZmZpeCcpXG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgcmV0dXJuICh0aGlzLnBpbm5lZE9mZnNldCA9IHBvc2l0aW9uLnRvcCAtIHNjcm9sbFRvcClcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSwgMSlcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kZWxlbWVudC5pcygnOnZpc2libGUnKSkgcmV0dXJuXG5cbiAgICB2YXIgaGVpZ2h0ICAgICAgID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXQgICAgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3BcbiAgICB2YXIgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbVxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSBNYXRoLm1heCgkKGRvY3VtZW50KS5oZWlnaHQoKSwgJChkb2N1bWVudC5ib2R5KS5oZWlnaHQoKSlcblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ICE9ICdvYmplY3QnKSAgICAgICAgIG9mZnNldEJvdHRvbSA9IG9mZnNldFRvcCA9IG9mZnNldFxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0VG9wID09ICdmdW5jdGlvbicpICAgIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3AodGhpcy4kZWxlbWVudClcbiAgICBpZiAodHlwZW9mIG9mZnNldEJvdHRvbSA9PSAnZnVuY3Rpb24nKSBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tKHRoaXMuJGVsZW1lbnQpXG5cbiAgICB2YXIgYWZmaXggPSB0aGlzLmdldFN0YXRlKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSlcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgIT0gYWZmaXgpIHtcbiAgICAgIGlmICh0aGlzLnVucGluICE9IG51bGwpIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCAnJylcblxuICAgICAgdmFyIGFmZml4VHlwZSA9ICdhZmZpeCcgKyAoYWZmaXggPyAnLScgKyBhZmZpeCA6ICcnKVxuICAgICAgdmFyIGUgICAgICAgICA9ICQuRXZlbnQoYWZmaXhUeXBlICsgJy5icy5hZmZpeCcpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuYWZmaXhlZCA9IGFmZml4XG4gICAgICB0aGlzLnVucGluID0gYWZmaXggPT0gJ2JvdHRvbScgPyB0aGlzLmdldFBpbm5lZE9mZnNldCgpIDogbnVsbFxuXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVClcbiAgICAgICAgLmFkZENsYXNzKGFmZml4VHlwZSlcbiAgICAgICAgLnRyaWdnZXIoYWZmaXhUeXBlLnJlcGxhY2UoJ2FmZml4JywgJ2FmZml4ZWQnKSArICcuYnMuYWZmaXgnKVxuICAgIH1cblxuICAgIGlmIChhZmZpeCA9PSAnYm90dG9tJykge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmZzZXQoe1xuICAgICAgICB0b3A6IHNjcm9sbEhlaWdodCAtIGhlaWdodCAtIG9mZnNldEJvdHRvbVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuXG4gIC8vIEFGRklYIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmFmZml4JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hZmZpeCcsIChkYXRhID0gbmV3IEFmZml4KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hZmZpeFxuXG4gICQuZm4uYWZmaXggICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hZmZpeC5Db25zdHJ1Y3RvciA9IEFmZml4XG5cblxuICAvLyBBRkZJWCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWZmaXgubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFmZml4ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUZGSVggREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwiYWZmaXhcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkc3B5LmRhdGEoKVxuXG4gICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IHt9XG5cbiAgICAgIGlmIChkYXRhLm9mZnNldEJvdHRvbSAhPSBudWxsKSBkYXRhLm9mZnNldC5ib3R0b20gPSBkYXRhLm9mZnNldEJvdHRvbVxuICAgICAgaWYgKGRhdGEub2Zmc2V0VG9wICAgICE9IG51bGwpIGRhdGEub2Zmc2V0LnRvcCAgICA9IGRhdGEub2Zmc2V0VG9wXG5cbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksIGRhdGEpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuIiwiaW1wb3J0IHsgc2VjdGlvbnMgfSBmcm9tIFwiLi9zZWN0aW9uc1wiO1xuaW1wb3J0IHsgVGV4dEFuaW1hdGVkLCBXb3JkQW5pbWF0ZWQgfSBmcm9tIFwiLi90ZXh0XCI7XG5cbnRyeSB7XG4gICAgcmVxdWlyZSgnYm9vdHN0cmFwLXNhc3MnKTtcbn0gY2F0Y2ggKGUpIHt9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdjaHVua19pbmVmZmljaWVudCcsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oY2h1bmtTaXplKSB7XG4gICAgICAgIHZhciBhcnJheT10aGlzO1xuICAgICAgICByZXR1cm4gW10uY29uY2F0LmFwcGx5KFtdLFxuICAgICAgICAgICAgYXJyYXkubWFwKGZ1bmN0aW9uKGVsZW0saSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpJWNodW5rU2l6ZSA/IFtdIDogW2FycmF5LnNsaWNlKGksaStjaHVua1NpemUpXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbi8vIEdFVCBSRUFEWSAhXG4kKGZ1bmN0aW9uICgpIHtcblxuICAgICQoXCIubWFpblwiKS5vbmVwYWdlX3Njcm9sbCh7XG4gICAgICAgIHNlY3Rpb25Db250YWluZXI6IFwic2VjdGlvblwiLCAvLyBzZWN0aW9uQ29udGFpbmVyIGFjY2VwdHMgYW55IGtpbmQgb2Ygc2VsZWN0b3IgaW4gY2FzZSB5b3UgZG9uJ3Qgd2FudCB0byB1c2Ugc2VjdGlvblxuICAgICAgICBlYXNpbmc6IFwiZWFzZVwiLCAvLyBFYXNpbmcgb3B0aW9ucyBhY2NlcHRzIHRoZSBDU1MzIGVhc2luZyBhbmltYXRpb24gc3VjaCBcImVhc2VcIiwgXCJsaW5lYXJcIiwgXCJlYXNlLWluXCIsIFwiZWFzZS1vdXRcIiwgXCJlYXNlLWluLW91dFwiLCBvciBldmVuIGN1YmljIGJlemllciB2YWx1ZSBzdWNoIGFzIFwiY3ViaWMtYmV6aWVyKDAuMTc1LCAwLjg4NSwgMC40MjAsIDEuMzEwKVwiXG4gICAgICAgIGFuaW1hdGlvblRpbWU6IDUwMCwgLy8gQW5pbWF0aW9uVGltZSBsZXQgeW91IGRlZmluZSBob3cgbG9uZyBlYWNoIHNlY3Rpb24gdGFrZXMgdG8gYW5pbWF0ZVxuICAgICAgICBwYWdpbmF0aW9uOiB0cnVlLCAvLyBZb3UgY2FuIGVpdGhlciBzaG93IG9yIGhpZGUgdGhlIHBhZ2luYXRpb24uIFRvZ2dsZSB0cnVlIGZvciBzaG93LCBmYWxzZSBmb3IgaGlkZS5cbiAgICAgICAgdXBkYXRlVVJMOiBmYWxzZSwgLy8gVG9nZ2xlIHRoaXMgdHJ1ZSBpZiB5b3Ugd2FudCB0aGUgVVJMIHRvIGJlIHVwZGF0ZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSB1c2VyIHNjcm9sbCB0byBlYWNoIHBhZ2UuXG4gICAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgYmVmb3JlTW92ZTogZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICAgICAgJChgW2RhdGEtc2VjdGlvbl1gKS5wYXJlbnQoJ2xpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJChgW2RhdGEtc2VjdGlvbj1cIiR7aW5kZXh9XCJdYCkucGFyZW50KCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnW2RhdGEtYW5pbWF0ZV0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkY2xhc3MgPSAkKHRoaXMpLmRhdGEoJ2FuaW1hdGUnKTtcbiAgICAgICAgICAgICAgICBpZiAoICRjbGFzcyApICQodGhpcykucmVtb3ZlQ2xhc3MoJGNsYXNzKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCQoJy5zZWN0aW9uLScgKyBzZWN0aW9uc1tpbmRleF0pLmhhc0NsYXNzKCdkYXJrJykpIHtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2RhcmsnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdkYXJrJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoJy5zZWN0aW9uLScgKyBzZWN0aW9uc1tpbmRleF0pLmZpbmQoJ1tkYXRhLWFuaW1hdGVdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGRlbGF5ID0gJCh0aGlzKS5kYXRhKCdkZWxheScpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRjbGFzcyA9ICQodGhpcykuZGF0YSgnYW5pbWF0ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRkZWxheSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgJGRlbGF5ICogMTAwMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYW5pbWF0ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoICRjbGFzcyApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGNsYXNzRGVsYXkgPSAkKHRoaXMpLmRhdGEoJGNsYXNzICsgJy1kZWxheScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGNsYXNzRGVsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJGNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRjbGFzc0RlbGF5ICogMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCRjbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gQW5pbWF0ZWQgVGV4dCBDaGFyYWN0ZXJzXG4gICAgJCgnLnRleHQtYW5pbWF0ZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVGV4dEFuaW1hdGVkKHRoaXMpO1xuICAgIH0pO1xuXG4gICAgLy8gQW5pbWF0ZWQgVGV4dCBXb3Jkc1xuICAgICQoJy53b3JkLWFuaW1hdGVkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFdvcmRBbmltYXRlZCh0aGlzKTtcbiAgICB9KTtcblxuICAgICQoXCIuYmxhc3RcIikubW91c2VlbnRlcihmdW5jdGlvbiAoKXtcbiAgICAgICAgdmFyIGVsID0gJCh0aGlzKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYW5pbWF0ZWQgcnViYmVyQmFuZCcpO1xuICAgICAgICAkKHRoaXMpLm9uZSgnd2Via2l0QW5pbWF0aW9uRW5kIG1vekFuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIGFuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBlbC5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgcnViYmVyQmFuZCcpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFBvcnRmb2xpb1xuICAgIGNvbnN0IHJlbmRlclBvcnRmb2xpbyA9IChjYXRlZ29yeSkgPT4ge1xuICAgICAgICBjb25zdCBsaXN0ID0gd2luZG93LnBvcnRmb2xpb0xpc3QuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKCFjYXRlZ29yeSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5jYXRlZ29yeSA9PSBjYXRlZ29yeTtcbiAgICAgICAgfSkuY2h1bmtfaW5lZmZpY2llbnQoNCk7XG4gICAgICAgIGxldCBodG1sID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBsaXN0KSB7XG4gICAgICAgICAgICBodG1sICs9IChcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIiBzd2lwZXItc2xpZGVcIj48ZGl2IGNsYXNzPVwieHJvd1wiPicgK1xuICAgICAgICAgICAgICAgIGxpc3RbaV0ubWFwKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wteHMtNiBpdGVtXCIgc3R5bGU9XCJtYXJnaW46IDA7IHBhZGRpbmc6IDA7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLWZhbmN5Ym94PVwiZ2FsbGVyeVwiICBocmVmPVwiJHtpdGVtLnVybH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHN0eWxlPVwid2lkdGg6IDEwMCU7aGVpZ2h0OiAyMzBweDtcIiBzcmM9XCIke2l0ZW0uaW1hZ2V9XCIgYWx0PVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBkYXRhLWZhbmN5Ym94IGRhdGEtY2FwdGlvbj1cIiR7aXRlbS50aXRsZX0gPGJyIC8+ICR7aXRlbS5kZXNjcmlwdGlvbn1cIiBocmVmPVwiJHtpdGVtLnVybH1cIiBjbGFzcz1cImhvdmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPiR7aXRlbS50aXRsZX08L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD4ke2l0ZW0uc3ViX3RpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICAgICAgICAgIH0pLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgKyAnPC9kaXY+PC9kaXY+J1xuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgJCgnI3BvcnRmb2xpby1saXN0JykuaHRtbChodG1sKVxuXG4gICAgICAgICQoXCJbZGF0YS1mYW5jeWJveF1cIikuZmFuY3lib3goe1xuICAgICAgICAgICAgLy8gT3B0aW9ucyB3aWxsIGdvIGhlcmVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFN3aXBlciAoJy5wcm90Zm9saW8tY29udGFpbmVyJywge1xuICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHdpbmRvdy5wb3J0Zm9saW9MaXN0KSB7XG4gICAgICAgIHJlbmRlclBvcnRmb2xpbygpXG4gICAgfVxuXG4gICAgJCgnLnBvcnRmb2xpby1jYXRlZ29yaWVzIGxpIGEnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5wb3J0Zm9saW8tY2F0ZWdvcmllcyBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSAkKHRoaXMpLnRleHQoKTtcbiAgICAgICAgaWYgKGNhdGVnb3J5ID09ICdBbGwnKSB7XG4gICAgICAgICAgICAvLyAkKCdbZGF0YS1jYXRlb2dyeV0nKS5zaG93KCk7XG4gICAgICAgICAgICByZW5kZXJQb3J0Zm9saW8oKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVuZGVyUG9ydGZvbGlvKGNhdGVnb3J5KVxuICAgICAgICAgICAgLy8gJCgnW2RhdGEtY2F0ZW9ncnldJykuaGlkZSgpO1xuICAgICAgICAgICAgLy8gJChgW2RhdGEtY2F0ZW9ncnk9XCIke2NhdGVnb3J5fVwiXWApLnNob3coKS5hZGRDbGFzcygnYW5pbWF0ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pXG5cbn0pO1xuXG5cblxuJCgnLmhlYWRlci1saW5rcyBhJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICQoJy5tYWluJykubW92ZVRvKCQodGhpcykuZGF0YSgnc2VjdGlvbicpKTtcbiAgICByZXR1cm4gZmFsc2U7XG59KVxuXG4kKFwiLm93bC1jYXJvdXNlbFwiKS5vd2xDYXJvdXNlbCh7XG4gICAgcmVzcG9uc2l2ZSA6IHtcbiAgICAgICAgMDp7XG4gICAgICAgICAgICBpdGVtczoyLFxuICAgICAgICB9LFxuICAgICAgICA2MDA6e1xuICAgICAgICAgICAgaXRlbXM6MyxcbiAgICAgICAgICAgIG5hdjpmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAxMDAwOntcbiAgICAgICAgICAgIGl0ZW1zOjUsXG4gICAgICAgICAgICBsb29wOmZhbHNlXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxudmFyIHR5cGVkID0gbmV3IFR5cGVkKFwiLmVsZW1lbnRcIiwge1xuICAgIC8vIFdhaXRzIDEwMDBtcyBhZnRlciB0eXBpbmcgXCJGaXJzdFwiXG4gICAgc3RyaW5nczogW1wiV2ViIERldmVsb3Blci5cIiwgXCJCYWNrZW5kIERldmVsb3Blci5cIiwgXCJVWCBEZXNpZ25lci5cIiwgXCJNb2JpbGUgRGV2ZWxvcGVyLlwiXSxcbiAgICBsb29wOiB0cnVlLFxuICAgIHR5cGVTcGVlZDogNTAsXG4gICAgYmFja1NwZWVkOiA1MCxcbn0pOyIsImV4cG9ydCBjb25zdCBzZWN0aW9ucyA9IHtcbiAgICAxOiAnaG9tZScsXG4gICAgMjogJ2NhcmRzJyxcbiAgICAzOiAnc2VydmljZXMnLFxuICAgIDQ6ICdwb3J0Zm9saW8nLFxuICAgIDU6ICdjb250YWN0JyxcbiAgICA2OiAnc29jaWFsJyxcbn07IiwiZXhwb3J0IGNvbnN0IFRleHRBbmltYXRlZCA9IChlbGUpID0+IHtcbiAgICBjb25zdCAkdGV4dCA9ICQoZWxlKS50ZXh0KCk7XG4gICAgJChlbGUpLmh0bWwoXCJcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZigkdGV4dC5jaGFyQXQoaSkgPT09IFwiIFwiKVxuICAgICAgICAgICAgJChlbGUpLmFwcGVuZCgnPHNwYW4+JysgJHRleHQuY2hhckF0KGkpICsgJzwvc3Bhbj4nKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAkKGVsZSkuYXBwZW5kKCc8c3BhbiBjbGFzcz1cImJsYXN0XCI+JysgJHRleHQuY2hhckF0KGkpICsgJzwvc3Bhbj4nKVxuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBXb3JkQW5pbWF0ZWQgPSAoZWxlKSA9PiB7XG4gICAgY29uc3QgJHRleHQgPSAkKGVsZSkudGV4dCgpLnNwbGl0KCcgJyk7XG4gICAgJChlbGUpLmh0bWwoXCJcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAkKGVsZSkuYXBwZW5kKCc8c3BhbiBjbGFzcz1cImJsYXN0IHdvcmRcIj4nKyAkdGV4dFtpXSArICc8L3NwYW4+JylcbiAgICB9XG59OyJdLCJwcmVFeGlzdGluZ0NvbW1lbnQiOiIvLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKdWIyUmxYMjF2WkhWc1pYTXZZbTl2ZEhOMGNtRndMWE5oYzNNdllYTnpaWFJ6TDJwaGRtRnpZM0pwY0hSekwySnZiM1J6ZEhKaGNDNXFjeUlzSW5OeVl5OXpZM0pwY0hSekwybHVaR1Y0TG1weklpd2ljM0pqTDNOamNtbHdkSE12YzJWamRHbHZibk11YW5NaUxDSnpjbU12YzJOeWFYQjBjeTkwWlhoMExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTzBGRFFVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN096dEJRM293UlVFN08wRkJRMEU3TzBGQlJVRXNTVUZCU1R0QlFVTkJMRmxCUVZFc1owSkJRVkk3UVVGRFNDeERRVVpFTEVOQlJVVXNUMEZCVHl4RFFVRlFMRVZCUVZVc1EwRkJSVHM3UVVGRlpDeFBRVUZQTEdOQlFWQXNRMEZCYzBJc1RVRkJUU3hUUVVFMVFpeEZRVUYxUXl4dFFrRkJka01zUlVGQk5FUTdRVUZEZUVRc1YwRkJUeXhsUVVGVExGTkJRVlFzUlVGQmIwSTdRVUZEZGtJc1dVRkJTU3hSUVVGTkxFbEJRVlk3UVVGRFFTeGxRVUZQTEVkQlFVY3NUVUZCU0N4RFFVRlZMRXRCUVZZc1EwRkJaMElzUlVGQmFFSXNSVUZEU0N4TlFVRk5MRWRCUVU0c1EwRkJWU3hWUVVGVExFbEJRVlFzUlVGQll5eERRVUZrTEVWQlFXbENPMEZCUTNaQ0xHMUNRVUZQTEVsQlFVVXNVMEZCUml4SFFVRmpMRVZCUVdRc1IwRkJiVUlzUTBGQlF5eE5RVUZOTEV0QlFVNHNRMEZCV1N4RFFVRmFMRVZCUVdNc1NVRkJSU3hUUVVGb1FpeERRVUZFTEVOQlFURkNPMEZCUTBnc1UwRkdSQ3hEUVVSSExFTkJRVkE3UVVGTFNEdEJRVkoxUkN4RFFVRTFSRHM3UVVGWFFUdEJRVU5CTEVWQlFVVXNXVUZCV1RzN1FVRkZWaXhOUVVGRkxFOUJRVVlzUlVGQlZ5eGpRVUZZTEVOQlFUQkNPMEZCUTNSQ0xEQkNRVUZyUWl4VFFVUkpMRVZCUTA4N1FVRkROMElzWjBKQlFWRXNUVUZHWXl4RlFVVk9PMEZCUTJoQ0xIVkNRVUZsTEVkQlNFOHNSVUZIUmp0QlFVTndRaXh2UWtGQldTeEpRVXBWTEVWQlNVbzdRVUZEYkVJc2JVSkJRVmNzUzBGTVZ5eEZRVXRLTzBGQlEyeENMR3RDUVVGVkxFbEJUbGs3UVVGUGRFSXNZMEZCVFN4TFFWQm5RanRCUVZGMFFpeHZRa0ZCV1N4dlFrRkJVeXhMUVVGVUxFVkJRV2RDT3p0QlFVVjRRaXhuUTBGQmIwSXNUVUZCY0VJc1EwRkJNa0lzU1VGQk0wSXNSVUZCYVVNc1YwRkJha01zUTBGQk5rTXNVVUZCTjBNN1FVRkRRU3h0UTBGQmIwSXNTMEZCY0VJc1ZVRkJLMElzVFVGQkwwSXNRMEZCYzBNc1NVRkJkRU1zUlVGQk5FTXNVVUZCTlVNc1EwRkJjVVFzVVVGQmNrUTdPMEZCUlVFc1kwRkJSU3huUWtGQlJpeEZRVUZ2UWl4SlFVRndRaXhEUVVGNVFpeFpRVUZaTzBGQlEycERMRzlDUVVGTkxGTkJRVk1zUlVGQlJTeEpRVUZHTEVWQlFWRXNTVUZCVWl4RFFVRmhMRk5CUVdJc1EwRkJaanRCUVVOQkxHOUNRVUZMTEUxQlFVd3NSVUZCWXl4RlFVRkZMRWxCUVVZc1JVRkJVU3hYUVVGU0xFTkJRVzlDTEUxQlFYQkNPMEZCUTJRc2EwSkJRVVVzU1VGQlJpeEZRVUZSTEZkQlFWSXNRMEZCYjBJc1UwRkJjRUk3UVVGRFNDeGhRVXBFT3p0QlFVMUJMR2RDUVVGSkxFVkJRVVVzWTBGQll5eHRRa0ZCVXl4TFFVRlVMRU5CUVdoQ0xFVkJRV2xETEZGQlFXcERMRU5CUVRCRExFMUJRVEZETEVOQlFVb3NSVUZCZFVRN1FVRkRia1FzYTBKQlFVVXNUVUZCUml4RlFVRlZMRkZCUVZZc1EwRkJiVUlzVFVGQmJrSTdRVUZEU0N4aFFVWkVMRTFCUlU4N1FVRkRTQ3hyUWtGQlJTeE5RVUZHTEVWQlFWVXNWMEZCVml4RFFVRnpRaXhOUVVGMFFqdEJRVU5JT3p0QlFVVkVMR05CUVVVc1kwRkJZeXh0UWtGQlV5eExRVUZVTEVOQlFXaENMRVZCUVdsRExFbEJRV3BETEVOQlFYTkRMR2RDUVVGMFF5eEZRVUYzUkN4SlFVRjRSQ3hEUVVFMlJDeFpRVUZaTzBGQlFVRTdPMEZCUTNKRkxHOUNRVUZOTEZOQlFWTXNSVUZCUlN4SlFVRkdMRVZCUVZFc1NVRkJVaXhEUVVGaExFOUJRV0lzUTBGQlpqdEJRVU5CTEc5Q1FVRk5MRk5CUVZNc1JVRkJSU3hKUVVGR0xFVkJRVkVzU1VGQlVpeERRVUZoTEZOQlFXSXNRMEZCWmpzN1FVRkZRU3h2UWtGQlNTeE5RVUZLTEVWQlFWazdRVUZEVWl3clFrRkJWeXhaUVVGTk8wRkJRMklzYVVOQlFWRXNVVUZCVWl4RFFVRnBRaXhUUVVGcVFqdEJRVU5JTEhGQ1FVWkVMRVZCUlVjc1UwRkJVeXhKUVVaYU8wRkJSMGdzYVVKQlNrUXNUVUZKVHp0QlFVTklMSE5DUVVGRkxFbEJRVVlzUlVGQlVTeFJRVUZTTEVOQlFXbENMRk5CUVdwQ08wRkJRMGc3UVVGRFJDeHZRa0ZCU3l4TlFVRk1MRVZCUVdNN1FVRkRWaXgzUWtGQlRTeGpRVUZqTEVWQlFVVXNTVUZCUml4RlFVRlJMRWxCUVZJc1EwRkJZU3hUUVVGVExGRkJRWFJDTEVOQlFYQkNPMEZCUTBFc2QwSkJRVWtzVjBGQlNpeEZRVUZwUWp0QlFVTmlMRzFEUVVGWExGbEJRVTA3UVVGRFlpeHhRMEZCVVN4UlFVRlNMRU5CUVdsQ0xFMUJRV3BDTzBGQlEwZ3NlVUpCUmtRc1JVRkZSeXhqUVVGakxFbEJSbXBDTzBGQlIwZ3NjVUpCU2tRc1RVRkpUenRCUVVOSUxEQkNRVUZGTEVsQlFVWXNSVUZCVVN4UlFVRlNMRU5CUVdsQ0xFMUJRV3BDTzBGQlEwZzdRVUZEU2p0QlFVTktMR0ZCY2tKRU8wRkJkVUpJTzBGQmFFUnhRaXhMUVVFeFFqczdRVUZ0UkVFN1FVRkRRU3hOUVVGRkxHZENRVUZHTEVWQlFXOUNMRWxCUVhCQ0xFTkJRWGxDTEZsQlFWazdRVUZEYWtNc1owTkJRV0VzU1VGQllqdEJRVU5JTEV0QlJrUTdPMEZCU1VFN1FVRkRRU3hOUVVGRkxHZENRVUZHTEVWQlFXOUNMRWxCUVhCQ0xFTkJRWGxDTEZsQlFWazdRVUZEYWtNc1owTkJRV0VzU1VGQllqdEJRVU5JTEV0QlJrUTdPMEZCU1VFc1RVRkJSU3hSUVVGR0xFVkJRVmtzVlVGQldpeERRVUYxUWl4WlFVRlhPMEZCUXpsQ0xGbEJRVWtzUzBGQlN5eEZRVUZGTEVsQlFVWXNRMEZCVkR0QlFVTkJMRlZCUVVVc1NVRkJSaXhGUVVGUkxGRkJRVklzUTBGQmFVSXNjVUpCUVdwQ08wRkJRMEVzVlVGQlJTeEpRVUZHTEVWQlFWRXNSMEZCVWl4RFFVRlpMRGhGUVVGYUxFVkJRVFJHTEZsQlFWVTdRVUZEYkVjc1pVRkJSeXhYUVVGSUxFTkJRV1VzY1VKQlFXWTdRVUZEU0N4VFFVWkVPMEZCUjBnc1MwRk9SRHM3UVVGUlFUdEJRVU5CTEZGQlFVMHNhMEpCUVd0Q0xGTkJRV3hDTEdWQlFXdENMRU5CUVVNc1VVRkJSQ3hGUVVGak8wRkJRMnhETEZsQlFVMHNUMEZCVHl4UFFVRlBMR0ZCUVZBc1EwRkJjVUlzVFVGQmNrSXNRMEZCTkVJc1owSkJRVkU3UVVGRE4wTXNaMEpCUVVrc1EwRkJReXhSUVVGTUxFVkJRV1VzVDBGQlR5eEpRVUZRTzBGQlEyWXNiVUpCUVU4c1MwRkJTeXhSUVVGTUxFbEJRV2xDTEZGQlFYaENPMEZCUTBnc1UwRklXU3hGUVVkV0xHbENRVWhWTEVOQlIxRXNRMEZJVWl4RFFVRmlPMEZCU1VFc1dVRkJTU3hQUVVGUExFVkJRVmc3UVVGRFFTeGhRVUZMTEVsQlFVMHNRMEZCV0N4SlFVRm5RaXhKUVVGb1FpeEZRVUZ6UWp0QlFVTnNRaXh2UWtGRFNTeHJSRUZEUVN4TFFVRkxMRU5CUVV3c1JVRkJVU3hIUVVGU0xFTkJRVmtzVlVGQlF5eEpRVUZFTEVWQlFVOHNRMEZCVUN4RlFVRmhPMEZCUTNKQ0xIZE1RVVYzUXl4TFFVRkxMRWRCUmpkRExIbEdRVWQxUkN4TFFVRkxMRXRCU0RWRUxEUkhRVXR4UXl4TFFVRkxMRXRCVERGRExHZENRVXN3UkN4TFFVRkxMRmRCVEM5RUxHdENRVXR4Uml4TFFVRkxMRWRCVERGR0xITklRVTlyUWl4TFFVRkxMRXRCVUhaQ0xHdEVRVkZwUWl4TFFVRkxMRk5CVW5SQ08wRkJXVWdzWVVGaVJDeEZRV0ZITEVsQllrZ3NRMEZoVVN4RlFXSlNMRU5CUkVFc1IwRmxSU3hqUVdoQ1RqdEJRV3RDU0RzN1FVRkZSQ3hWUVVGRkxHbENRVUZHTEVWQlFYRkNMRWxCUVhKQ0xFTkJRVEJDTEVsQlFURkNPenRCUVVWQkxGVkJRVVVzYVVKQlFVWXNSVUZCY1VJc1VVRkJja0lzUTBGQk9FSTdRVUZETVVJN1FVRkVNRUlzVTBGQk9VSTdPMEZCU1VFc1dVRkJTU3hOUVVGS0xFTkJRVmtzYzBKQlFWb3NSVUZCYjBNN1FVRkRhRU1zTWtKQlFXVTdRVUZFYVVJc1UwRkJjRU03UVVGSFNDeExRWEJEUkRzN1FVRnpRMEVzVVVGQlNTeFBRVUZQTEdGQlFWZ3NSVUZCTUVJN1FVRkRkRUk3UVVGRFNEczdRVUZGUkN4TlFVRkZMRFJDUVVGR0xFVkJRV2RETEV0QlFXaERMRU5CUVhORExGbEJRVms3UVVGRE9VTXNWVUZCUlN3d1FrRkJSaXhGUVVFNFFpeFhRVUU1UWl4RFFVRXdReXhSUVVFeFF6dEJRVU5CTEZWQlFVVXNTVUZCUml4RlFVRlJMRTFCUVZJc1IwRkJhVUlzVVVGQmFrSXNRMEZCTUVJc1VVRkJNVUk3TzBGQlJVRXNXVUZCVFN4WFFVRlhMRVZCUVVVc1NVRkJSaXhGUVVGUkxFbEJRVklzUlVGQmFrSTdRVUZEUVN4WlFVRkpMRmxCUVZrc1MwRkJhRUlzUlVGQmRVSTdRVUZEYmtJN1FVRkRRVHRCUVVOSUxGTkJTRVFzVFVGSFR6dEJRVU5JTERSQ1FVRm5RaXhSUVVGb1FqdEJRVU5CTzBGQlEwRTdRVUZEU0RzN1FVRkZSQ3hsUVVGUExFdEJRVkE3UVVGRFNDeExRV1pFTzBGQmFVSklMRU5CYmtsRU96dEJRWFZKUVN4RlFVRkZMR2xDUVVGR0xFVkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xGbEJRVms3UVVGRGJrTXNUVUZCUlN4UFFVRkdMRVZCUVZjc1RVRkJXQ3hEUVVGclFpeEZRVUZGTEVsQlFVWXNSVUZCVVN4SlFVRlNMRU5CUVdFc1UwRkJZaXhEUVVGc1FqdEJRVU5CTEZkQlFVOHNTMEZCVUR0QlFVTklMRU5CU0VRN08wRkJTMEVzUlVGQlJTeGxRVUZHTEVWQlFXMUNMRmRCUVc1Q0xFTkJRU3RDTzBGQlF6TkNMR2RDUVVGaE8wRkJRMVFzVjBGQlJUdEJRVU5GTEcxQ1FVRk5PMEZCUkZJc1UwRkVUenRCUVVsVUxHRkJRVWs3UVVGRFFTeHRRa0ZCVFN4RFFVUk9PMEZCUlVFc2FVSkJRVWs3UVVGR1NpeFRRVXBMTzBGQlVWUXNZMEZCU3p0QlFVTkVMRzFDUVVGTkxFTkJSRXc3UVVGRlJDeHJRa0ZCU3p0QlFVWktPMEZCVWtrN1FVRkVZeXhEUVVFdlFqczdRVUZuUWtFc1NVRkJTU3hSUVVGUkxFbEJRVWtzUzBGQlNpeERRVUZWTEZWQlFWWXNSVUZCYzBJN1FVRkRPVUk3UVVGRFFTeGhRVUZUTEVOQlFVTXNaMEpCUVVRc1JVRkJiVUlzYjBKQlFXNUNMRVZCUVhsRExHTkJRWHBETEVWQlFYbEVMRzFDUVVGNlJDeERRVVp4UWp0QlFVYzVRaXhWUVVGTkxFbEJTSGRDTzBGQlNUbENMR1ZCUVZjc1JVRktiVUk3UVVGTE9VSXNaVUZCVnp0QlFVeHRRaXhEUVVGMFFpeERRVUZhT3pzN096czdPenRCUXk5TFR5eEpRVUZOTERoQ1FVRlhPMEZCUTNCQ0xFOUJRVWNzVFVGRWFVSTdRVUZGY0VJc1QwRkJSeXhQUVVacFFqdEJRVWR3UWl4UFFVRkhMRlZCU0dsQ08wRkJTWEJDTEU5QlFVY3NWMEZLYVVJN1FVRkxjRUlzVDBGQlJ5eFRRVXhwUWp0QlFVMXdRaXhQUVVGSE8wRkJUbWxDTEVOQlFXcENPenM3T3pzN096dEJRMEZCTEVsQlFVMHNjME5CUVdVc1UwRkJaaXhaUVVGbExFTkJRVU1zUjBGQlJDeEZRVUZUTzBGQlEycERMRkZCUVUwc1VVRkJVU3hGUVVGRkxFZEJRVVlzUlVGQlR5eEpRVUZRTEVWQlFXUTdRVUZEUVN4TlFVRkZMRWRCUVVZc1JVRkJUeXhKUVVGUUxFTkJRVmtzUlVGQldqdEJRVU5CTEZOQlFVc3NTVUZCU1N4SlFVRkpMRU5CUVdJc1JVRkJaMElzU1VGQlNTeE5RVUZOTEUxQlFURkNMRVZCUVd0RExFZEJRV3hETEVWQlFYVkRPMEZCUTI1RExGbEJRVWNzVFVGQlRTeE5RVUZPTEVOQlFXRXNRMEZCWWl4TlFVRnZRaXhIUVVGMlFpeEZRVU5KTEVWQlFVVXNSMEZCUml4RlFVRlBMRTFCUVZBc1EwRkJZeXhYUVVGVkxFMUJRVTBzVFVGQlRpeERRVUZoTEVOQlFXSXNRMEZCVml4SFFVRTBRaXhUUVVFeFF5eEZRVVJLTEV0QlIwa3NSVUZCUlN4SFFVRkdMRVZCUVU4c1RVRkJVQ3hEUVVGakxIbENRVUYzUWl4TlFVRk5MRTFCUVU0c1EwRkJZU3hEUVVGaUxFTkJRWGhDTEVkQlFUQkRMRk5CUVhoRU8wRkJRMUE3UVVGRFNpeERRVlJOT3p0QlFWZEJMRWxCUVUwc2MwTkJRV1VzVTBGQlppeFpRVUZsTEVOQlFVTXNSMEZCUkN4RlFVRlRPMEZCUTJwRExGRkJRVTBzVVVGQlVTeEZRVUZGTEVkQlFVWXNSVUZCVHl4SlFVRlFMRWRCUVdNc1MwRkJaQ3hEUVVGdlFpeEhRVUZ3UWl4RFFVRmtPMEZCUTBFc1RVRkJSU3hIUVVGR0xFVkJRVThzU1VGQlVDeERRVUZaTEVWQlFWbzdRVUZEUVN4VFFVRkxMRWxCUVVrc1NVRkJTU3hEUVVGaUxFVkJRV2RDTEVsQlFVa3NUVUZCVFN4TlFVRXhRaXhGUVVGclF5eEhRVUZzUXl4RlFVRjFRenRCUVVOdVF5eFZRVUZGTEVkQlFVWXNSVUZCVHl4TlFVRlFMRU5CUVdNc09FSkJRVFpDTEUxQlFVMHNRMEZCVGl4RFFVRTNRaXhIUVVGM1F5eFRRVUYwUkR0QlFVTklPMEZCUTBvc1EwRk9UU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUtDbDdablZ1WTNScGIyNGdjaWhsTEc0c2RDbDdablZ1WTNScGIyNGdieWhwTEdZcGUybG1LQ0Z1VzJsZEtYdHBaaWdoWlZ0cFhTbDdkbUZ5SUdNOVhDSm1kVzVqZEdsdmJsd2lQVDEwZVhCbGIyWWdjbVZ4ZFdseVpTWW1jbVZ4ZFdseVpUdHBaaWdoWmlZbVl5bHlaWFIxY200Z1l5aHBMQ0V3S1R0cFppaDFLWEpsZEhWeWJpQjFLR2tzSVRBcE8zWmhjaUJoUFc1bGR5QkZjbkp2Y2loY0lrTmhibTV2ZENCbWFXNWtJRzF2WkhWc1pTQW5YQ0lyYVN0Y0lpZGNJaWs3ZEdoeWIzY2dZUzVqYjJSbFBWd2lUVTlFVlV4RlgwNVBWRjlHVDFWT1JGd2lMR0Y5ZG1GeUlIQTlibHRwWFQxN1pYaHdiM0owY3pwN2ZYMDdaVnRwWFZzd1hTNWpZV3hzS0hBdVpYaHdiM0owY3l4bWRXNWpkR2x2YmloeUtYdDJZWElnYmoxbFcybGRXekZkVzNKZE8zSmxkSFZ5YmlCdktHNThmSElwZlN4d0xIQXVaWGh3YjNKMGN5eHlMR1VzYml4MEtYMXlaWFIxY200Z2JsdHBYUzVsZUhCdmNuUnpmV1p2Y2loMllYSWdkVDFjSW1aMWJtTjBhVzl1WENJOVBYUjVjR1Z2WmlCeVpYRjFhWEpsSmlaeVpYRjFhWEpsTEdrOU1EdHBQSFF1YkdWdVozUm9PMmtyS3lsdktIUmJhVjBwTzNKbGRIVnliaUJ2ZlhKbGRIVnliaUJ5ZlNrb0tTSXNJaThxSVZ4dUlDb2dRbTl2ZEhOMGNtRndJSFl6TGpNdU55QW9hSFIwY0RvdkwyZGxkR0p2YjNSemRISmhjQzVqYjIwcFhHNGdLaUJEYjNCNWNtbG5hSFFnTWpBeE1TMHlNREUySUZSM2FYUjBaWElzSUVsdVl5NWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJSFJvWlNCTlNWUWdiR2xqWlc1elpWeHVJQ292WEc1Y2JtbG1JQ2gwZVhCbGIyWWdhbEYxWlhKNUlEMDlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMEp2YjNSemRISmhjRnhjSjNNZ1NtRjJZVk5qY21sd2RDQnlaWEYxYVhKbGN5QnFVWFZsY25rbktWeHVmVnh1WEc0clpuVnVZM1JwYjI0Z0tDUXBJSHRjYmlBZ0ozVnpaU0J6ZEhKcFkzUW5PMXh1SUNCMllYSWdkbVZ5YzJsdmJpQTlJQ1F1Wm00dWFuRjFaWEo1TG5Od2JHbDBLQ2NnSnlsYk1GMHVjM0JzYVhRb0p5NG5LVnh1SUNCcFppQW9LSFpsY25OcGIyNWJNRjBnUENBeUlDWW1JSFpsY25OcGIyNWJNVjBnUENBNUtTQjhmQ0FvZG1WeWMybHZibHN3WFNBOVBTQXhJQ1ltSUhabGNuTnBiMjViTVYwZ1BUMGdPU0FtSmlCMlpYSnphVzl1V3pKZElEd2dNU2tnZkh3Z0tIWmxjbk5wYjI1Yk1GMGdQaUF6S1NrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduUW05dmRITjBjbUZ3WEZ3bmN5QktZWFpoVTJOeWFYQjBJSEpsY1hWcGNtVnpJR3BSZFdWeWVTQjJaWEp6YVc5dUlERXVPUzR4SUc5eUlHaHBaMmhsY2l3Z1luVjBJR3h2ZDJWeUlIUm9ZVzRnZG1WeWMybHZiaUEwSnlsY2JpQWdmVnh1ZlNocVVYVmxjbmtwTzF4dVhHNHZLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmlBcUlFSnZiM1J6ZEhKaGNEb2dkSEpoYm5OcGRHbHZiaTVxY3lCMk15NHpMamRjYmlBcUlHaDBkSEE2THk5blpYUmliMjkwYzNSeVlYQXVZMjl0TDJwaGRtRnpZM0pwY0hRdkkzUnlZVzV6YVhScGIyNXpYRzRnS2lBOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQxY2JpQXFJRU52Y0hseWFXZG9kQ0F5TURFeExUSXdNVFlnVkhkcGRIUmxjaXdnU1c1akxseHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmRIZGljeTlpYjI5MGMzUnlZWEF2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQU0FxTDF4dVhHNWNiaXRtZFc1amRHbHZiaUFvSkNrZ2UxeHVJQ0FuZFhObElITjBjbWxqZENjN1hHNWNiaUFnTHk4Z1ExTlRJRlJTUVU1VFNWUkpUMDRnVTFWUVVFOVNWQ0FvVTJodmRYUnZkWFE2SUdoMGRIQTZMeTkzZDNjdWJXOWtaWEp1YVhweUxtTnZiUzhwWEc0Z0lDOHZJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBWeHVYRzRnSUdaMWJtTjBhVzl1SUhSeVlXNXphWFJwYjI1RmJtUW9LU0I3WEc0Z0lDQWdkbUZ5SUdWc0lEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblltOXZkSE4wY21Gd0p5bGNibHh1SUNBZ0lIWmhjaUIwY21GdWMwVnVaRVYyWlc1MFRtRnRaWE1nUFNCN1hHNGdJQ0FnSUNCWFpXSnJhWFJVY21GdWMybDBhVzl1SURvZ0ozZGxZbXRwZEZSeVlXNXphWFJwYjI1RmJtUW5MRnh1SUNBZ0lDQWdUVzk2VkhKaGJuTnBkR2x2YmlBZ0lDQTZJQ2QwY21GdWMybDBhVzl1Wlc1a0p5eGNiaUFnSUNBZ0lFOVVjbUZ1YzJsMGFXOXVJQ0FnSUNBZ09pQW5iMVJ5WVc1emFYUnBiMjVGYm1RZ2IzUnlZVzV6YVhScGIyNWxibVFuTEZ4dUlDQWdJQ0FnZEhKaGJuTnBkR2x2YmlBZ0lDQWdJQ0E2SUNkMGNtRnVjMmwwYVc5dVpXNWtKMXh1SUNBZ0lIMWNibHh1SUNBZ0lHWnZjaUFvZG1GeUlHNWhiV1VnYVc0Z2RISmhibk5GYm1SRmRtVnVkRTVoYldWektTQjdYRzRnSUNBZ0lDQnBaaUFvWld3dWMzUjViR1ZiYm1GdFpWMGdJVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2V5QmxibVE2SUhSeVlXNXpSVzVrUlhabGJuUk9ZVzFsYzF0dVlXMWxYU0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlHWmhiSE5sSUM4dklHVjRjR3hwWTJsMElHWnZjaUJwWlRnZ0tDQWdMbDh1S1Z4dUlDQjlYRzVjYmlBZ0x5OGdhSFIwY0RvdkwySnNiMmN1WVd4bGVHMWhZMk5oZHk1amIyMHZZM056TFhSeVlXNXphWFJwYjI1elhHNGdJQ1F1Wm00dVpXMTFiR0YwWlZSeVlXNXphWFJwYjI1RmJtUWdQU0JtZFc1amRHbHZiaUFvWkhWeVlYUnBiMjRwSUh0Y2JpQWdJQ0IyWVhJZ1kyRnNiR1ZrSUQwZ1ptRnNjMlZjYmlBZ0lDQjJZWElnSkdWc0lEMGdkR2hwYzF4dUlDQWdJQ1FvZEdocGN5a3ViMjVsS0NkaWMxUnlZVzV6YVhScGIyNUZibVFuTENCbWRXNWpkR2x2YmlBb0tTQjdJR05oYkd4bFpDQTlJSFJ5ZFdVZ2ZTbGNiaUFnSUNCMllYSWdZMkZzYkdKaFkyc2dQU0JtZFc1amRHbHZiaUFvS1NCN0lHbG1JQ2doWTJGc2JHVmtLU0FrS0NSbGJDa3VkSEpwWjJkbGNpZ2tMbk4xY0hCdmNuUXVkSEpoYm5OcGRHbHZiaTVsYm1RcElIMWNiaUFnSUNCelpYUlVhVzFsYjNWMEtHTmhiR3hpWVdOckxDQmtkWEpoZEdsdmJpbGNiaUFnSUNCeVpYUjFjbTRnZEdocGMxeHVJQ0I5WEc1Y2JpQWdKQ2htZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSkM1emRYQndiM0owTG5SeVlXNXphWFJwYjI0Z1BTQjBjbUZ1YzJsMGFXOXVSVzVrS0NsY2JseHVJQ0FnSUdsbUlDZ2hKQzV6ZFhCd2IzSjBMblJ5WVc1emFYUnBiMjRwSUhKbGRIVnlibHh1WEc0Z0lDQWdKQzVsZG1WdWRDNXpjR1ZqYVdGc0xtSnpWSEpoYm5OcGRHbHZia1Z1WkNBOUlIdGNiaUFnSUNBZ0lHSnBibVJVZVhCbE9pQWtMbk4xY0hCdmNuUXVkSEpoYm5OcGRHbHZiaTVsYm1Rc1hHNGdJQ0FnSUNCa1pXeGxaMkYwWlZSNWNHVTZJQ1F1YzNWd2NHOXlkQzUwY21GdWMybDBhVzl1TG1WdVpDeGNiaUFnSUNBZ0lHaGhibVJzWlRvZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tDUW9aUzUwWVhKblpYUXBMbWx6S0hSb2FYTXBLU0J5WlhSMWNtNGdaUzVvWVc1a2JHVlBZbW91YUdGdVpHeGxjaTVoY0hCc2VTaDBhR2x6TENCaGNtZDFiV1Z1ZEhNcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlLVnh1WEc1OUtHcFJkV1Z5ZVNrN1hHNWNiaThxSUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFZ4dUlDb2dRbTl2ZEhOMGNtRndPaUJoYkdWeWRDNXFjeUIyTXk0ekxqZGNiaUFxSUdoMGRIQTZMeTluWlhSaWIyOTBjM1J5WVhBdVkyOXRMMnBoZG1GelkzSnBjSFF2STJGc1pYSjBjMXh1SUNvZ1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVhHNGdLaUJEYjNCNWNtbG5hSFFnTWpBeE1TMHlNREUySUZSM2FYUjBaWElzSUVsdVl5NWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzUjNZbk12WW05dmRITjBjbUZ3TDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDBnS2k5Y2JseHVYRzRyWm5WdVkzUnBiMjRnS0NRcElIdGNiaUFnSjNWelpTQnpkSEpwWTNRbk8xeHVYRzRnSUM4dklFRk1SVkpVSUVOTVFWTlRJRVJGUmtsT1NWUkpUMDVjYmlBZ0x5OGdQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFZ4dVhHNGdJSFpoY2lCa2FYTnRhWE56SUQwZ0oxdGtZWFJoTFdScGMyMXBjM005WENKaGJHVnlkRndpWFNkY2JpQWdkbUZ5SUVGc1pYSjBJQ0FnUFNCbWRXNWpkR2x2YmlBb1pXd3BJSHRjYmlBZ0lDQWtLR1ZzS1M1dmJpZ25ZMnhwWTJzbkxDQmthWE50YVhOekxDQjBhR2x6TG1Oc2IzTmxLVnh1SUNCOVhHNWNiaUFnUVd4bGNuUXVWa1ZTVTBsUFRpQTlJQ2N6TGpNdU55ZGNibHh1SUNCQmJHVnlkQzVVVWtGT1UwbFVTVTlPWDBSVlVrRlVTVTlPSUQwZ01UVXdYRzVjYmlBZ1FXeGxjblF1Y0hKdmRHOTBlWEJsTG1Oc2IzTmxJRDBnWm5WdVkzUnBiMjRnS0dVcElIdGNiaUFnSUNCMllYSWdKSFJvYVhNZ0lDQWdQU0FrS0hSb2FYTXBYRzRnSUNBZ2RtRnlJSE5sYkdWamRHOXlJRDBnSkhSb2FYTXVZWFIwY2lnblpHRjBZUzEwWVhKblpYUW5LVnh1WEc0Z0lDQWdhV1lnS0NGelpXeGxZM1J2Y2lrZ2UxeHVJQ0FnSUNBZ2MyVnNaV04wYjNJZ1BTQWtkR2hwY3k1aGRIUnlLQ2RvY21WbUp5bGNiaUFnSUNBZ0lITmxiR1ZqZEc5eUlEMGdjMlZzWldOMGIzSWdKaVlnYzJWc1pXTjBiM0l1Y21Wd2JHRmpaU2d2TGlvb1B6MGpXMTVjWEhOZEtpUXBMeXdnSnljcElDOHZJSE4wY21sd0lHWnZjaUJwWlRkY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IyWVhJZ0pIQmhjbVZ1ZENBOUlDUW9jMlZzWldOMGIzSWdQVDA5SUNjakp5QS9JRnRkSURvZ2MyVnNaV04wYjNJcFhHNWNiaUFnSUNCcFppQW9aU2tnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwWEc1Y2JpQWdJQ0JwWmlBb0lTUndZWEpsYm5RdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBa2NHRnlaVzUwSUQwZ0pIUm9hWE11WTJ4dmMyVnpkQ2duTG1Gc1pYSjBKeWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQWtjR0Z5Wlc1MExuUnlhV2RuWlhJb1pTQTlJQ1F1UlhabGJuUW9KMk5zYjNObExtSnpMbUZzWlhKMEp5a3BYRzVjYmlBZ0lDQnBaaUFvWlM1cGMwUmxabUYxYkhSUWNtVjJaVzUwWldRb0tTa2djbVYwZFhKdVhHNWNiaUFnSUNBa2NHRnlaVzUwTG5KbGJXOTJaVU5zWVhOektDZHBiaWNwWEc1Y2JpQWdJQ0JtZFc1amRHbHZiaUJ5WlcxdmRtVkZiR1Z0Wlc1MEtDa2dlMXh1SUNBZ0lDQWdMeThnWkdWMFlXTm9JR1p5YjIwZ2NHRnlaVzUwTENCbWFYSmxJR1YyWlc1MElIUm9aVzRnWTJ4bFlXNGdkWEFnWkdGMFlWeHVJQ0FnSUNBZ0pIQmhjbVZ1ZEM1a1pYUmhZMmdvS1M1MGNtbG5aMlZ5S0NkamJHOXpaV1F1WW5NdVlXeGxjblFuS1M1eVpXMXZkbVVvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQ1F1YzNWd2NHOXlkQzUwY21GdWMybDBhVzl1SUNZbUlDUndZWEpsYm5RdWFHRnpRMnhoYzNNb0oyWmhaR1VuS1NBL1hHNGdJQ0FnSUNBa2NHRnlaVzUwWEc0Z0lDQWdJQ0FnSUM1dmJtVW9KMkp6VkhKaGJuTnBkR2x2YmtWdVpDY3NJSEpsYlc5MlpVVnNaVzFsYm5RcFhHNGdJQ0FnSUNBZ0lDNWxiWFZzWVhSbFZISmhibk5wZEdsdmJrVnVaQ2hCYkdWeWRDNVVVa0ZPVTBsVVNVOU9YMFJWVWtGVVNVOU9LU0E2WEc0Z0lDQWdJQ0J5WlcxdmRtVkZiR1Z0Wlc1MEtDbGNiaUFnZlZ4dVhHNWNiaUFnTHk4Z1FVeEZVbFFnVUV4VlIwbE9JRVJGUmtsT1NWUkpUMDVjYmlBZ0x5OGdQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQxY2JseHVJQ0JtZFc1amRHbHZiaUJRYkhWbmFXNG9iM0IwYVc5dUtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVaV0ZqYUNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQjJZWElnSkhSb2FYTWdQU0FrS0hSb2FYTXBYRzRnSUNBZ0lDQjJZWElnWkdGMFlTQWdQU0FrZEdocGN5NWtZWFJoS0NkaWN5NWhiR1Z5ZENjcFhHNWNiaUFnSUNBZ0lHbG1JQ2doWkdGMFlTa2dKSFJvYVhNdVpHRjBZU2duWW5NdVlXeGxjblFuTENBb1pHRjBZU0E5SUc1bGR5QkJiR1Z5ZENoMGFHbHpLU2twWEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUc5d2RHbHZiaUE5UFNBbmMzUnlhVzVuSnlrZ1pHRjBZVnR2Y0hScGIyNWRMbU5oYkd3b0pIUm9hWE1wWEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUhaaGNpQnZiR1FnUFNBa0xtWnVMbUZzWlhKMFhHNWNiaUFnSkM1bWJpNWhiR1Z5ZENBZ0lDQWdJQ0FnSUNBZ0lDQTlJRkJzZFdkcGJseHVJQ0FrTG1adUxtRnNaWEowTGtOdmJuTjBjblZqZEc5eUlEMGdRV3hsY25SY2JseHVYRzRnSUM4dklFRk1SVkpVSUU1UElFTlBUa1pNU1VOVVhHNGdJQzh2SUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5WEc1Y2JpQWdKQzVtYmk1aGJHVnlkQzV1YjBOdmJtWnNhV04wSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDUXVabTR1WVd4bGNuUWdQU0J2YkdSY2JpQWdJQ0J5WlhSMWNtNGdkR2hwYzF4dUlDQjlYRzVjYmx4dUlDQXZMeUJCVEVWU1ZDQkVRVlJCTFVGUVNWeHVJQ0F2THlBOVBUMDlQVDA5UFQwOVBUMDlQVnh1WEc0Z0lDUW9aRzlqZFcxbGJuUXBMbTl1S0NkamJHbGpheTVpY3k1aGJHVnlkQzVrWVhSaExXRndhU2NzSUdScGMyMXBjM01zSUVGc1pYSjBMbkJ5YjNSdmRIbHdaUzVqYkc5elpTbGNibHh1ZlNocVVYVmxjbmtwTzF4dVhHNHZLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmlBcUlFSnZiM1J6ZEhKaGNEb2dZblYwZEc5dUxtcHpJSFl6TGpNdU4xeHVJQ29nYUhSMGNEb3ZMMmRsZEdKdmIzUnpkSEpoY0M1amIyMHZhbUYyWVhOamNtbHdkQzhqWW5WMGRHOXVjMXh1SUNvZ1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVhHNGdLaUJEYjNCNWNtbG5hSFFnTWpBeE1TMHlNREUySUZSM2FYUjBaWElzSUVsdVl5NWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzUjNZbk12WW05dmRITjBjbUZ3TDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDBnS2k5Y2JseHVYRzRyWm5WdVkzUnBiMjRnS0NRcElIdGNiaUFnSjNWelpTQnpkSEpwWTNRbk8xeHVYRzRnSUM4dklFSlZWRlJQVGlCUVZVSk1TVU1nUTB4QlUxTWdSRVZHU1U1SlZFbFBUbHh1SUNBdkx5QTlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmx4dUlDQjJZWElnUW5WMGRHOXVJRDBnWm5WdVkzUnBiMjRnS0dWc1pXMWxiblFzSUc5d2RHbHZibk1wSUh0Y2JpQWdJQ0IwYUdsekxpUmxiR1Z0Wlc1MElDQTlJQ1FvWld4bGJXVnVkQ2xjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nSUNBOUlDUXVaWGgwWlc1a0tIdDlMQ0JDZFhSMGIyNHVSRVZHUVZWTVZGTXNJRzl3ZEdsdmJuTXBYRzRnSUNBZ2RHaHBjeTVwYzB4dllXUnBibWNnUFNCbVlXeHpaVnh1SUNCOVhHNWNiaUFnUW5WMGRHOXVMbFpGVWxOSlQwNGdJRDBnSnpNdU15NDNKMXh1WEc0Z0lFSjFkSFJ2Ymk1RVJVWkJWVXhVVXlBOUlIdGNiaUFnSUNCc2IyRmthVzVuVkdWNGREb2dKMnh2WVdScGJtY3VMaTRuWEc0Z0lIMWNibHh1SUNCQ2RYUjBiMjR1Y0hKdmRHOTBlWEJsTG5ObGRGTjBZWFJsSUQwZ1puVnVZM1JwYjI0Z0tITjBZWFJsS1NCN1hHNGdJQ0FnZG1GeUlHUWdJQ0FnUFNBblpHbHpZV0pzWldRblhHNGdJQ0FnZG1GeUlDUmxiQ0FnUFNCMGFHbHpMaVJsYkdWdFpXNTBYRzRnSUNBZ2RtRnlJSFpoYkNBZ1BTQWtaV3d1YVhNb0oybHVjSFYwSnlrZ1B5QW5kbUZzSnlBNklDZG9kRzFzSjF4dUlDQWdJSFpoY2lCa1lYUmhJRDBnSkdWc0xtUmhkR0VvS1Z4dVhHNGdJQ0FnYzNSaGRHVWdLejBnSjFSbGVIUW5YRzVjYmlBZ0lDQnBaaUFvWkdGMFlTNXlaWE5sZEZSbGVIUWdQVDBnYm5Wc2JDa2dKR1ZzTG1SaGRHRW9KM0psYzJWMFZHVjRkQ2NzSUNSbGJGdDJZV3hkS0NrcFhHNWNiaUFnSUNBdkx5QndkWE5vSUhSdklHVjJaVzUwSUd4dmIzQWdkRzhnWVd4c2IzY2dabTl5YlhNZ2RHOGdjM1ZpYldsMFhHNGdJQ0FnYzJWMFZHbHRaVzkxZENna0xuQnliM2g1S0daMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lDUmxiRnQyWVd4ZEtHUmhkR0ZiYzNSaGRHVmRJRDA5SUc1MWJHd2dQeUIwYUdsekxtOXdkR2x2Ym5OYmMzUmhkR1ZkSURvZ1pHRjBZVnR6ZEdGMFpWMHBYRzVjYmlBZ0lDQWdJR2xtSUNoemRHRjBaU0E5UFNBbmJHOWhaR2x1WjFSbGVIUW5LU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVhWE5NYjJGa2FXNW5JRDBnZEhKMVpWeHVJQ0FnSUNBZ0lDQWtaV3d1WVdSa1EyeGhjM01vWkNrdVlYUjBjaWhrTENCa0tTNXdjbTl3S0dRc0lIUnlkV1VwWEc0Z0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0hSb2FYTXVhWE5NYjJGa2FXNW5LU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVhWE5NYjJGa2FXNW5JRDBnWm1Gc2MyVmNiaUFnSUNBZ0lDQWdKR1ZzTG5KbGJXOTJaVU5zWVhOektHUXBMbkpsYlc5MlpVRjBkSElvWkNrdWNISnZjQ2hrTENCbVlXeHpaU2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMQ0IwYUdsektTd2dNQ2xjYmlBZ2ZWeHVYRzRnSUVKMWRIUnZiaTV3Y205MGIzUjVjR1V1ZEc5bloyeGxJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmphR0Z1WjJWa0lEMGdkSEoxWlZ4dUlDQWdJSFpoY2lBa2NHRnlaVzUwSUQwZ2RHaHBjeTRrWld4bGJXVnVkQzVqYkc5elpYTjBLQ2RiWkdGMFlTMTBiMmRuYkdVOVhDSmlkWFIwYjI1elhDSmRKeWxjYmx4dUlDQWdJR2xtSUNna2NHRnlaVzUwTG14bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnZG1GeUlDUnBibkIxZENBOUlIUm9hWE11SkdWc1pXMWxiblF1Wm1sdVpDZ25hVzV3ZFhRbktWeHVJQ0FnSUNBZ2FXWWdLQ1JwYm5CMWRDNXdjbTl3S0NkMGVYQmxKeWtnUFQwZ0ozSmhaR2x2SnlrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvSkdsdWNIVjBMbkJ5YjNBb0oyTm9aV05yWldRbktTa2dZMmhoYm1kbFpDQTlJR1poYkhObFhHNGdJQ0FnSUNBZ0lDUndZWEpsYm5RdVptbHVaQ2duTG1GamRHbDJaU2NwTG5KbGJXOTJaVU5zWVhOektDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ0lDQjBhR2x6TGlSbGJHVnRaVzUwTG1Ga1pFTnNZWE56S0NkaFkzUnBkbVVuS1Z4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNna2FXNXdkWFF1Y0hKdmNDZ25kSGx3WlNjcElEMDlJQ2RqYUdWamEySnZlQ2NwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLQ2drYVc1d2RYUXVjSEp2Y0NnblkyaGxZMnRsWkNjcEtTQWhQVDBnZEdocGN5NGtaV3hsYldWdWRDNW9ZWE5EYkdGemN5Z25ZV04wYVhabEp5a3BJR05vWVc1blpXUWdQU0JtWVd4elpWeHVJQ0FnSUNBZ0lDQjBhR2x6TGlSbGJHVnRaVzUwTG5SdloyZHNaVU5zWVhOektDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0pHbHVjSFYwTG5CeWIzQW9KMk5vWldOclpXUW5MQ0IwYUdsekxpUmxiR1Z0Wlc1MExtaGhjME5zWVhOektDZGhZM1JwZG1VbktTbGNiaUFnSUNBZ0lHbG1JQ2hqYUdGdVoyVmtLU0FrYVc1d2RYUXVkSEpwWjJkbGNpZ25ZMmhoYm1kbEp5bGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnZEdocGN5NGtaV3hsYldWdWRDNWhkSFJ5S0NkaGNtbGhMWEJ5WlhOelpXUW5MQ0FoZEdocGN5NGtaV3hsYldWdWRDNW9ZWE5EYkdGemN5Z25ZV04wYVhabEp5a3BYRzRnSUNBZ0lDQjBhR2x6TGlSbGJHVnRaVzUwTG5SdloyZHNaVU5zWVhOektDZGhZM1JwZG1VbktWeHVJQ0FnSUgxY2JpQWdmVnh1WEc1Y2JpQWdMeThnUWxWVVZFOU9JRkJNVlVkSlRpQkVSVVpKVGtsVVNVOU9YRzRnSUM4dklEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFZ4dVhHNGdJR1oxYm1OMGFXOXVJRkJzZFdkcGJpaHZjSFJwYjI0cElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWxZV05vS0daMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lIWmhjaUFrZEdocGN5QWdJRDBnSkNoMGFHbHpLVnh1SUNBZ0lDQWdkbUZ5SUdSaGRHRWdJQ0FnUFNBa2RHaHBjeTVrWVhSaEtDZGljeTVpZFhSMGIyNG5LVnh1SUNBZ0lDQWdkbUZ5SUc5d2RHbHZibk1nUFNCMGVYQmxiMllnYjNCMGFXOXVJRDA5SUNkdlltcGxZM1FuSUNZbUlHOXdkR2x2Ymx4dVhHNGdJQ0FnSUNCcFppQW9JV1JoZEdFcElDUjBhR2x6TG1SaGRHRW9KMkp6TG1KMWRIUnZiaWNzSUNoa1lYUmhJRDBnYm1WM0lFSjFkSFJ2YmloMGFHbHpMQ0J2Y0hScGIyNXpLU2twWEc1Y2JpQWdJQ0FnSUdsbUlDaHZjSFJwYjI0Z1BUMGdKM1J2WjJkc1pTY3BJR1JoZEdFdWRHOW5aMnhsS0NsY2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0c5d2RHbHZiaWtnWkdGMFlTNXpaWFJUZEdGMFpTaHZjSFJwYjI0cFhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lIWmhjaUJ2YkdRZ1BTQWtMbVp1TG1KMWRIUnZibHh1WEc0Z0lDUXVabTR1WW5WMGRHOXVJQ0FnSUNBZ0lDQWdJQ0FnSUQwZ1VHeDFaMmx1WEc0Z0lDUXVabTR1WW5WMGRHOXVMa052Ym5OMGNuVmpkRzl5SUQwZ1FuVjBkRzl1WEc1Y2JseHVJQ0F2THlCQ1ZWUlVUMDRnVGs4Z1EwOU9Sa3hKUTFSY2JpQWdMeThnUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5WEc1Y2JpQWdKQzVtYmk1aWRYUjBiMjR1Ym05RGIyNW1iR2xqZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWtMbVp1TG1KMWRIUnZiaUE5SUc5c1pGeHVJQ0FnSUhKbGRIVnliaUIwYUdselhHNGdJSDFjYmx4dVhHNGdJQzh2SUVKVlZGUlBUaUJFUVZSQkxVRlFTVnh1SUNBdkx5QTlQVDA5UFQwOVBUMDlQVDA5UFQxY2JseHVJQ0FrS0dSdlkzVnRaVzUwS1Z4dUlDQWdJQzV2YmlnblkyeHBZMnN1WW5NdVluVjBkRzl1TG1SaGRHRXRZWEJwSnl3Z0oxdGtZWFJoTFhSdloyZHNaVjQ5WENKaWRYUjBiMjVjSWwwbkxDQm1kVzVqZEdsdmJpQW9aU2tnZTF4dUlDQWdJQ0FnZG1GeUlDUmlkRzRnUFNBa0tHVXVkR0Z5WjJWMEtTNWpiRzl6WlhOMEtDY3VZblJ1SnlsY2JpQWdJQ0FnSUZCc2RXZHBiaTVqWVd4c0tDUmlkRzRzSUNkMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnYVdZZ0tDRW9KQ2hsTG5SaGNtZGxkQ2t1YVhNb0oybHVjSFYwVzNSNWNHVTlYQ0p5WVdScGIxd2lYU3dnYVc1d2RYUmJkSGx3WlQxY0ltTm9aV05yWW05NFhDSmRKeWtwS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJRkJ5WlhabGJuUWdaRzkxWW14bElHTnNhV05ySUc5dUlISmhaR2x2Y3l3Z1lXNWtJSFJvWlNCa2IzVmliR1VnYzJWc1pXTjBhVzl1Y3lBb2MyOGdZMkZ1WTJWc2JHRjBhVzl1S1NCdmJpQmphR1ZqYTJKdmVHVnpYRzRnSUNBZ0lDQWdJR1V1Y0hKbGRtVnVkRVJsWm1GMWJIUW9LVnh1SUNBZ0lDQWdJQ0F2THlCVWFHVWdkR0Z5WjJWMElHTnZiWEJ2Ym1WdWRDQnpkR2xzYkNCeVpXTmxhWFpsSUhSb1pTQm1iMk4xYzF4dUlDQWdJQ0FnSUNCcFppQW9KR0owYmk1cGN5Z25hVzV3ZFhRc1luVjBkRzl1SnlrcElDUmlkRzR1ZEhKcFoyZGxjaWduWm05amRYTW5LVnh1SUNBZ0lDQWdJQ0JsYkhObElDUmlkRzR1Wm1sdVpDZ25hVzV3ZFhRNmRtbHphV0pzWlN4aWRYUjBiMjQ2ZG1semFXSnNaU2NwTG1acGNuTjBLQ2t1ZEhKcFoyZGxjaWduWm05amRYTW5LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUNBZ0xtOXVLQ2RtYjJOMWN5NWljeTVpZFhSMGIyNHVaR0YwWVMxaGNHa2dZbXgxY2k1aWN5NWlkWFIwYjI0dVpHRjBZUzFoY0drbkxDQW5XMlJoZEdFdGRHOW5aMnhsWGoxY0ltSjFkSFJ2Ymx3aVhTY3NJR1oxYm1OMGFXOXVJQ2hsS1NCN1hHNGdJQ0FnSUNBa0tHVXVkR0Z5WjJWMEtTNWpiRzl6WlhOMEtDY3VZblJ1SnlrdWRHOW5aMnhsUTJ4aGMzTW9KMlp2WTNWekp5d2dMMTVtYjJOMWN5aHBiaWsvSkM4dWRHVnpkQ2hsTG5SNWNHVXBLVnh1SUNBZ0lIMHBYRzVjYm4wb2FsRjFaWEo1S1R0Y2JseHVMeW9nUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5WEc0Z0tpQkNiMjkwYzNSeVlYQTZJR05oY205MWMyVnNMbXB6SUhZekxqTXVOMXh1SUNvZ2FIUjBjRG92TDJkbGRHSnZiM1J6ZEhKaGNDNWpiMjB2YW1GMllYTmpjbWx3ZEM4alkyRnliM1Z6Wld4Y2JpQXFJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1SUNvZ1EyOXdlWEpwWjJoMElESXdNVEV0TWpBeE5pQlVkMmwwZEdWeUxDQkpibU11WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzkwZDJKekwySnZiM1J6ZEhKaGNDOWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOUlDb3ZYRzVjYmx4dUsyWjFibU4wYVc5dUlDZ2tLU0I3WEc0Z0lDZDFjMlVnYzNSeWFXTjBKenRjYmx4dUlDQXZMeUJEUVZKUFZWTkZUQ0JEVEVGVFV5QkVSVVpKVGtsVVNVOU9YRzRnSUM4dklEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQxY2JseHVJQ0IyWVhJZ1EyRnliM1Z6Wld3Z1BTQm1kVzVqZEdsdmJpQW9aV3hsYldWdWRDd2diM0IwYVc5dWN5a2dlMXh1SUNBZ0lIUm9hWE11SkdWc1pXMWxiblFnSUNBZ1BTQWtLR1ZzWlcxbGJuUXBYRzRnSUNBZ2RHaHBjeTRrYVc1a2FXTmhkRzl5Y3lBOUlIUm9hWE11SkdWc1pXMWxiblF1Wm1sdVpDZ25MbU5oY205MWMyVnNMV2x1WkdsallYUnZjbk1uS1Z4dUlDQWdJSFJvYVhNdWIzQjBhVzl1Y3lBZ0lDQWdQU0J2Y0hScGIyNXpYRzRnSUNBZ2RHaHBjeTV3WVhWelpXUWdJQ0FnSUNBOUlHNTFiR3hjYmlBZ0lDQjBhR2x6TG5Oc2FXUnBibWNnSUNBZ0lEMGdiblZzYkZ4dUlDQWdJSFJvYVhNdWFXNTBaWEoyWVd3Z0lDQWdQU0J1ZFd4c1hHNGdJQ0FnZEdocGN5NGtZV04wYVhabElDQWdJQ0E5SUc1MWJHeGNiaUFnSUNCMGFHbHpMaVJwZEdWdGN5QWdJQ0FnSUQwZ2JuVnNiRnh1WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjV6TG10bGVXSnZZWEprSUNZbUlIUm9hWE11SkdWc1pXMWxiblF1YjI0b0oydGxlV1J2ZDI0dVluTXVZMkZ5YjNWelpXd25MQ0FrTG5CeWIzaDVLSFJvYVhNdWEyVjVaRzkzYml3Z2RHaHBjeWtwWEc1Y2JpQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdWNHRjFjMlVnUFQwZ0oyaHZkbVZ5SnlBbUppQWhLQ2R2Ym5SdmRXTm9jM1JoY25RbklHbHVJR1J2WTNWdFpXNTBMbVJ2WTNWdFpXNTBSV3hsYldWdWRDa2dKaVlnZEdocGN5NGtaV3hsYldWdWRGeHVJQ0FnSUNBZ0xtOXVLQ2R0YjNWelpXVnVkR1Z5TG1KekxtTmhjbTkxYzJWc0p5d2dKQzV3Y205NGVTaDBhR2x6TG5CaGRYTmxMQ0IwYUdsektTbGNiaUFnSUNBZ0lDNXZiaWduYlc5MWMyVnNaV0YyWlM1aWN5NWpZWEp2ZFhObGJDY3NJQ1F1Y0hKdmVIa29kR2hwY3k1amVXTnNaU3dnZEdocGN5a3BYRzRnSUgxY2JseHVJQ0JEWVhKdmRYTmxiQzVXUlZKVFNVOU9JQ0E5SUNjekxqTXVOeWRjYmx4dUlDQkRZWEp2ZFhObGJDNVVVa0ZPVTBsVVNVOU9YMFJWVWtGVVNVOU9JRDBnTmpBd1hHNWNiaUFnUTJGeWIzVnpaV3d1UkVWR1FWVk1WRk1nUFNCN1hHNGdJQ0FnYVc1MFpYSjJZV3c2SURVd01EQXNYRzRnSUNBZ2NHRjFjMlU2SUNkb2IzWmxjaWNzWEc0Z0lDQWdkM0poY0RvZ2RISjFaU3hjYmlBZ0lDQnJaWGxpYjJGeVpEb2dkSEoxWlZ4dUlDQjlYRzVjYmlBZ1EyRnliM1Z6Wld3dWNISnZkRzkwZVhCbExtdGxlV1J2ZDI0Z1BTQm1kVzVqZEdsdmJpQW9aU2tnZTF4dUlDQWdJR2xtSUNndmFXNXdkWFI4ZEdWNGRHRnlaV0V2YVM1MFpYTjBLR1V1ZEdGeVoyVjBMblJoWjA1aGJXVXBLU0J5WlhSMWNtNWNiaUFnSUNCemQybDBZMmdnS0dVdWQyaHBZMmdwSUh0Y2JpQWdJQ0FnSUdOaGMyVWdNemM2SUhSb2FYTXVjSEpsZGlncE95QmljbVZoYTF4dUlDQWdJQ0FnWTJGelpTQXpPVG9nZEdocGN5NXVaWGgwS0NrN0lHSnlaV0ZyWEc0Z0lDQWdJQ0JrWldaaGRXeDBPaUJ5WlhSMWNtNWNiaUFnSUNCOVhHNWNiaUFnSUNCbExuQnlaWFpsYm5SRVpXWmhkV3gwS0NsY2JpQWdmVnh1WEc0Z0lFTmhjbTkxYzJWc0xuQnliM1J2ZEhsd1pTNWplV05zWlNBOUlHWjFibU4wYVc5dUlDaGxLU0I3WEc0Z0lDQWdaU0I4ZkNBb2RHaHBjeTV3WVhWelpXUWdQU0JtWVd4elpTbGNibHh1SUNBZ0lIUm9hWE11YVc1MFpYSjJZV3dnSmlZZ1kyeGxZWEpKYm5SbGNuWmhiQ2gwYUdsekxtbHVkR1Z5ZG1Gc0tWeHVYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbWx1ZEdWeWRtRnNYRzRnSUNBZ0lDQW1KaUFoZEdocGN5NXdZWFZ6WldSY2JpQWdJQ0FnSUNZbUlDaDBhR2x6TG1sdWRHVnlkbUZzSUQwZ2MyVjBTVzUwWlhKMllXd29KQzV3Y205NGVTaDBhR2x6TG01bGVIUXNJSFJvYVhNcExDQjBhR2x6TG05d2RHbHZibk11YVc1MFpYSjJZV3dwS1Z4dVhHNGdJQ0FnY21WMGRYSnVJSFJvYVhOY2JpQWdmVnh1WEc0Z0lFTmhjbTkxYzJWc0xuQnliM1J2ZEhsd1pTNW5aWFJKZEdWdFNXNWtaWGdnUFNCbWRXNWpkR2x2YmlBb2FYUmxiU2tnZTF4dUlDQWdJSFJvYVhNdUpHbDBaVzF6SUQwZ2FYUmxiUzV3WVhKbGJuUW9LUzVqYUdsc1pISmxiaWduTG1sMFpXMG5LVnh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMaVJwZEdWdGN5NXBibVJsZUNocGRHVnRJSHg4SUhSb2FYTXVKR0ZqZEdsMlpTbGNiaUFnZlZ4dVhHNGdJRU5oY205MWMyVnNMbkJ5YjNSdmRIbHdaUzVuWlhSSmRHVnRSbTl5UkdseVpXTjBhVzl1SUQwZ1puVnVZM1JwYjI0Z0tHUnBjbVZqZEdsdmJpd2dZV04wYVhabEtTQjdYRzRnSUNBZ2RtRnlJR0ZqZEdsMlpVbHVaR1Y0SUQwZ2RHaHBjeTVuWlhSSmRHVnRTVzVrWlhnb1lXTjBhWFpsS1Z4dUlDQWdJSFpoY2lCM2FXeHNWM0poY0NBOUlDaGthWEpsWTNScGIyNGdQVDBnSjNCeVpYWW5JQ1ltSUdGamRHbDJaVWx1WkdWNElEMDlQU0F3S1Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUh4OElDaGthWEpsWTNScGIyNGdQVDBnSjI1bGVIUW5JQ1ltSUdGamRHbDJaVWx1WkdWNElEMDlJQ2gwYUdsekxpUnBkR1Z0Y3k1c1pXNW5kR2dnTFNBeEtTbGNiaUFnSUNCcFppQW9kMmxzYkZkeVlYQWdKaVlnSVhSb2FYTXViM0IwYVc5dWN5NTNjbUZ3S1NCeVpYUjFjbTRnWVdOMGFYWmxYRzRnSUNBZ2RtRnlJR1JsYkhSaElEMGdaR2x5WldOMGFXOXVJRDA5SUNkd2NtVjJKeUEvSUMweElEb2dNVnh1SUNBZ0lIWmhjaUJwZEdWdFNXNWtaWGdnUFNBb1lXTjBhWFpsU1c1a1pYZ2dLeUJrWld4MFlTa2dKU0IwYUdsekxpUnBkR1Z0Y3k1c1pXNW5kR2hjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTRrYVhSbGJYTXVaWEVvYVhSbGJVbHVaR1Y0S1Z4dUlDQjlYRzVjYmlBZ1EyRnliM1Z6Wld3dWNISnZkRzkwZVhCbExuUnZJRDBnWm5WdVkzUnBiMjRnS0hCdmN5a2dlMXh1SUNBZ0lIWmhjaUIwYUdGMElDQWdJQ0FnSUNBOUlIUm9hWE5jYmlBZ0lDQjJZWElnWVdOMGFYWmxTVzVrWlhnZ1BTQjBhR2x6TG1kbGRFbDBaVzFKYm1SbGVDaDBhR2x6TGlSaFkzUnBkbVVnUFNCMGFHbHpMaVJsYkdWdFpXNTBMbVpwYm1Rb0p5NXBkR1Z0TG1GamRHbDJaU2NwS1Z4dVhHNGdJQ0FnYVdZZ0tIQnZjeUErSUNoMGFHbHpMaVJwZEdWdGN5NXNaVzVuZEdnZ0xTQXhLU0I4ZkNCd2IzTWdQQ0F3S1NCeVpYUjFjbTVjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbk5zYVdScGJtY3BJQ0FnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMaVJsYkdWdFpXNTBMbTl1WlNnbmMyeHBaQzVpY3k1allYSnZkWE5sYkNjc0lHWjFibU4wYVc5dUlDZ3BJSHNnZEdoaGRDNTBieWh3YjNNcElIMHBJQzh2SUhsbGN5d2dYQ0p6Ykdsa1hDSmNiaUFnSUNCcFppQW9ZV04wYVhabFNXNWtaWGdnUFQwZ2NHOXpLU0J5WlhSMWNtNGdkR2hwY3k1d1lYVnpaU2dwTG1ONVkyeGxLQ2xjYmx4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG5Oc2FXUmxLSEJ2Y3lBK0lHRmpkR2wyWlVsdVpHVjRJRDhnSjI1bGVIUW5JRG9nSjNCeVpYWW5MQ0IwYUdsekxpUnBkR1Z0Y3k1bGNTaHdiM01wS1Z4dUlDQjlYRzVjYmlBZ1EyRnliM1Z6Wld3dWNISnZkRzkwZVhCbExuQmhkWE5sSUQwZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQmxJSHg4SUNoMGFHbHpMbkJoZFhObFpDQTlJSFJ5ZFdVcFhHNWNiaUFnSUNCcFppQW9kR2hwY3k0a1pXeGxiV1Z1ZEM1bWFXNWtLQ2N1Ym1WNGRDd2dMbkJ5WlhZbktTNXNaVzVuZEdnZ0ppWWdKQzV6ZFhCd2IzSjBMblJ5WVc1emFYUnBiMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVKR1ZzWlcxbGJuUXVkSEpwWjJkbGNpZ2tMbk4xY0hCdmNuUXVkSEpoYm5OcGRHbHZiaTVsYm1RcFhHNGdJQ0FnSUNCMGFHbHpMbU41WTJ4bEtIUnlkV1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1cGJuUmxjblpoYkNBOUlHTnNaV0Z5U1c1MFpYSjJZV3dvZEdocGN5NXBiblJsY25aaGJDbGNibHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpYRzRnSUgxY2JseHVJQ0JEWVhKdmRYTmxiQzV3Y205MGIzUjVjR1V1Ym1WNGRDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV6Ykdsa2FXNW5LU0J5WlhSMWNtNWNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NXpiR2xrWlNnbmJtVjRkQ2NwWEc0Z0lIMWNibHh1SUNCRFlYSnZkWE5sYkM1d2NtOTBiM1I1Y0dVdWNISmxkaUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1emJHbGthVzVuS1NCeVpYUjFjbTVjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTV6Ykdsa1pTZ25jSEpsZGljcFhHNGdJSDFjYmx4dUlDQkRZWEp2ZFhObGJDNXdjbTkwYjNSNWNHVXVjMnhwWkdVZ1BTQm1kVzVqZEdsdmJpQW9kSGx3WlN3Z2JtVjRkQ2tnZTF4dUlDQWdJSFpoY2lBa1lXTjBhWFpsSUNBZ1BTQjBhR2x6TGlSbGJHVnRaVzUwTG1acGJtUW9KeTVwZEdWdExtRmpkR2wyWlNjcFhHNGdJQ0FnZG1GeUlDUnVaWGgwSUNBZ0lDQTlJRzVsZUhRZ2ZId2dkR2hwY3k1blpYUkpkR1Z0Um05eVJHbHlaV04wYVc5dUtIUjVjR1VzSUNSaFkzUnBkbVVwWEc0Z0lDQWdkbUZ5SUdselEzbGpiR2x1WnlBOUlIUm9hWE11YVc1MFpYSjJZV3hjYmlBZ0lDQjJZWElnWkdseVpXTjBhVzl1SUQwZ2RIbHdaU0E5UFNBbmJtVjRkQ2NnUHlBbmJHVm1kQ2NnT2lBbmNtbG5hSFFuWEc0Z0lDQWdkbUZ5SUhSb1lYUWdJQ0FnSUNBOUlIUm9hWE5jYmx4dUlDQWdJR2xtSUNna2JtVjRkQzVvWVhORGJHRnpjeWduWVdOMGFYWmxKeWtwSUhKbGRIVnliaUFvZEdocGN5NXpiR2xrYVc1bklEMGdabUZzYzJVcFhHNWNiaUFnSUNCMllYSWdjbVZzWVhSbFpGUmhjbWRsZENBOUlDUnVaWGgwV3pCZFhHNGdJQ0FnZG1GeUlITnNhV1JsUlhabGJuUWdQU0FrTGtWMlpXNTBLQ2R6Ykdsa1pTNWljeTVqWVhKdmRYTmxiQ2NzSUh0Y2JpQWdJQ0FnSUhKbGJHRjBaV1JVWVhKblpYUTZJSEpsYkdGMFpXUlVZWEpuWlhRc1hHNGdJQ0FnSUNCa2FYSmxZM1JwYjI0NklHUnBjbVZqZEdsdmJseHVJQ0FnSUgwcFhHNGdJQ0FnZEdocGN5NGtaV3hsYldWdWRDNTBjbWxuWjJWeUtITnNhV1JsUlhabGJuUXBYRzRnSUNBZ2FXWWdLSE5zYVdSbFJYWmxiblF1YVhORVpXWmhkV3gwVUhKbGRtVnVkR1ZrS0NrcElISmxkSFZ5Ymx4dVhHNGdJQ0FnZEdocGN5NXpiR2xrYVc1bklEMGdkSEoxWlZ4dVhHNGdJQ0FnYVhORGVXTnNhVzVuSUNZbUlIUm9hWE11Y0dGMWMyVW9LVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVKR2x1WkdsallYUnZjbk11YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxpUnBibVJwWTJGMGIzSnpMbVpwYm1Rb0p5NWhZM1JwZG1VbktTNXlaVzF2ZG1WRGJHRnpjeWduWVdOMGFYWmxKeWxjYmlBZ0lDQWdJSFpoY2lBa2JtVjRkRWx1WkdsallYUnZjaUE5SUNRb2RHaHBjeTRrYVc1a2FXTmhkRzl5Y3k1amFHbHNaSEpsYmlncFczUm9hWE11WjJWMFNYUmxiVWx1WkdWNEtDUnVaWGgwS1YwcFhHNGdJQ0FnSUNBa2JtVjRkRWx1WkdsallYUnZjaUFtSmlBa2JtVjRkRWx1WkdsallYUnZjaTVoWkdSRGJHRnpjeWduWVdOMGFYWmxKeWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQjJZWElnYzJ4cFpFVjJaVzUwSUQwZ0pDNUZkbVZ1ZENnbmMyeHBaQzVpY3k1allYSnZkWE5sYkNjc0lIc2djbVZzWVhSbFpGUmhjbWRsZERvZ2NtVnNZWFJsWkZSaGNtZGxkQ3dnWkdseVpXTjBhVzl1T2lCa2FYSmxZM1JwYjI0Z2ZTa2dMeThnZVdWekxDQmNJbk5zYVdSY0lseHVJQ0FnSUdsbUlDZ2tMbk4xY0hCdmNuUXVkSEpoYm5OcGRHbHZiaUFtSmlCMGFHbHpMaVJsYkdWdFpXNTBMbWhoYzBOc1lYTnpLQ2R6Ykdsa1pTY3BLU0I3WEc0Z0lDQWdJQ0FrYm1WNGRDNWhaR1JEYkdGemN5aDBlWEJsS1Z4dUlDQWdJQ0FnSkc1bGVIUmJNRjB1YjJabWMyVjBWMmxrZEdnZ0x5OGdabTl5WTJVZ2NtVm1iRzkzWEc0Z0lDQWdJQ0FrWVdOMGFYWmxMbUZrWkVOc1lYTnpLR1JwY21WamRHbHZiaWxjYmlBZ0lDQWdJQ1J1WlhoMExtRmtaRU5zWVhOektHUnBjbVZqZEdsdmJpbGNiaUFnSUNBZ0lDUmhZM1JwZG1WY2JpQWdJQ0FnSUNBZ0xtOXVaU2duWW5OVWNtRnVjMmwwYVc5dVJXNWtKeXdnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ1J1WlhoMExuSmxiVzkyWlVOc1lYTnpLRnQwZVhCbExDQmthWEpsWTNScGIyNWRMbXB2YVc0b0p5QW5LU2t1WVdSa1EyeGhjM01vSjJGamRHbDJaU2NwWEc0Z0lDQWdJQ0FnSUNBZ0pHRmpkR2wyWlM1eVpXMXZkbVZEYkdGemN5aGJKMkZqZEdsMlpTY3NJR1JwY21WamRHbHZibDB1YW05cGJpZ25JQ2NwS1Z4dUlDQWdJQ0FnSUNBZ0lIUm9ZWFF1YzJ4cFpHbHVaeUE5SUdaaGJITmxYRzRnSUNBZ0lDQWdJQ0FnYzJWMFZHbHRaVzkxZENobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHRjBMaVJsYkdWdFpXNTBMblJ5YVdkblpYSW9jMnhwWkVWMlpXNTBLVnh1SUNBZ0lDQWdJQ0FnSUgwc0lEQXBYRzRnSUNBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0FnSUM1bGJYVnNZWFJsVkhKaGJuTnBkR2x2YmtWdVpDaERZWEp2ZFhObGJDNVVVa0ZPVTBsVVNVOU9YMFJWVWtGVVNVOU9LVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBa1lXTjBhWFpsTG5KbGJXOTJaVU5zWVhOektDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ0pHNWxlSFF1WVdSa1EyeGhjM01vSjJGamRHbDJaU2NwWEc0Z0lDQWdJQ0IwYUdsekxuTnNhV1JwYm1jZ1BTQm1ZV3h6WlZ4dUlDQWdJQ0FnZEdocGN5NGtaV3hsYldWdWRDNTBjbWxuWjJWeUtITnNhV1JGZG1WdWRDbGNiaUFnSUNCOVhHNWNiaUFnSUNCcGMwTjVZMnhwYm1jZ0ppWWdkR2hwY3k1amVXTnNaU2dwWEc1Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwYzF4dUlDQjlYRzVjYmx4dUlDQXZMeUJEUVZKUFZWTkZUQ0JRVEZWSFNVNGdSRVZHU1U1SlZFbFBUbHh1SUNBdkx5QTlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBWeHVYRzRnSUdaMWJtTjBhVzl1SUZCc2RXZHBiaWh2Y0hScGIyNHBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVsWVdOb0tHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJSFpoY2lBa2RHaHBjeUFnSUQwZ0pDaDBhR2x6S1Z4dUlDQWdJQ0FnZG1GeUlHUmhkR0VnSUNBZ1BTQWtkR2hwY3k1a1lYUmhLQ2RpY3k1allYSnZkWE5sYkNjcFhHNGdJQ0FnSUNCMllYSWdiM0IwYVc5dWN5QTlJQ1F1WlhoMFpXNWtLSHQ5TENCRFlYSnZkWE5sYkM1RVJVWkJWVXhVVXl3Z0pIUm9hWE11WkdGMFlTZ3BMQ0IwZVhCbGIyWWdiM0IwYVc5dUlEMDlJQ2R2WW1wbFkzUW5JQ1ltSUc5d2RHbHZiaWxjYmlBZ0lDQWdJSFpoY2lCaFkzUnBiMjRnSUQwZ2RIbHdaVzltSUc5d2RHbHZiaUE5UFNBbmMzUnlhVzVuSnlBL0lHOXdkR2x2YmlBNklHOXdkR2x2Ym5NdWMyeHBaR1ZjYmx4dUlDQWdJQ0FnYVdZZ0tDRmtZWFJoS1NBa2RHaHBjeTVrWVhSaEtDZGljeTVqWVhKdmRYTmxiQ2NzSUNoa1lYUmhJRDBnYm1WM0lFTmhjbTkxYzJWc0tIUm9hWE1zSUc5d2RHbHZibk1wS1NsY2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2IzQjBhVzl1SUQwOUlDZHVkVzFpWlhJbktTQmtZWFJoTG5SdktHOXdkR2x2YmlsY2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0dGamRHbHZiaWtnWkdGMFlWdGhZM1JwYjI1ZEtDbGNiaUFnSUNBZ0lHVnNjMlVnYVdZZ0tHOXdkR2x2Ym5NdWFXNTBaWEoyWVd3cElHUmhkR0V1Y0dGMWMyVW9LUzVqZVdOc1pTZ3BYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSFpoY2lCdmJHUWdQU0FrTG1adUxtTmhjbTkxYzJWc1hHNWNiaUFnSkM1bWJpNWpZWEp2ZFhObGJDQWdJQ0FnSUNBZ0lDQWdJQ0E5SUZCc2RXZHBibHh1SUNBa0xtWnVMbU5oY205MWMyVnNMa052Ym5OMGNuVmpkRzl5SUQwZ1EyRnliM1Z6Wld4Y2JseHVYRzRnSUM4dklFTkJVazlWVTBWTUlFNVBJRU5QVGtaTVNVTlVYRzRnSUM4dklEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlYRzVjYmlBZ0pDNW1iaTVqWVhKdmRYTmxiQzV1YjBOdmJtWnNhV04wSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDUXVabTR1WTJGeWIzVnpaV3dnUFNCdmJHUmNiaUFnSUNCeVpYUjFjbTRnZEdocGMxeHVJQ0I5WEc1Y2JseHVJQ0F2THlCRFFWSlBWVk5GVENCRVFWUkJMVUZRU1Z4dUlDQXZMeUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1WEc0Z0lIWmhjaUJqYkdsamEwaGhibVJzWlhJZ1BTQm1kVzVqZEdsdmJpQW9aU2tnZTF4dUlDQWdJSFpoY2lCb2NtVm1YRzRnSUNBZ2RtRnlJQ1IwYUdseklDQWdQU0FrS0hSb2FYTXBYRzRnSUNBZ2RtRnlJQ1IwWVhKblpYUWdQU0FrS0NSMGFHbHpMbUYwZEhJb0oyUmhkR0V0ZEdGeVoyVjBKeWtnZkh3Z0tHaHlaV1lnUFNBa2RHaHBjeTVoZEhSeUtDZG9jbVZtSnlrcElDWW1JR2h5WldZdWNtVndiR0ZqWlNndkxpb29QejBqVzE1Y1hITmRLeVFwTHl3Z0p5Y3BLU0F2THlCemRISnBjQ0JtYjNJZ2FXVTNYRzRnSUNBZ2FXWWdLQ0VrZEdGeVoyVjBMbWhoYzBOc1lYTnpLQ2RqWVhKdmRYTmxiQ2NwS1NCeVpYUjFjbTVjYmlBZ0lDQjJZWElnYjNCMGFXOXVjeUE5SUNRdVpYaDBaVzVrS0h0OUxDQWtkR0Z5WjJWMExtUmhkR0VvS1N3Z0pIUm9hWE11WkdGMFlTZ3BLVnh1SUNBZ0lIWmhjaUJ6Ykdsa1pVbHVaR1Y0SUQwZ0pIUm9hWE11WVhSMGNpZ25aR0YwWVMxemJHbGtaUzEwYnljcFhHNGdJQ0FnYVdZZ0tITnNhV1JsU1c1a1pYZ3BJRzl3ZEdsdmJuTXVhVzUwWlhKMllXd2dQU0JtWVd4elpWeHVYRzRnSUNBZ1VHeDFaMmx1TG1OaGJHd29KSFJoY21kbGRDd2diM0IwYVc5dWN5bGNibHh1SUNBZ0lHbG1JQ2h6Ykdsa1pVbHVaR1Y0S1NCN1hHNGdJQ0FnSUNBa2RHRnlaMlYwTG1SaGRHRW9KMkp6TG1OaGNtOTFjMlZzSnlrdWRHOG9jMnhwWkdWSmJtUmxlQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQmxMbkJ5WlhabGJuUkVaV1poZFd4MEtDbGNiaUFnZlZ4dVhHNGdJQ1FvWkc5amRXMWxiblFwWEc0Z0lDQWdMbTl1S0NkamJHbGpheTVpY3k1allYSnZkWE5sYkM1a1lYUmhMV0Z3YVNjc0lDZGJaR0YwWVMxemJHbGtaVjBuTENCamJHbGphMGhoYm1Sc1pYSXBYRzRnSUNBZ0xtOXVLQ2RqYkdsamF5NWljeTVqWVhKdmRYTmxiQzVrWVhSaExXRndhU2NzSUNkYlpHRjBZUzF6Ykdsa1pTMTBiMTBuTENCamJHbGphMGhoYm1Sc1pYSXBYRzVjYmlBZ0pDaDNhVzVrYjNjcExtOXVLQ2RzYjJGa0p5d2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ1FvSjF0a1lYUmhMWEpwWkdVOVhDSmpZWEp2ZFhObGJGd2lYU2NwTG1WaFkyZ29ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZG1GeUlDUmpZWEp2ZFhObGJDQTlJQ1FvZEdocGN5bGNiaUFnSUNBZ0lGQnNkV2RwYmk1allXeHNLQ1JqWVhKdmRYTmxiQ3dnSkdOaGNtOTFjMlZzTG1SaGRHRW9LU2xjYmlBZ0lDQjlLVnh1SUNCOUtWeHVYRzU5S0dwUmRXVnllU2s3WEc1Y2JpOHFJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1SUNvZ1FtOXZkSE4wY21Gd09pQmpiMnhzWVhCelpTNXFjeUIyTXk0ekxqZGNiaUFxSUdoMGRIQTZMeTluWlhSaWIyOTBjM1J5WVhBdVkyOXRMMnBoZG1GelkzSnBjSFF2STJOdmJHeGhjSE5sWEc0Z0tpQTlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMWNiaUFxSUVOdmNIbHlhV2RvZENBeU1ERXhMVEl3TVRZZ1ZIZHBkSFJsY2l3Z1NXNWpMbHh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZkSGRpY3k5aWIyOTBjM1J5WVhBdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFNBcUwxeHVYRzR2S2lCcWMyaHBiblFnYkdGMFpXUmxaam9nWm1Gc2MyVWdLaTljYmx4dUsyWjFibU4wYVc5dUlDZ2tLU0I3WEc0Z0lDZDFjMlVnYzNSeWFXTjBKenRjYmx4dUlDQXZMeUJEVDB4TVFWQlRSU0JRVlVKTVNVTWdRMHhCVTFNZ1JFVkdTVTVKVkVsUFRseHVJQ0F2THlBOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1WEc0Z0lIWmhjaUJEYjJ4c1lYQnpaU0E5SUdaMWJtTjBhVzl1SUNobGJHVnRaVzUwTENCdmNIUnBiMjV6S1NCN1hHNGdJQ0FnZEdocGN5NGtaV3hsYldWdWRDQWdJQ0FnSUQwZ0pDaGxiR1Z0Wlc1MEtWeHVJQ0FnSUhSb2FYTXViM0IwYVc5dWN5QWdJQ0FnSUNBOUlDUXVaWGgwWlc1a0tIdDlMQ0JEYjJ4c1lYQnpaUzVFUlVaQlZVeFVVeXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjBhR2x6TGlSMGNtbG5aMlZ5SUNBZ0lDQWdQU0FrS0NkYlpHRjBZUzEwYjJkbmJHVTlYQ0pqYjJ4c1lYQnpaVndpWFZ0b2NtVm1QVndpSXljZ0t5QmxiR1Z0Wlc1MExtbGtJQ3NnSjF3aVhTd25JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNkYlpHRjBZUzEwYjJkbmJHVTlYQ0pqYjJ4c1lYQnpaVndpWFZ0a1lYUmhMWFJoY21kbGREMWNJaU1uSUNzZ1pXeGxiV1Z1ZEM1cFpDQXJJQ2RjSWwwbktWeHVJQ0FnSUhSb2FYTXVkSEpoYm5OcGRHbHZibWx1WnlBOUlHNTFiR3hjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVjR0Z5Wlc1MEtTQjdYRzRnSUNBZ0lDQjBhR2x6TGlSd1lYSmxiblFnUFNCMGFHbHpMbWRsZEZCaGNtVnVkQ2dwWEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11WVdSa1FYSnBZVUZ1WkVOdmJHeGhjSE5sWkVOc1lYTnpLSFJvYVhNdUpHVnNaVzFsYm5Rc0lIUm9hWE11SkhSeWFXZG5aWElwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NTBiMmRuYkdVcElIUm9hWE11ZEc5bloyeGxLQ2xjYmlBZ2ZWeHVYRzRnSUVOdmJHeGhjSE5sTGxaRlVsTkpUMDRnSUQwZ0p6TXVNeTQzSjF4dVhHNGdJRU52Ykd4aGNITmxMbFJTUVU1VFNWUkpUMDVmUkZWU1FWUkpUMDRnUFNBek5UQmNibHh1SUNCRGIyeHNZWEJ6WlM1RVJVWkJWVXhVVXlBOUlIdGNiaUFnSUNCMGIyZG5iR1U2SUhSeWRXVmNiaUFnZlZ4dVhHNGdJRU52Ykd4aGNITmxMbkJ5YjNSdmRIbHdaUzVrYVcxbGJuTnBiMjRnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR2hoYzFkcFpIUm9JRDBnZEdocGN5NGtaV3hsYldWdWRDNW9ZWE5EYkdGemN5Z25kMmxrZEdnbktWeHVJQ0FnSUhKbGRIVnliaUJvWVhOWGFXUjBhQ0EvSUNkM2FXUjBhQ2NnT2lBbmFHVnBaMmgwSjF4dUlDQjlYRzVjYmlBZ1EyOXNiR0Z3YzJVdWNISnZkRzkwZVhCbExuTm9iM2NnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWRISmhibk5wZEdsdmJtbHVaeUI4ZkNCMGFHbHpMaVJsYkdWdFpXNTBMbWhoYzBOc1lYTnpLQ2RwYmljcEtTQnlaWFIxY201Y2JseHVJQ0FnSUhaaGNpQmhZM1JwZG1WelJHRjBZVnh1SUNBZ0lIWmhjaUJoWTNScGRtVnpJRDBnZEdocGN5NGtjR0Z5Wlc1MElDWW1JSFJvYVhNdUpIQmhjbVZ1ZEM1amFHbHNaSEpsYmlnbkxuQmhibVZzSnlrdVkyaHBiR1J5Wlc0b0p5NXBiaXdnTG1OdmJHeGhjSE5wYm1jbktWeHVYRzRnSUNBZ2FXWWdLR0ZqZEdsMlpYTWdKaVlnWVdOMGFYWmxjeTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJR0ZqZEdsMlpYTkVZWFJoSUQwZ1lXTjBhWFpsY3k1a1lYUmhLQ2RpY3k1amIyeHNZWEJ6WlNjcFhHNGdJQ0FnSUNCcFppQW9ZV04wYVhabGMwUmhkR0VnSmlZZ1lXTjBhWFpsYzBSaGRHRXVkSEpoYm5OcGRHbHZibWx1WnlrZ2NtVjBkWEp1WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkbUZ5SUhOMFlYSjBSWFpsYm5RZ1BTQWtMa1YyWlc1MEtDZHphRzkzTG1KekxtTnZiR3hoY0hObEp5bGNiaUFnSUNCMGFHbHpMaVJsYkdWdFpXNTBMblJ5YVdkblpYSW9jM1JoY25SRmRtVnVkQ2xjYmlBZ0lDQnBaaUFvYzNSaGNuUkZkbVZ1ZEM1cGMwUmxabUYxYkhSUWNtVjJaVzUwWldRb0tTa2djbVYwZFhKdVhHNWNiaUFnSUNCcFppQW9ZV04wYVhabGN5QW1KaUJoWTNScGRtVnpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdVR3gxWjJsdUxtTmhiR3dvWVdOMGFYWmxjeXdnSjJocFpHVW5LVnh1SUNBZ0lDQWdZV04wYVhabGMwUmhkR0VnZkh3Z1lXTjBhWFpsY3k1a1lYUmhLQ2RpY3k1amIyeHNZWEJ6WlNjc0lHNTFiR3dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkbUZ5SUdScGJXVnVjMmx2YmlBOUlIUm9hWE11WkdsdFpXNXphVzl1S0NsY2JseHVJQ0FnSUhSb2FYTXVKR1ZzWlcxbGJuUmNiaUFnSUNBZ0lDNXlaVzF2ZG1WRGJHRnpjeWduWTI5c2JHRndjMlVuS1Z4dUlDQWdJQ0FnTG1Ga1pFTnNZWE56S0NkamIyeHNZWEJ6YVc1bkp5bGJaR2x0Wlc1emFXOXVYU2d3S1Z4dUlDQWdJQ0FnTG1GMGRISW9KMkZ5YVdFdFpYaHdZVzVrWldRbkxDQjBjblZsS1Z4dVhHNGdJQ0FnZEdocGN5NGtkSEpwWjJkbGNseHVJQ0FnSUNBZ0xuSmxiVzkyWlVOc1lYTnpLQ2RqYjJ4c1lYQnpaV1FuS1Z4dUlDQWdJQ0FnTG1GMGRISW9KMkZ5YVdFdFpYaHdZVzVrWldRbkxDQjBjblZsS1Z4dVhHNGdJQ0FnZEdocGN5NTBjbUZ1YzJsMGFXOXVhVzVuSUQwZ01WeHVYRzRnSUNBZ2RtRnlJR052YlhCc1pYUmxJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTRrWld4bGJXVnVkRnh1SUNBZ0lDQWdJQ0F1Y21WdGIzWmxRMnhoYzNNb0oyTnZiR3hoY0hOcGJtY25LVnh1SUNBZ0lDQWdJQ0F1WVdSa1EyeGhjM01vSjJOdmJHeGhjSE5sSUdsdUp5bGJaR2x0Wlc1emFXOXVYU2duSnlsY2JpQWdJQ0FnSUhSb2FYTXVkSEpoYm5OcGRHbHZibWx1WnlBOUlEQmNiaUFnSUNBZ0lIUm9hWE11SkdWc1pXMWxiblJjYmlBZ0lDQWdJQ0FnTG5SeWFXZG5aWElvSjNOb2IzZHVMbUp6TG1OdmJHeGhjSE5sSnlsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb0lTUXVjM1Z3Y0c5eWRDNTBjbUZ1YzJsMGFXOXVLU0J5WlhSMWNtNGdZMjl0Y0d4bGRHVXVZMkZzYkNoMGFHbHpLVnh1WEc0Z0lDQWdkbUZ5SUhOamNtOXNiRk5wZW1VZ1BTQWtMbU5oYldWc1EyRnpaU2hiSjNOamNtOXNiQ2NzSUdScGJXVnVjMmx2YmwwdWFtOXBiaWduTFNjcEtWeHVYRzRnSUNBZ2RHaHBjeTRrWld4bGJXVnVkRnh1SUNBZ0lDQWdMbTl1WlNnblluTlVjbUZ1YzJsMGFXOXVSVzVrSnl3Z0pDNXdjbTk0ZVNoamIyMXdiR1YwWlN3Z2RHaHBjeWtwWEc0Z0lDQWdJQ0F1WlcxMWJHRjBaVlJ5WVc1emFYUnBiMjVGYm1Rb1EyOXNiR0Z3YzJVdVZGSkJUbE5KVkVsUFRsOUVWVkpCVkVsUFRpbGJaR2x0Wlc1emFXOXVYU2gwYUdsekxpUmxiR1Z0Wlc1MFd6QmRXM05qY205c2JGTnBlbVZkS1Z4dUlDQjlYRzVjYmlBZ1EyOXNiR0Z3YzJVdWNISnZkRzkwZVhCbExtaHBaR1VnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWRISmhibk5wZEdsdmJtbHVaeUI4ZkNBaGRHaHBjeTRrWld4bGJXVnVkQzVvWVhORGJHRnpjeWduYVc0bktTa2djbVYwZFhKdVhHNWNiaUFnSUNCMllYSWdjM1JoY25SRmRtVnVkQ0E5SUNRdVJYWmxiblFvSjJocFpHVXVZbk11WTI5c2JHRndjMlVuS1Z4dUlDQWdJSFJvYVhNdUpHVnNaVzFsYm5RdWRISnBaMmRsY2loemRHRnlkRVYyWlc1MEtWeHVJQ0FnSUdsbUlDaHpkR0Z5ZEVWMlpXNTBMbWx6UkdWbVlYVnNkRkJ5WlhabGJuUmxaQ2dwS1NCeVpYUjFjbTVjYmx4dUlDQWdJSFpoY2lCa2FXMWxibk5wYjI0Z1BTQjBhR2x6TG1ScGJXVnVjMmx2YmlncFhHNWNiaUFnSUNCMGFHbHpMaVJsYkdWdFpXNTBXMlJwYldWdWMybHZibDBvZEdocGN5NGtaV3hsYldWdWRGdGthVzFsYm5OcGIyNWRLQ2twV3pCZExtOW1abk5sZEVobGFXZG9kRnh1WEc0Z0lDQWdkR2hwY3k0a1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnTG1Ga1pFTnNZWE56S0NkamIyeHNZWEJ6YVc1bkp5bGNiaUFnSUNBZ0lDNXlaVzF2ZG1WRGJHRnpjeWduWTI5c2JHRndjMlVnYVc0bktWeHVJQ0FnSUNBZ0xtRjBkSElvSjJGeWFXRXRaWGh3WVc1a1pXUW5MQ0JtWVd4elpTbGNibHh1SUNBZ0lIUm9hWE11SkhSeWFXZG5aWEpjYmlBZ0lDQWdJQzVoWkdSRGJHRnpjeWduWTI5c2JHRndjMlZrSnlsY2JpQWdJQ0FnSUM1aGRIUnlLQ2RoY21saExXVjRjR0Z1WkdWa0p5d2dabUZzYzJVcFhHNWNiaUFnSUNCMGFHbHpMblJ5WVc1emFYUnBiMjVwYm1jZ1BTQXhYRzVjYmlBZ0lDQjJZWElnWTI5dGNHeGxkR1VnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG5SeVlXNXphWFJwYjI1cGJtY2dQU0F3WEc0Z0lDQWdJQ0IwYUdsekxpUmxiR1Z0Wlc1MFhHNGdJQ0FnSUNBZ0lDNXlaVzF2ZG1WRGJHRnpjeWduWTI5c2JHRndjMmx1WnljcFhHNGdJQ0FnSUNBZ0lDNWhaR1JEYkdGemN5Z25ZMjlzYkdGd2MyVW5LVnh1SUNBZ0lDQWdJQ0F1ZEhKcFoyZGxjaWduYUdsa1pHVnVMbUp6TG1OdmJHeGhjSE5sSnlsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb0lTUXVjM1Z3Y0c5eWRDNTBjbUZ1YzJsMGFXOXVLU0J5WlhSMWNtNGdZMjl0Y0d4bGRHVXVZMkZzYkNoMGFHbHpLVnh1WEc0Z0lDQWdkR2hwY3k0a1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnVzJScGJXVnVjMmx2Ymwwb01DbGNiaUFnSUNBZ0lDNXZibVVvSjJKelZISmhibk5wZEdsdmJrVnVaQ2NzSUNRdWNISnZlSGtvWTI5dGNHeGxkR1VzSUhSb2FYTXBLVnh1SUNBZ0lDQWdMbVZ0ZFd4aGRHVlVjbUZ1YzJsMGFXOXVSVzVrS0VOdmJHeGhjSE5sTGxSU1FVNVRTVlJKVDA1ZlJGVlNRVlJKVDA0cFhHNGdJSDFjYmx4dUlDQkRiMnhzWVhCelpTNXdjbTkwYjNSNWNHVXVkRzluWjJ4bElEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhOYmRHaHBjeTRrWld4bGJXVnVkQzVvWVhORGJHRnpjeWduYVc0bktTQS9JQ2RvYVdSbEp5QTZJQ2R6YUc5M0oxMG9LVnh1SUNCOVhHNWNiaUFnUTI5c2JHRndjMlV1Y0hKdmRHOTBlWEJsTG1kbGRGQmhjbVZ1ZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0pDaDBhR2x6TG05d2RHbHZibk11Y0dGeVpXNTBLVnh1SUNBZ0lDQWdMbVpwYm1Rb0oxdGtZWFJoTFhSdloyZHNaVDFjSW1OdmJHeGhjSE5sWENKZFcyUmhkR0V0Y0dGeVpXNTBQVndpSnlBcklIUm9hWE11YjNCMGFXOXVjeTV3WVhKbGJuUWdLeUFuWENKZEp5bGNiaUFnSUNBZ0lDNWxZV05vS0NRdWNISnZlSGtvWm5WdVkzUnBiMjRnS0drc0lHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUNSbGJHVnRaVzUwSUQwZ0pDaGxiR1Z0Wlc1MEtWeHVJQ0FnSUNBZ0lDQjBhR2x6TG1Ga1pFRnlhV0ZCYm1SRGIyeHNZWEJ6WldSRGJHRnpjeWhuWlhSVVlYSm5aWFJHY205dFZISnBaMmRsY2lna1pXeGxiV1Z1ZENrc0lDUmxiR1Z0Wlc1MEtWeHVJQ0FnSUNBZ2ZTd2dkR2hwY3lrcFhHNGdJQ0FnSUNBdVpXNWtLQ2xjYmlBZ2ZWeHVYRzRnSUVOdmJHeGhjSE5sTG5CeWIzUnZkSGx3WlM1aFpHUkJjbWxoUVc1a1EyOXNiR0Z3YzJWa1EyeGhjM01nUFNCbWRXNWpkR2x2YmlBb0pHVnNaVzFsYm5Rc0lDUjBjbWxuWjJWeUtTQjdYRzRnSUNBZ2RtRnlJR2x6VDNCbGJpQTlJQ1JsYkdWdFpXNTBMbWhoYzBOc1lYTnpLQ2RwYmljcFhHNWNiaUFnSUNBa1pXeGxiV1Z1ZEM1aGRIUnlLQ2RoY21saExXVjRjR0Z1WkdWa0p5d2dhWE5QY0dWdUtWeHVJQ0FnSUNSMGNtbG5aMlZ5WEc0Z0lDQWdJQ0F1ZEc5bloyeGxRMnhoYzNNb0oyTnZiR3hoY0hObFpDY3NJQ0ZwYzA5d1pXNHBYRzRnSUNBZ0lDQXVZWFIwY2lnbllYSnBZUzFsZUhCaGJtUmxaQ2NzSUdselQzQmxiaWxjYmlBZ2ZWeHVYRzRnSUdaMWJtTjBhVzl1SUdkbGRGUmhjbWRsZEVaeWIyMVVjbWxuWjJWeUtDUjBjbWxuWjJWeUtTQjdYRzRnSUNBZ2RtRnlJR2h5WldaY2JpQWdJQ0IyWVhJZ2RHRnlaMlYwSUQwZ0pIUnlhV2RuWlhJdVlYUjBjaWduWkdGMFlTMTBZWEpuWlhRbktWeHVJQ0FnSUNBZ2ZId2dLR2h5WldZZ1BTQWtkSEpwWjJkbGNpNWhkSFJ5S0Nkb2NtVm1KeWtwSUNZbUlHaHlaV1l1Y21Wd2JHRmpaU2d2TGlvb1B6MGpXMTVjWEhOZEt5UXBMeXdnSnljcElDOHZJSE4wY21sd0lHWnZjaUJwWlRkY2JseHVJQ0FnSUhKbGRIVnliaUFrS0hSaGNtZGxkQ2xjYmlBZ2ZWeHVYRzVjYmlBZ0x5OGdRMDlNVEVGUVUwVWdVRXhWUjBsT0lFUkZSa2xPU1ZSSlQwNWNiaUFnTHk4Z1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQxY2JseHVJQ0JtZFc1amRHbHZiaUJRYkhWbmFXNG9iM0IwYVc5dUtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVaV0ZqYUNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQjJZWElnSkhSb2FYTWdJQ0E5SUNRb2RHaHBjeWxjYmlBZ0lDQWdJSFpoY2lCa1lYUmhJQ0FnSUQwZ0pIUm9hWE11WkdGMFlTZ25Zbk11WTI5c2JHRndjMlVuS1Z4dUlDQWdJQ0FnZG1GeUlHOXdkR2x2Ym5NZ1BTQWtMbVY0ZEdWdVpDaDdmU3dnUTI5c2JHRndjMlV1UkVWR1FWVk1WRk1zSUNSMGFHbHpMbVJoZEdFb0tTd2dkSGx3Wlc5bUlHOXdkR2x2YmlBOVBTQW5iMkpxWldOMEp5QW1KaUJ2Y0hScGIyNHBYRzVjYmlBZ0lDQWdJR2xtSUNnaFpHRjBZU0FtSmlCdmNIUnBiMjV6TG5SdloyZHNaU0FtSmlBdmMyaHZkM3hvYVdSbEx5NTBaWE4wS0c5d2RHbHZiaWtwSUc5d2RHbHZibk11ZEc5bloyeGxJRDBnWm1Gc2MyVmNiaUFnSUNBZ0lHbG1JQ2doWkdGMFlTa2dKSFJvYVhNdVpHRjBZU2duWW5NdVkyOXNiR0Z3YzJVbkxDQW9aR0YwWVNBOUlHNWxkeUJEYjJ4c1lYQnpaU2gwYUdsekxDQnZjSFJwYjI1ektTa3BYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JRzl3ZEdsdmJpQTlQU0FuYzNSeWFXNW5KeWtnWkdGMFlWdHZjSFJwYjI1ZEtDbGNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdkbUZ5SUc5c1pDQTlJQ1F1Wm00dVkyOXNiR0Z3YzJWY2JseHVJQ0FrTG1adUxtTnZiR3hoY0hObElDQWdJQ0FnSUNBZ0lDQWdJRDBnVUd4MVoybHVYRzRnSUNRdVptNHVZMjlzYkdGd2MyVXVRMjl1YzNSeWRXTjBiM0lnUFNCRGIyeHNZWEJ6WlZ4dVhHNWNiaUFnTHk4Z1EwOU1URUZRVTBVZ1RrOGdRMDlPUmt4SlExUmNiaUFnTHk4Z1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMWNibHh1SUNBa0xtWnVMbU52Ykd4aGNITmxMbTV2UTI5dVpteHBZM1FnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0pDNW1iaTVqYjJ4c1lYQnpaU0E5SUc5c1pGeHVJQ0FnSUhKbGRIVnliaUIwYUdselhHNGdJSDFjYmx4dVhHNGdJQzh2SUVOUFRFeEJVRk5GSUVSQlZFRXRRVkJKWEc0Z0lDOHZJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlYRzVjYmlBZ0pDaGtiMk4xYldWdWRDa3ViMjRvSjJOc2FXTnJMbUp6TG1OdmJHeGhjSE5sTG1SaGRHRXRZWEJwSnl3Z0oxdGtZWFJoTFhSdloyZHNaVDFjSW1OdmJHeGhjSE5sWENKZEp5d2dablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0IyWVhJZ0pIUm9hWE1nSUNBOUlDUW9kR2hwY3lsY2JseHVJQ0FnSUdsbUlDZ2hKSFJvYVhNdVlYUjBjaWduWkdGMFlTMTBZWEpuWlhRbktTa2daUzV3Y21WMlpXNTBSR1ZtWVhWc2RDZ3BYRzVjYmlBZ0lDQjJZWElnSkhSaGNtZGxkQ0E5SUdkbGRGUmhjbWRsZEVaeWIyMVVjbWxuWjJWeUtDUjBhR2x6S1Z4dUlDQWdJSFpoY2lCa1lYUmhJQ0FnSUQwZ0pIUmhjbWRsZEM1a1lYUmhLQ2RpY3k1amIyeHNZWEJ6WlNjcFhHNGdJQ0FnZG1GeUlHOXdkR2x2YmlBZ1BTQmtZWFJoSUQ4Z0ozUnZaMmRzWlNjZ09pQWtkR2hwY3k1a1lYUmhLQ2xjYmx4dUlDQWdJRkJzZFdkcGJpNWpZV3hzS0NSMFlYSm5aWFFzSUc5d2RHbHZiaWxjYmlBZ2ZTbGNibHh1ZlNocVVYVmxjbmtwTzF4dVhHNHZLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmlBcUlFSnZiM1J6ZEhKaGNEb2daSEp2Y0dSdmQyNHVhbk1nZGpNdU15NDNYRzRnS2lCb2RIUndPaTh2WjJWMFltOXZkSE4wY21Gd0xtTnZiUzlxWVhaaGMyTnlhWEIwTHlOa2NtOXdaRzkzYm5OY2JpQXFJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1SUNvZ1EyOXdlWEpwWjJoMElESXdNVEV0TWpBeE5pQlVkMmwwZEdWeUxDQkpibU11WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzkwZDJKekwySnZiM1J6ZEhKaGNDOWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOUlDb3ZYRzVjYmx4dUsyWjFibU4wYVc5dUlDZ2tLU0I3WEc0Z0lDZDFjMlVnYzNSeWFXTjBKenRjYmx4dUlDQXZMeUJFVWs5UVJFOVhUaUJEVEVGVFV5QkVSVVpKVGtsVVNVOU9YRzRnSUM4dklEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQxY2JseHVJQ0IyWVhJZ1ltRmphMlJ5YjNBZ1BTQW5MbVJ5YjNCa2IzZHVMV0poWTJ0a2NtOXdKMXh1SUNCMllYSWdkRzluWjJ4bElDQWdQU0FuVzJSaGRHRXRkRzluWjJ4bFBWd2laSEp2Y0dSdmQyNWNJbDBuWEc0Z0lIWmhjaUJFY205d1pHOTNiaUE5SUdaMWJtTjBhVzl1SUNobGJHVnRaVzUwS1NCN1hHNGdJQ0FnSkNobGJHVnRaVzUwS1M1dmJpZ25ZMnhwWTJzdVluTXVaSEp2Y0dSdmQyNG5MQ0IwYUdsekxuUnZaMmRzWlNsY2JpQWdmVnh1WEc0Z0lFUnliM0JrYjNkdUxsWkZVbE5KVDA0Z1BTQW5NeTR6TGpjblhHNWNiaUFnWm5WdVkzUnBiMjRnWjJWMFVHRnlaVzUwS0NSMGFHbHpLU0I3WEc0Z0lDQWdkbUZ5SUhObGJHVmpkRzl5SUQwZ0pIUm9hWE11WVhSMGNpZ25aR0YwWVMxMFlYSm5aWFFuS1Z4dVhHNGdJQ0FnYVdZZ0tDRnpaV3hsWTNSdmNpa2dlMXh1SUNBZ0lDQWdjMlZzWldOMGIzSWdQU0FrZEdocGN5NWhkSFJ5S0Nkb2NtVm1KeWxjYmlBZ0lDQWdJSE5sYkdWamRHOXlJRDBnYzJWc1pXTjBiM0lnSmlZZ0x5TmJRUzFhWVMxNlhTOHVkR1Z6ZENoelpXeGxZM1J2Y2lrZ0ppWWdjMlZzWldOMGIzSXVjbVZ3YkdGalpTZ3ZMaW9vUHowalcxNWNYSE5kS2lRcEx5d2dKeWNwSUM4dklITjBjbWx3SUdadmNpQnBaVGRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjJZWElnSkhCaGNtVnVkQ0E5SUhObGJHVmpkRzl5SUNZbUlDUW9jMlZzWldOMGIzSXBYRzVjYmlBZ0lDQnlaWFIxY200Z0pIQmhjbVZ1ZENBbUppQWtjR0Z5Wlc1MExteGxibWQwYUNBL0lDUndZWEpsYm5RZ09pQWtkR2hwY3k1d1lYSmxiblFvS1Z4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z1kyeGxZWEpOWlc1MWN5aGxLU0I3WEc0Z0lDQWdhV1lnS0dVZ0ppWWdaUzUzYUdsamFDQTlQVDBnTXlrZ2NtVjBkWEp1WEc0Z0lDQWdKQ2hpWVdOclpISnZjQ2t1Y21WdGIzWmxLQ2xjYmlBZ0lDQWtLSFJ2WjJkc1pTa3VaV0ZqYUNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQjJZWElnSkhSb2FYTWdJQ0FnSUNBZ0lDQTlJQ1FvZEdocGN5bGNiaUFnSUNBZ0lIWmhjaUFrY0dGeVpXNTBJQ0FnSUNBZ0lEMGdaMlYwVUdGeVpXNTBLQ1IwYUdsektWeHVJQ0FnSUNBZ2RtRnlJSEpsYkdGMFpXUlVZWEpuWlhRZ1BTQjdJSEpsYkdGMFpXUlVZWEpuWlhRNklIUm9hWE1nZlZ4dVhHNGdJQ0FnSUNCcFppQW9JU1J3WVhKbGJuUXVhR0Z6UTJ4aGMzTW9KMjl3Wlc0bktTa2djbVYwZFhKdVhHNWNiaUFnSUNBZ0lHbG1JQ2hsSUNZbUlHVXVkSGx3WlNBOVBTQW5ZMnhwWTJzbklDWW1JQzlwYm5CMWRIeDBaWGgwWVhKbFlTOXBMblJsYzNRb1pTNTBZWEpuWlhRdWRHRm5UbUZ0WlNrZ0ppWWdKQzVqYjI1MFlXbHVjeWdrY0dGeVpXNTBXekJkTENCbExuUmhjbWRsZENrcElISmxkSFZ5Ymx4dVhHNGdJQ0FnSUNBa2NHRnlaVzUwTG5SeWFXZG5aWElvWlNBOUlDUXVSWFpsYm5Rb0oyaHBaR1V1WW5NdVpISnZjR1J2ZDI0bkxDQnlaV3hoZEdWa1ZHRnlaMlYwS1NsY2JseHVJQ0FnSUNBZ2FXWWdLR1V1YVhORVpXWmhkV3gwVUhKbGRtVnVkR1ZrS0NrcElISmxkSFZ5Ymx4dVhHNGdJQ0FnSUNBa2RHaHBjeTVoZEhSeUtDZGhjbWxoTFdWNGNHRnVaR1ZrSnl3Z0oyWmhiSE5sSnlsY2JpQWdJQ0FnSUNSd1lYSmxiblF1Y21WdGIzWmxRMnhoYzNNb0oyOXdaVzRuS1M1MGNtbG5aMlZ5S0NRdVJYWmxiblFvSjJocFpHUmxiaTVpY3k1a2NtOXdaRzkzYmljc0lISmxiR0YwWldSVVlYSm5aWFFwS1Z4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCRWNtOXdaRzkzYmk1d2NtOTBiM1I1Y0dVdWRHOW5aMnhsSUQwZ1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQjJZWElnSkhSb2FYTWdQU0FrS0hSb2FYTXBYRzVjYmlBZ0lDQnBaaUFvSkhSb2FYTXVhWE1vSnk1a2FYTmhZbXhsWkN3Z09tUnBjMkZpYkdWa0p5a3BJSEpsZEhWeWJseHVYRzRnSUNBZ2RtRnlJQ1J3WVhKbGJuUWdJRDBnWjJWMFVHRnlaVzUwS0NSMGFHbHpLVnh1SUNBZ0lIWmhjaUJwYzBGamRHbDJaU0E5SUNSd1lYSmxiblF1YUdGelEyeGhjM01vSjI5d1pXNG5LVnh1WEc0Z0lDQWdZMnhsWVhKTlpXNTFjeWdwWEc1Y2JpQWdJQ0JwWmlBb0lXbHpRV04wYVhabEtTQjdYRzRnSUNBZ0lDQnBaaUFvSjI5dWRHOTFZMmh6ZEdGeWRDY2dhVzRnWkc5amRXMWxiblF1Wkc5amRXMWxiblJGYkdWdFpXNTBJQ1ltSUNFa2NHRnlaVzUwTG1Oc2IzTmxjM1FvSnk1dVlYWmlZWEl0Ym1GMkp5a3ViR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUdsbUlHMXZZbWxzWlNCM1pTQjFjMlVnWVNCaVlXTnJaSEp2Y0NCaVpXTmhkWE5sSUdOc2FXTnJJR1YyWlc1MGN5QmtiMjRuZENCa1pXeGxaMkYwWlZ4dUlDQWdJQ0FnSUNBa0tHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BLVnh1SUNBZ0lDQWdJQ0FnSUM1aFpHUkRiR0Z6Y3lnblpISnZjR1J2ZDI0dFltRmphMlJ5YjNBbktWeHVJQ0FnSUNBZ0lDQWdJQzVwYm5ObGNuUkJablJsY2lna0tIUm9hWE1wS1Z4dUlDQWdJQ0FnSUNBZ0lDNXZiaWduWTJ4cFkyc25MQ0JqYkdWaGNrMWxiblZ6S1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMllYSWdjbVZzWVhSbFpGUmhjbWRsZENBOUlIc2djbVZzWVhSbFpGUmhjbWRsZERvZ2RHaHBjeUI5WEc0Z0lDQWdJQ0FrY0dGeVpXNTBMblJ5YVdkblpYSW9aU0E5SUNRdVJYWmxiblFvSjNOb2IzY3VZbk11WkhKdmNHUnZkMjRuTENCeVpXeGhkR1ZrVkdGeVoyVjBLU2xjYmx4dUlDQWdJQ0FnYVdZZ0tHVXVhWE5FWldaaGRXeDBVSEpsZG1WdWRHVmtLQ2twSUhKbGRIVnlibHh1WEc0Z0lDQWdJQ0FrZEdocGMxeHVJQ0FnSUNBZ0lDQXVkSEpwWjJkbGNpZ25abTlqZFhNbktWeHVJQ0FnSUNBZ0lDQXVZWFIwY2lnbllYSnBZUzFsZUhCaGJtUmxaQ2NzSUNkMGNuVmxKeWxjYmx4dUlDQWdJQ0FnSkhCaGNtVnVkRnh1SUNBZ0lDQWdJQ0F1ZEc5bloyeGxRMnhoYzNNb0oyOXdaVzRuS1Z4dUlDQWdJQ0FnSUNBdWRISnBaMmRsY2lna0xrVjJaVzUwS0NkemFHOTNiaTVpY3k1a2NtOXdaRzkzYmljc0lISmxiR0YwWldSVVlYSm5aWFFwS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQjlYRzVjYmlBZ1JISnZjR1J2ZDI0dWNISnZkRzkwZVhCbExtdGxlV1J2ZDI0Z1BTQm1kVzVqZEdsdmJpQW9aU2tnZTF4dUlDQWdJR2xtSUNnaEx5Z3pPSHcwTUh3eU4zd3pNaWt2TG5SbGMzUW9aUzUzYUdsamFDa2dmSHdnTDJsdWNIVjBmSFJsZUhSaGNtVmhMMmt1ZEdWemRDaGxMblJoY21kbGRDNTBZV2RPWVcxbEtTa2djbVYwZFhKdVhHNWNiaUFnSUNCMllYSWdKSFJvYVhNZ1BTQWtLSFJvYVhNcFhHNWNiaUFnSUNCbExuQnlaWFpsYm5SRVpXWmhkV3gwS0NsY2JpQWdJQ0JsTG5OMGIzQlFjbTl3WVdkaGRHbHZiaWdwWEc1Y2JpQWdJQ0JwWmlBb0pIUm9hWE11YVhNb0p5NWthWE5oWW14bFpDd2dPbVJwYzJGaWJHVmtKeWtwSUhKbGRIVnlibHh1WEc0Z0lDQWdkbUZ5SUNSd1lYSmxiblFnSUQwZ1oyVjBVR0Z5Wlc1MEtDUjBhR2x6S1Z4dUlDQWdJSFpoY2lCcGMwRmpkR2wyWlNBOUlDUndZWEpsYm5RdWFHRnpRMnhoYzNNb0oyOXdaVzRuS1Z4dVhHNGdJQ0FnYVdZZ0tDRnBjMEZqZEdsMlpTQW1KaUJsTG5kb2FXTm9JQ0U5SURJM0lIeDhJR2x6UVdOMGFYWmxJQ1ltSUdVdWQyaHBZMmdnUFQwZ01qY3BJSHRjYmlBZ0lDQWdJR2xtSUNobExuZG9hV05vSUQwOUlESTNLU0FrY0dGeVpXNTBMbVpwYm1Rb2RHOW5aMnhsS1M1MGNtbG5aMlZ5S0NkbWIyTjFjeWNwWEc0Z0lDQWdJQ0J5WlhSMWNtNGdKSFJvYVhNdWRISnBaMmRsY2lnblkyeHBZMnNuS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSFpoY2lCa1pYTmpJRDBnSnlCc2FUcHViM1FvTG1ScGMyRmliR1ZrS1RwMmFYTnBZbXhsSUdFblhHNGdJQ0FnZG1GeUlDUnBkR1Z0Y3lBOUlDUndZWEpsYm5RdVptbHVaQ2duTG1SeWIzQmtiM2R1TFcxbGJuVW5JQ3NnWkdWell5bGNibHh1SUNBZ0lHbG1JQ2doSkdsMFpXMXpMbXhsYm1kMGFDa2djbVYwZFhKdVhHNWNiaUFnSUNCMllYSWdhVzVrWlhnZ1BTQWthWFJsYlhNdWFXNWtaWGdvWlM1MFlYSm5aWFFwWEc1Y2JpQWdJQ0JwWmlBb1pTNTNhR2xqYUNBOVBTQXpPQ0FtSmlCcGJtUmxlQ0ErSURBcElDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJtUmxlQzB0SUNBZ0lDQWdJQ0FnTHk4Z2RYQmNiaUFnSUNCcFppQW9aUzUzYUdsamFDQTlQU0EwTUNBbUppQnBibVJsZUNBOElDUnBkR1Z0Y3k1c1pXNW5kR2dnTFNBeEtTQnBibVJsZUNzcklDQWdJQ0FnSUNBZ0x5OGdaRzkzYmx4dUlDQWdJR2xtSUNnaGZtbHVaR1Y0S1NBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdVpHVjRJRDBnTUZ4dVhHNGdJQ0FnSkdsMFpXMXpMbVZ4S0dsdVpHVjRLUzUwY21sbloyVnlLQ2RtYjJOMWN5Y3BYRzRnSUgxY2JseHVYRzRnSUM4dklFUlNUMUJFVDFkT0lGQk1WVWRKVGlCRVJVWkpUa2xVU1U5T1hHNGdJQzh2SUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5WEc1Y2JpQWdablZ1WTNScGIyNGdVR3gxWjJsdUtHOXdkR2x2YmlrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtVmhZMmdvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RtRnlJQ1IwYUdseklEMGdKQ2gwYUdsektWeHVJQ0FnSUNBZ2RtRnlJR1JoZEdFZ0lEMGdKSFJvYVhNdVpHRjBZU2duWW5NdVpISnZjR1J2ZDI0bktWeHVYRzRnSUNBZ0lDQnBaaUFvSVdSaGRHRXBJQ1IwYUdsekxtUmhkR0VvSjJKekxtUnliM0JrYjNkdUp5d2dLR1JoZEdFZ1BTQnVaWGNnUkhKdmNHUnZkMjRvZEdocGN5a3BLVnh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJ2Y0hScGIyNGdQVDBnSjNOMGNtbHVaeWNwSUdSaGRHRmJiM0IwYVc5dVhTNWpZV3hzS0NSMGFHbHpLVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0IyWVhJZ2IyeGtJRDBnSkM1bWJpNWtjbTl3Wkc5M2JseHVYRzRnSUNRdVptNHVaSEp2Y0dSdmQyNGdJQ0FnSUNBZ0lDQWdJQ0FnUFNCUWJIVm5hVzVjYmlBZ0pDNW1iaTVrY205d1pHOTNiaTVEYjI1emRISjFZM1J2Y2lBOUlFUnliM0JrYjNkdVhHNWNibHh1SUNBdkx5QkVVazlRUkU5WFRpQk9UeUJEVDA1R1RFbERWRnh1SUNBdkx5QTlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1WEc0Z0lDUXVabTR1WkhKdmNHUnZkMjR1Ym05RGIyNW1iR2xqZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWtMbVp1TG1SeWIzQmtiM2R1SUQwZ2IyeGtYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTmNiaUFnZlZ4dVhHNWNiaUFnTHk4Z1FWQlFURmtnVkU4Z1UxUkJUa1JCVWtRZ1JGSlBVRVJQVjA0Z1JVeEZUVVZPVkZOY2JpQWdMeThnUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmx4dUlDQWtLR1J2WTNWdFpXNTBLVnh1SUNBZ0lDNXZiaWduWTJ4cFkyc3VZbk11WkhKdmNHUnZkMjR1WkdGMFlTMWhjR2tuTENCamJHVmhjazFsYm5WektWeHVJQ0FnSUM1dmJpZ25ZMnhwWTJzdVluTXVaSEp2Y0dSdmQyNHVaR0YwWVMxaGNHa25MQ0FuTG1SeWIzQmtiM2R1SUdadmNtMG5MQ0JtZFc1amRHbHZiaUFvWlNrZ2V5QmxMbk4wYjNCUWNtOXdZV2RoZEdsdmJpZ3BJSDBwWEc0Z0lDQWdMbTl1S0NkamJHbGpheTVpY3k1a2NtOXdaRzkzYmk1a1lYUmhMV0Z3YVNjc0lIUnZaMmRzWlN3Z1JISnZjR1J2ZDI0dWNISnZkRzkwZVhCbExuUnZaMmRzWlNsY2JpQWdJQ0F1YjI0b0oydGxlV1J2ZDI0dVluTXVaSEp2Y0dSdmQyNHVaR0YwWVMxaGNHa25MQ0IwYjJkbmJHVXNJRVJ5YjNCa2IzZHVMbkJ5YjNSdmRIbHdaUzVyWlhsa2IzZHVLVnh1SUNBZ0lDNXZiaWduYTJWNVpHOTNiaTVpY3k1a2NtOXdaRzkzYmk1a1lYUmhMV0Z3YVNjc0lDY3VaSEp2Y0dSdmQyNHRiV1Z1ZFNjc0lFUnliM0JrYjNkdUxuQnliM1J2ZEhsd1pTNXJaWGxrYjNkdUtWeHVYRzU5S0dwUmRXVnllU2s3WEc1Y2JpOHFJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1SUNvZ1FtOXZkSE4wY21Gd09pQnRiMlJoYkM1cWN5QjJNeTR6TGpkY2JpQXFJR2gwZEhBNkx5OW5aWFJpYjI5MGMzUnlZWEF1WTI5dEwycGhkbUZ6WTNKcGNIUXZJMjF2WkdGc2MxeHVJQ29nUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5WEc0Z0tpQkRiM0I1Y21sbmFIUWdNakF4TVMweU1ERTJJRlIzYVhSMFpYSXNJRWx1WXk1Y2JpQXFJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0FvYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNSM1luTXZZbTl2ZEhOMGNtRndMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQTlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMGdLaTljYmx4dVhHNHJablZ1WTNScGIyNGdLQ1FwSUh0Y2JpQWdKM1Z6WlNCemRISnBZM1FuTzF4dVhHNGdJQzh2SUUxUFJFRk1JRU5NUVZOVElFUkZSa2xPU1ZSSlQwNWNiaUFnTHk4Z1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1WEc0Z0lIWmhjaUJOYjJSaGJDQTlJR1oxYm1OMGFXOXVJQ2hsYkdWdFpXNTBMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjV6SUNBZ0lDQWdJQ0FnSUNBZ0lEMGdiM0IwYVc5dWMxeHVJQ0FnSUhSb2FYTXVKR0p2WkhrZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E5SUNRb1pHOWpkVzFsYm5RdVltOWtlU2xjYmlBZ0lDQjBhR2x6TGlSbGJHVnRaVzUwSUNBZ0lDQWdJQ0FnSUNBZ1BTQWtLR1ZzWlcxbGJuUXBYRzRnSUNBZ2RHaHBjeTRrWkdsaGJHOW5JQ0FnSUNBZ0lDQWdJQ0FnSUQwZ2RHaHBjeTRrWld4bGJXVnVkQzVtYVc1a0tDY3ViVzlrWVd3dFpHbGhiRzluSnlsY2JpQWdJQ0IwYUdsekxpUmlZV05yWkhKdmNDQWdJQ0FnSUNBZ0lDQWdQU0J1ZFd4c1hHNGdJQ0FnZEdocGN5NXBjMU5vYjNkdUlDQWdJQ0FnSUNBZ0lDQWdJRDBnYm5Wc2JGeHVJQ0FnSUhSb2FYTXViM0pwWjJsdVlXeENiMlI1VUdGa0lDQWdJQ0E5SUc1MWJHeGNiaUFnSUNCMGFHbHpMbk5qY205c2JHSmhjbGRwWkhSb0lDQWdJQ0FnUFNBd1hHNGdJQ0FnZEdocGN5NXBaMjV2Y21WQ1lXTnJaSEp2Y0VOc2FXTnJJRDBnWm1Gc2MyVmNibHh1SUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWNtVnRiM1JsS1NCN1hHNGdJQ0FnSUNCMGFHbHpMaVJsYkdWdFpXNTBYRzRnSUNBZ0lDQWdJQzVtYVc1a0tDY3ViVzlrWVd3dFkyOXVkR1Z1ZENjcFhHNGdJQ0FnSUNBZ0lDNXNiMkZrS0hSb2FYTXViM0IwYVc5dWN5NXlaVzF2ZEdVc0lDUXVjSEp2ZUhrb1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVKR1ZzWlcxbGJuUXVkSEpwWjJkbGNpZ25iRzloWkdWa0xtSnpMbTF2WkdGc0p5bGNiaUFnSUNBZ0lDQWdmU3dnZEdocGN5a3BYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdUVzlrWVd3dVZrVlNVMGxQVGlBZ1BTQW5NeTR6TGpjblhHNWNiaUFnVFc5a1lXd3VWRkpCVGxOSlZFbFBUbDlFVlZKQlZFbFBUaUE5SURNd01GeHVJQ0JOYjJSaGJDNUNRVU5MUkZKUFVGOVVVa0ZPVTBsVVNVOU9YMFJWVWtGVVNVOU9JRDBnTVRVd1hHNWNiaUFnVFc5a1lXd3VSRVZHUVZWTVZGTWdQU0I3WEc0Z0lDQWdZbUZqYTJSeWIzQTZJSFJ5ZFdVc1hHNGdJQ0FnYTJWNVltOWhjbVE2SUhSeWRXVXNYRzRnSUNBZ2MyaHZkem9nZEhKMVpWeHVJQ0I5WEc1Y2JpQWdUVzlrWVd3dWNISnZkRzkwZVhCbExuUnZaMmRzWlNBOUlHWjFibU4wYVc5dUlDaGZjbVZzWVhSbFpGUmhjbWRsZENrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtbHpVMmh2ZDI0Z1B5QjBhR2x6TG1ocFpHVW9LU0E2SUhSb2FYTXVjMmh2ZHloZmNtVnNZWFJsWkZSaGNtZGxkQ2xjYmlBZ2ZWeHVYRzRnSUUxdlpHRnNMbkJ5YjNSdmRIbHdaUzV6YUc5M0lEMGdablZ1WTNScGIyNGdLRjl5Wld4aGRHVmtWR0Z5WjJWMEtTQjdYRzRnSUNBZ2RtRnlJSFJvWVhRZ1BTQjBhR2x6WEc0Z0lDQWdkbUZ5SUdVZ0lDQWdQU0FrTGtWMlpXNTBLQ2R6YUc5M0xtSnpMbTF2WkdGc0p5d2dleUJ5Wld4aGRHVmtWR0Z5WjJWME9pQmZjbVZzWVhSbFpGUmhjbWRsZENCOUtWeHVYRzRnSUNBZ2RHaHBjeTRrWld4bGJXVnVkQzUwY21sbloyVnlLR1VwWEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTVwYzFOb2IzZHVJSHg4SUdVdWFYTkVaV1poZFd4MFVISmxkbVZ1ZEdWa0tDa3BJSEpsZEhWeWJseHVYRzRnSUNBZ2RHaHBjeTVwYzFOb2IzZHVJRDBnZEhKMVpWeHVYRzRnSUNBZ2RHaHBjeTVqYUdWamExTmpjbTlzYkdKaGNpZ3BYRzRnSUNBZ2RHaHBjeTV6WlhSVFkzSnZiR3hpWVhJb0tWeHVJQ0FnSUhSb2FYTXVKR0p2WkhrdVlXUmtRMnhoYzNNb0oyMXZaR0ZzTFc5d1pXNG5LVnh1WEc0Z0lDQWdkR2hwY3k1bGMyTmhjR1VvS1Z4dUlDQWdJSFJvYVhNdWNtVnphWHBsS0NsY2JseHVJQ0FnSUhSb2FYTXVKR1ZzWlcxbGJuUXViMjRvSjJOc2FXTnJMbVJwYzIxcGMzTXVZbk11Ylc5a1lXd25MQ0FuVzJSaGRHRXRaR2x6YldsemN6MWNJbTF2WkdGc1hDSmRKeXdnSkM1d2NtOTRlU2gwYUdsekxtaHBaR1VzSUhSb2FYTXBLVnh1WEc0Z0lDQWdkR2hwY3k0a1pHbGhiRzluTG05dUtDZHRiM1Z6WldSdmQyNHVaR2x6YldsemN5NWljeTV0YjJSaGJDY3NJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FnSUhSb1lYUXVKR1ZzWlcxbGJuUXViMjVsS0NkdGIzVnpaWFZ3TG1ScGMyMXBjM011WW5NdWJXOWtZV3duTENCbWRXNWpkR2x2YmlBb1pTa2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb0pDaGxMblJoY21kbGRDa3VhWE1vZEdoaGRDNGtaV3hsYldWdWRDa3BJSFJvWVhRdWFXZHViM0psUW1GamEyUnliM0JEYkdsamF5QTlJSFJ5ZFdWY2JpQWdJQ0FnSUgwcFhHNGdJQ0FnZlNsY2JseHVJQ0FnSUhSb2FYTXVZbUZqYTJSeWIzQW9ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZG1GeUlIUnlZVzV6YVhScGIyNGdQU0FrTG5OMWNIQnZjblF1ZEhKaGJuTnBkR2x2YmlBbUppQjBhR0YwTGlSbGJHVnRaVzUwTG1oaGMwTnNZWE56S0NkbVlXUmxKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tDRjBhR0YwTGlSbGJHVnRaVzUwTG5CaGNtVnVkQ2dwTG14bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHRjBMaVJsYkdWdFpXNTBMbUZ3Y0dWdVpGUnZLSFJvWVhRdUpHSnZaSGtwSUM4dklHUnZiaWQwSUcxdmRtVWdiVzlrWVd4eklHUnZiU0J3YjNOcGRHbHZibHh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdGMExpUmxiR1Z0Wlc1MFhHNGdJQ0FnSUNBZ0lDNXphRzkzS0NsY2JpQWdJQ0FnSUNBZ0xuTmpjbTlzYkZSdmNDZ3dLVnh1WEc0Z0lDQWdJQ0IwYUdGMExtRmthblZ6ZEVScFlXeHZaeWdwWEc1Y2JpQWdJQ0FnSUdsbUlDaDBjbUZ1YzJsMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUhSb1lYUXVKR1ZzWlcxbGJuUmJNRjB1YjJabWMyVjBWMmxrZEdnZ0x5OGdabTl5WTJVZ2NtVm1iRzkzWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb1lYUXVKR1ZzWlcxbGJuUXVZV1JrUTJ4aGMzTW9KMmx1SnlsY2JseHVJQ0FnSUNBZ2RHaGhkQzVsYm1admNtTmxSbTlqZFhNb0tWeHVYRzRnSUNBZ0lDQjJZWElnWlNBOUlDUXVSWFpsYm5Rb0ozTm9iM2R1TG1KekxtMXZaR0ZzSnl3Z2V5QnlaV3hoZEdWa1ZHRnlaMlYwT2lCZmNtVnNZWFJsWkZSaGNtZGxkQ0I5S1Z4dVhHNGdJQ0FnSUNCMGNtRnVjMmwwYVc5dUlEOWNiaUFnSUNBZ0lDQWdkR2hoZEM0a1pHbGhiRzluSUM4dklIZGhhWFFnWm05eUlHMXZaR0ZzSUhSdklITnNhV1JsSUdsdVhHNGdJQ0FnSUNBZ0lDQWdMbTl1WlNnblluTlVjbUZ1YzJsMGFXOXVSVzVrSnl3Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaGhkQzRrWld4bGJXVnVkQzUwY21sbloyVnlLQ2RtYjJOMWN5Y3BMblJ5YVdkblpYSW9aU2xjYmlBZ0lDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ0lDQWdJQzVsYlhWc1lYUmxWSEpoYm5OcGRHbHZia1Z1WkNoTmIyUmhiQzVVVWtGT1UwbFVTVTlPWDBSVlVrRlVTVTlPS1NBNlhHNGdJQ0FnSUNBZ0lIUm9ZWFF1SkdWc1pXMWxiblF1ZEhKcFoyZGxjaWduWm05amRYTW5LUzUwY21sbloyVnlLR1VwWEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUUxdlpHRnNMbkJ5YjNSdmRIbHdaUzVvYVdSbElEMGdablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0JwWmlBb1pTa2daUzV3Y21WMlpXNTBSR1ZtWVhWc2RDZ3BYRzVjYmlBZ0lDQmxJRDBnSkM1RmRtVnVkQ2duYUdsa1pTNWljeTV0YjJSaGJDY3BYRzVjYmlBZ0lDQjBhR2x6TGlSbGJHVnRaVzUwTG5SeWFXZG5aWElvWlNsY2JseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1cGMxTm9iM2R1SUh4OElHVXVhWE5FWldaaGRXeDBVSEpsZG1WdWRHVmtLQ2twSUhKbGRIVnlibHh1WEc0Z0lDQWdkR2hwY3k1cGMxTm9iM2R1SUQwZ1ptRnNjMlZjYmx4dUlDQWdJSFJvYVhNdVpYTmpZWEJsS0NsY2JpQWdJQ0IwYUdsekxuSmxjMmw2WlNncFhHNWNiaUFnSUNBa0tHUnZZM1Z0Wlc1MEtTNXZabVlvSjJadlkzVnphVzR1WW5NdWJXOWtZV3duS1Z4dVhHNGdJQ0FnZEdocGN5NGtaV3hsYldWdWRGeHVJQ0FnSUNBZ0xuSmxiVzkyWlVOc1lYTnpLQ2RwYmljcFhHNGdJQ0FnSUNBdWIyWm1LQ2RqYkdsamF5NWthWE50YVhOekxtSnpMbTF2WkdGc0p5bGNiaUFnSUNBZ0lDNXZabVlvSjIxdmRYTmxkWEF1WkdsemJXbHpjeTVpY3k1dGIyUmhiQ2NwWEc1Y2JpQWdJQ0IwYUdsekxpUmthV0ZzYjJjdWIyWm1LQ2R0YjNWelpXUnZkMjR1WkdsemJXbHpjeTVpY3k1dGIyUmhiQ2NwWEc1Y2JpQWdJQ0FrTG5OMWNIQnZjblF1ZEhKaGJuTnBkR2x2YmlBbUppQjBhR2x6TGlSbGJHVnRaVzUwTG1oaGMwTnNZWE56S0NkbVlXUmxKeWtnUDF4dUlDQWdJQ0FnZEdocGN5NGtaV3hsYldWdWRGeHVJQ0FnSUNBZ0lDQXViMjVsS0NkaWMxUnlZVzV6YVhScGIyNUZibVFuTENBa0xuQnliM2g1S0hSb2FYTXVhR2xrWlUxdlpHRnNMQ0IwYUdsektTbGNiaUFnSUNBZ0lDQWdMbVZ0ZFd4aGRHVlVjbUZ1YzJsMGFXOXVSVzVrS0UxdlpHRnNMbFJTUVU1VFNWUkpUMDVmUkZWU1FWUkpUMDRwSURwY2JpQWdJQ0FnSUhSb2FYTXVhR2xrWlUxdlpHRnNLQ2xjYmlBZ2ZWeHVYRzRnSUUxdlpHRnNMbkJ5YjNSdmRIbHdaUzVsYm1admNtTmxSbTlqZFhNZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdKQ2hrYjJOMWJXVnVkQ2xjYmlBZ0lDQWdJQzV2Wm1Zb0oyWnZZM1Z6YVc0dVluTXViVzlrWVd3bktTQXZMeUJuZFdGeVpDQmhaMkZwYm5OMElHbHVabWx1YVhSbElHWnZZM1Z6SUd4dmIzQmNiaUFnSUNBZ0lDNXZiaWduWm05amRYTnBiaTVpY3k1dGIyUmhiQ2NzSUNRdWNISnZlSGtvWm5WdVkzUnBiMjRnS0dVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0dSdlkzVnRaVzUwSUNFOVBTQmxMblJoY21kbGRDQW1KbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTRrWld4bGJXVnVkRnN3WFNBaFBUMGdaUzUwWVhKblpYUWdKaVpjYmlBZ0lDQWdJQ0FnSUNBZ0lDRjBhR2x6TGlSbGJHVnRaVzUwTG1oaGN5aGxMblJoY21kbGRDa3ViR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NGtaV3hsYldWdWRDNTBjbWxuWjJWeUtDZG1iMk4xY3ljcFhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMHNJSFJvYVhNcEtWeHVJQ0I5WEc1Y2JpQWdUVzlrWVd3dWNISnZkRzkwZVhCbExtVnpZMkZ3WlNBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdocGN5NXBjMU5vYjNkdUlDWW1JSFJvYVhNdWIzQjBhVzl1Y3k1clpYbGliMkZ5WkNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTRrWld4bGJXVnVkQzV2YmlnbmEyVjVaRzkzYmk1a2FYTnRhWE56TG1KekxtMXZaR0ZzSnl3Z0pDNXdjbTk0ZVNobWRXNWpkR2x2YmlBb1pTa2dlMXh1SUNBZ0lDQWdJQ0JsTG5kb2FXTm9JRDA5SURJM0lDWW1JSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdJQ0I5TENCMGFHbHpLU2xjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLQ0YwYUdsekxtbHpVMmh2ZDI0cElIdGNiaUFnSUNBZ0lIUm9hWE11SkdWc1pXMWxiblF1YjJabUtDZHJaWGxrYjNkdUxtUnBjMjFwYzNNdVluTXViVzlrWVd3bktWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lFMXZaR0ZzTG5CeWIzUnZkSGx3WlM1eVpYTnBlbVVnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWFYTlRhRzkzYmlrZ2UxeHVJQ0FnSUNBZ0pDaDNhVzVrYjNjcExtOXVLQ2R5WlhOcGVtVXVZbk11Ylc5a1lXd25MQ0FrTG5CeWIzaDVLSFJvYVhNdWFHRnVaR3hsVlhCa1lYUmxMQ0IwYUdsektTbGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSkNoM2FXNWtiM2NwTG05bVppZ25jbVZ6YVhwbExtSnpMbTF2WkdGc0p5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQk5iMlJoYkM1d2NtOTBiM1I1Y0dVdWFHbGtaVTF2WkdGc0lEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCMGFHRjBJRDBnZEdocGMxeHVJQ0FnSUhSb2FYTXVKR1ZzWlcxbGJuUXVhR2xrWlNncFhHNGdJQ0FnZEdocGN5NWlZV05yWkhKdmNDaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0IwYUdGMExpUmliMlI1TG5KbGJXOTJaVU5zWVhOektDZHRiMlJoYkMxdmNHVnVKeWxjYmlBZ0lDQWdJSFJvWVhRdWNtVnpaWFJCWkdwMWMzUnRaVzUwY3lncFhHNGdJQ0FnSUNCMGFHRjBMbkpsYzJWMFUyTnliMnhzWW1GeUtDbGNiaUFnSUNBZ0lIUm9ZWFF1SkdWc1pXMWxiblF1ZEhKcFoyZGxjaWduYUdsa1pHVnVMbUp6TG0xdlpHRnNKeWxjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnVFc5a1lXd3VjSEp2ZEc5MGVYQmxMbkpsYlc5MlpVSmhZMnRrY205d0lEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdUpHSmhZMnRrY205d0lDWW1JSFJvYVhNdUpHSmhZMnRrY205d0xuSmxiVzkyWlNncFhHNGdJQ0FnZEdocGN5NGtZbUZqYTJSeWIzQWdQU0J1ZFd4c1hHNGdJSDFjYmx4dUlDQk5iMlJoYkM1d2NtOTBiM1I1Y0dVdVltRmphMlJ5YjNBZ1BTQm1kVzVqZEdsdmJpQW9ZMkZzYkdKaFkyc3BJSHRjYmlBZ0lDQjJZWElnZEdoaGRDQTlJSFJvYVhOY2JpQWdJQ0IyWVhJZ1lXNXBiV0YwWlNBOUlIUm9hWE11SkdWc1pXMWxiblF1YUdGelEyeGhjM01vSjJaaFpHVW5LU0EvSUNkbVlXUmxKeUE2SUNjblhHNWNiaUFnSUNCcFppQW9kR2hwY3k1cGMxTm9iM2R1SUNZbUlIUm9hWE11YjNCMGFXOXVjeTVpWVdOclpISnZjQ2tnZTF4dUlDQWdJQ0FnZG1GeUlHUnZRVzVwYldGMFpTQTlJQ1F1YzNWd2NHOXlkQzUwY21GdWMybDBhVzl1SUNZbUlHRnVhVzFoZEdWY2JseHVJQ0FnSUNBZ2RHaHBjeTRrWW1GamEyUnliM0FnUFNBa0tHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BLVnh1SUNBZ0lDQWdJQ0F1WVdSa1EyeGhjM01vSjIxdlpHRnNMV0poWTJ0a2NtOXdJQ2NnS3lCaGJtbHRZWFJsS1Z4dUlDQWdJQ0FnSUNBdVlYQndaVzVrVkc4b2RHaHBjeTRrWW05a2VTbGNibHh1SUNBZ0lDQWdkR2hwY3k0a1pXeGxiV1Z1ZEM1dmJpZ25ZMnhwWTJzdVpHbHpiV2x6Y3k1aWN5NXRiMlJoYkNjc0lDUXVjSEp2ZUhrb1puVnVZM1JwYjI0Z0tHVXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11YVdkdWIzSmxRbUZqYTJSeWIzQkRiR2xqYXlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWFXZHViM0psUW1GamEyUnliM0JEYkdsamF5QTlJR1poYkhObFhHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdhV1lnS0dVdWRHRnlaMlYwSUNFOVBTQmxMbU4xY25KbGJuUlVZWEpuWlhRcElISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVZbUZqYTJSeWIzQWdQVDBnSjNOMFlYUnBZeWRjYmlBZ0lDQWdJQ0FnSUNBL0lIUm9hWE11SkdWc1pXMWxiblJiTUYwdVptOWpkWE1vS1Z4dUlDQWdJQ0FnSUNBZ0lEb2dkR2hwY3k1b2FXUmxLQ2xjYmlBZ0lDQWdJSDBzSUhSb2FYTXBLVnh1WEc0Z0lDQWdJQ0JwWmlBb1pHOUJibWx0WVhSbEtTQjBhR2x6TGlSaVlXTnJaSEp2Y0Zzd1hTNXZabVp6WlhSWGFXUjBhQ0F2THlCbWIzSmpaU0J5Wldac2IzZGNibHh1SUNBZ0lDQWdkR2hwY3k0a1ltRmphMlJ5YjNBdVlXUmtRMnhoYzNNb0oybHVKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpZV3hzWW1GamF5a2djbVYwZFhKdVhHNWNiaUFnSUNBZ0lHUnZRVzVwYldGMFpTQS9YRzRnSUNBZ0lDQWdJSFJvYVhNdUpHSmhZMnRrY205d1hHNGdJQ0FnSUNBZ0lDQWdMbTl1WlNnblluTlVjbUZ1YzJsMGFXOXVSVzVrSnl3Z1kyRnNiR0poWTJzcFhHNGdJQ0FnSUNBZ0lDQWdMbVZ0ZFd4aGRHVlVjbUZ1YzJsMGFXOXVSVzVrS0UxdlpHRnNMa0pCUTB0RVVrOVFYMVJTUVU1VFNWUkpUMDVmUkZWU1FWUkpUMDRwSURwY2JpQWdJQ0FnSUNBZ1kyRnNiR0poWTJzb0tWeHVYRzRnSUNBZ2ZTQmxiSE5sSUdsbUlDZ2hkR2hwY3k1cGMxTm9iM2R1SUNZbUlIUm9hWE11SkdKaFkydGtjbTl3S1NCN1hHNGdJQ0FnSUNCMGFHbHpMaVJpWVdOclpISnZjQzV5WlcxdmRtVkRiR0Z6Y3lnbmFXNG5LVnh1WEc0Z0lDQWdJQ0IyWVhJZ1kyRnNiR0poWTJ0U1pXMXZkbVVnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJSFJvWVhRdWNtVnRiM1psUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCallXeHNZbUZqYXlBbUppQmpZV3hzWW1GamF5Z3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQWtMbk4xY0hCdmNuUXVkSEpoYm5OcGRHbHZiaUFtSmlCMGFHbHpMaVJsYkdWdFpXNTBMbWhoYzBOc1lYTnpLQ2RtWVdSbEp5a2dQMXh1SUNBZ0lDQWdJQ0IwYUdsekxpUmlZV05yWkhKdmNGeHVJQ0FnSUNBZ0lDQWdJQzV2Ym1Vb0oySnpWSEpoYm5OcGRHbHZia1Z1WkNjc0lHTmhiR3hpWVdOclVtVnRiM1psS1Z4dUlDQWdJQ0FnSUNBZ0lDNWxiWFZzWVhSbFZISmhibk5wZEdsdmJrVnVaQ2hOYjJSaGJDNUNRVU5MUkZKUFVGOVVVa0ZPVTBsVVNVOU9YMFJWVWtGVVNVOU9LU0E2WEc0Z0lDQWdJQ0FnSUdOaGJHeGlZV05yVW1WdGIzWmxLQ2xjYmx4dUlDQWdJSDBnWld4elpTQnBaaUFvWTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUdOaGJHeGlZV05yS0NsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdkx5QjBhR1Z6WlNCbWIyeHNiM2RwYm1jZ2JXVjBhRzlrY3lCaGNtVWdkWE5sWkNCMGJ5Qm9ZVzVrYkdVZ2IzWmxjbVpzYjNkcGJtY2diVzlrWVd4elhHNWNiaUFnVFc5a1lXd3VjSEp2ZEc5MGVYQmxMbWhoYm1Sc1pWVndaR0YwWlNBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TG1Ga2FuVnpkRVJwWVd4dlp5Z3BYRzRnSUgxY2JseHVJQ0JOYjJSaGJDNXdjbTkwYjNSNWNHVXVZV1JxZFhOMFJHbGhiRzluSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ0YjJSaGJFbHpUM1psY21ac2IzZHBibWNnUFNCMGFHbHpMaVJsYkdWdFpXNTBXekJkTG5OamNtOXNiRWhsYVdkb2RDQStJR1J2WTNWdFpXNTBMbVJ2WTNWdFpXNTBSV3hsYldWdWRDNWpiR2xsYm5SSVpXbG5hSFJjYmx4dUlDQWdJSFJvYVhNdUpHVnNaVzFsYm5RdVkzTnpLSHRjYmlBZ0lDQWdJSEJoWkdScGJtZE1aV1owT2lBZ0lYUm9hWE11WW05a2VVbHpUM1psY21ac2IzZHBibWNnSmlZZ2JXOWtZV3hKYzA5MlpYSm1iRzkzYVc1bklEOGdkR2hwY3k1elkzSnZiR3hpWVhKWGFXUjBhQ0E2SUNjbkxGeHVJQ0FnSUNBZ2NHRmtaR2x1WjFKcFoyaDBPaUIwYUdsekxtSnZaSGxKYzA5MlpYSm1iRzkzYVc1bklDWW1JQ0Z0YjJSaGJFbHpUM1psY21ac2IzZHBibWNnUHlCMGFHbHpMbk5qY205c2JHSmhjbGRwWkhSb0lEb2dKeWRjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnVFc5a1lXd3VjSEp2ZEc5MGVYQmxMbkpsYzJWMFFXUnFkWE4wYldWdWRITWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZEdocGN5NGtaV3hsYldWdWRDNWpjM01vZTF4dUlDQWdJQ0FnY0dGa1pHbHVaMHhsWm5RNklDY25MRnh1SUNBZ0lDQWdjR0ZrWkdsdVoxSnBaMmgwT2lBbkoxeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQk5iMlJoYkM1d2NtOTBiM1I1Y0dVdVkyaGxZMnRUWTNKdmJHeGlZWElnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR1oxYkd4WGFXNWtiM2RYYVdSMGFDQTlJSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9YRzRnSUNBZ2FXWWdLQ0ZtZFd4c1YybHVaRzkzVjJsa2RHZ3BJSHNnTHk4Z2QyOXlhMkZ5YjNWdVpDQm1iM0lnYldsemMybHVaeUIzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0JwYmlCSlJUaGNiaUFnSUNBZ0lIWmhjaUJrYjJOMWJXVnVkRVZzWlcxbGJuUlNaV04wSUQwZ1pHOWpkVzFsYm5RdVpHOWpkVzFsYm5SRmJHVnRaVzUwTG1kbGRFSnZkVzVrYVc1blEyeHBaVzUwVW1WamRDZ3BYRzRnSUNBZ0lDQm1kV3hzVjJsdVpHOTNWMmxrZEdnZ1BTQmtiMk4xYldWdWRFVnNaVzFsYm5SU1pXTjBMbkpwWjJoMElDMGdUV0YwYUM1aFluTW9aRzlqZFcxbGJuUkZiR1Z0Wlc1MFVtVmpkQzVzWldaMEtWeHVJQ0FnSUgxY2JpQWdJQ0IwYUdsekxtSnZaSGxKYzA5MlpYSm1iRzkzYVc1bklEMGdaRzlqZFcxbGJuUXVZbTlrZVM1amJHbGxiblJYYVdSMGFDQThJR1oxYkd4WGFXNWtiM2RYYVdSMGFGeHVJQ0FnSUhSb2FYTXVjMk55YjJ4c1ltRnlWMmxrZEdnZ1BTQjBhR2x6TG0xbFlYTjFjbVZUWTNKdmJHeGlZWElvS1Z4dUlDQjlYRzVjYmlBZ1RXOWtZV3d1Y0hKdmRHOTBlWEJsTG5ObGRGTmpjbTlzYkdKaGNpQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1ltOWtlVkJoWkNBOUlIQmhjbk5sU1c1MEtDaDBhR2x6TGlSaWIyUjVMbU56Y3lnbmNHRmtaR2x1WnkxeWFXZG9kQ2NwSUh4OElEQXBMQ0F4TUNsY2JpQWdJQ0IwYUdsekxtOXlhV2RwYm1Gc1FtOWtlVkJoWkNBOUlHUnZZM1Z0Wlc1MExtSnZaSGt1YzNSNWJHVXVjR0ZrWkdsdVoxSnBaMmgwSUh4OElDY25YRzRnSUNBZ2FXWWdLSFJvYVhNdVltOWtlVWx6VDNabGNtWnNiM2RwYm1jcElIUm9hWE11SkdKdlpIa3VZM056S0Nkd1lXUmthVzVuTFhKcFoyaDBKeXdnWW05a2VWQmhaQ0FySUhSb2FYTXVjMk55YjJ4c1ltRnlWMmxrZEdncFhHNGdJSDFjYmx4dUlDQk5iMlJoYkM1d2NtOTBiM1I1Y0dVdWNtVnpaWFJUWTNKdmJHeGlZWElnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RHaHBjeTRrWW05a2VTNWpjM01vSjNCaFpHUnBibWN0Y21sbmFIUW5MQ0IwYUdsekxtOXlhV2RwYm1Gc1FtOWtlVkJoWkNsY2JpQWdmVnh1WEc0Z0lFMXZaR0ZzTG5CeWIzUnZkSGx3WlM1dFpXRnpkWEpsVTJOeWIyeHNZbUZ5SUQwZ1puVnVZM1JwYjI0Z0tDa2dleUF2THlCMGFIZ2dkMkZzYzJoY2JpQWdJQ0IyWVhJZ2MyTnliMnhzUkdsMklEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblpHbDJKeWxjYmlBZ0lDQnpZM0p2Ykd4RWFYWXVZMnhoYzNOT1lXMWxJRDBnSjIxdlpHRnNMWE5qY205c2JHSmhjaTF0WldGemRYSmxKMXh1SUNBZ0lIUm9hWE11SkdKdlpIa3VZWEJ3Wlc1a0tITmpjbTlzYkVScGRpbGNiaUFnSUNCMllYSWdjMk55YjJ4c1ltRnlWMmxrZEdnZ1BTQnpZM0p2Ykd4RWFYWXViMlptYzJWMFYybGtkR2dnTFNCelkzSnZiR3hFYVhZdVkyeHBaVzUwVjJsa2RHaGNiaUFnSUNCMGFHbHpMaVJpYjJSNVd6QmRMbkpsYlc5MlpVTm9hV3hrS0hOamNtOXNiRVJwZGlsY2JpQWdJQ0J5WlhSMWNtNGdjMk55YjJ4c1ltRnlWMmxrZEdoY2JpQWdmVnh1WEc1Y2JpQWdMeThnVFU5RVFVd2dVRXhWUjBsT0lFUkZSa2xPU1ZSSlQwNWNiaUFnTHk4Z1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmx4dUlDQm1kVzVqZEdsdmJpQlFiSFZuYVc0b2IzQjBhVzl1TENCZmNtVnNZWFJsWkZSaGNtZGxkQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG1WaFkyZ29ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZG1GeUlDUjBhR2x6SUNBZ1BTQWtLSFJvYVhNcFhHNGdJQ0FnSUNCMllYSWdaR0YwWVNBZ0lDQTlJQ1IwYUdsekxtUmhkR0VvSjJKekxtMXZaR0ZzSnlsY2JpQWdJQ0FnSUhaaGNpQnZjSFJwYjI1eklEMGdKQzVsZUhSbGJtUW9lMzBzSUUxdlpHRnNMa1JGUmtGVlRGUlRMQ0FrZEdocGN5NWtZWFJoS0Nrc0lIUjVjR1Z2WmlCdmNIUnBiMjRnUFQwZ0oyOWlhbVZqZENjZ0ppWWdiM0IwYVc5dUtWeHVYRzRnSUNBZ0lDQnBaaUFvSVdSaGRHRXBJQ1IwYUdsekxtUmhkR0VvSjJKekxtMXZaR0ZzSnl3Z0tHUmhkR0VnUFNCdVpYY2dUVzlrWVd3b2RHaHBjeXdnYjNCMGFXOXVjeWtwS1Z4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCdmNIUnBiMjRnUFQwZ0ozTjBjbWx1WnljcElHUmhkR0ZiYjNCMGFXOXVYU2hmY21Wc1lYUmxaRlJoY21kbGRDbGNiaUFnSUNBZ0lHVnNjMlVnYVdZZ0tHOXdkR2x2Ym5NdWMyaHZkeWtnWkdGMFlTNXphRzkzS0Y5eVpXeGhkR1ZrVkdGeVoyVjBLVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0IyWVhJZ2IyeGtJRDBnSkM1bWJpNXRiMlJoYkZ4dVhHNGdJQ1F1Wm00dWJXOWtZV3dnSUNBZ0lDQWdJQ0FnSUNBZ1BTQlFiSFZuYVc1Y2JpQWdKQzVtYmk1dGIyUmhiQzVEYjI1emRISjFZM1J2Y2lBOUlFMXZaR0ZzWEc1Y2JseHVJQ0F2THlCTlQwUkJUQ0JPVHlCRFQwNUdURWxEVkZ4dUlDQXZMeUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1WEc0Z0lDUXVabTR1Ylc5a1lXd3VibTlEYjI1bWJHbGpkQ0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBa0xtWnVMbTF2WkdGc0lEMGdiMnhrWEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE5jYmlBZ2ZWeHVYRzVjYmlBZ0x5OGdUVTlFUVV3Z1JFRlVRUzFCVUVsY2JpQWdMeThnUFQwOVBUMDlQVDA5UFQwOVBUMWNibHh1SUNBa0tHUnZZM1Z0Wlc1MEtTNXZiaWduWTJ4cFkyc3VZbk11Ylc5a1lXd3VaR0YwWVMxaGNHa25MQ0FuVzJSaGRHRXRkRzluWjJ4bFBWd2liVzlrWVd4Y0lsMG5MQ0JtZFc1amRHbHZiaUFvWlNrZ2UxeHVJQ0FnSUhaaGNpQWtkR2hwY3lBZ0lEMGdKQ2gwYUdsektWeHVJQ0FnSUhaaGNpQm9jbVZtSUNBZ0lEMGdKSFJvYVhNdVlYUjBjaWduYUhKbFppY3BYRzRnSUNBZ2RtRnlJQ1IwWVhKblpYUWdQU0FrS0NSMGFHbHpMbUYwZEhJb0oyUmhkR0V0ZEdGeVoyVjBKeWtnZkh3Z0tHaHlaV1lnSmlZZ2FISmxaaTV5WlhCc1lXTmxLQzh1S2lnL1BTTmJYbHhjYzEwckpDa3ZMQ0FuSnlrcEtTQXZMeUJ6ZEhKcGNDQm1iM0lnYVdVM1hHNGdJQ0FnZG1GeUlHOXdkR2x2YmlBZ1BTQWtkR0Z5WjJWMExtUmhkR0VvSjJKekxtMXZaR0ZzSnlrZ1B5QW5kRzluWjJ4bEp5QTZJQ1F1WlhoMFpXNWtLSHNnY21WdGIzUmxPaUFoTHlNdkxuUmxjM1FvYUhKbFppa2dKaVlnYUhKbFppQjlMQ0FrZEdGeVoyVjBMbVJoZEdFb0tTd2dKSFJvYVhNdVpHRjBZU2dwS1Z4dVhHNGdJQ0FnYVdZZ0tDUjBhR2x6TG1sektDZGhKeWtwSUdVdWNISmxkbVZ1ZEVSbFptRjFiSFFvS1Z4dVhHNGdJQ0FnSkhSaGNtZGxkQzV2Ym1Vb0ozTm9iM2N1WW5NdWJXOWtZV3duTENCbWRXNWpkR2x2YmlBb2MyaHZkMFYyWlc1MEtTQjdYRzRnSUNBZ0lDQnBaaUFvYzJodmQwVjJaVzUwTG1selJHVm1ZWFZzZEZCeVpYWmxiblJsWkNncEtTQnlaWFIxY200Z0x5OGdiMjVzZVNCeVpXZHBjM1JsY2lCbWIyTjFjeUJ5WlhOMGIzSmxjaUJwWmlCdGIyUmhiQ0IzYVd4c0lHRmpkSFZoYkd4NUlHZGxkQ0J6YUc5M2JseHVJQ0FnSUNBZ0pIUmhjbWRsZEM1dmJtVW9KMmhwWkdSbGJpNWljeTV0YjJSaGJDY3NJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FnSUNBZ0pIUm9hWE11YVhNb0p6cDJhWE5wWW14bEp5a2dKaVlnSkhSb2FYTXVkSEpwWjJkbGNpZ25abTlqZFhNbktWeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNCOUtWeHVJQ0FnSUZCc2RXZHBiaTVqWVd4c0tDUjBZWEpuWlhRc0lHOXdkR2x2Yml3Z2RHaHBjeWxjYmlBZ2ZTbGNibHh1ZlNocVVYVmxjbmtwTzF4dVhHNHZLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmlBcUlFSnZiM1J6ZEhKaGNEb2dkRzl2YkhScGNDNXFjeUIyTXk0ekxqZGNiaUFxSUdoMGRIQTZMeTluWlhSaWIyOTBjM1J5WVhBdVkyOXRMMnBoZG1GelkzSnBjSFF2STNSdmIyeDBhWEJjYmlBcUlFbHVjM0JwY21Wa0lHSjVJSFJvWlNCdmNtbG5hVzVoYkNCcVVYVmxjbmt1ZEdsd2Mza2dZbmtnU21GemIyNGdSbkpoYldWY2JpQXFJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVnh1SUNvZ1EyOXdlWEpwWjJoMElESXdNVEV0TWpBeE5pQlVkMmwwZEdWeUxDQkpibU11WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzkwZDJKekwySnZiM1J6ZEhKaGNDOWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOUlDb3ZYRzVjYmx4dUsyWjFibU4wYVc5dUlDZ2tLU0I3WEc0Z0lDZDFjMlVnYzNSeWFXTjBKenRjYmx4dUlDQXZMeUJVVDA5TVZFbFFJRkJWUWt4SlF5QkRURUZUVXlCRVJVWkpUa2xVU1U5T1hHNGdJQzh2SUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMWNibHh1SUNCMllYSWdWRzl2YkhScGNDQTlJR1oxYm1OMGFXOXVJQ2hsYkdWdFpXNTBMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lDQWdkR2hwY3k1MGVYQmxJQ0FnSUNBZ0lEMGdiblZzYkZ4dUlDQWdJSFJvYVhNdWIzQjBhVzl1Y3lBZ0lDQTlJRzUxYkd4Y2JpQWdJQ0IwYUdsekxtVnVZV0pzWldRZ0lDQWdQU0J1ZFd4c1hHNGdJQ0FnZEdocGN5NTBhVzFsYjNWMElDQWdJRDBnYm5Wc2JGeHVJQ0FnSUhSb2FYTXVhRzkyWlhKVGRHRjBaU0E5SUc1MWJHeGNiaUFnSUNCMGFHbHpMaVJsYkdWdFpXNTBJQ0FnUFNCdWRXeHNYRzRnSUNBZ2RHaHBjeTVwYmxOMFlYUmxJQ0FnSUQwZ2JuVnNiRnh1WEc0Z0lDQWdkR2hwY3k1cGJtbDBLQ2QwYjI5c2RHbHdKeXdnWld4bGJXVnVkQ3dnYjNCMGFXOXVjeWxjYmlBZ2ZWeHVYRzRnSUZSdmIyeDBhWEF1VmtWU1UwbFBUaUFnUFNBbk15NHpMamNuWEc1Y2JpQWdWRzl2YkhScGNDNVVVa0ZPVTBsVVNVOU9YMFJWVWtGVVNVOU9JRDBnTVRVd1hHNWNiaUFnVkc5dmJIUnBjQzVFUlVaQlZVeFVVeUE5SUh0Y2JpQWdJQ0JoYm1sdFlYUnBiMjQ2SUhSeWRXVXNYRzRnSUNBZ2NHeGhZMlZ0Wlc1ME9pQW5kRzl3Snl4Y2JpQWdJQ0J6Wld4bFkzUnZjam9nWm1Gc2MyVXNYRzRnSUNBZ2RHVnRjR3hoZEdVNklDYzhaR2wySUdOc1lYTnpQVndpZEc5dmJIUnBjRndpSUhKdmJHVTlYQ0owYjI5c2RHbHdYQ0krUEdScGRpQmpiR0Z6Y3oxY0luUnZiMngwYVhBdFlYSnliM2RjSWo0OEwyUnBkajQ4WkdsMklHTnNZWE56UFZ3aWRHOXZiSFJwY0MxcGJtNWxjbHdpUGp3dlpHbDJQand2WkdsMlBpY3NYRzRnSUNBZ2RISnBaMmRsY2pvZ0oyaHZkbVZ5SUdadlkzVnpKeXhjYmlBZ0lDQjBhWFJzWlRvZ0p5Y3NYRzRnSUNBZ1pHVnNZWGs2SURBc1hHNGdJQ0FnYUhSdGJEb2dabUZzYzJVc1hHNGdJQ0FnWTI5dWRHRnBibVZ5T2lCbVlXeHpaU3hjYmlBZ0lDQjJhV1YzY0c5eWREb2dlMXh1SUNBZ0lDQWdjMlZzWldOMGIzSTZJQ2RpYjJSNUp5eGNiaUFnSUNBZ0lIQmhaR1JwYm1jNklEQmNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQlViMjlzZEdsd0xuQnliM1J2ZEhsd1pTNXBibWwwSUQwZ1puVnVZM1JwYjI0Z0tIUjVjR1VzSUdWc1pXMWxiblFzSUc5d2RHbHZibk1wSUh0Y2JpQWdJQ0IwYUdsekxtVnVZV0pzWldRZ0lDQTlJSFJ5ZFdWY2JpQWdJQ0IwYUdsekxuUjVjR1VnSUNBZ0lDQTlJSFI1Y0dWY2JpQWdJQ0IwYUdsekxpUmxiR1Z0Wlc1MElDQTlJQ1FvWld4bGJXVnVkQ2xjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nSUNBOUlIUm9hWE11WjJWMFQzQjBhVzl1Y3lodmNIUnBiMjV6S1Z4dUlDQWdJSFJvYVhNdUpIWnBaWGR3YjNKMElEMGdkR2hwY3k1dmNIUnBiMjV6TG5acFpYZHdiM0owSUNZbUlDUW9KQzVwYzBaMWJtTjBhVzl1S0hSb2FYTXViM0IwYVc5dWN5NTJhV1YzY0c5eWRDa2dQeUIwYUdsekxtOXdkR2x2Ym5NdWRtbGxkM0J2Y25RdVkyRnNiQ2gwYUdsekxDQjBhR2x6TGlSbGJHVnRaVzUwS1NBNklDaDBhR2x6TG05d2RHbHZibk11ZG1sbGQzQnZjblF1YzJWc1pXTjBiM0lnZkh3Z2RHaHBjeTV2Y0hScGIyNXpMblpwWlhkd2IzSjBLU2xjYmlBZ0lDQjBhR2x6TG1sdVUzUmhkR1VnSUNBOUlIc2dZMnhwWTJzNklHWmhiSE5sTENCb2IzWmxjam9nWm1Gc2MyVXNJR1p2WTNWek9pQm1ZV3h6WlNCOVhHNWNiaUFnSUNCcFppQW9kR2hwY3k0a1pXeGxiV1Z1ZEZzd1hTQnBibk4wWVc1alpXOW1JR1J2WTNWdFpXNTBMbU52Ym5OMGNuVmpkRzl5SUNZbUlDRjBhR2x6TG05d2RHbHZibk11YzJWc1pXTjBiM0lwSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduWUhObGJHVmpkRzl5WUNCdmNIUnBiMjRnYlhWemRDQmlaU0J6Y0dWamFXWnBaV1FnZDJobGJpQnBibWwwYVdGc2FYcHBibWNnSnlBcklIUm9hWE11ZEhsd1pTQXJJQ2NnYjI0Z2RHaGxJSGRwYm1SdmR5NWtiMk4xYldWdWRDQnZZbXBsWTNRaEp5bGNiaUFnSUNCOVhHNWNiaUFnSUNCMllYSWdkSEpwWjJkbGNuTWdQU0IwYUdsekxtOXdkR2x2Ym5NdWRISnBaMmRsY2k1emNHeHBkQ2duSUNjcFhHNWNiaUFnSUNCbWIzSWdLSFpoY2lCcElEMGdkSEpwWjJkbGNuTXViR1Z1WjNSb095QnBMUzA3S1NCN1hHNGdJQ0FnSUNCMllYSWdkSEpwWjJkbGNpQTlJSFJ5YVdkblpYSnpXMmxkWEc1Y2JpQWdJQ0FnSUdsbUlDaDBjbWxuWjJWeUlEMDlJQ2RqYkdsamF5Y3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NGtaV3hsYldWdWRDNXZiaWduWTJ4cFkyc3VKeUFySUhSb2FYTXVkSGx3WlN3Z2RHaHBjeTV2Y0hScGIyNXpMbk5sYkdWamRHOXlMQ0FrTG5CeWIzaDVLSFJvYVhNdWRHOW5aMnhsTENCMGFHbHpLU2xjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvZEhKcFoyZGxjaUFoUFNBbmJXRnVkV0ZzSnlrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnWlhabGJuUkpiaUFnUFNCMGNtbG5aMlZ5SUQwOUlDZG9iM1psY2ljZ1B5QW5iVzkxYzJWbGJuUmxjaWNnT2lBblptOWpkWE5wYmlkY2JpQWdJQ0FnSUNBZ2RtRnlJR1YyWlc1MFQzVjBJRDBnZEhKcFoyZGxjaUE5UFNBbmFHOTJaWEluSUQ4Z0oyMXZkWE5sYkdWaGRtVW5JRG9nSjJadlkzVnpiM1YwSjF4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11SkdWc1pXMWxiblF1YjI0b1pYWmxiblJKYmlBZ0t5QW5MaWNnS3lCMGFHbHpMblI1Y0dVc0lIUm9hWE11YjNCMGFXOXVjeTV6Wld4bFkzUnZjaXdnSkM1d2NtOTRlU2gwYUdsekxtVnVkR1Z5TENCMGFHbHpLU2xjYmlBZ0lDQWdJQ0FnZEdocGN5NGtaV3hsYldWdWRDNXZiaWhsZG1WdWRFOTFkQ0FySUNjdUp5QXJJSFJvYVhNdWRIbHdaU3dnZEdocGN5NXZjSFJwYjI1ekxuTmxiR1ZqZEc5eUxDQWtMbkJ5YjNoNUtIUm9hWE11YkdWaGRtVXNJSFJvYVhNcEtWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NXpaV3hsWTNSdmNpQS9YRzRnSUNBZ0lDQW9kR2hwY3k1ZmIzQjBhVzl1Y3lBOUlDUXVaWGgwWlc1a0tIdDlMQ0IwYUdsekxtOXdkR2x2Ym5Nc0lIc2dkSEpwWjJkbGNqb2dKMjFoYm5WaGJDY3NJSE5sYkdWamRHOXlPaUFuSnlCOUtTa2dPbHh1SUNBZ0lDQWdkR2hwY3k1bWFYaFVhWFJzWlNncFhHNGdJSDFjYmx4dUlDQlViMjlzZEdsd0xuQnliM1J2ZEhsd1pTNW5aWFJFWldaaGRXeDBjeUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnVkc5dmJIUnBjQzVFUlVaQlZVeFVVMXh1SUNCOVhHNWNiaUFnVkc5dmJIUnBjQzV3Y205MGIzUjVjR1V1WjJWMFQzQjBhVzl1Y3lBOUlHWjFibU4wYVc5dUlDaHZjSFJwYjI1ektTQjdYRzRnSUNBZ2IzQjBhVzl1Y3lBOUlDUXVaWGgwWlc1a0tIdDlMQ0IwYUdsekxtZGxkRVJsWm1GMWJIUnpLQ2tzSUhSb2FYTXVKR1ZzWlcxbGJuUXVaR0YwWVNncExDQnZjSFJwYjI1ektWeHVYRzRnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVaR1ZzWVhrZ0ppWWdkSGx3Wlc5bUlHOXdkR2x2Ym5NdVpHVnNZWGtnUFQwZ0oyNTFiV0psY2ljcElIdGNiaUFnSUNBZ0lHOXdkR2x2Ym5NdVpHVnNZWGtnUFNCN1hHNGdJQ0FnSUNBZ0lITm9iM2M2SUc5d2RHbHZibk11WkdWc1lYa3NYRzRnSUNBZ0lDQWdJR2hwWkdVNklHOXdkR2x2Ym5NdVpHVnNZWGxjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2IzQjBhVzl1YzF4dUlDQjlYRzVjYmlBZ1ZHOXZiSFJwY0M1d2NtOTBiM1I1Y0dVdVoyVjBSR1ZzWldkaGRHVlBjSFJwYjI1eklEMGdablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCdmNIUnBiMjV6SUNBOUlIdDlYRzRnSUNBZ2RtRnlJR1JsWm1GMWJIUnpJRDBnZEdocGN5NW5aWFJFWldaaGRXeDBjeWdwWEc1Y2JpQWdJQ0IwYUdsekxsOXZjSFJwYjI1eklDWW1JQ1F1WldGamFDaDBhR2x6TGw5dmNIUnBiMjV6TENCbWRXNWpkR2x2YmlBb2EyVjVMQ0IyWVd4MVpTa2dlMXh1SUNBZ0lDQWdhV1lnS0dSbFptRjFiSFJ6VzJ0bGVWMGdJVDBnZG1Gc2RXVXBJRzl3ZEdsdmJuTmJhMlY1WFNBOUlIWmhiSFZsWEc0Z0lDQWdmU2xjYmx4dUlDQWdJSEpsZEhWeWJpQnZjSFJwYjI1elhHNGdJSDFjYmx4dUlDQlViMjlzZEdsd0xuQnliM1J2ZEhsd1pTNWxiblJsY2lBOUlHWjFibU4wYVc5dUlDaHZZbW9wSUh0Y2JpQWdJQ0IyWVhJZ2MyVnNaaUE5SUc5aWFpQnBibk4wWVc1alpXOW1JSFJvYVhNdVkyOXVjM1J5ZFdOMGIzSWdQMXh1SUNBZ0lDQWdiMkpxSURvZ0pDaHZZbW91WTNWeWNtVnVkRlJoY21kbGRDa3VaR0YwWVNnblluTXVKeUFySUhSb2FYTXVkSGx3WlNsY2JseHVJQ0FnSUdsbUlDZ2hjMlZzWmlrZ2UxeHVJQ0FnSUNBZ2MyVnNaaUE5SUc1bGR5QjBhR2x6TG1OdmJuTjBjblZqZEc5eUtHOWlhaTVqZFhKeVpXNTBWR0Z5WjJWMExDQjBhR2x6TG1kbGRFUmxiR1ZuWVhSbFQzQjBhVzl1Y3lncEtWeHVJQ0FnSUNBZ0pDaHZZbW91WTNWeWNtVnVkRlJoY21kbGRDa3VaR0YwWVNnblluTXVKeUFySUhSb2FYTXVkSGx3WlN3Z2MyVnNaaWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvYjJKcUlHbHVjM1JoYm1ObGIyWWdKQzVGZG1WdWRDa2dlMXh1SUNBZ0lDQWdjMlZzWmk1cGJsTjBZWFJsVzI5aWFpNTBlWEJsSUQwOUlDZG1iMk4xYzJsdUp5QS9JQ2RtYjJOMWN5Y2dPaUFuYUc5MlpYSW5YU0E5SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9jMlZzWmk1MGFYQW9LUzVvWVhORGJHRnpjeWduYVc0bktTQjhmQ0J6Wld4bUxtaHZkbVZ5VTNSaGRHVWdQVDBnSjJsdUp5a2dlMXh1SUNBZ0lDQWdjMlZzWmk1b2IzWmxjbE4wWVhSbElEMGdKMmx1SjF4dUlDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1kyeGxZWEpVYVcxbGIzVjBLSE5sYkdZdWRHbHRaVzkxZENsY2JseHVJQ0FnSUhObGJHWXVhRzkyWlhKVGRHRjBaU0E5SUNkcGJpZGNibHh1SUNBZ0lHbG1JQ2doYzJWc1ppNXZjSFJwYjI1ekxtUmxiR0Y1SUh4OElDRnpaV3htTG05d2RHbHZibk11WkdWc1lYa3VjMmh2ZHlrZ2NtVjBkWEp1SUhObGJHWXVjMmh2ZHlncFhHNWNiaUFnSUNCelpXeG1MblJwYldWdmRYUWdQU0J6WlhSVWFXMWxiM1YwS0daMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lHbG1JQ2h6Wld4bUxtaHZkbVZ5VTNSaGRHVWdQVDBnSjJsdUp5a2djMlZzWmk1emFHOTNLQ2xjYmlBZ0lDQjlMQ0J6Wld4bUxtOXdkR2x2Ym5NdVpHVnNZWGt1YzJodmR5bGNiaUFnZlZ4dVhHNGdJRlJ2YjJ4MGFYQXVjSEp2ZEc5MGVYQmxMbWx6U1c1VGRHRjBaVlJ5ZFdVZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdabTl5SUNoMllYSWdhMlY1SUdsdUlIUm9hWE11YVc1VGRHRjBaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YVc1VGRHRjBaVnRyWlhsZEtTQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNCOVhHNWNiaUFnVkc5dmJIUnBjQzV3Y205MGIzUjVjR1V1YkdWaGRtVWdQU0JtZFc1amRHbHZiaUFvYjJKcUtTQjdYRzRnSUNBZ2RtRnlJSE5sYkdZZ1BTQnZZbW9nYVc1emRHRnVZMlZ2WmlCMGFHbHpMbU52Ym5OMGNuVmpkRzl5SUQ5Y2JpQWdJQ0FnSUc5aWFpQTZJQ1FvYjJKcUxtTjFjbkpsYm5SVVlYSm5aWFFwTG1SaGRHRW9KMkp6TGljZ0t5QjBhR2x6TG5SNWNHVXBYRzVjYmlBZ0lDQnBaaUFvSVhObGJHWXBJSHRjYmlBZ0lDQWdJSE5sYkdZZ1BTQnVaWGNnZEdocGN5NWpiMjV6ZEhKMVkzUnZjaWh2WW1vdVkzVnljbVZ1ZEZSaGNtZGxkQ3dnZEdocGN5NW5aWFJFWld4bFoyRjBaVTl3ZEdsdmJuTW9LU2xjYmlBZ0lDQWdJQ1FvYjJKcUxtTjFjbkpsYm5SVVlYSm5aWFFwTG1SaGRHRW9KMkp6TGljZ0t5QjBhR2x6TG5SNWNHVXNJSE5sYkdZcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tHOWlhaUJwYm5OMFlXNWpaVzltSUNRdVJYWmxiblFwSUh0Y2JpQWdJQ0FnSUhObGJHWXVhVzVUZEdGMFpWdHZZbW91ZEhsd1pTQTlQU0FuWm05amRYTnZkWFFuSUQ4Z0oyWnZZM1Z6SnlBNklDZG9iM1psY2lkZElEMGdabUZzYzJWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2MyVnNaaTVwYzBsdVUzUmhkR1ZVY25WbEtDa3BJSEpsZEhWeWJseHVYRzRnSUNBZ1kyeGxZWEpVYVcxbGIzVjBLSE5sYkdZdWRHbHRaVzkxZENsY2JseHVJQ0FnSUhObGJHWXVhRzkyWlhKVGRHRjBaU0E5SUNkdmRYUW5YRzVjYmlBZ0lDQnBaaUFvSVhObGJHWXViM0IwYVc5dWN5NWtaV3hoZVNCOGZDQWhjMlZzWmk1dmNIUnBiMjV6TG1SbGJHRjVMbWhwWkdVcElISmxkSFZ5YmlCelpXeG1MbWhwWkdVb0tWeHVYRzRnSUNBZ2MyVnNaaTUwYVcxbGIzVjBJRDBnYzJWMFZHbHRaVzkxZENobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQnBaaUFvYzJWc1ppNW9iM1psY2xOMFlYUmxJRDA5SUNkdmRYUW5LU0J6Wld4bUxtaHBaR1VvS1Z4dUlDQWdJSDBzSUhObGJHWXViM0IwYVc5dWN5NWtaV3hoZVM1b2FXUmxLVnh1SUNCOVhHNWNiaUFnVkc5dmJIUnBjQzV3Y205MGIzUjVjR1V1YzJodmR5QTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1pTQTlJQ1F1UlhabGJuUW9KM05vYjNjdVluTXVKeUFySUhSb2FYTXVkSGx3WlNsY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG1oaGMwTnZiblJsYm5Rb0tTQW1KaUIwYUdsekxtVnVZV0pzWldRcElIdGNiaUFnSUNBZ0lIUm9hWE11SkdWc1pXMWxiblF1ZEhKcFoyZGxjaWhsS1Z4dVhHNGdJQ0FnSUNCMllYSWdhVzVFYjIwZ1BTQWtMbU52Ym5SaGFXNXpLSFJvYVhNdUpHVnNaVzFsYm5SYk1GMHViM2R1WlhKRWIyTjFiV1Z1ZEM1a2IyTjFiV1Z1ZEVWc1pXMWxiblFzSUhSb2FYTXVKR1ZzWlcxbGJuUmJNRjBwWEc0Z0lDQWdJQ0JwWmlBb1pTNXBjMFJsWm1GMWJIUlFjbVYyWlc1MFpXUW9LU0I4ZkNBaGFXNUViMjBwSUhKbGRIVnlibHh1SUNBZ0lDQWdkbUZ5SUhSb1lYUWdQU0IwYUdselhHNWNiaUFnSUNBZ0lIWmhjaUFrZEdsd0lEMGdkR2hwY3k1MGFYQW9LVnh1WEc0Z0lDQWdJQ0IyWVhJZ2RHbHdTV1FnUFNCMGFHbHpMbWRsZEZWSlJDaDBhR2x6TG5SNWNHVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWMyVjBRMjl1ZEdWdWRDZ3BYRzRnSUNBZ0lDQWtkR2x3TG1GMGRISW9KMmxrSnl3Z2RHbHdTV1FwWEc0Z0lDQWdJQ0IwYUdsekxpUmxiR1Z0Wlc1MExtRjBkSElvSjJGeWFXRXRaR1Z6WTNKcFltVmtZbmtuTENCMGFYQkpaQ2xjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVoYm1sdFlYUnBiMjRwSUNSMGFYQXVZV1JrUTJ4aGMzTW9KMlpoWkdVbktWeHVYRzRnSUNBZ0lDQjJZWElnY0d4aFkyVnRaVzUwSUQwZ2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NXdiR0ZqWlcxbGJuUWdQVDBnSjJaMWJtTjBhVzl1SnlBL1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTV3YkdGalpXMWxiblF1WTJGc2JDaDBhR2x6TENBa2RHbHdXekJkTENCMGFHbHpMaVJsYkdWdFpXNTBXekJkS1NBNlhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTV3YkdGalpXMWxiblJjYmx4dUlDQWdJQ0FnZG1GeUlHRjFkRzlVYjJ0bGJpQTlJQzljWEhNL1lYVjBiejljWEhNL0wybGNiaUFnSUNBZ0lIWmhjaUJoZFhSdlVHeGhZMlVnUFNCaGRYUnZWRzlyWlc0dWRHVnpkQ2h3YkdGalpXMWxiblFwWEc0Z0lDQWdJQ0JwWmlBb1lYVjBiMUJzWVdObEtTQndiR0ZqWlcxbGJuUWdQU0J3YkdGalpXMWxiblF1Y21Wd2JHRmpaU2hoZFhSdlZHOXJaVzRzSUNjbktTQjhmQ0FuZEc5d0oxeHVYRzRnSUNBZ0lDQWtkR2x3WEc0Z0lDQWdJQ0FnSUM1a1pYUmhZMmdvS1Z4dUlDQWdJQ0FnSUNBdVkzTnpLSHNnZEc5d09pQXdMQ0JzWldaME9pQXdMQ0JrYVhOd2JHRjVPaUFuWW14dlkyc25JSDBwWEc0Z0lDQWdJQ0FnSUM1aFpHUkRiR0Z6Y3lod2JHRmpaVzFsYm5RcFhHNGdJQ0FnSUNBZ0lDNWtZWFJoS0NkaWN5NG5JQ3NnZEdocGN5NTBlWEJsTENCMGFHbHpLVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVkyOXVkR0ZwYm1WeUlEOGdKSFJwY0M1aGNIQmxibVJVYnloMGFHbHpMbTl3ZEdsdmJuTXVZMjl1ZEdGcGJtVnlLU0E2SUNSMGFYQXVhVzV6WlhKMFFXWjBaWElvZEdocGN5NGtaV3hsYldWdWRDbGNiaUFnSUNBZ0lIUm9hWE11SkdWc1pXMWxiblF1ZEhKcFoyZGxjaWduYVc1elpYSjBaV1F1WW5NdUp5QXJJSFJvYVhNdWRIbHdaU2xjYmx4dUlDQWdJQ0FnZG1GeUlIQnZjeUFnSUNBZ0lDQWdJQ0E5SUhSb2FYTXVaMlYwVUc5emFYUnBiMjRvS1Z4dUlDQWdJQ0FnZG1GeUlHRmpkSFZoYkZkcFpIUm9JQ0E5SUNSMGFYQmJNRjB1YjJabWMyVjBWMmxrZEdoY2JpQWdJQ0FnSUhaaGNpQmhZM1IxWVd4SVpXbG5hSFFnUFNBa2RHbHdXekJkTG05bVpuTmxkRWhsYVdkb2RGeHVYRzRnSUNBZ0lDQnBaaUFvWVhWMGIxQnNZV05sS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJ2Y21kUWJHRmpaVzFsYm5RZ1BTQndiR0ZqWlcxbGJuUmNiaUFnSUNBZ0lDQWdkbUZ5SUhacFpYZHdiM0owUkdsdElEMGdkR2hwY3k1blpYUlFiM05wZEdsdmJpaDBhR2x6TGlSMmFXVjNjRzl5ZENsY2JseHVJQ0FnSUNBZ0lDQndiR0ZqWlcxbGJuUWdQU0J3YkdGalpXMWxiblFnUFQwZ0oySnZkSFJ2YlNjZ0ppWWdjRzl6TG1KdmRIUnZiU0FySUdGamRIVmhiRWhsYVdkb2RDQStJSFpwWlhkd2IzSjBSR2x0TG1KdmRIUnZiU0EvSUNkMGIzQW5JQ0FnSURwY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjR3hoWTJWdFpXNTBJRDA5SUNkMGIzQW5JQ0FnSUNZbUlIQnZjeTUwYjNBZ0lDQWdMU0JoWTNSMVlXeElaV2xuYUhRZ1BDQjJhV1YzY0c5eWRFUnBiUzUwYjNBZ0lDQWdQeUFuWW05MGRHOXRKeUE2WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQnNZV05sYldWdWRDQTlQU0FuY21sbmFIUW5JQ0FtSmlCd2IzTXVjbWxuYUhRZ0lDc2dZV04wZFdGc1YybGtkR2dnSUQ0Z2RtbGxkM0J2Y25SRWFXMHVkMmxrZEdnZ0lEOGdKMnhsWm5RbklDQWdPbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2JHRmpaVzFsYm5RZ1BUMGdKMnhsWm5RbklDQWdKaVlnY0c5ekxteGxablFnSUNBdElHRmpkSFZoYkZkcFpIUm9JQ0E4SUhacFpYZHdiM0owUkdsdExteGxablFnSUNBL0lDZHlhV2RvZENjZ0lEcGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY0d4aFkyVnRaVzUwWEc1Y2JpQWdJQ0FnSUNBZ0pIUnBjRnh1SUNBZ0lDQWdJQ0FnSUM1eVpXMXZkbVZEYkdGemN5aHZjbWRRYkdGalpXMWxiblFwWEc0Z0lDQWdJQ0FnSUNBZ0xtRmtaRU5zWVhOektIQnNZV05sYldWdWRDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkbUZ5SUdOaGJHTjFiR0YwWldSUFptWnpaWFFnUFNCMGFHbHpMbWRsZEVOaGJHTjFiR0YwWldSUFptWnpaWFFvY0d4aFkyVnRaVzUwTENCd2IzTXNJR0ZqZEhWaGJGZHBaSFJvTENCaFkzUjFZV3hJWldsbmFIUXBYRzVjYmlBZ0lDQWdJSFJvYVhNdVlYQndiSGxRYkdGalpXMWxiblFvWTJGc1kzVnNZWFJsWkU5bVpuTmxkQ3dnY0d4aFkyVnRaVzUwS1Z4dVhHNGdJQ0FnSUNCMllYSWdZMjl0Y0d4bGRHVWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJ3Y21WMlNHOTJaWEpUZEdGMFpTQTlJSFJvWVhRdWFHOTJaWEpUZEdGMFpWeHVJQ0FnSUNBZ0lDQjBhR0YwTGlSbGJHVnRaVzUwTG5SeWFXZG5aWElvSjNOb2IzZHVMbUp6TGljZ0t5QjBhR0YwTG5SNWNHVXBYRzRnSUNBZ0lDQWdJSFJvWVhRdWFHOTJaWEpUZEdGMFpTQTlJRzUxYkd4Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvY0hKbGRraHZkbVZ5VTNSaGRHVWdQVDBnSjI5MWRDY3BJSFJvWVhRdWJHVmhkbVVvZEdoaGRDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdKQzV6ZFhCd2IzSjBMblJ5WVc1emFYUnBiMjRnSmlZZ2RHaHBjeTRrZEdsd0xtaGhjME5zWVhOektDZG1ZV1JsSnlrZ1AxeHVJQ0FnSUNBZ0lDQWtkR2x3WEc0Z0lDQWdJQ0FnSUNBZ0xtOXVaU2duWW5OVWNtRnVjMmwwYVc5dVJXNWtKeXdnWTI5dGNHeGxkR1VwWEc0Z0lDQWdJQ0FnSUNBZ0xtVnRkV3hoZEdWVWNtRnVjMmwwYVc5dVJXNWtLRlJ2YjJ4MGFYQXVWRkpCVGxOSlZFbFBUbDlFVlZKQlZFbFBUaWtnT2x4dUlDQWdJQ0FnSUNCamIyMXdiR1YwWlNncFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1ZHOXZiSFJwY0M1d2NtOTBiM1I1Y0dVdVlYQndiSGxRYkdGalpXMWxiblFnUFNCbWRXNWpkR2x2YmlBb2IyWm1jMlYwTENCd2JHRmpaVzFsYm5RcElIdGNiaUFnSUNCMllYSWdKSFJwY0NBZ0lEMGdkR2hwY3k1MGFYQW9LVnh1SUNBZ0lIWmhjaUIzYVdSMGFDQWdQU0FrZEdsd1d6QmRMbTltWm5ObGRGZHBaSFJvWEc0Z0lDQWdkbUZ5SUdobGFXZG9kQ0E5SUNSMGFYQmJNRjB1YjJabWMyVjBTR1ZwWjJoMFhHNWNiaUFnSUNBdkx5QnRZVzUxWVd4c2VTQnlaV0ZrSUcxaGNtZHBibk1nWW1WallYVnpaU0JuWlhSQ2IzVnVaR2x1WjBOc2FXVnVkRkpsWTNRZ2FXNWpiSFZrWlhNZ1pHbG1abVZ5Wlc1alpWeHVJQ0FnSUhaaGNpQnRZWEpuYVc1VWIzQWdQU0J3WVhKelpVbHVkQ2drZEdsd0xtTnpjeWduYldGeVoybHVMWFJ2Y0NjcExDQXhNQ2xjYmlBZ0lDQjJZWElnYldGeVoybHVUR1ZtZENBOUlIQmhjbk5sU1c1MEtDUjBhWEF1WTNOektDZHRZWEpuYVc0dGJHVm1kQ2NwTENBeE1DbGNibHh1SUNBZ0lDOHZJSGRsSUcxMWMzUWdZMmhsWTJzZ1ptOXlJRTVoVGlCbWIzSWdhV1VnT0M4NVhHNGdJQ0FnYVdZZ0tHbHpUbUZPS0cxaGNtZHBibFJ2Y0NrcElDQnRZWEpuYVc1VWIzQWdJRDBnTUZ4dUlDQWdJR2xtSUNocGMwNWhUaWh0WVhKbmFXNU1aV1owS1NrZ2JXRnlaMmx1VEdWbWRDQTlJREJjYmx4dUlDQWdJRzltWm5ObGRDNTBiM0FnSUNzOUlHMWhjbWRwYmxSdmNGeHVJQ0FnSUc5bVpuTmxkQzVzWldaMElDczlJRzFoY21kcGJreGxablJjYmx4dUlDQWdJQzh2SUNRdVptNHViMlptYzJWMElHUnZaWE51SjNRZ2NtOTFibVFnY0dsNFpXd2dkbUZzZFdWelhHNGdJQ0FnTHk4Z2MyOGdkMlVnZFhObElITmxkRTltWm5ObGRDQmthWEpsWTNSc2VTQjNhWFJvSUc5MWNpQnZkMjRnWm5WdVkzUnBiMjRnUWkwd1hHNGdJQ0FnSkM1dlptWnpaWFF1YzJWMFQyWm1jMlYwS0NSMGFYQmJNRjBzSUNRdVpYaDBaVzVrS0h0Y2JpQWdJQ0FnSUhWemFXNW5PaUJtZFc1amRHbHZiaUFvY0hKdmNITXBJSHRjYmlBZ0lDQWdJQ0FnSkhScGNDNWpjM01vZTF4dUlDQWdJQ0FnSUNBZ0lIUnZjRG9nVFdGMGFDNXliM1Z1WkNod2NtOXdjeTUwYjNBcExGeHVJQ0FnSUNBZ0lDQWdJR3hsWm5RNklFMWhkR2d1Y205MWJtUW9jSEp2Y0hNdWJHVm1kQ2xjYmlBZ0lDQWdJQ0FnZlNsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TENCdlptWnpaWFFwTENBd0tWeHVYRzRnSUNBZ0pIUnBjQzVoWkdSRGJHRnpjeWduYVc0bktWeHVYRzRnSUNBZ0x5OGdZMmhsWTJzZ2RHOGdjMlZsSUdsbUlIQnNZV05wYm1jZ2RHbHdJR2x1SUc1bGR5QnZabVp6WlhRZ1kyRjFjMlZrSUhSb1pTQjBhWEFnZEc4Z2NtVnphWHBsSUdsMGMyVnNabHh1SUNBZ0lIWmhjaUJoWTNSMVlXeFhhV1IwYUNBZ1BTQWtkR2x3V3pCZExtOW1abk5sZEZkcFpIUm9YRzRnSUNBZ2RtRnlJR0ZqZEhWaGJFaGxhV2RvZENBOUlDUjBhWEJiTUYwdWIyWm1jMlYwU0dWcFoyaDBYRzVjYmlBZ0lDQnBaaUFvY0d4aFkyVnRaVzUwSUQwOUlDZDBiM0FuSUNZbUlHRmpkSFZoYkVobGFXZG9kQ0FoUFNCb1pXbG5hSFFwSUh0Y2JpQWdJQ0FnSUc5bVpuTmxkQzUwYjNBZ1BTQnZabVp6WlhRdWRHOXdJQ3NnYUdWcFoyaDBJQzBnWVdOMGRXRnNTR1ZwWjJoMFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnZG1GeUlHUmxiSFJoSUQwZ2RHaHBjeTVuWlhSV2FXVjNjRzl5ZEVGa2FuVnpkR1ZrUkdWc2RHRW9jR3hoWTJWdFpXNTBMQ0J2Wm1aelpYUXNJR0ZqZEhWaGJGZHBaSFJvTENCaFkzUjFZV3hJWldsbmFIUXBYRzVjYmlBZ0lDQnBaaUFvWkdWc2RHRXViR1ZtZENrZ2IyWm1jMlYwTG14bFpuUWdLejBnWkdWc2RHRXViR1ZtZEZ4dUlDQWdJR1ZzYzJVZ2IyWm1jMlYwTG5SdmNDQXJQU0JrWld4MFlTNTBiM0JjYmx4dUlDQWdJSFpoY2lCcGMxWmxjblJwWTJGc0lDQWdJQ0FnSUNBZ0lEMGdMM1J2Y0h4aWIzUjBiMjB2TG5SbGMzUW9jR3hoWTJWdFpXNTBLVnh1SUNBZ0lIWmhjaUJoY25KdmQwUmxiSFJoSUNBZ0lDQWdJQ0FnSUQwZ2FYTldaWEowYVdOaGJDQS9JR1JsYkhSaExteGxablFnS2lBeUlDMGdkMmxrZEdnZ0t5QmhZM1IxWVd4WGFXUjBhQ0E2SUdSbGJIUmhMblJ2Y0NBcUlESWdMU0JvWldsbmFIUWdLeUJoWTNSMVlXeElaV2xuYUhSY2JpQWdJQ0IyWVhJZ1lYSnliM2RQWm1aelpYUlFiM05wZEdsdmJpQTlJR2x6Vm1WeWRHbGpZV3dnUHlBbmIyWm1jMlYwVjJsa2RHZ25JRG9nSjI5bVpuTmxkRWhsYVdkb2RDZGNibHh1SUNBZ0lDUjBhWEF1YjJabWMyVjBLRzltWm5ObGRDbGNiaUFnSUNCMGFHbHpMbkpsY0d4aFkyVkJjbkp2ZHloaGNuSnZkMFJsYkhSaExDQWtkR2x3V3pCZFcyRnljbTkzVDJabWMyVjBVRzl6YVhScGIyNWRMQ0JwYzFabGNuUnBZMkZzS1Z4dUlDQjlYRzVjYmlBZ1ZHOXZiSFJwY0M1d2NtOTBiM1I1Y0dVdWNtVndiR0ZqWlVGeWNtOTNJRDBnWm5WdVkzUnBiMjRnS0dSbGJIUmhMQ0JrYVcxbGJuTnBiMjRzSUdselZtVnlkR2xqWVd3cElIdGNiaUFnSUNCMGFHbHpMbUZ5Y205M0tDbGNiaUFnSUNBZ0lDNWpjM01vYVhOV1pYSjBhV05oYkNBL0lDZHNaV1owSnlBNklDZDBiM0FuTENBMU1DQXFJQ2d4SUMwZ1pHVnNkR0VnTHlCa2FXMWxibk5wYjI0cElDc2dKeVVuS1Z4dUlDQWdJQ0FnTG1OemN5aHBjMVpsY25ScFkyRnNJRDhnSjNSdmNDY2dPaUFuYkdWbWRDY3NJQ2NuS1Z4dUlDQjlYRzVjYmlBZ1ZHOXZiSFJwY0M1d2NtOTBiM1I1Y0dVdWMyVjBRMjl1ZEdWdWRDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ0pIUnBjQ0FnUFNCMGFHbHpMblJwY0NncFhHNGdJQ0FnZG1GeUlIUnBkR3hsSUQwZ2RHaHBjeTVuWlhSVWFYUnNaU2dwWEc1Y2JpQWdJQ0FrZEdsd0xtWnBibVFvSnk1MGIyOXNkR2x3TFdsdWJtVnlKeWxiZEdocGN5NXZjSFJwYjI1ekxtaDBiV3dnUHlBbmFIUnRiQ2NnT2lBbmRHVjRkQ2RkS0hScGRHeGxLVnh1SUNBZ0lDUjBhWEF1Y21WdGIzWmxRMnhoYzNNb0oyWmhaR1VnYVc0Z2RHOXdJR0p2ZEhSdmJTQnNaV1owSUhKcFoyaDBKeWxjYmlBZ2ZWeHVYRzRnSUZSdmIyeDBhWEF1Y0hKdmRHOTBlWEJsTG1ocFpHVWdQU0JtZFc1amRHbHZiaUFvWTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0IyWVhJZ2RHaGhkQ0E5SUhSb2FYTmNiaUFnSUNCMllYSWdKSFJwY0NBOUlDUW9kR2hwY3k0a2RHbHdLVnh1SUNBZ0lIWmhjaUJsSUNBZ0lEMGdKQzVGZG1WdWRDZ25hR2xrWlM1aWN5NG5JQ3NnZEdocGN5NTBlWEJsS1Z4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnWTI5dGNHeGxkR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hoZEM1b2IzWmxjbE4wWVhSbElDRTlJQ2RwYmljcElDUjBhWEF1WkdWMFlXTm9LQ2xjYmlBZ0lDQWdJR2xtSUNoMGFHRjBMaVJsYkdWdFpXNTBLU0I3SUM4dklGUlBSRTg2SUVOb1pXTnJJSGRvWlhSb1pYSWdaM1ZoY21ScGJtY2dkR2hwY3lCamIyUmxJSGRwZEdnZ2RHaHBjeUJnYVdaZ0lHbHpJSEpsWVd4c2VTQnVaV05sYzNOaGNua3VYRzRnSUNBZ0lDQWdJSFJvWVhRdUpHVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ0lDQXVjbVZ0YjNabFFYUjBjaWduWVhKcFlTMWtaWE5qY21saVpXUmllU2NwWEc0Z0lDQWdJQ0FnSUNBZ0xuUnlhV2RuWlhJb0oyaHBaR1JsYmk1aWN5NG5JQ3NnZEdoaGRDNTBlWEJsS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnWTJGc2JHSmhZMnNnSmlZZ1kyRnNiR0poWTJzb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVKR1ZzWlcxbGJuUXVkSEpwWjJkbGNpaGxLVnh1WEc0Z0lDQWdhV1lnS0dVdWFYTkVaV1poZFd4MFVISmxkbVZ1ZEdWa0tDa3BJSEpsZEhWeWJseHVYRzRnSUNBZ0pIUnBjQzV5WlcxdmRtVkRiR0Z6Y3lnbmFXNG5LVnh1WEc0Z0lDQWdKQzV6ZFhCd2IzSjBMblJ5WVc1emFYUnBiMjRnSmlZZ0pIUnBjQzVvWVhORGJHRnpjeWduWm1Ga1pTY3BJRDljYmlBZ0lDQWdJQ1IwYVhCY2JpQWdJQ0FnSUNBZ0xtOXVaU2duWW5OVWNtRnVjMmwwYVc5dVJXNWtKeXdnWTI5dGNHeGxkR1VwWEc0Z0lDQWdJQ0FnSUM1bGJYVnNZWFJsVkhKaGJuTnBkR2x2YmtWdVpDaFViMjlzZEdsd0xsUlNRVTVUU1ZSSlQwNWZSRlZTUVZSSlQwNHBJRHBjYmlBZ0lDQWdJR052YlhCc1pYUmxLQ2xjYmx4dUlDQWdJSFJvYVhNdWFHOTJaWEpUZEdGMFpTQTlJRzUxYkd4Y2JseHVJQ0FnSUhKbGRIVnliaUIwYUdselhHNGdJSDFjYmx4dUlDQlViMjlzZEdsd0xuQnliM1J2ZEhsd1pTNW1hWGhVYVhSc1pTQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ0pHVWdQU0IwYUdsekxpUmxiR1Z0Wlc1MFhHNGdJQ0FnYVdZZ0tDUmxMbUYwZEhJb0ozUnBkR3hsSnlrZ2ZId2dkSGx3Wlc5bUlDUmxMbUYwZEhJb0oyUmhkR0V0YjNKcFoybHVZV3d0ZEdsMGJHVW5LU0FoUFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ0pHVXVZWFIwY2lnblpHRjBZUzF2Y21sbmFXNWhiQzEwYVhSc1pTY3NJQ1JsTG1GMGRISW9KM1JwZEd4bEp5a2dmSHdnSnljcExtRjBkSElvSjNScGRHeGxKeXdnSnljcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1ZHOXZiSFJwY0M1d2NtOTBiM1I1Y0dVdWFHRnpRMjl1ZEdWdWRDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1blpYUlVhWFJzWlNncFhHNGdJSDFjYmx4dUlDQlViMjlzZEdsd0xuQnliM1J2ZEhsd1pTNW5aWFJRYjNOcGRHbHZiaUE5SUdaMWJtTjBhVzl1SUNna1pXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNSbGJHVnRaVzUwSUNBZ1BTQWtaV3hsYldWdWRDQjhmQ0IwYUdsekxpUmxiR1Z0Wlc1MFhHNWNiaUFnSUNCMllYSWdaV3dnSUNBZ0lEMGdKR1ZzWlcxbGJuUmJNRjFjYmlBZ0lDQjJZWElnYVhOQ2IyUjVJRDBnWld3dWRHRm5UbUZ0WlNBOVBTQW5RazlFV1NkY2JseHVJQ0FnSUhaaGNpQmxiRkpsWTNRZ0lDQWdQU0JsYkM1blpYUkNiM1Z1WkdsdVowTnNhV1Z1ZEZKbFkzUW9LVnh1SUNBZ0lHbG1JQ2hsYkZKbFkzUXVkMmxrZEdnZ1BUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0x5OGdkMmxrZEdnZ1lXNWtJR2hsYVdkb2RDQmhjbVVnYldsemMybHVaeUJwYmlCSlJUZ3NJSE52SUdOdmJYQjFkR1VnZEdobGJTQnRZVzUxWVd4c2VUc2djMlZsSUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5MGQySnpMMkp2YjNSemRISmhjQzlwYzNOMVpYTXZNVFF3T1ROY2JpQWdJQ0FnSUdWc1VtVmpkQ0E5SUNRdVpYaDBaVzVrS0h0OUxDQmxiRkpsWTNRc0lIc2dkMmxrZEdnNklHVnNVbVZqZEM1eWFXZG9kQ0F0SUdWc1VtVmpkQzVzWldaMExDQm9aV2xuYUhRNklHVnNVbVZqZEM1aWIzUjBiMjBnTFNCbGJGSmxZM1F1ZEc5d0lIMHBYRzRnSUNBZ2ZWeHVJQ0FnSUhaaGNpQnBjMU4yWnlBOUlIZHBibVJ2ZHk1VFZrZEZiR1Z0Wlc1MElDWW1JR1ZzSUdsdWMzUmhibU5sYjJZZ2QybHVaRzkzTGxOV1IwVnNaVzFsYm5SY2JpQWdJQ0F2THlCQmRtOXBaQ0IxYzJsdVp5QWtMbTltWm5ObGRDZ3BJRzl1SUZOV1IzTWdjMmx1WTJVZ2FYUWdaMmwyWlhNZ2FXNWpiM0p5WldOMElISmxjM1ZzZEhNZ2FXNGdhbEYxWlhKNUlETXVYRzRnSUNBZ0x5OGdVMlZsSUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5MGQySnpMMkp2YjNSemRISmhjQzlwYzNOMVpYTXZNakF5T0RCY2JpQWdJQ0IyWVhJZ1pXeFBabVp6WlhRZ0lEMGdhWE5DYjJSNUlEOGdleUIwYjNBNklEQXNJR3hsWm5RNklEQWdmU0E2SUNocGMxTjJaeUEvSUc1MWJHd2dPaUFrWld4bGJXVnVkQzV2Wm1aelpYUW9LU2xjYmlBZ0lDQjJZWElnYzJOeWIyeHNJQ0FnSUQwZ2V5QnpZM0p2Ykd3NklHbHpRbTlrZVNBL0lHUnZZM1Z0Wlc1MExtUnZZM1Z0Wlc1MFJXeGxiV1Z1ZEM1elkzSnZiR3hVYjNBZ2ZId2daRzlqZFcxbGJuUXVZbTlrZVM1elkzSnZiR3hVYjNBZ09pQWtaV3hsYldWdWRDNXpZM0p2Ykd4VWIzQW9LU0I5WEc0Z0lDQWdkbUZ5SUc5MWRHVnlSR2x0Y3lBOUlHbHpRbTlrZVNBL0lIc2dkMmxrZEdnNklDUW9kMmx1Wkc5M0tTNTNhV1IwYUNncExDQm9aV2xuYUhRNklDUW9kMmx1Wkc5M0tTNW9aV2xuYUhRb0tTQjlJRG9nYm5Wc2JGeHVYRzRnSUNBZ2NtVjBkWEp1SUNRdVpYaDBaVzVrS0h0OUxDQmxiRkpsWTNRc0lITmpjbTlzYkN3Z2IzVjBaWEpFYVcxekxDQmxiRTltWm5ObGRDbGNiaUFnZlZ4dVhHNGdJRlJ2YjJ4MGFYQXVjSEp2ZEc5MGVYQmxMbWRsZEVOaGJHTjFiR0YwWldSUFptWnpaWFFnUFNCbWRXNWpkR2x2YmlBb2NHeGhZMlZ0Wlc1MExDQndiM01zSUdGamRIVmhiRmRwWkhSb0xDQmhZM1IxWVd4SVpXbG5hSFFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjR3hoWTJWdFpXNTBJRDA5SUNkaWIzUjBiMjBuSUQ4Z2V5QjBiM0E2SUhCdmN5NTBiM0FnS3lCd2IzTXVhR1ZwWjJoMExDQWdJR3hsWm5RNklIQnZjeTVzWldaMElDc2djRzl6TG5kcFpIUm9JQzhnTWlBdElHRmpkSFZoYkZkcFpIUm9JQzhnTWlCOUlEcGNiaUFnSUNBZ0lDQWdJQ0FnY0d4aFkyVnRaVzUwSUQwOUlDZDBiM0FuSUNBZ0lEOGdleUIwYjNBNklIQnZjeTUwYjNBZ0xTQmhZM1IxWVd4SVpXbG5hSFFzSUd4bFpuUTZJSEJ2Y3k1c1pXWjBJQ3NnY0c5ekxuZHBaSFJvSUM4Z01pQXRJR0ZqZEhWaGJGZHBaSFJvSUM4Z01pQjlJRHBjYmlBZ0lDQWdJQ0FnSUNBZ2NHeGhZMlZ0Wlc1MElEMDlJQ2RzWldaMEp5QWdJRDhnZXlCMGIzQTZJSEJ2Y3k1MGIzQWdLeUJ3YjNNdWFHVnBaMmgwSUM4Z01pQXRJR0ZqZEhWaGJFaGxhV2RvZENBdklESXNJR3hsWm5RNklIQnZjeTVzWldaMElDMGdZV04wZFdGc1YybGtkR2dnZlNBNlhHNGdJQ0FnSUNBZ0lDOHFJSEJzWVdObGJXVnVkQ0E5UFNBbmNtbG5hSFFuSUNvdklIc2dkRzl3T2lCd2IzTXVkRzl3SUNzZ2NHOXpMbWhsYVdkb2RDQXZJRElnTFNCaFkzUjFZV3hJWldsbmFIUWdMeUF5TENCc1pXWjBPaUJ3YjNNdWJHVm1kQ0FySUhCdmN5NTNhV1IwYUNCOVhHNWNiaUFnZlZ4dVhHNGdJRlJ2YjJ4MGFYQXVjSEp2ZEc5MGVYQmxMbWRsZEZacFpYZHdiM0owUVdScWRYTjBaV1JFWld4MFlTQTlJR1oxYm1OMGFXOXVJQ2h3YkdGalpXMWxiblFzSUhCdmN5d2dZV04wZFdGc1YybGtkR2dzSUdGamRIVmhiRWhsYVdkb2RDa2dlMXh1SUNBZ0lIWmhjaUJrWld4MFlTQTlJSHNnZEc5d09pQXdMQ0JzWldaME9pQXdJSDFjYmlBZ0lDQnBaaUFvSVhSb2FYTXVKSFpwWlhkd2IzSjBLU0J5WlhSMWNtNGdaR1ZzZEdGY2JseHVJQ0FnSUhaaGNpQjJhV1YzY0c5eWRGQmhaR1JwYm1jZ1BTQjBhR2x6TG05d2RHbHZibk11ZG1sbGQzQnZjblFnSmlZZ2RHaHBjeTV2Y0hScGIyNXpMblpwWlhkd2IzSjBMbkJoWkdScGJtY2dmSHdnTUZ4dUlDQWdJSFpoY2lCMmFXVjNjRzl5ZEVScGJXVnVjMmx2Ym5NZ1BTQjBhR2x6TG1kbGRGQnZjMmwwYVc5dUtIUm9hWE11SkhacFpYZHdiM0owS1Z4dVhHNGdJQ0FnYVdZZ0tDOXlhV2RvZEh4c1pXWjBMeTUwWlhOMEtIQnNZV05sYldWdWRDa3BJSHRjYmlBZ0lDQWdJSFpoY2lCMGIzQkZaR2RsVDJabWMyVjBJQ0FnSUQwZ2NHOXpMblJ2Y0NBdElIWnBaWGR3YjNKMFVHRmtaR2x1WnlBdElIWnBaWGR3YjNKMFJHbHRaVzV6YVc5dWN5NXpZM0p2Ykd4Y2JpQWdJQ0FnSUhaaGNpQmliM1IwYjIxRlpHZGxUMlptYzJWMElEMGdjRzl6TG5SdmNDQXJJSFpwWlhkd2IzSjBVR0ZrWkdsdVp5QXRJSFpwWlhkd2IzSjBSR2x0Wlc1emFXOXVjeTV6WTNKdmJHd2dLeUJoWTNSMVlXeElaV2xuYUhSY2JpQWdJQ0FnSUdsbUlDaDBiM0JGWkdkbFQyWm1jMlYwSUR3Z2RtbGxkM0J2Y25SRWFXMWxibk5wYjI1ekxuUnZjQ2tnZXlBdkx5QjBiM0FnYjNabGNtWnNiM2RjYmlBZ0lDQWdJQ0FnWkdWc2RHRXVkRzl3SUQwZ2RtbGxkM0J2Y25SRWFXMWxibk5wYjI1ekxuUnZjQ0F0SUhSdmNFVmtaMlZQWm1aelpYUmNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9ZbTkwZEc5dFJXUm5aVTltWm5ObGRDQStJSFpwWlhkd2IzSjBSR2x0Wlc1emFXOXVjeTUwYjNBZ0t5QjJhV1YzY0c5eWRFUnBiV1Z1YzJsdmJuTXVhR1ZwWjJoMEtTQjdJQzh2SUdKdmRIUnZiU0J2ZG1WeVpteHZkMXh1SUNBZ0lDQWdJQ0JrWld4MFlTNTBiM0FnUFNCMmFXVjNjRzl5ZEVScGJXVnVjMmx2Ym5NdWRHOXdJQ3NnZG1sbGQzQnZjblJFYVcxbGJuTnBiMjV6TG1obGFXZG9kQ0F0SUdKdmRIUnZiVVZrWjJWUFptWnpaWFJjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2RtRnlJR3hsWm5SRlpHZGxUMlptYzJWMElDQTlJSEJ2Y3k1c1pXWjBJQzBnZG1sbGQzQnZjblJRWVdSa2FXNW5YRzRnSUNBZ0lDQjJZWElnY21sbmFIUkZaR2RsVDJabWMyVjBJRDBnY0c5ekxteGxablFnS3lCMmFXVjNjRzl5ZEZCaFpHUnBibWNnS3lCaFkzUjFZV3hYYVdSMGFGeHVJQ0FnSUNBZ2FXWWdLR3hsWm5SRlpHZGxUMlptYzJWMElEd2dkbWxsZDNCdmNuUkVhVzFsYm5OcGIyNXpMbXhsWm5RcElIc2dMeThnYkdWbWRDQnZkbVZ5Wm14dmQxeHVJQ0FnSUNBZ0lDQmtaV3gwWVM1c1pXWjBJRDBnZG1sbGQzQnZjblJFYVcxbGJuTnBiMjV6TG14bFpuUWdMU0JzWldaMFJXUm5aVTltWm5ObGRGeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaHlhV2RvZEVWa1oyVlBabVp6WlhRZ1BpQjJhV1YzY0c5eWRFUnBiV1Z1YzJsdmJuTXVjbWxuYUhRcElIc2dMeThnY21sbmFIUWdiM1psY21ac2IzZGNiaUFnSUNBZ0lDQWdaR1ZzZEdFdWJHVm1kQ0E5SUhacFpYZHdiM0owUkdsdFpXNXphVzl1Y3k1c1pXWjBJQ3NnZG1sbGQzQnZjblJFYVcxbGJuTnBiMjV6TG5kcFpIUm9JQzBnY21sbmFIUkZaR2RsVDJabWMyVjBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1SUdSbGJIUmhYRzRnSUgxY2JseHVJQ0JVYjI5c2RHbHdMbkJ5YjNSdmRIbHdaUzVuWlhSVWFYUnNaU0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdkR2wwYkdWY2JpQWdJQ0IyWVhJZ0pHVWdQU0IwYUdsekxpUmxiR1Z0Wlc1MFhHNGdJQ0FnZG1GeUlHOGdJRDBnZEdocGN5NXZjSFJwYjI1elhHNWNiaUFnSUNCMGFYUnNaU0E5SUNSbExtRjBkSElvSjJSaGRHRXRiM0pwWjJsdVlXd3RkR2wwYkdVbktWeHVJQ0FnSUNBZ2ZId2dLSFI1Y0dWdlppQnZMblJwZEd4bElEMDlJQ2RtZFc1amRHbHZiaWNnUHlCdkxuUnBkR3hsTG1OaGJHd29KR1ZiTUYwcElEb2dJRzh1ZEdsMGJHVXBYRzVjYmlBZ0lDQnlaWFIxY200Z2RHbDBiR1ZjYmlBZ2ZWeHVYRzRnSUZSdmIyeDBhWEF1Y0hKdmRHOTBlWEJsTG1kbGRGVkpSQ0E5SUdaMWJtTjBhVzl1SUNod2NtVm1hWGdwSUh0Y2JpQWdJQ0JrYnlCd2NtVm1hWGdnS3owZ2ZuNG9UV0YwYUM1eVlXNWtiMjBvS1NBcUlERXdNREF3TURBcFhHNGdJQ0FnZDJocGJHVWdLR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tIQnlaV1pwZUNrcFhHNGdJQ0FnY21WMGRYSnVJSEJ5WldacGVGeHVJQ0I5WEc1Y2JpQWdWRzl2YkhScGNDNXdjbTkwYjNSNWNHVXVkR2x3SUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHbG1JQ2doZEdocGN5NGtkR2x3S1NCN1hHNGdJQ0FnSUNCMGFHbHpMaVIwYVhBZ1BTQWtLSFJvYVhNdWIzQjBhVzl1Y3k1MFpXMXdiR0YwWlNsY2JpQWdJQ0FnSUdsbUlDaDBhR2x6TGlSMGFYQXViR1Z1WjNSb0lDRTlJREVwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0hSb2FYTXVkSGx3WlNBcklDY2dZSFJsYlhCc1lYUmxZQ0J2Y0hScGIyNGdiWFZ6ZENCamIyNXphWE4wSUc5bUlHVjRZV04wYkhrZ01TQjBiM0F0YkdWMlpXd2daV3hsYldWdWRDRW5LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NGtkR2x3WEc0Z0lIMWNibHh1SUNCVWIyOXNkR2x3TG5CeWIzUnZkSGx3WlM1aGNuSnZkeUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0hSb2FYTXVKR0Z5Y205M0lEMGdkR2hwY3k0a1lYSnliM2NnZkh3Z2RHaHBjeTUwYVhBb0tTNW1hVzVrS0NjdWRHOXZiSFJwY0MxaGNuSnZkeWNwS1Z4dUlDQjlYRzVjYmlBZ1ZHOXZiSFJwY0M1d2NtOTBiM1I1Y0dVdVpXNWhZbXhsSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11Wlc1aFlteGxaQ0E5SUhSeWRXVmNiaUFnZlZ4dVhHNGdJRlJ2YjJ4MGFYQXVjSEp2ZEc5MGVYQmxMbVJwYzJGaWJHVWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZEdocGN5NWxibUZpYkdWa0lEMGdabUZzYzJWY2JpQWdmVnh1WEc0Z0lGUnZiMngwYVhBdWNISnZkRzkwZVhCbExuUnZaMmRzWlVWdVlXSnNaV1FnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RHaHBjeTVsYm1GaWJHVmtJRDBnSVhSb2FYTXVaVzVoWW14bFpGeHVJQ0I5WEc1Y2JpQWdWRzl2YkhScGNDNXdjbTkwYjNSNWNHVXVkRzluWjJ4bElEMGdablZ1WTNScGIyNGdLR1VwSUh0Y2JpQWdJQ0IyWVhJZ2MyVnNaaUE5SUhSb2FYTmNiaUFnSUNCcFppQW9aU2tnZTF4dUlDQWdJQ0FnYzJWc1ppQTlJQ1FvWlM1amRYSnlaVzUwVkdGeVoyVjBLUzVrWVhSaEtDZGljeTRuSUNzZ2RHaHBjeTUwZVhCbEtWeHVJQ0FnSUNBZ2FXWWdLQ0Z6Wld4bUtTQjdYRzRnSUNBZ0lDQWdJSE5sYkdZZ1BTQnVaWGNnZEdocGN5NWpiMjV6ZEhKMVkzUnZjaWhsTG1OMWNuSmxiblJVWVhKblpYUXNJSFJvYVhNdVoyVjBSR1ZzWldkaGRHVlBjSFJwYjI1ektDa3BYRzRnSUNBZ0lDQWdJQ1FvWlM1amRYSnlaVzUwVkdGeVoyVjBLUzVrWVhSaEtDZGljeTRuSUNzZ2RHaHBjeTUwZVhCbExDQnpaV3htS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNobEtTQjdYRzRnSUNBZ0lDQnpaV3htTG1sdVUzUmhkR1V1WTJ4cFkyc2dQU0FoYzJWc1ppNXBibE4wWVhSbExtTnNhV05yWEc0Z0lDQWdJQ0JwWmlBb2MyVnNaaTVwYzBsdVUzUmhkR1ZVY25WbEtDa3BJSE5sYkdZdVpXNTBaWElvYzJWc1ppbGNiaUFnSUNBZ0lHVnNjMlVnYzJWc1ppNXNaV0YyWlNoelpXeG1LVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCelpXeG1MblJwY0NncExtaGhjME5zWVhOektDZHBiaWNwSUQ4Z2MyVnNaaTVzWldGMlpTaHpaV3htS1NBNklITmxiR1l1Wlc1MFpYSW9jMlZzWmlsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCVWIyOXNkR2x3TG5CeWIzUnZkSGx3WlM1a1pYTjBjbTk1SUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUIwYUdGMElEMGdkR2hwYzF4dUlDQWdJR05zWldGeVZHbHRaVzkxZENoMGFHbHpMblJwYldWdmRYUXBYRzRnSUNBZ2RHaHBjeTVvYVdSbEtHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJSFJvWVhRdUpHVnNaVzFsYm5RdWIyWm1LQ2N1SnlBcklIUm9ZWFF1ZEhsd1pTa3VjbVZ0YjNabFJHRjBZU2duWW5NdUp5QXJJSFJvWVhRdWRIbHdaU2xjYmlBZ0lDQWdJR2xtSUNoMGFHRjBMaVIwYVhBcElIdGNiaUFnSUNBZ0lDQWdkR2hoZEM0a2RHbHdMbVJsZEdGamFDZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjBhR0YwTGlSMGFYQWdQU0J1ZFd4c1hHNGdJQ0FnSUNCMGFHRjBMaVJoY25KdmR5QTlJRzUxYkd4Y2JpQWdJQ0FnSUhSb1lYUXVKSFpwWlhkd2IzSjBJRDBnYm5Wc2JGeHVJQ0FnSUNBZ2RHaGhkQzRrWld4bGJXVnVkQ0E5SUc1MWJHeGNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JseHVJQ0F2THlCVVQwOU1WRWxRSUZCTVZVZEpUaUJFUlVaSlRrbFVTVTlPWEc0Z0lDOHZJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMWNibHh1SUNCbWRXNWpkR2x2YmlCUWJIVm5hVzRvYjNCMGFXOXVLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WldGamFDaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0IyWVhJZ0pIUm9hWE1nSUNBOUlDUW9kR2hwY3lsY2JpQWdJQ0FnSUhaaGNpQmtZWFJoSUNBZ0lEMGdKSFJvYVhNdVpHRjBZU2duWW5NdWRHOXZiSFJwY0NjcFhHNGdJQ0FnSUNCMllYSWdiM0IwYVc5dWN5QTlJSFI1Y0dWdlppQnZjSFJwYjI0Z1BUMGdKMjlpYW1WamRDY2dKaVlnYjNCMGFXOXVYRzVjYmlBZ0lDQWdJR2xtSUNnaFpHRjBZU0FtSmlBdlpHVnpkSEp2ZVh4b2FXUmxMeTUwWlhOMEtHOXdkR2x2YmlrcElISmxkSFZ5Ymx4dUlDQWdJQ0FnYVdZZ0tDRmtZWFJoS1NBa2RHaHBjeTVrWVhSaEtDZGljeTUwYjI5c2RHbHdKeXdnS0dSaGRHRWdQU0J1WlhjZ1ZHOXZiSFJwY0NoMGFHbHpMQ0J2Y0hScGIyNXpLU2twWEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUc5d2RHbHZiaUE5UFNBbmMzUnlhVzVuSnlrZ1pHRjBZVnR2Y0hScGIyNWRLQ2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnZG1GeUlHOXNaQ0E5SUNRdVptNHVkRzl2YkhScGNGeHVYRzRnSUNRdVptNHVkRzl2YkhScGNDQWdJQ0FnSUNBZ0lDQWdJQ0E5SUZCc2RXZHBibHh1SUNBa0xtWnVMblJ2YjJ4MGFYQXVRMjl1YzNSeWRXTjBiM0lnUFNCVWIyOXNkR2x3WEc1Y2JseHVJQ0F2THlCVVQwOU1WRWxRSUU1UElFTlBUa1pNU1VOVVhHNGdJQzh2SUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQxY2JseHVJQ0FrTG1adUxuUnZiMngwYVhBdWJtOURiMjVtYkdsamRDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FrTG1adUxuUnZiMngwYVhBZ1BTQnZiR1JjYmlBZ0lDQnlaWFIxY200Z2RHaHBjMXh1SUNCOVhHNWNibjBvYWxGMVpYSjVLVHRjYmx4dUx5b2dQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlYRzRnS2lCQ2IyOTBjM1J5WVhBNklIQnZjRzkyWlhJdWFuTWdkak11TXk0M1hHNGdLaUJvZEhSd09pOHZaMlYwWW05dmRITjBjbUZ3TG1OdmJTOXFZWFpoYzJOeWFYQjBMeU53YjNCdmRtVnljMXh1SUNvZ1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVhHNGdLaUJEYjNCNWNtbG5hSFFnTWpBeE1TMHlNREUySUZSM2FYUjBaWElzSUVsdVl5NWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzUjNZbk12WW05dmRITjBjbUZ3TDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDBnS2k5Y2JseHVYRzRyWm5WdVkzUnBiMjRnS0NRcElIdGNiaUFnSjNWelpTQnpkSEpwWTNRbk8xeHVYRzRnSUM4dklGQlBVRTlXUlZJZ1VGVkNURWxESUVOTVFWTlRJRVJGUmtsT1NWUkpUMDVjYmlBZ0x5OGdQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFZ4dVhHNGdJSFpoY2lCUWIzQnZkbVZ5SUQwZ1puVnVZM1JwYjI0Z0tHVnNaVzFsYm5Rc0lHOXdkR2x2Ym5NcElIdGNiaUFnSUNCMGFHbHpMbWx1YVhRb0ozQnZjRzkyWlhJbkxDQmxiR1Z0Wlc1MExDQnZjSFJwYjI1ektWeHVJQ0I5WEc1Y2JpQWdhV1lnS0NFa0xtWnVMblJ2YjJ4MGFYQXBJSFJvY205M0lHNWxkeUJGY25KdmNpZ25VRzl3YjNabGNpQnlaWEYxYVhKbGN5QjBiMjlzZEdsd0xtcHpKeWxjYmx4dUlDQlFiM0J2ZG1WeUxsWkZVbE5KVDA0Z0lEMGdKek11TXk0M0oxeHVYRzRnSUZCdmNHOTJaWEl1UkVWR1FWVk1WRk1nUFNBa0xtVjRkR1Z1WkNoN2ZTd2dKQzVtYmk1MGIyOXNkR2x3TGtOdmJuTjBjblZqZEc5eUxrUkZSa0ZWVEZSVExDQjdYRzRnSUNBZ2NHeGhZMlZ0Wlc1ME9pQW5jbWxuYUhRbkxGeHVJQ0FnSUhSeWFXZG5aWEk2SUNkamJHbGpheWNzWEc0Z0lDQWdZMjl1ZEdWdWREb2dKeWNzWEc0Z0lDQWdkR1Z0Y0d4aGRHVTZJQ2M4WkdsMklHTnNZWE56UFZ3aWNHOXdiM1psY2x3aUlISnZiR1U5WENKMGIyOXNkR2x3WENJK1BHUnBkaUJqYkdGemN6MWNJbUZ5Y205M1hDSStQQzlrYVhZK1BHZ3pJR05zWVhOelBWd2ljRzl3YjNabGNpMTBhWFJzWlZ3aVBqd3ZhRE0rUEdScGRpQmpiR0Z6Y3oxY0luQnZjRzkyWlhJdFkyOXVkR1Z1ZEZ3aVBqd3ZaR2wyUGp3dlpHbDJQaWRjYmlBZ2ZTbGNibHh1WEc0Z0lDOHZJRTVQVkVVNklGQlBVRTlXUlZJZ1JWaFVSVTVFVXlCMGIyOXNkR2x3TG1welhHNGdJQzh2SUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlYRzVjYmlBZ1VHOXdiM1psY2k1d2NtOTBiM1I1Y0dVZ1BTQWtMbVY0ZEdWdVpDaDdmU3dnSkM1bWJpNTBiMjlzZEdsd0xrTnZibk4wY25WamRHOXlMbkJ5YjNSdmRIbHdaU2xjYmx4dUlDQlFiM0J2ZG1WeUxuQnliM1J2ZEhsd1pTNWpiMjV6ZEhKMVkzUnZjaUE5SUZCdmNHOTJaWEpjYmx4dUlDQlFiM0J2ZG1WeUxuQnliM1J2ZEhsd1pTNW5aWFJFWldaaGRXeDBjeUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnVUc5d2IzWmxjaTVFUlVaQlZVeFVVMXh1SUNCOVhHNWNiaUFnVUc5d2IzWmxjaTV3Y205MGIzUjVjR1V1YzJWMFEyOXVkR1Z1ZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnSkhScGNDQWdJQ0E5SUhSb2FYTXVkR2x3S0NsY2JpQWdJQ0IyWVhJZ2RHbDBiR1VnSUNBOUlIUm9hWE11WjJWMFZHbDBiR1VvS1Z4dUlDQWdJSFpoY2lCamIyNTBaVzUwSUQwZ2RHaHBjeTVuWlhSRGIyNTBaVzUwS0NsY2JseHVJQ0FnSUNSMGFYQXVabWx1WkNnbkxuQnZjRzkyWlhJdGRHbDBiR1VuS1Z0MGFHbHpMbTl3ZEdsdmJuTXVhSFJ0YkNBL0lDZG9kRzFzSnlBNklDZDBaWGgwSjEwb2RHbDBiR1VwWEc0Z0lDQWdKSFJwY0M1bWFXNWtLQ2N1Y0c5d2IzWmxjaTFqYjI1MFpXNTBKeWt1WTJocGJHUnlaVzRvS1M1a1pYUmhZMmdvS1M1bGJtUW9LVnNnTHk4Z2QyVWdkWE5sSUdGd2NHVnVaQ0JtYjNJZ2FIUnRiQ0J2WW1wbFkzUnpJSFJ2SUcxaGFXNTBZV2x1SUdweklHVjJaVzUwYzF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtaDBiV3dnUHlBb2RIbHdaVzltSUdOdmJuUmxiblFnUFQwZ0ozTjBjbWx1WnljZ1B5QW5hSFJ0YkNjZ09pQW5ZWEJ3Wlc1a0p5a2dPaUFuZEdWNGRDZGNiaUFnSUNCZEtHTnZiblJsYm5RcFhHNWNiaUFnSUNBa2RHbHdMbkpsYlc5MlpVTnNZWE56S0NkbVlXUmxJSFJ2Y0NCaWIzUjBiMjBnYkdWbWRDQnlhV2RvZENCcGJpY3BYRzVjYmlBZ0lDQXZMeUJKUlRnZ1pHOWxjMjRuZENCaFkyTmxjSFFnYUdsa2FXNW5JSFpwWVNCMGFHVWdZRHBsYlhCMGVXQWdjSE5sZFdSdklITmxiR1ZqZEc5eUxDQjNaU0JvWVhabElIUnZJR1J2WEc0Z0lDQWdMeThnZEdocGN5QnRZVzUxWVd4c2VTQmllU0JqYUdWamEybHVaeUIwYUdVZ1kyOXVkR1Z1ZEhNdVhHNGdJQ0FnYVdZZ0tDRWtkR2x3TG1acGJtUW9KeTV3YjNCdmRtVnlMWFJwZEd4bEp5a3VhSFJ0YkNncEtTQWtkR2x3TG1acGJtUW9KeTV3YjNCdmRtVnlMWFJwZEd4bEp5a3VhR2xrWlNncFhHNGdJSDFjYmx4dUlDQlFiM0J2ZG1WeUxuQnliM1J2ZEhsd1pTNW9ZWE5EYjI1MFpXNTBJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtZGxkRlJwZEd4bEtDa2dmSHdnZEdocGN5NW5aWFJEYjI1MFpXNTBLQ2xjYmlBZ2ZWeHVYRzRnSUZCdmNHOTJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFTnZiblJsYm5RZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUNSbElEMGdkR2hwY3k0a1pXeGxiV1Z1ZEZ4dUlDQWdJSFpoY2lCdklDQTlJSFJvYVhNdWIzQjBhVzl1YzF4dVhHNGdJQ0FnY21WMGRYSnVJQ1JsTG1GMGRISW9KMlJoZEdFdFkyOXVkR1Z1ZENjcFhHNGdJQ0FnSUNCOGZDQW9kSGx3Wlc5bUlHOHVZMjl1ZEdWdWRDQTlQU0FuWm5WdVkzUnBiMjRuSUQ5Y2JpQWdJQ0FnSUNBZ0lDQWdJRzh1WTI5dWRHVnVkQzVqWVd4c0tDUmxXekJkS1NBNlhHNGdJQ0FnSUNBZ0lDQWdJQ0J2TG1OdmJuUmxiblFwWEc0Z0lIMWNibHh1SUNCUWIzQnZkbVZ5TG5CeWIzUnZkSGx3WlM1aGNuSnZkeUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0hSb2FYTXVKR0Z5Y205M0lEMGdkR2hwY3k0a1lYSnliM2NnZkh3Z2RHaHBjeTUwYVhBb0tTNW1hVzVrS0NjdVlYSnliM2NuS1NsY2JpQWdmVnh1WEc1Y2JpQWdMeThnVUU5UVQxWkZVaUJRVEZWSFNVNGdSRVZHU1U1SlZFbFBUbHh1SUNBdkx5QTlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVhHNWNiaUFnWm5WdVkzUnBiMjRnVUd4MVoybHVLRzl3ZEdsdmJpa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbVZoWTJnb1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdkbUZ5SUNSMGFHbHpJQ0FnUFNBa0tIUm9hWE1wWEc0Z0lDQWdJQ0IyWVhJZ1pHRjBZU0FnSUNBOUlDUjBhR2x6TG1SaGRHRW9KMkp6TG5CdmNHOTJaWEluS1Z4dUlDQWdJQ0FnZG1GeUlHOXdkR2x2Ym5NZ1BTQjBlWEJsYjJZZ2IzQjBhVzl1SUQwOUlDZHZZbXBsWTNRbklDWW1JRzl3ZEdsdmJseHVYRzRnSUNBZ0lDQnBaaUFvSVdSaGRHRWdKaVlnTDJSbGMzUnliM2w4YUdsa1pTOHVkR1Z6ZENodmNIUnBiMjRwS1NCeVpYUjFjbTVjYmlBZ0lDQWdJR2xtSUNnaFpHRjBZU2tnSkhSb2FYTXVaR0YwWVNnblluTXVjRzl3YjNabGNpY3NJQ2hrWVhSaElEMGdibVYzSUZCdmNHOTJaWElvZEdocGN5d2diM0IwYVc5dWN5a3BLVnh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJ2Y0hScGIyNGdQVDBnSjNOMGNtbHVaeWNwSUdSaGRHRmJiM0IwYVc5dVhTZ3BYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSFpoY2lCdmJHUWdQU0FrTG1adUxuQnZjRzkyWlhKY2JseHVJQ0FrTG1adUxuQnZjRzkyWlhJZ0lDQWdJQ0FnSUNBZ0lDQWdQU0JRYkhWbmFXNWNiaUFnSkM1bWJpNXdiM0J2ZG1WeUxrTnZibk4wY25WamRHOXlJRDBnVUc5d2IzWmxjbHh1WEc1Y2JpQWdMeThnVUU5UVQxWkZVaUJPVHlCRFQwNUdURWxEVkZ4dUlDQXZMeUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5WEc1Y2JpQWdKQzVtYmk1d2IzQnZkbVZ5TG01dlEyOXVabXhwWTNRZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdKQzVtYmk1d2IzQnZkbVZ5SUQwZ2IyeGtYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTmNiaUFnZlZ4dVhHNTlLR3BSZFdWeWVTazdYRzVjYmk4cUlEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBWeHVJQ29nUW05dmRITjBjbUZ3T2lCelkzSnZiR3h6Y0hrdWFuTWdkak11TXk0M1hHNGdLaUJvZEhSd09pOHZaMlYwWW05dmRITjBjbUZ3TG1OdmJTOXFZWFpoYzJOeWFYQjBMeU56WTNKdmJHeHpjSGxjYmlBcUlEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBWeHVJQ29nUTI5d2VYSnBaMmgwSURJd01URXRNakF4TmlCVWQybDBkR1Z5TENCSmJtTXVYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOTBkMkp6TDJKdmIzUnpkSEpoY0M5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5SUNvdlhHNWNibHh1SzJaMWJtTjBhVzl1SUNna0tTQjdYRzRnSUNkMWMyVWdjM1J5YVdOMEp6dGNibHh1SUNBdkx5QlRRMUpQVEV4VFVGa2dRMHhCVTFNZ1JFVkdTVTVKVkVsUFRseHVJQ0F2THlBOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFZ4dVhHNGdJR1oxYm1OMGFXOXVJRk5qY205c2JGTndlU2hsYkdWdFpXNTBMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lDQWdkR2hwY3k0a1ltOWtlU0FnSUNBZ0lDQWdJQ0E5SUNRb1pHOWpkVzFsYm5RdVltOWtlU2xjYmlBZ0lDQjBhR2x6TGlSelkzSnZiR3hGYkdWdFpXNTBJRDBnSkNobGJHVnRaVzUwS1M1cGN5aGtiMk4xYldWdWRDNWliMlI1S1NBL0lDUW9kMmx1Wkc5M0tTQTZJQ1FvWld4bGJXVnVkQ2xjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nSUNBZ0lDQWdJRDBnSkM1bGVIUmxibVFvZTMwc0lGTmpjbTlzYkZOd2VTNUVSVVpCVlV4VVV5d2diM0IwYVc5dWN5bGNiaUFnSUNCMGFHbHpMbk5sYkdWamRHOXlJQ0FnSUNBZ0lEMGdLSFJvYVhNdWIzQjBhVzl1Y3k1MFlYSm5aWFFnZkh3Z0p5Y3BJQ3NnSnlBdWJtRjJJR3hwSUQ0Z1lTZGNiaUFnSUNCMGFHbHpMbTltWm5ObGRITWdJQ0FnSUNBZ0lEMGdXMTFjYmlBZ0lDQjBhR2x6TG5SaGNtZGxkSE1nSUNBZ0lDQWdJRDBnVzExY2JpQWdJQ0IwYUdsekxtRmpkR2wyWlZSaGNtZGxkQ0FnSUQwZ2JuVnNiRnh1SUNBZ0lIUm9hWE11YzJOeWIyeHNTR1ZwWjJoMElDQWdQU0F3WEc1Y2JpQWdJQ0IwYUdsekxpUnpZM0p2Ykd4RmJHVnRaVzUwTG05dUtDZHpZM0p2Ykd3dVluTXVjMk55YjJ4c2MzQjVKeXdnSkM1d2NtOTRlU2gwYUdsekxuQnliMk5sYzNNc0lIUm9hWE1wS1Z4dUlDQWdJSFJvYVhNdWNtVm1jbVZ6YUNncFhHNGdJQ0FnZEdocGN5NXdjbTlqWlhOektDbGNiaUFnZlZ4dVhHNGdJRk5qY205c2JGTndlUzVXUlZKVFNVOU9JQ0E5SUNjekxqTXVOeWRjYmx4dUlDQlRZM0p2Ykd4VGNIa3VSRVZHUVZWTVZGTWdQU0I3WEc0Z0lDQWdiMlptYzJWME9pQXhNRnh1SUNCOVhHNWNiaUFnVTJOeWIyeHNVM0I1TG5CeWIzUnZkSGx3WlM1blpYUlRZM0p2Ykd4SVpXbG5hSFFnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVKSE5qY205c2JFVnNaVzFsYm5SYk1GMHVjMk55YjJ4c1NHVnBaMmgwSUh4OElFMWhkR2d1YldGNEtIUm9hWE11SkdKdlpIbGJNRjB1YzJOeWIyeHNTR1ZwWjJoMExDQmtiMk4xYldWdWRDNWtiMk4xYldWdWRFVnNaVzFsYm5RdWMyTnliMnhzU0dWcFoyaDBLVnh1SUNCOVhHNWNiaUFnVTJOeWIyeHNVM0I1TG5CeWIzUnZkSGx3WlM1eVpXWnlaWE5vSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUIwYUdGMElDQWdJQ0FnSUNBZ0lEMGdkR2hwYzF4dUlDQWdJSFpoY2lCdlptWnpaWFJOWlhSb2IyUWdJRDBnSjI5bVpuTmxkQ2RjYmlBZ0lDQjJZWElnYjJabWMyVjBRbUZ6WlNBZ0lDQTlJREJjYmx4dUlDQWdJSFJvYVhNdWIyWm1jMlYwY3lBZ0lDQWdJRDBnVzExY2JpQWdJQ0IwYUdsekxuUmhjbWRsZEhNZ0lDQWdJQ0E5SUZ0ZFhHNGdJQ0FnZEdocGN5NXpZM0p2Ykd4SVpXbG5hSFFnUFNCMGFHbHpMbWRsZEZOamNtOXNiRWhsYVdkb2RDZ3BYRzVjYmlBZ0lDQnBaaUFvSVNRdWFYTlhhVzVrYjNjb2RHaHBjeTRrYzJOeWIyeHNSV3hsYldWdWRGc3dYU2twSUh0Y2JpQWdJQ0FnSUc5bVpuTmxkRTFsZEdodlpDQTlJQ2R3YjNOcGRHbHZiaWRjYmlBZ0lDQWdJRzltWm5ObGRFSmhjMlVnSUNBOUlIUm9hWE11SkhOamNtOXNiRVZzWlcxbGJuUXVjMk55YjJ4c1ZHOXdLQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TGlSaWIyUjVYRzRnSUNBZ0lDQXVabWx1WkNoMGFHbHpMbk5sYkdWamRHOXlLVnh1SUNBZ0lDQWdMbTFoY0NobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJSFpoY2lBa1pXd2dJQ0E5SUNRb2RHaHBjeWxjYmlBZ0lDQWdJQ0FnZG1GeUlHaHlaV1lnSUQwZ0pHVnNMbVJoZEdFb0ozUmhjbWRsZENjcElIeDhJQ1JsYkM1aGRIUnlLQ2RvY21WbUp5bGNiaUFnSUNBZ0lDQWdkbUZ5SUNSb2NtVm1JRDBnTDE0akxpOHVkR1Z6ZENob2NtVm1LU0FtSmlBa0tHaHlaV1lwWEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNna2FISmxabHh1SUNBZ0lDQWdJQ0FnSUNZbUlDUm9jbVZtTG14bGJtZDBhRnh1SUNBZ0lDQWdJQ0FnSUNZbUlDUm9jbVZtTG1sektDYzZkbWx6YVdKc1pTY3BYRzRnSUNBZ0lDQWdJQ0FnSmlZZ1cxc2thSEpsWmx0dlptWnpaWFJOWlhSb2IyUmRLQ2t1ZEc5d0lDc2diMlptYzJWMFFtRnpaU3dnYUhKbFpsMWRLU0I4ZkNCdWRXeHNYRzRnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdMbk52Y25Rb1puVnVZM1JwYjI0Z0tHRXNJR0lwSUhzZ2NtVjBkWEp1SUdGYk1GMGdMU0JpV3pCZElIMHBYRzRnSUNBZ0lDQXVaV0ZqYUNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJSFJvWVhRdWIyWm1jMlYwY3k1d2RYTm9LSFJvYVhOYk1GMHBYRzRnSUNBZ0lDQWdJSFJvWVhRdWRHRnlaMlYwY3k1d2RYTm9LSFJvYVhOYk1WMHBYRzRnSUNBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnVTJOeWIyeHNVM0I1TG5CeWIzUnZkSGx3WlM1d2NtOWpaWE56SUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ6WTNKdmJHeFViM0FnSUNBZ1BTQjBhR2x6TGlSelkzSnZiR3hGYkdWdFpXNTBMbk5qY205c2JGUnZjQ2dwSUNzZ2RHaHBjeTV2Y0hScGIyNXpMbTltWm5ObGRGeHVJQ0FnSUhaaGNpQnpZM0p2Ykd4SVpXbG5hSFFnUFNCMGFHbHpMbWRsZEZOamNtOXNiRWhsYVdkb2RDZ3BYRzRnSUNBZ2RtRnlJRzFoZUZOamNtOXNiQ0FnSUNBOUlIUm9hWE11YjNCMGFXOXVjeTV2Wm1aelpYUWdLeUJ6WTNKdmJHeElaV2xuYUhRZ0xTQjBhR2x6TGlSelkzSnZiR3hGYkdWdFpXNTBMbWhsYVdkb2RDZ3BYRzRnSUNBZ2RtRnlJRzltWm5ObGRITWdJQ0FnSUNBOUlIUm9hWE11YjJabWMyVjBjMXh1SUNBZ0lIWmhjaUIwWVhKblpYUnpJQ0FnSUNBZ1BTQjBhR2x6TG5SaGNtZGxkSE5jYmlBZ0lDQjJZWElnWVdOMGFYWmxWR0Z5WjJWMElEMGdkR2hwY3k1aFkzUnBkbVZVWVhKblpYUmNiaUFnSUNCMllYSWdhVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjMk55YjJ4c1NHVnBaMmgwSUNFOUlITmpjbTlzYkVobGFXZG9kQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXlaV1p5WlhOb0tDbGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9jMk55YjJ4c1ZHOXdJRDQ5SUcxaGVGTmpjbTlzYkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdGamRHbDJaVlJoY21kbGRDQWhQU0FvYVNBOUlIUmhjbWRsZEhOYmRHRnlaMlYwY3k1c1pXNW5kR2dnTFNBeFhTa2dKaVlnZEdocGN5NWhZM1JwZG1GMFpTaHBLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2hoWTNScGRtVlVZWEpuWlhRZ0ppWWdjMk55YjJ4c1ZHOXdJRHdnYjJabWMyVjBjMXN3WFNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVoWTNScGRtVlVZWEpuWlhRZ1BTQnVkV3hzWEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1amJHVmhjaWdwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdabTl5SUNocElEMGdiMlptYzJWMGN5NXNaVzVuZEdnN0lHa3RMVHNwSUh0Y2JpQWdJQ0FnSUdGamRHbDJaVlJoY21kbGRDQWhQU0IwWVhKblpYUnpXMmxkWEc0Z0lDQWdJQ0FnSUNZbUlITmpjbTlzYkZSdmNDQStQU0J2Wm1aelpYUnpXMmxkWEc0Z0lDQWdJQ0FnSUNZbUlDaHZabVp6WlhSelcya2dLeUF4WFNBOVBUMGdkVzVrWldacGJtVmtJSHg4SUhOamNtOXNiRlJ2Y0NBOElHOW1abk5sZEhOYmFTQXJJREZkS1Z4dUlDQWdJQ0FnSUNBbUppQjBhR2x6TG1GamRHbDJZWFJsS0hSaGNtZGxkSE5iYVYwcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1UyTnliMnhzVTNCNUxuQnliM1J2ZEhsd1pTNWhZM1JwZG1GMFpTQTlJR1oxYm1OMGFXOXVJQ2gwWVhKblpYUXBJSHRjYmlBZ0lDQjBhR2x6TG1GamRHbDJaVlJoY21kbGRDQTlJSFJoY21kbGRGeHVYRzRnSUNBZ2RHaHBjeTVqYkdWaGNpZ3BYRzVjYmlBZ0lDQjJZWElnYzJWc1pXTjBiM0lnUFNCMGFHbHpMbk5sYkdWamRHOXlJQ3RjYmlBZ0lDQWdJQ2RiWkdGMFlTMTBZWEpuWlhROVhDSW5JQ3NnZEdGeVoyVjBJQ3NnSjF3aVhTd25JQ3RjYmlBZ0lDQWdJSFJvYVhNdWMyVnNaV04wYjNJZ0t5QW5XMmh5WldZOVhDSW5JQ3NnZEdGeVoyVjBJQ3NnSjF3aVhTZGNibHh1SUNBZ0lIWmhjaUJoWTNScGRtVWdQU0FrS0hObGJHVmpkRzl5S1Z4dUlDQWdJQ0FnTG5CaGNtVnVkSE1vSjJ4cEp5bGNiaUFnSUNBZ0lDNWhaR1JEYkdGemN5Z25ZV04wYVhabEp5bGNibHh1SUNBZ0lHbG1JQ2hoWTNScGRtVXVjR0Z5Wlc1MEtDY3VaSEp2Y0dSdmQyNHRiV1Z1ZFNjcExteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ1lXTjBhWFpsSUQwZ1lXTjBhWFpsWEc0Z0lDQWdJQ0FnSUM1amJHOXpaWE4wS0Nkc2FTNWtjbTl3Wkc5M2JpY3BYRzRnSUNBZ0lDQWdJQzVoWkdSRGJHRnpjeWduWVdOMGFYWmxKeWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQmhZM1JwZG1VdWRISnBaMmRsY2lnbllXTjBhWFpoZEdVdVluTXVjMk55YjJ4c2MzQjVKeWxjYmlBZ2ZWeHVYRzRnSUZOamNtOXNiRk53ZVM1d2NtOTBiM1I1Y0dVdVkyeGxZWElnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0pDaDBhR2x6TG5ObGJHVmpkRzl5S1Z4dUlDQWdJQ0FnTG5CaGNtVnVkSE5WYm5ScGJDaDBhR2x6TG05d2RHbHZibk11ZEdGeVoyVjBMQ0FuTG1GamRHbDJaU2NwWEc0Z0lDQWdJQ0F1Y21WdGIzWmxRMnhoYzNNb0oyRmpkR2wyWlNjcFhHNGdJSDFjYmx4dVhHNGdJQzh2SUZORFVrOU1URk5RV1NCUVRGVkhTVTRnUkVWR1NVNUpWRWxQVGx4dUlDQXZMeUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmx4dUlDQm1kVzVqZEdsdmJpQlFiSFZuYVc0b2IzQjBhVzl1S1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVpXRmphQ2htZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNCMllYSWdKSFJvYVhNZ0lDQTlJQ1FvZEdocGN5bGNiaUFnSUNBZ0lIWmhjaUJrWVhSaElDQWdJRDBnSkhSb2FYTXVaR0YwWVNnblluTXVjMk55YjJ4c2MzQjVKeWxjYmlBZ0lDQWdJSFpoY2lCdmNIUnBiMjV6SUQwZ2RIbHdaVzltSUc5d2RHbHZiaUE5UFNBbmIySnFaV04wSnlBbUppQnZjSFJwYjI1Y2JseHVJQ0FnSUNBZ2FXWWdLQ0ZrWVhSaEtTQWtkR2hwY3k1a1lYUmhLQ2RpY3k1elkzSnZiR3h6Y0hrbkxDQW9aR0YwWVNBOUlHNWxkeUJUWTNKdmJHeFRjSGtvZEdocGN5d2diM0IwYVc5dWN5a3BLVnh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJ2Y0hScGIyNGdQVDBnSjNOMGNtbHVaeWNwSUdSaGRHRmJiM0IwYVc5dVhTZ3BYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSFpoY2lCdmJHUWdQU0FrTG1adUxuTmpjbTlzYkhOd2VWeHVYRzRnSUNRdVptNHVjMk55YjJ4c2MzQjVJQ0FnSUNBZ0lDQWdJQ0FnSUQwZ1VHeDFaMmx1WEc0Z0lDUXVabTR1YzJOeWIyeHNjM0I1TGtOdmJuTjBjblZqZEc5eUlEMGdVMk55YjJ4c1UzQjVYRzVjYmx4dUlDQXZMeUJUUTFKUFRFeFRVRmtnVGs4Z1EwOU9Sa3hKUTFSY2JpQWdMeThnUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVhHNWNiaUFnSkM1bWJpNXpZM0p2Ykd4emNIa3VibTlEYjI1bWJHbGpkQ0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBa0xtWnVMbk5qY205c2JITndlU0E5SUc5c1pGeHVJQ0FnSUhKbGRIVnliaUIwYUdselhHNGdJSDFjYmx4dVhHNGdJQzh2SUZORFVrOU1URk5RV1NCRVFWUkJMVUZRU1Z4dUlDQXZMeUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmx4dUlDQWtLSGRwYm1SdmR5a3ViMjRvSjJ4dllXUXVZbk11YzJOeWIyeHNjM0I1TG1SaGRHRXRZWEJwSnl3Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDUW9KMXRrWVhSaExYTndlVDFjSW5OamNtOXNiRndpWFNjcExtVmhZMmdvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RtRnlJQ1J6Y0hrZ1BTQWtLSFJvYVhNcFhHNGdJQ0FnSUNCUWJIVm5hVzR1WTJGc2JDZ2tjM0I1TENBa2MzQjVMbVJoZEdFb0tTbGNiaUFnSUNCOUtWeHVJQ0I5S1Z4dVhHNTlLR3BSZFdWeWVTazdYRzVjYmk4cUlEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBWeHVJQ29nUW05dmRITjBjbUZ3T2lCMFlXSXVhbk1nZGpNdU15NDNYRzRnS2lCb2RIUndPaTh2WjJWMFltOXZkSE4wY21Gd0xtTnZiUzlxWVhaaGMyTnlhWEIwTHlOMFlXSnpYRzRnS2lBOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQxY2JpQXFJRU52Y0hseWFXZG9kQ0F5TURFeExUSXdNVFlnVkhkcGRIUmxjaXdnU1c1akxseHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmRIZGljeTlpYjI5MGMzUnlZWEF2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJRDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQU0FxTDF4dVhHNWNiaXRtZFc1amRHbHZiaUFvSkNrZ2UxeHVJQ0FuZFhObElITjBjbWxqZENjN1hHNWNiaUFnTHk4Z1ZFRkNJRU5NUVZOVElFUkZSa2xPU1ZSSlQwNWNiaUFnTHk4Z1BUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMWNibHh1SUNCMllYSWdWR0ZpSUQwZ1puVnVZM1JwYjI0Z0tHVnNaVzFsYm5RcElIdGNiaUFnSUNBdkx5QnFjMk56T21ScGMyRmliR1VnY21WeGRXbHlaVVJ2Ykd4aGNrSmxabTl5WldwUmRXVnllVUZ6YzJsbmJtMWxiblJjYmlBZ0lDQjBhR2x6TG1Wc1pXMWxiblFnUFNBa0tHVnNaVzFsYm5RcFhHNGdJQ0FnTHk4Z2FuTmpjenBsYm1GaWJHVWdjbVZ4ZFdseVpVUnZiR3hoY2tKbFptOXlaV3BSZFdWeWVVRnpjMmxuYm0xbGJuUmNiaUFnZlZ4dVhHNGdJRlJoWWk1V1JWSlRTVTlPSUQwZ0p6TXVNeTQzSjF4dVhHNGdJRlJoWWk1VVVrRk9VMGxVU1U5T1gwUlZVa0ZVU1U5T0lEMGdNVFV3WEc1Y2JpQWdWR0ZpTG5CeWIzUnZkSGx3WlM1emFHOTNJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQWtkR2hwY3lBZ0lDQTlJSFJvYVhNdVpXeGxiV1Z1ZEZ4dUlDQWdJSFpoY2lBa2RXd2dJQ0FnSUNBOUlDUjBhR2x6TG1Oc2IzTmxjM1FvSjNWc09tNXZkQ2d1WkhKdmNHUnZkMjR0YldWdWRTa25LVnh1SUNBZ0lIWmhjaUJ6Wld4bFkzUnZjaUE5SUNSMGFHbHpMbVJoZEdFb0ozUmhjbWRsZENjcFhHNWNiaUFnSUNCcFppQW9JWE5sYkdWamRHOXlLU0I3WEc0Z0lDQWdJQ0J6Wld4bFkzUnZjaUE5SUNSMGFHbHpMbUYwZEhJb0oyaHlaV1luS1Z4dUlDQWdJQ0FnYzJWc1pXTjBiM0lnUFNCelpXeGxZM1J2Y2lBbUppQnpaV3hsWTNSdmNpNXlaWEJzWVdObEtDOHVLaWcvUFNOYlhseGNjMTBxSkNrdkxDQW5KeWtnTHk4Z2MzUnlhWEFnWm05eUlHbGxOMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2drZEdocGN5NXdZWEpsYm5Rb0oyeHBKeWt1YUdGelEyeGhjM01vSjJGamRHbDJaU2NwS1NCeVpYUjFjbTVjYmx4dUlDQWdJSFpoY2lBa2NISmxkbWx2ZFhNZ1BTQWtkV3d1Wm1sdVpDZ25MbUZqZEdsMlpUcHNZWE4wSUdFbktWeHVJQ0FnSUhaaGNpQm9hV1JsUlhabGJuUWdQU0FrTGtWMlpXNTBLQ2RvYVdSbExtSnpMblJoWWljc0lIdGNiaUFnSUNBZ0lISmxiR0YwWldSVVlYSm5aWFE2SUNSMGFHbHpXekJkWEc0Z0lDQWdmU2xjYmlBZ0lDQjJZWElnYzJodmQwVjJaVzUwSUQwZ0pDNUZkbVZ1ZENnbmMyaHZkeTVpY3k1MFlXSW5MQ0I3WEc0Z0lDQWdJQ0J5Wld4aGRHVmtWR0Z5WjJWME9pQWtjSEpsZG1sdmRYTmJNRjFjYmlBZ0lDQjlLVnh1WEc0Z0lDQWdKSEJ5WlhacGIzVnpMblJ5YVdkblpYSW9hR2xrWlVWMlpXNTBLVnh1SUNBZ0lDUjBhR2x6TG5SeWFXZG5aWElvYzJodmQwVjJaVzUwS1Z4dVhHNGdJQ0FnYVdZZ0tITm9iM2RGZG1WdWRDNXBjMFJsWm1GMWJIUlFjbVYyWlc1MFpXUW9LU0I4ZkNCb2FXUmxSWFpsYm5RdWFYTkVaV1poZFd4MFVISmxkbVZ1ZEdWa0tDa3BJSEpsZEhWeWJseHVYRzRnSUNBZ2RtRnlJQ1IwWVhKblpYUWdQU0FrS0hObGJHVmpkRzl5S1Z4dVhHNGdJQ0FnZEdocGN5NWhZM1JwZG1GMFpTZ2tkR2hwY3k1amJHOXpaWE4wS0Nkc2FTY3BMQ0FrZFd3cFhHNGdJQ0FnZEdocGN5NWhZM1JwZG1GMFpTZ2tkR0Z5WjJWMExDQWtkR0Z5WjJWMExuQmhjbVZ1ZENncExDQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0FrY0hKbGRtbHZkWE11ZEhKcFoyZGxjaWg3WEc0Z0lDQWdJQ0FnSUhSNWNHVTZJQ2RvYVdSa1pXNHVZbk11ZEdGaUp5eGNiaUFnSUNBZ0lDQWdjbVZzWVhSbFpGUmhjbWRsZERvZ0pIUm9hWE5iTUYxY2JpQWdJQ0FnSUgwcFhHNGdJQ0FnSUNBa2RHaHBjeTUwY21sbloyVnlLSHRjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dKM05vYjNkdUxtSnpMblJoWWljc1hHNGdJQ0FnSUNBZ0lISmxiR0YwWldSVVlYSm5aWFE2SUNSd2NtVjJhVzkxYzFzd1hWeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdWR0ZpTG5CeWIzUnZkSGx3WlM1aFkzUnBkbUYwWlNBOUlHWjFibU4wYVc5dUlDaGxiR1Z0Wlc1MExDQmpiMjUwWVdsdVpYSXNJR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdkbUZ5SUNSaFkzUnBkbVVnSUNBZ1BTQmpiMjUwWVdsdVpYSXVabWx1WkNnblBpQXVZV04wYVhabEp5bGNiaUFnSUNCMllYSWdkSEpoYm5OcGRHbHZiaUE5SUdOaGJHeGlZV05yWEc0Z0lDQWdJQ0FtSmlBa0xuTjFjSEJ2Y25RdWRISmhibk5wZEdsdmJseHVJQ0FnSUNBZ0ppWWdLQ1JoWTNScGRtVXViR1Z1WjNSb0lDWW1JQ1JoWTNScGRtVXVhR0Z6UTJ4aGMzTW9KMlpoWkdVbktTQjhmQ0FoSVdOdmJuUmhhVzVsY2k1bWFXNWtLQ2MrSUM1bVlXUmxKeWt1YkdWdVozUm9LVnh1WEc0Z0lDQWdablZ1WTNScGIyNGdibVY0ZENncElIdGNiaUFnSUNBZ0lDUmhZM1JwZG1WY2JpQWdJQ0FnSUNBZ0xuSmxiVzkyWlVOc1lYTnpLQ2RoWTNScGRtVW5LVnh1SUNBZ0lDQWdJQ0F1Wm1sdVpDZ25QaUF1WkhKdmNHUnZkMjR0YldWdWRTQStJQzVoWTNScGRtVW5LVnh1SUNBZ0lDQWdJQ0FnSUM1eVpXMXZkbVZEYkdGemN5Z25ZV04wYVhabEp5bGNiaUFnSUNBZ0lDQWdMbVZ1WkNncFhHNGdJQ0FnSUNBZ0lDNW1hVzVrS0NkYlpHRjBZUzEwYjJkbmJHVTlYQ0owWVdKY0lsMG5LVnh1SUNBZ0lDQWdJQ0FnSUM1aGRIUnlLQ2RoY21saExXVjRjR0Z1WkdWa0p5d2dabUZzYzJVcFhHNWNiaUFnSUNBZ0lHVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ0xtRmtaRU5zWVhOektDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ0lDQXVabWx1WkNnblcyUmhkR0V0ZEc5bloyeGxQVndpZEdGaVhDSmRKeWxjYmlBZ0lDQWdJQ0FnSUNBdVlYUjBjaWduWVhKcFlTMWxlSEJoYm1SbFpDY3NJSFJ5ZFdVcFhHNWNiaUFnSUNBZ0lHbG1JQ2gwY21GdWMybDBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5SYk1GMHViMlptYzJWMFYybGtkR2dnTHk4Z2NtVm1iRzkzSUdadmNpQjBjbUZ1YzJsMGFXOXVYRzRnSUNBZ0lDQWdJR1ZzWlcxbGJuUXVZV1JrUTJ4aGMzTW9KMmx1SnlsY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblF1Y21WdGIzWmxRMnhoYzNNb0oyWmhaR1VuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9aV3hsYldWdWRDNXdZWEpsYm5Rb0p5NWtjbTl3Wkc5M2JpMXRaVzUxSnlrdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ0lDQXVZMnh2YzJWemRDZ25iR2t1WkhKdmNHUnZkMjRuS1Z4dUlDQWdJQ0FnSUNBZ0lDQWdMbUZrWkVOc1lYTnpLQ2RoWTNScGRtVW5LVnh1SUNBZ0lDQWdJQ0FnSUM1bGJtUW9LVnh1SUNBZ0lDQWdJQ0FnSUM1bWFXNWtLQ2RiWkdGMFlTMTBiMmRuYkdVOVhDSjBZV0pjSWwwbktWeHVJQ0FnSUNBZ0lDQWdJQ0FnTG1GMGRISW9KMkZ5YVdFdFpYaHdZVzVrWldRbkxDQjBjblZsS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCallXeHNZbUZqYXlBbUppQmpZV3hzWW1GamF5Z3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0pHRmpkR2wyWlM1c1pXNW5kR2dnSmlZZ2RISmhibk5wZEdsdmJpQS9YRzRnSUNBZ0lDQWtZV04wYVhabFhHNGdJQ0FnSUNBZ0lDNXZibVVvSjJKelZISmhibk5wZEdsdmJrVnVaQ2NzSUc1bGVIUXBYRzRnSUNBZ0lDQWdJQzVsYlhWc1lYUmxWSEpoYm5OcGRHbHZia1Z1WkNoVVlXSXVWRkpCVGxOSlZFbFBUbDlFVlZKQlZFbFBUaWtnT2x4dUlDQWdJQ0FnYm1WNGRDZ3BYRzVjYmlBZ0lDQWtZV04wYVhabExuSmxiVzkyWlVOc1lYTnpLQ2RwYmljcFhHNGdJSDFjYmx4dVhHNGdJQzh2SUZSQlFpQlFURlZIU1U0Z1JFVkdTVTVKVkVsUFRseHVJQ0F2THlBOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMWNibHh1SUNCbWRXNWpkR2x2YmlCUWJIVm5hVzRvYjNCMGFXOXVLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WldGamFDaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0IyWVhJZ0pIUm9hWE1nUFNBa0tIUm9hWE1wWEc0Z0lDQWdJQ0IyWVhJZ1pHRjBZU0FnUFNBa2RHaHBjeTVrWVhSaEtDZGljeTUwWVdJbktWeHVYRzRnSUNBZ0lDQnBaaUFvSVdSaGRHRXBJQ1IwYUdsekxtUmhkR0VvSjJKekxuUmhZaWNzSUNoa1lYUmhJRDBnYm1WM0lGUmhZaWgwYUdsektTa3BYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JRzl3ZEdsdmJpQTlQU0FuYzNSeWFXNW5KeWtnWkdGMFlWdHZjSFJwYjI1ZEtDbGNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdkbUZ5SUc5c1pDQTlJQ1F1Wm00dWRHRmlYRzVjYmlBZ0pDNW1iaTUwWVdJZ0lDQWdJQ0FnSUNBZ0lDQWdQU0JRYkhWbmFXNWNiaUFnSkM1bWJpNTBZV0l1UTI5dWMzUnlkV04wYjNJZ1BTQlVZV0pjYmx4dVhHNGdJQzh2SUZSQlFpQk9UeUJEVDA1R1RFbERWRnh1SUNBdkx5QTlQVDA5UFQwOVBUMDlQVDA5UFQxY2JseHVJQ0FrTG1adUxuUmhZaTV1YjBOdmJtWnNhV04wSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDUXVabTR1ZEdGaUlEMGdiMnhrWEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE5jYmlBZ2ZWeHVYRzVjYmlBZ0x5OGdWRUZDSUVSQlZFRXRRVkJKWEc0Z0lDOHZJRDA5UFQwOVBUMDlQVDA5UFZ4dVhHNGdJSFpoY2lCamJHbGphMGhoYm1Sc1pYSWdQU0JtZFc1amRHbHZiaUFvWlNrZ2UxeHVJQ0FnSUdVdWNISmxkbVZ1ZEVSbFptRjFiSFFvS1Z4dUlDQWdJRkJzZFdkcGJpNWpZV3hzS0NRb2RHaHBjeWtzSUNkemFHOTNKeWxjYmlBZ2ZWeHVYRzRnSUNRb1pHOWpkVzFsYm5RcFhHNGdJQ0FnTG05dUtDZGpiR2xqYXk1aWN5NTBZV0l1WkdGMFlTMWhjR2tuTENBblcyUmhkR0V0ZEc5bloyeGxQVndpZEdGaVhDSmRKeXdnWTJ4cFkydElZVzVrYkdWeUtWeHVJQ0FnSUM1dmJpZ25ZMnhwWTJzdVluTXVkR0ZpTG1SaGRHRXRZWEJwSnl3Z0oxdGtZWFJoTFhSdloyZHNaVDFjSW5CcGJHeGNJbDBuTENCamJHbGphMGhoYm1Sc1pYSXBYRzVjYm4wb2FsRjFaWEo1S1R0Y2JseHVMeW9nUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5WEc0Z0tpQkNiMjkwYzNSeVlYQTZJR0ZtWm1sNExtcHpJSFl6TGpNdU4xeHVJQ29nYUhSMGNEb3ZMMmRsZEdKdmIzUnpkSEpoY0M1amIyMHZhbUYyWVhOamNtbHdkQzhqWVdabWFYaGNiaUFxSUQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFZ4dUlDb2dRMjl3ZVhKcFoyaDBJREl3TVRFdE1qQXhOaUJVZDJsMGRHVnlMQ0JKYm1NdVhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5MGQySnpMMkp2YjNSemRISmhjQzlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUlDb2dQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlJQ292WEc1Y2JseHVLMloxYm1OMGFXOXVJQ2drS1NCN1hHNGdJQ2QxYzJVZ2MzUnlhV04wSnp0Y2JseHVJQ0F2THlCQlJrWkpXQ0JEVEVGVFV5QkVSVVpKVGtsVVNVOU9YRzRnSUM4dklEMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmx4dUlDQjJZWElnUVdabWFYZ2dQU0JtZFc1amRHbHZiaUFvWld4bGJXVnVkQ3dnYjNCMGFXOXVjeWtnZTF4dUlDQWdJSFJvYVhNdWIzQjBhVzl1Y3lBOUlDUXVaWGgwWlc1a0tIdDlMQ0JCWm1acGVDNUVSVVpCVlV4VVV5d2diM0IwYVc5dWN5bGNibHh1SUNBZ0lIUm9hWE11SkhSaGNtZGxkQ0E5SUNRb2RHaHBjeTV2Y0hScGIyNXpMblJoY21kbGRDbGNiaUFnSUNBZ0lDNXZiaWduYzJOeWIyeHNMbUp6TG1GbVptbDRMbVJoZEdFdFlYQnBKeXdnSkM1d2NtOTRlU2gwYUdsekxtTm9aV05yVUc5emFYUnBiMjRzSUhSb2FYTXBLVnh1SUNBZ0lDQWdMbTl1S0NkamJHbGpheTVpY3k1aFptWnBlQzVrWVhSaExXRndhU2NzSUNBa0xuQnliM2g1S0hSb2FYTXVZMmhsWTJ0UWIzTnBkR2x2YmxkcGRHaEZkbVZ1ZEV4dmIzQXNJSFJvYVhNcEtWeHVYRzRnSUNBZ2RHaHBjeTRrWld4bGJXVnVkQ0FnSUNBZ1BTQWtLR1ZzWlcxbGJuUXBYRzRnSUNBZ2RHaHBjeTVoWm1acGVHVmtJQ0FnSUNBZ1BTQnVkV3hzWEc0Z0lDQWdkR2hwY3k1MWJuQnBiaUFnSUNBZ0lDQWdQU0J1ZFd4c1hHNGdJQ0FnZEdocGN5NXdhVzV1WldSUFptWnpaWFFnUFNCdWRXeHNYRzVjYmlBZ0lDQjBhR2x6TG1Ob1pXTnJVRzl6YVhScGIyNG9LVnh1SUNCOVhHNWNiaUFnUVdabWFYZ3VWa1ZTVTBsUFRpQWdQU0FuTXk0ekxqY25YRzVjYmlBZ1FXWm1hWGd1VWtWVFJWUWdJQ0FnUFNBbllXWm1hWGdnWVdabWFYZ3RkRzl3SUdGbVptbDRMV0p2ZEhSdmJTZGNibHh1SUNCQlptWnBlQzVFUlVaQlZVeFVVeUE5SUh0Y2JpQWdJQ0J2Wm1aelpYUTZJREFzWEc0Z0lDQWdkR0Z5WjJWME9pQjNhVzVrYjNkY2JpQWdmVnh1WEc0Z0lFRm1abWw0TG5CeWIzUnZkSGx3WlM1blpYUlRkR0YwWlNBOUlHWjFibU4wYVc5dUlDaHpZM0p2Ykd4SVpXbG5hSFFzSUdobGFXZG9kQ3dnYjJabWMyVjBWRzl3TENCdlptWnpaWFJDYjNSMGIyMHBJSHRjYmlBZ0lDQjJZWElnYzJOeWIyeHNWRzl3SUNBZ0lEMGdkR2hwY3k0a2RHRnlaMlYwTG5OamNtOXNiRlJ2Y0NncFhHNGdJQ0FnZG1GeUlIQnZjMmwwYVc5dUlDQWdJQ0E5SUhSb2FYTXVKR1ZzWlcxbGJuUXViMlptYzJWMEtDbGNiaUFnSUNCMllYSWdkR0Z5WjJWMFNHVnBaMmgwSUQwZ2RHaHBjeTRrZEdGeVoyVjBMbWhsYVdkb2RDZ3BYRzVjYmlBZ0lDQnBaaUFvYjJabWMyVjBWRzl3SUNFOUlHNTFiR3dnSmlZZ2RHaHBjeTVoWm1acGVHVmtJRDA5SUNkMGIzQW5LU0J5WlhSMWNtNGdjMk55YjJ4c1ZHOXdJRHdnYjJabWMyVjBWRzl3SUQ4Z0ozUnZjQ2NnT2lCbVlXeHpaVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVZV1ptYVhobFpDQTlQU0FuWW05MGRHOXRKeWtnZTF4dUlDQWdJQ0FnYVdZZ0tHOW1abk5sZEZSdmNDQWhQU0J1ZFd4c0tTQnlaWFIxY200Z0tITmpjbTlzYkZSdmNDQXJJSFJvYVhNdWRXNXdhVzRnUEQwZ2NHOXphWFJwYjI0dWRHOXdLU0EvSUdaaGJITmxJRG9nSjJKdmRIUnZiU2RjYmlBZ0lDQWdJSEpsZEhWeWJpQW9jMk55YjJ4c1ZHOXdJQ3NnZEdGeVoyVjBTR1ZwWjJoMElEdzlJSE5qY205c2JFaGxhV2RvZENBdElHOW1abk5sZEVKdmRIUnZiU2tnUHlCbVlXeHpaU0E2SUNkaWIzUjBiMjBuWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkbUZ5SUdsdWFYUnBZV3hwZW1sdVp5QWdJRDBnZEdocGN5NWhabVpwZUdWa0lEMDlJRzUxYkd4Y2JpQWdJQ0IyWVhJZ1kyOXNiR2xrWlhKVWIzQWdJQ0FnUFNCcGJtbDBhV0ZzYVhwcGJtY2dQeUJ6WTNKdmJHeFViM0FnT2lCd2IzTnBkR2x2Ymk1MGIzQmNiaUFnSUNCMllYSWdZMjlzYkdsa1pYSklaV2xuYUhRZ1BTQnBibWwwYVdGc2FYcHBibWNnUHlCMFlYSm5aWFJJWldsbmFIUWdPaUJvWldsbmFIUmNibHh1SUNBZ0lHbG1JQ2h2Wm1aelpYUlViM0FnSVQwZ2JuVnNiQ0FtSmlCelkzSnZiR3hVYjNBZ1BEMGdiMlptYzJWMFZHOXdLU0J5WlhSMWNtNGdKM1J2Y0NkY2JpQWdJQ0JwWmlBb2IyWm1jMlYwUW05MGRHOXRJQ0U5SUc1MWJHd2dKaVlnS0dOdmJHeHBaR1Z5Vkc5d0lDc2dZMjlzYkdsa1pYSklaV2xuYUhRZ1BqMGdjMk55YjJ4c1NHVnBaMmgwSUMwZ2IyWm1jMlYwUW05MGRHOXRLU2tnY21WMGRYSnVJQ2RpYjNSMGIyMG5YRzVjYmlBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ2ZWeHVYRzRnSUVGbVptbDRMbkJ5YjNSdmRIbHdaUzVuWlhSUWFXNXVaV1JQWm1aelpYUWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11Y0dsdWJtVmtUMlptYzJWMEtTQnlaWFIxY200Z2RHaHBjeTV3YVc1dVpXUlBabVp6WlhSY2JpQWdJQ0IwYUdsekxpUmxiR1Z0Wlc1MExuSmxiVzkyWlVOc1lYTnpLRUZtWm1sNExsSkZVMFZVS1M1aFpHUkRiR0Z6Y3lnbllXWm1hWGduS1Z4dUlDQWdJSFpoY2lCelkzSnZiR3hVYjNBZ1BTQjBhR2x6TGlSMFlYSm5aWFF1YzJOeWIyeHNWRzl3S0NsY2JpQWdJQ0IyWVhJZ2NHOXphWFJwYjI0Z0lEMGdkR2hwY3k0a1pXeGxiV1Z1ZEM1dlptWnpaWFFvS1Z4dUlDQWdJSEpsZEhWeWJpQW9kR2hwY3k1d2FXNXVaV1JQWm1aelpYUWdQU0J3YjNOcGRHbHZiaTUwYjNBZ0xTQnpZM0p2Ykd4VWIzQXBYRzRnSUgxY2JseHVJQ0JCWm1acGVDNXdjbTkwYjNSNWNHVXVZMmhsWTJ0UWIzTnBkR2x2YmxkcGRHaEZkbVZ1ZEV4dmIzQWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnYzJWMFZHbHRaVzkxZENna0xuQnliM2g1S0hSb2FYTXVZMmhsWTJ0UWIzTnBkR2x2Yml3Z2RHaHBjeWtzSURFcFhHNGdJSDFjYmx4dUlDQkJabVpwZUM1d2NtOTBiM1I1Y0dVdVkyaGxZMnRRYjNOcGRHbHZiaUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCcFppQW9JWFJvYVhNdUpHVnNaVzFsYm5RdWFYTW9KenAyYVhOcFlteGxKeWtwSUhKbGRIVnlibHh1WEc0Z0lDQWdkbUZ5SUdobGFXZG9kQ0FnSUNBZ0lDQTlJSFJvYVhNdUpHVnNaVzFsYm5RdWFHVnBaMmgwS0NsY2JpQWdJQ0IyWVhJZ2IyWm1jMlYwSUNBZ0lDQWdJRDBnZEdocGN5NXZjSFJwYjI1ekxtOW1abk5sZEZ4dUlDQWdJSFpoY2lCdlptWnpaWFJVYjNBZ0lDQWdQU0J2Wm1aelpYUXVkRzl3WEc0Z0lDQWdkbUZ5SUc5bVpuTmxkRUp2ZEhSdmJTQTlJRzltWm5ObGRDNWliM1IwYjIxY2JpQWdJQ0IyWVhJZ2MyTnliMnhzU0dWcFoyaDBJRDBnVFdGMGFDNXRZWGdvSkNoa2IyTjFiV1Z1ZENrdWFHVnBaMmgwS0Nrc0lDUW9aRzlqZFcxbGJuUXVZbTlrZVNrdWFHVnBaMmgwS0NrcFhHNWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlHOW1abk5sZENBaFBTQW5iMkpxWldOMEp5a2dJQ0FnSUNBZ0lDQnZabVp6WlhSQ2IzUjBiMjBnUFNCdlptWnpaWFJVYjNBZ1BTQnZabVp6WlhSY2JpQWdJQ0JwWmlBb2RIbHdaVzltSUc5bVpuTmxkRlJ2Y0NBOVBTQW5ablZ1WTNScGIyNG5LU0FnSUNCdlptWnpaWFJVYjNBZ0lDQWdQU0J2Wm1aelpYUXVkRzl3S0hSb2FYTXVKR1ZzWlcxbGJuUXBYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQnZabVp6WlhSQ2IzUjBiMjBnUFQwZ0oyWjFibU4wYVc5dUp5a2diMlptYzJWMFFtOTBkRzl0SUQwZ2IyWm1jMlYwTG1KdmRIUnZiU2gwYUdsekxpUmxiR1Z0Wlc1MEtWeHVYRzRnSUNBZ2RtRnlJR0ZtWm1sNElEMGdkR2hwY3k1blpYUlRkR0YwWlNoelkzSnZiR3hJWldsbmFIUXNJR2hsYVdkb2RDd2diMlptYzJWMFZHOXdMQ0J2Wm1aelpYUkNiM1IwYjIwcFhHNWNiaUFnSUNCcFppQW9kR2hwY3k1aFptWnBlR1ZrSUNFOUlHRm1abWw0S1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1MWJuQnBiaUFoUFNCdWRXeHNLU0IwYUdsekxpUmxiR1Z0Wlc1MExtTnpjeWduZEc5d0p5d2dKeWNwWEc1Y2JpQWdJQ0FnSUhaaGNpQmhabVpwZUZSNWNHVWdQU0FuWVdabWFYZ25JQ3NnS0dGbVptbDRJRDhnSnkwbklDc2dZV1ptYVhnZ09pQW5KeWxjYmlBZ0lDQWdJSFpoY2lCbElDQWdJQ0FnSUNBZ1BTQWtMa1YyWlc1MEtHRm1abWw0Vkhsd1pTQXJJQ2N1WW5NdVlXWm1hWGduS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMaVJsYkdWdFpXNTBMblJ5YVdkblpYSW9aU2xjYmx4dUlDQWdJQ0FnYVdZZ0tHVXVhWE5FWldaaGRXeDBVSEpsZG1WdWRHVmtLQ2twSUhKbGRIVnlibHh1WEc0Z0lDQWdJQ0IwYUdsekxtRm1abWw0WldRZ1BTQmhabVpwZUZ4dUlDQWdJQ0FnZEdocGN5NTFibkJwYmlBOUlHRm1abWw0SUQwOUlDZGliM1IwYjIwbklEOGdkR2hwY3k1blpYUlFhVzV1WldSUFptWnpaWFFvS1NBNklHNTFiR3hjYmx4dUlDQWdJQ0FnZEdocGN5NGtaV3hsYldWdWRGeHVJQ0FnSUNBZ0lDQXVjbVZ0YjNabFEyeGhjM01vUVdabWFYZ3VVa1ZUUlZRcFhHNGdJQ0FnSUNBZ0lDNWhaR1JEYkdGemN5aGhabVpwZUZSNWNHVXBYRzRnSUNBZ0lDQWdJQzUwY21sbloyVnlLR0ZtWm1sNFZIbHdaUzV5WlhCc1lXTmxLQ2RoWm1acGVDY3NJQ2RoWm1acGVHVmtKeWtnS3lBbkxtSnpMbUZtWm1sNEp5bGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9ZV1ptYVhnZ1BUMGdKMkp2ZEhSdmJTY3BJSHRjYmlBZ0lDQWdJSFJvYVhNdUpHVnNaVzFsYm5RdWIyWm1jMlYwS0h0Y2JpQWdJQ0FnSUNBZ2RHOXdPaUJ6WTNKdmJHeElaV2xuYUhRZ0xTQm9aV2xuYUhRZ0xTQnZabVp6WlhSQ2IzUjBiMjFjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdmVnh1SUNCOVhHNWNibHh1SUNBdkx5QkJSa1pKV0NCUVRGVkhTVTRnUkVWR1NVNUpWRWxQVGx4dUlDQXZMeUE5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBWeHVYRzRnSUdaMWJtTjBhVzl1SUZCc2RXZHBiaWh2Y0hScGIyNHBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVsWVdOb0tHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJSFpoY2lBa2RHaHBjeUFnSUQwZ0pDaDBhR2x6S1Z4dUlDQWdJQ0FnZG1GeUlHUmhkR0VnSUNBZ1BTQWtkR2hwY3k1a1lYUmhLQ2RpY3k1aFptWnBlQ2NwWEc0Z0lDQWdJQ0IyWVhJZ2IzQjBhVzl1Y3lBOUlIUjVjR1Z2WmlCdmNIUnBiMjRnUFQwZ0oyOWlhbVZqZENjZ0ppWWdiM0IwYVc5dVhHNWNiaUFnSUNBZ0lHbG1JQ2doWkdGMFlTa2dKSFJvYVhNdVpHRjBZU2duWW5NdVlXWm1hWGduTENBb1pHRjBZU0E5SUc1bGR5QkJabVpwZUNoMGFHbHpMQ0J2Y0hScGIyNXpLU2twWEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUc5d2RHbHZiaUE5UFNBbmMzUnlhVzVuSnlrZ1pHRjBZVnR2Y0hScGIyNWRLQ2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnZG1GeUlHOXNaQ0E5SUNRdVptNHVZV1ptYVhoY2JseHVJQ0FrTG1adUxtRm1abWw0SUNBZ0lDQWdJQ0FnSUNBZ0lEMGdVR3gxWjJsdVhHNGdJQ1F1Wm00dVlXWm1hWGd1UTI5dWMzUnlkV04wYjNJZ1BTQkJabVpwZUZ4dVhHNWNiaUFnTHk4Z1FVWkdTVmdnVGs4Z1EwOU9Sa3hKUTFSY2JpQWdMeThnUFQwOVBUMDlQVDA5UFQwOVBUMDlQVDFjYmx4dUlDQWtMbVp1TG1GbVptbDRMbTV2UTI5dVpteHBZM1FnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0pDNW1iaTVoWm1acGVDQTlJRzlzWkZ4dUlDQWdJSEpsZEhWeWJpQjBhR2x6WEc0Z0lIMWNibHh1WEc0Z0lDOHZJRUZHUmtsWUlFUkJWRUV0UVZCSlhHNGdJQzh2SUQwOVBUMDlQVDA5UFQwOVBUMDlYRzVjYmlBZ0pDaDNhVzVrYjNjcExtOXVLQ2RzYjJGa0p5d2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ1FvSjF0a1lYUmhMWE53ZVQxY0ltRm1abWw0WENKZEp5a3VaV0ZqYUNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQjJZWElnSkhOd2VTQTlJQ1FvZEdocGN5bGNiaUFnSUNBZ0lIWmhjaUJrWVhSaElEMGdKSE53ZVM1a1lYUmhLQ2xjYmx4dUlDQWdJQ0FnWkdGMFlTNXZabVp6WlhRZ1BTQmtZWFJoTG05bVpuTmxkQ0I4ZkNCN2ZWeHVYRzRnSUNBZ0lDQnBaaUFvWkdGMFlTNXZabVp6WlhSQ2IzUjBiMjBnSVQwZ2JuVnNiQ2tnWkdGMFlTNXZabVp6WlhRdVltOTBkRzl0SUQwZ1pHRjBZUzV2Wm1aelpYUkNiM1IwYjIxY2JpQWdJQ0FnSUdsbUlDaGtZWFJoTG05bVpuTmxkRlJ2Y0NBZ0lDQWhQU0J1ZFd4c0tTQmtZWFJoTG05bVpuTmxkQzUwYjNBZ0lDQWdQU0JrWVhSaExtOW1abk5sZEZSdmNGeHVYRzRnSUNBZ0lDQlFiSFZuYVc0dVkyRnNiQ2drYzNCNUxDQmtZWFJoS1Z4dUlDQWdJSDBwWEc0Z0lIMHBYRzVjYm4wb2FsRjFaWEo1S1R0Y2JpSXNJbWx0Y0c5eWRDQjdJSE5sWTNScGIyNXpJSDBnWm5KdmJTQmNJaTR2YzJWamRHbHZibk5jSWp0Y2JtbHRjRzl5ZENCN0lGUmxlSFJCYm1sdFlYUmxaQ3dnVjI5eVpFRnVhVzFoZEdWa0lIMGdabkp2YlNCY0lpNHZkR1Y0ZEZ3aU8xeHVYRzUwY25rZ2UxeHVJQ0FnSUhKbGNYVnBjbVVvSjJKdmIzUnpkSEpoY0MxellYTnpKeWs3WEc1OUlHTmhkR05vSUNobEtTQjdmVnh1WEc1UFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29RWEp5WVhrdWNISnZkRzkwZVhCbExDQW5ZMmgxYm10ZmFXNWxabVpwWTJsbGJuUW5MQ0I3WEc0Z0lDQWdkbUZzZFdVNklHWjFibU4wYVc5dUtHTm9kVzVyVTJsNlpTa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ1lYSnlZWGs5ZEdocGN6dGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGdGRMbU52Ym1OaGRDNWhjSEJzZVNoYlhTeGNiaUFnSUNBZ0lDQWdJQ0FnSUdGeWNtRjVMbTFoY0NobWRXNWpkR2x2YmlobGJHVnRMR2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnYVNWamFIVnVhMU5wZW1VZ1B5QmJYU0E2SUZ0aGNuSmhlUzV6YkdsalpTaHBMR2tyWTJoMWJtdFRhWHBsS1YwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnSUNBcE8xeHVJQ0FnSUgxY2JuMHBPMXh1WEc0dkx5QkhSVlFnVWtWQlJGa2dJVnh1SkNobWRXNWpkR2x2YmlBb0tTQjdYRzVjYmlBZ0lDQWtLRndpTG0xaGFXNWNJaWt1YjI1bGNHRm5aVjl6WTNKdmJHd29lMXh1SUNBZ0lDQWdJQ0J6WldOMGFXOXVRMjl1ZEdGcGJtVnlPaUJjSW5ObFkzUnBiMjVjSWl3Z0x5OGdjMlZqZEdsdmJrTnZiblJoYVc1bGNpQmhZMk5sY0hSeklHRnVlU0JyYVc1a0lHOW1JSE5sYkdWamRHOXlJR2x1SUdOaGMyVWdlVzkxSUdSdmJpZDBJSGRoYm5RZ2RHOGdkWE5sSUhObFkzUnBiMjVjYmlBZ0lDQWdJQ0FnWldGemFXNW5PaUJjSW1WaGMyVmNJaXdnTHk4Z1JXRnphVzVuSUc5d2RHbHZibk1nWVdOalpYQjBjeUIwYUdVZ1ExTlRNeUJsWVhOcGJtY2dZVzVwYldGMGFXOXVJSE4xWTJnZ1hDSmxZWE5sWENJc0lGd2liR2x1WldGeVhDSXNJRndpWldGelpTMXBibHdpTENCY0ltVmhjMlV0YjNWMFhDSXNJRndpWldGelpTMXBiaTF2ZFhSY0lpd2diM0lnWlhabGJpQmpkV0pwWXlCaVpYcHBaWElnZG1Gc2RXVWdjM1ZqYUNCaGN5QmNJbU4xWW1sakxXSmxlbWxsY2lnd0xqRTNOU3dnTUM0NE9EVXNJREF1TkRJd0xDQXhMak14TUNsY0lseHVJQ0FnSUNBZ0lDQmhibWx0WVhScGIyNVVhVzFsT2lBMU1EQXNJQzh2SUVGdWFXMWhkR2x2YmxScGJXVWdiR1YwSUhsdmRTQmtaV1pwYm1VZ2FHOTNJR3h2Ym1jZ1pXRmphQ0J6WldOMGFXOXVJSFJoYTJWeklIUnZJR0Z1YVcxaGRHVmNiaUFnSUNBZ0lDQWdjR0ZuYVc1aGRHbHZiam9nZEhKMVpTd2dMeThnV1c5MUlHTmhiaUJsYVhSb1pYSWdjMmh2ZHlCdmNpQm9hV1JsSUhSb1pTQndZV2RwYm1GMGFXOXVMaUJVYjJkbmJHVWdkSEoxWlNCbWIzSWdjMmh2ZHl3Z1ptRnNjMlVnWm05eUlHaHBaR1V1WEc0Z0lDQWdJQ0FnSUhWd1pHRjBaVlZTVERvZ1ptRnNjMlVzSUM4dklGUnZaMmRzWlNCMGFHbHpJSFJ5ZFdVZ2FXWWdlVzkxSUhkaGJuUWdkR2hsSUZWU1RDQjBieUJpWlNCMWNHUmhkR1ZrSUdGMWRHOXRZWFJwWTJGc2JIa2dkMmhsYmlCMGFHVWdkWE5sY2lCelkzSnZiR3dnZEc4Z1pXRmphQ0J3WVdkbExseHVJQ0FnSUNBZ0lDQnJaWGxpYjJGeVpEb2dkSEoxWlN4Y2JpQWdJQ0FnSUNBZ2JHOXZjRG9nWm1Gc2MyVXNYRzRnSUNBZ0lDQWdJR0psWm05eVpVMXZkbVU2SUdaMWJtTjBhVzl1S0dsdVpHVjRLU0I3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ1FvWUZ0a1lYUmhMWE5sWTNScGIyNWRZQ2t1Y0dGeVpXNTBLQ2RzYVNjcExuSmxiVzkyWlVOc1lYTnpLQ2RoWTNScGRtVW5LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDUW9ZRnRrWVhSaExYTmxZM1JwYjI0OVhDSWtlMmx1WkdWNGZWd2lYV0FwTG5CaGNtVnVkQ2duYkdrbktTNWhaR1JEYkdGemN5Z25ZV04wYVhabEp5azdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDUW9KMXRrWVhSaExXRnVhVzFoZEdWZEp5a3VaV0ZqYUNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ0pHTnNZWE56SUQwZ0pDaDBhR2x6S1M1a1lYUmhLQ2RoYm1sdFlYUmxKeWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tDQWtZMnhoYzNNZ0tTQWtLSFJvYVhNcExuSmxiVzkyWlVOc1lYTnpLQ1JqYkdGemN5azdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKQ2gwYUdsektTNXlaVzF2ZG1WRGJHRnpjeWduWVc1cGJXRjBaU2NwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNna0tDY3VjMlZqZEdsdmJpMG5JQ3NnYzJWamRHbHZibk5iYVc1a1pYaGRLUzVvWVhORGJHRnpjeWduWkdGeWF5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkNnblltOWtlU2NwTG1Ga1pFTnNZWE56S0Nka1lYSnJKeWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDUW9KMkp2WkhrbktTNXlaVzF2ZG1WRGJHRnpjeWduWkdGeWF5Y3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBa0tDY3VjMlZqZEdsdmJpMG5JQ3NnYzJWamRHbHZibk5iYVc1a1pYaGRLUzVtYVc1a0tDZGJaR0YwWVMxaGJtbHRZWFJsWFNjcExtVmhZMmdvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUNSa1pXeGhlU0E5SUNRb2RHaHBjeWt1WkdGMFlTZ25aR1ZzWVhrbktUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENBa1kyeGhjM01nUFNBa0tIUm9hWE1wTG1SaGRHRW9KMkZ1YVcxaGRHVW5LVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDZ2taR1ZzWVhrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FrS0hSb2FYTXBMbUZrWkVOc1lYTnpLQ2RoYm1sdFlYUmxKeWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNJQ1JrWld4aGVTQXFJREV3TURBcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1FvZEdocGN5a3VZV1JrUTJ4aGMzTW9KMkZ1YVcxaGRHVW5LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tDQWtZMnhoYzNNZ0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOdmJuTjBJQ1JqYkdGemMwUmxiR0Y1SUQwZ0pDaDBhR2x6S1M1a1lYUmhLQ1JqYkdGemN5QXJJQ2N0WkdWc1lYa25LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLQ1JqYkdGemMwUmxiR0Y1S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtLSFJvYVhNcExtRmtaRU5zWVhOektDUmpiR0Z6Y3lrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxDQWtZMnhoYzNORVpXeGhlU0FxSURFd01EQXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkNoMGFHbHpLUzVoWkdSRGJHRnpjeWdrWTJ4aGMzTXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNWNiaUFnSUNBZ0lDQWdmU3hjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJQzh2SUVGdWFXMWhkR1ZrSUZSbGVIUWdRMmhoY21GamRHVnljMXh1SUNBZ0lDUW9KeTUwWlhoMExXRnVhVzFoZEdWa0p5a3VaV0ZqYUNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJRlJsZUhSQmJtbHRZWFJsWkNoMGFHbHpLVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJQzh2SUVGdWFXMWhkR1ZrSUZSbGVIUWdWMjl5WkhOY2JpQWdJQ0FrS0NjdWQyOXlaQzFoYm1sdFlYUmxaQ2NwTG1WaFkyZ29ablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnSUNCWGIzSmtRVzVwYldGMFpXUW9kR2hwY3lrN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNBa0tGd2lMbUpzWVhOMFhDSXBMbTF2ZFhObFpXNTBaWElvWm5WdVkzUnBiMjRnS0NsN1hHNGdJQ0FnSUNBZ0lIWmhjaUJsYkNBOUlDUW9kR2hwY3lrN1hHNGdJQ0FnSUNBZ0lDUW9kR2hwY3lrdVlXUmtRMnhoYzNNb0oyRnVhVzFoZEdWa0lISjFZbUpsY2tKaGJtUW5LVHRjYmlBZ0lDQWdJQ0FnSkNoMGFHbHpLUzV2Ym1Vb0ozZGxZbXRwZEVGdWFXMWhkR2x2YmtWdVpDQnRiM3BCYm1sdFlYUnBiMjVGYm1RZ1RWTkJibWx0WVhScGIyNUZibVFnYjJGdWFXMWhkR2x2Ym1WdVpDQmhibWx0WVhScGIyNWxibVFuTENCbWRXNWpkR2x2YmlncGUxeHVJQ0FnSUNBZ0lDQWdJQ0FnWld3dWNtVnRiM1psUTJ4aGMzTW9KMkZ1YVcxaGRHVmtJSEoxWW1KbGNrSmhibVFuS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTazdYRzVjYmlBZ0lDQXZMeUJRYjNKMFptOXNhVzljYmlBZ0lDQmpiMjV6ZENCeVpXNWtaWEpRYjNKMFptOXNhVzhnUFNBb1kyRjBaV2R2Y25rcElEMCtJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiR2x6ZENBOUlIZHBibVJ2ZHk1d2IzSjBabTlzYVc5TWFYTjBMbVpwYkhSbGNpaHBkR1Z0SUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDZ2hZMkYwWldkdmNua3BJSEpsZEhWeWJpQjBjblZsTzF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHbDBaVzB1WTJGMFpXZHZjbmtnUFQwZ1kyRjBaV2R2Y25rN1hHNGdJQ0FnSUNBZ0lIMHBMbU5vZFc1clgybHVaV1ptYVdOcFpXNTBLRFFwTzF4dUlDQWdJQ0FnSUNCc1pYUWdhSFJ0YkNBOUlDY25PMXh1SUNBZ0lDQWdJQ0JtYjNJZ0tHTnZibk4wSUdrZ2FXNGdiR2x6ZENrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYUhSdGJDQXJQU0FvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSWdjM2RwY0dWeUxYTnNhV1JsWENJK1BHUnBkaUJqYkdGemN6MWNJbmh5YjNkY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzYVhOMFcybGRMbTFoY0Nnb2FYUmxiU3dnYVNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWUZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpWTI5c0xXMWtMVE1nWTI5c0xYaHpMVFlnYVhSbGJWd2lJSE4wZVd4bFBWd2liV0Z5WjJsdU9pQXdPeUJ3WVdSa2FXNW5PaUF3TzF3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHRWdaR0YwWVMxbVlXNWplV0p2ZUQxY0ltZGhiR3hsY25sY0lpQWdhSEpsWmoxY0lpUjdhWFJsYlM1MWNteDlYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHbHRaeUJ6ZEhsc1pUMWNJbmRwWkhSb09pQXhNREFsTzJobGFXZG9kRG9nTWpNd2NIZzdYQ0lnYzNKalBWd2lKSHRwZEdWdExtbHRZV2RsZlZ3aUlHRnNkRDFjSWx3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWhQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR0VnWkdGMFlTMW1ZVzVqZVdKdmVDQmtZWFJoTFdOaGNIUnBiMjQ5WENJa2UybDBaVzB1ZEdsMGJHVjlJRHhpY2lBdlBpQWtlMmwwWlcwdVpHVnpZM0pwY0hScGIyNTlYQ0lnYUhKbFpqMWNJaVI3YVhSbGJTNTFjbXg5WENJZ1kyeGhjM005WENKb2IzWmxjbHdpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pqYjI1MFpXNTBYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhvTWo0a2UybDBaVzB1ZEdsMGJHVjlQQzlvTWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhBK0pIdHBkR1Z0TG5OMVlsOTBhWFJzWlgwOEwzQStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMkUrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUG1CY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtTNXFiMmx1S0NjbktWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDc2dKend2WkdsMlBqd3ZaR2wyUGlkY2JpQWdJQ0FnSUNBZ0lDQWdJQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDUW9KeU53YjNKMFptOXNhVzh0YkdsemRDY3BMbWgwYld3b2FIUnRiQ2xjYmx4dUlDQWdJQ0FnSUNBa0tGd2lXMlJoZEdFdFptRnVZM2xpYjNoZFhDSXBMbVpoYm1ONVltOTRLSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRTl3ZEdsdmJuTWdkMmxzYkNCbmJ5Qm9aWEpsWEc0Z0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJRzVsZHlCVGQybHdaWElnS0NjdWNISnZkR1p2YkdsdkxXTnZiblJoYVc1bGNpY3NJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lITnNhV1JsYzFCbGNsWnBaWGM2SURFc1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gzYVc1a2IzY3VjRzl5ZEdadmJHbHZUR2x6ZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaVzVrWlhKUWIzSjBabTlzYVc4b0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUNRb0p5NXdiM0owWm05c2FXOHRZMkYwWldkdmNtbGxjeUJzYVNCaEp5a3VZMnhwWTJzb1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdJQ0FrS0NjdWNHOXlkR1p2YkdsdkxXTmhkR1ZuYjNKcFpYTWdiR2tuS1M1eVpXMXZkbVZEYkdGemN5Z25ZV04wYVhabEp5azdYRzRnSUNBZ0lDQWdJQ1FvZEdocGN5a3VjR0Z5Wlc1MEtDa3VZV1JrUTJ4aGMzTW9KMkZqZEdsMlpTY3BPMXh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR05oZEdWbmIzSjVJRDBnSkNoMGFHbHpLUzUwWlhoMEtDazdYRzRnSUNBZ0lDQWdJR2xtSUNoallYUmxaMjl5ZVNBOVBTQW5RV3hzSnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z0pDZ25XMlJoZEdFdFkyRjBaVzluY25sZEp5a3VjMmh2ZHlncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WdVpHVnlVRzl5ZEdadmJHbHZLQ2xjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxibVJsY2xCdmNuUm1iMnhwYnloallYUmxaMjl5ZVNsY2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUNRb0oxdGtZWFJoTFdOaGRHVnZaM0o1WFNjcExtaHBaR1VvS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUNRb1lGdGtZWFJoTFdOaGRHVnZaM0o1UFZ3aUpIdGpZWFJsWjI5eWVYMWNJbDFnS1M1emFHOTNLQ2t1WVdSa1EyeGhjM01vSjJGdWFXMWhkR1VuS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdJQ0I5S1Z4dVhHNTlLVHRjYmx4dVhHNWNiaVFvSnk1b1pXRmtaWEl0YkdsdWEzTWdZU2NwTG1Oc2FXTnJLR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FrS0NjdWJXRnBiaWNwTG0xdmRtVlVieWdrS0hSb2FYTXBMbVJoZEdFb0ozTmxZM1JwYjI0bktTazdYRzRnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1ZlNsY2JseHVKQ2hjSWk1dmQyd3RZMkZ5YjNWelpXeGNJaWt1YjNkc1EyRnliM1Z6Wld3b2UxeHVJQ0FnSUhKbGMzQnZibk5wZG1VZ09pQjdYRzRnSUNBZ0lDQWdJREE2ZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhWFJsYlhNNk1peGNiaUFnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnTmpBd09udGNiaUFnSUNBZ0lDQWdJQ0FnSUdsMFpXMXpPak1zWEc0Z0lDQWdJQ0FnSUNBZ0lDQnVZWFk2Wm1Gc2MyVmNiaUFnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnTVRBd01EcDdYRzRnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRjem8xTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdiRzl2Y0RwbVlXeHpaVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdmVnh1ZlNrN1hHNWNiblpoY2lCMGVYQmxaQ0E5SUc1bGR5QlVlWEJsWkNoY0lpNWxiR1Z0Wlc1MFhDSXNJSHRjYmlBZ0lDQXZMeUJYWVdsMGN5QXhNREF3YlhNZ1lXWjBaWElnZEhsd2FXNW5JRndpUm1seWMzUmNJbHh1SUNBZ0lITjBjbWx1WjNNNklGdGNJbGRsWWlCRVpYWmxiRzl3WlhJdVhDSXNJRndpUW1GamEyVnVaQ0JFWlhabGJHOXdaWEl1WENJc0lGd2lWVmdnUkdWemFXZHVaWEl1WENJc0lGd2lUVzlpYVd4bElFUmxkbVZzYjNCbGNpNWNJbDBzWEc0Z0lDQWdiRzl2Y0RvZ2RISjFaU3hjYmlBZ0lDQjBlWEJsVTNCbFpXUTZJRFV3TEZ4dUlDQWdJR0poWTJ0VGNHVmxaRG9nTlRBc1hHNTlLVHNpTENKbGVIQnZjblFnWTI5dWMzUWdjMlZqZEdsdmJuTWdQU0I3WEc0Z0lDQWdNVG9nSjJodmJXVW5MRnh1SUNBZ0lESTZJQ2RqWVhKa2N5Y3NYRzRnSUNBZ016b2dKM05sY25acFkyVnpKeXhjYmlBZ0lDQTBPaUFuY0c5eWRHWnZiR2x2Snl4Y2JpQWdJQ0ExT2lBblkyOXVkR0ZqZENjc1hHNGdJQ0FnTmpvZ0ozTnZZMmxoYkNjc1hHNTlPeUlzSW1WNGNHOXlkQ0JqYjI1emRDQlVaWGgwUVc1cGJXRjBaV1FnUFNBb1pXeGxLU0E5UGlCN1hHNGdJQ0FnWTI5dWMzUWdKSFJsZUhRZ1BTQWtLR1ZzWlNrdWRHVjRkQ2dwTzF4dUlDQWdJQ1FvWld4bEtTNW9kRzFzS0Z3aVhDSXBPMXh1SUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dKSFJsZUhRdWJHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnYVdZb0pIUmxlSFF1WTJoaGNrRjBLR2twSUQwOVBTQmNJaUJjSWlsY2JpQWdJQ0FnSUNBZ0lDQWdJQ1FvWld4bEtTNWhjSEJsYm1Rb0p6eHpjR0Z1UGljcklDUjBaWGgwTG1Ob1lYSkJkQ2hwS1NBcklDYzhMM053WVc0K0p5bGNiaUFnSUNBZ0lDQWdaV3h6WlZ4dUlDQWdJQ0FnSUNBZ0lDQWdKQ2hsYkdVcExtRndjR1Z1WkNnblBITndZVzRnWTJ4aGMzTTlYQ0ppYkdGemRGd2lQaWNySUNSMFpYaDBMbU5vWVhKQmRDaHBLU0FySUNjOEwzTndZVzQrSnlsY2JpQWdJQ0I5WEc1OU8xeHVYRzVsZUhCdmNuUWdZMjl1YzNRZ1YyOXlaRUZ1YVcxaGRHVmtJRDBnS0dWc1pTa2dQVDRnZTF4dUlDQWdJR052Ym5OMElDUjBaWGgwSUQwZ0pDaGxiR1VwTG5SbGVIUW9LUzV6Y0d4cGRDZ25JQ2NwTzF4dUlDQWdJQ1FvWld4bEtTNW9kRzFzS0Z3aVhDSXBPMXh1SUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dKSFJsZUhRdWJHVnVaM1JvT3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnSkNobGJHVXBMbUZ3Y0dWdVpDZ25QSE53WVc0Z1kyeGhjM005WENKaWJHRnpkQ0IzYjNKa1hDSStKeXNnSkhSbGVIUmJhVjBnS3lBblBDOXpjR0Z1UGljcFhHNGdJQ0FnZlZ4dWZUc2lYWDA9In0=
