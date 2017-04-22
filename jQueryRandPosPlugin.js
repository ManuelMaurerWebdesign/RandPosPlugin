/*
THIS PLUGIN IS LICENSED UNDER THE «CREATIVE COMMONS ATTRIBUTION-NON-COMMERCIAL LICENSE (CC BY-NC 4.0)»
LICENSE-LINK: https://creativecommons.org/licenses/by-nc/4.0/legalcode
-
YOU ARE ALLOWED TO ->
    ~ SHARE, COPY OR REDISTRIBUTE this plugin
    ~ ADAPT, REMIX, TRANSFORM OR BUILD UPON this plugin
    ~ FOR ANY NON-COMMERCIAL PURPOSE
YOU NEED TO ->
    ~ GIVE APPROPRIATE CREDIT: LINK TO «www.manuelmaurer.at» (Author: Manuel Maurer)
        FOR INSTANCE: Powered By «RandPosPlugin» Ⓒ Manuel Maurer <a href="www.manuelmaurer.at">www.manuelmaurer.at</a>

----------------------------------------------------------------------------------------------------------------------------

THIS PLUGIN USES THE FOLLOWING OTHER PLUG'INS ->
    DynamicsJS (MIT-LICENSE)
    WebUI PopOver Plugin (MIT-LICENSE)
*/


! function(a, b, c) {
    "use strict";
    ! function(b) {
        "function" == typeof define && define.amd ? define(["jquery"], b) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(a.jQuery)
    }(function(d) {
        function e(a, b) {
            return this.$element = d(a), b && ("string" === d.type(b.delay) || "number" === d.type(b.delay)) && (b.delay = {
                show: b.delay,
                hide: b.delay
            }), this.options = d.extend({}, i, b), this._defaults = i, this._name = f, this._targetclick = !1, this.init(), k.push(this.$element), this
        }
        var f = "webuiPopover",
            g = "webui-popover",
            h = "webui.popover",
            i = {
                placement: "auto",
                container: null,
                width: "auto",
                height: "auto",
                trigger: "click",
                style: "",
                selector: !1,
                delay: {
                    show: null,
                    hide: 300
                },
                async: {
                    type: "GET",
                    before: null,
                    success: null,
                    error: null
                },
                cache: !0,
                multi: !1,
                arrow: !0,
                title: "",
                content: "",
                closeable: !1,
                padding: !0,
                url: "",
                type: "html",
                direction: "",
                animation: null,
                template: '<div class="webui-popover"><div class="webui-arrow"></div><div class="webui-popover-inner"><a href="#" class="close"></a><h3 class="webui-popover-title"></h3><div class="webui-popover-content"><i class="icon-refresh"></i> <p> </p></div></div></div>',
                backdrop: !1,
                dismissible: !0,
                onShow: null,
                onHide: null,
                abortXHR: !0,
                autoHide: !1,
                offsetTop: 0,
                offsetLeft: 0,
                iframeOptions: {
                    frameborder: "0",
                    allowtransparency: "true",
                    id: "",
                    name: "",
                    scrolling: "",
                    onload: "",
                    height: "",
                    width: ""
                },
                hideEmpty: !1
            },
            j = g + "-rtl",
            k = [],
            l = d('<div class="webui-popover-backdrop"></div>'),
            m = 0,
            n = !1,
            o = -2e3,
            p = d(b),
            q = function(a, b) {
                return isNaN(a) ? b || 0 : Number(a)
            },
            r = function(a) {
                return a.data("plugin_" + f)
            },
            s = function() {
                for (var a = null, b = 0; b < k.length; b++) a = r(k[b]), a && a.hide(!0);
                p.trigger("hiddenAll." + h)
            },
            t = function(a) {
                for (var b = null, c = 0; c < k.length; c++) b = r(k[c]), b && b.id !== a.id && b.hide(!0);
                p.trigger("hiddenAll." + h)
            },
            u = "ontouchstart" in b.documentElement && /Mobi/.test(navigator.userAgent),
            v = function(a) {
                var b = {
                    x: 0,
                    y: 0
                };
                if ("touchstart" === a.type || "touchmove" === a.type || "touchend" === a.type || "touchcancel" === a.type) {
                    var c = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0];
                    b.x = c.pageX, b.y = c.pageY
                } else("mousedown" === a.type || "mouseup" === a.type || "click" === a.type) && (b.x = a.pageX, b.y = a.pageY);
                return b
            };
        e.prototype = {
            init: function() {
                if (this.$element[0] instanceof b.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
                "manual" !== this.getTrigger() && (u ? this.$element.off("touchend", this.options.selector).on("touchend", this.options.selector, d.proxy(this.toggle, this)) : "click" === this.getTrigger() ? this.$element.off("click", this.options.selector).on("click", this.options.selector, d.proxy(this.toggle, this)) : "hover" === this.getTrigger() && this.$element.off("mouseenter mouseleave click", this.options.selector).on("mouseenter", this.options.selector, d.proxy(this.mouseenterHandler, this)).on("mouseleave", this.options.selector, d.proxy(this.mouseleaveHandler, this))), this._poped = !1, this._inited = !0, this._opened = !1, this._idSeed = m, this.id = f + this._idSeed, this.options.container = d(this.options.container || b.body).first(), this.options.backdrop && l.appendTo(this.options.container).hide(), m++, "sticky" === this.getTrigger() && this.show(), this.options.selector && (this._options = d.extend({}, this.options, {
                    selector: ""
                }))
            },
            destroy: function() {
                for (var a = -1, b = 0; b < k.length; b++)
                    if (k[b] === this.$element) {
                        a = b;
                        break
                    }
                k.splice(a, 1), this.hide(), this.$element.data("plugin_" + f, null), "click" === this.getTrigger() ? this.$element.off("click") : "hover" === this.getTrigger() && this.$element.off("mouseenter mouseleave"), this.$target && this.$target.remove()
            },
            getDelegateOptions: function() {
                var a = {};
                return this._options && d.each(this._options, function(b, c) {
                    i[b] !== c && (a[b] = c)
                }), a
            },
            hide: function(a, b) {
                if ((a || "sticky" !== this.getTrigger()) && this._opened) {
                    b && (b.preventDefault(), b.stopPropagation()), this.xhr && this.options.abortXHR === !0 && (this.xhr.abort(), this.xhr = null);
                    var c = d.Event("hide." + h);
                    if (this.$element.trigger(c, [this.$target]), this.$target) {
                        this.$target.removeClass("in").addClass(this.getHideAnimation());
                        var e = this;
                        setTimeout(function() {
                            e.$target.hide(), e.getCache() || e.$target.remove()
                        }, e.getHideDelay())
                    }
                    this.options.backdrop && l.hide(), this._opened = !1, this.$element.trigger("hidden." + h, [this.$target]), this.options.onHide && this.options.onHide(this.$target)
                }
            },
            resetAutoHide: function() {
                var a = this,
                    b = a.getAutoHide();
                b && (a.autoHideHandler && clearTimeout(a.autoHideHandler), a.autoHideHandler = setTimeout(function() {
                    a.hide()
                }, b))
            },
            delegate: function(a) {
                var b = d(a).data("plugin_" + f);
                return b || (b = new e(a, this.getDelegateOptions()), d(a).data("plugin_" + f, b)), b
            },
            toggle: function(a) {
                var b = this;
                a && (a.preventDefault(), a.stopPropagation(), this.options.selector && (b = this.delegate(a.currentTarget))), b[b.getTarget().hasClass("in") ? "hide" : "show"]()
            },
            hideAll: function() {
                s()
            },
            hideOthers: function() {
                t(this)
            },
            show: function() {
                if (!this._opened) {
                    var a = this.getTarget().removeClass().addClass(g).addClass(this._customTargetClass);
                    if (this.options.multi || this.hideOthers(), !this.getCache() || !this._poped || "" === this.content) {
                        if (this.content = "", this.setTitle(this.getTitle()), this.options.closeable || a.find(".close").off("click").remove(), this.isAsync() ? this.setContentASync(this.options.content) : this.setContent(this.getContent()), this.canEmptyHide() && "" === this.content) return;
                        a.show()
                    }
                    this.displayContent(), this.options.onShow && this.options.onShow(a), this.bindBodyEvents(), this.options.backdrop && l.show(), this._opened = !0, this.resetAutoHide()
                }
            },
            displayContent: function() {
                var a = this.getElementPosition(),
                    b = this.getTarget().removeClass().addClass(g).addClass(this._customTargetClass),
                    c = this.getContentElement(),
                    e = b[0].offsetWidth,
                    f = b[0].offsetHeight,
                    i = "bottom",
                    k = d.Event("show." + h);
                if (this.canEmptyHide()) {
                    var l = c.children().html();
                    if (null !== l && 0 === l.trim().length) return
                }
                this.$element.trigger(k, [b]);
                var m = this.$element.data("width") || this.options.width;
                "" === m && (m = this._defaults.width), "auto" !== m && b.width(m);
                var n = this.$element.data("height") || this.options.height;
                "" === n && (n = this._defaults.height), "auto" !== n && c.height(n), this.options.style && this.$target.addClass(g + "-" + this.options.style), "rtl" !== this.options.direction || c.hasClass(j) || c.addClass(j), this.options.arrow || b.find(".webui-arrow").remove(), b.detach().css({
                    top: o,
                    left: o,
                    display: "block"
                }), this.getAnimation() && b.addClass(this.getAnimation()), b.appendTo(this.options.container), i = this.getPlacement(a), this.$element.trigger("added." + h), this.initTargetEvents(), this.options.padding || ("auto" !== this.options.height && c.css("height", c.outerHeight()), this.$target.addClass("webui-no-padding")), this.options.maxHeight && c.css("maxHeight", this.options.maxHeight), this.options.maxWidth && c.css("maxWidth", this.options.maxWidth), e = b[0].offsetWidth, f = b[0].offsetHeight;
                var p = this.getTargetPositin(a, i, e, f);
                if (this.$target.css(p.position).addClass(i).addClass("in"), "iframe" === this.options.type) {
                    var q = b.find("iframe"),
                        r = b.width(),
                        s = q.parent().height();
                    "" !== this.options.iframeOptions.width && "auto" !== this.options.iframeOptions.width && (r = this.options.iframeOptions.width), "" !== this.options.iframeOptions.height && "auto" !== this.options.iframeOptions.height && (s = this.options.iframeOptions.height), q.width(r).height(s)
                }
                if (this.options.arrow || this.$target.css({
                        margin: 0
                    }), this.options.arrow) {
                    var t = this.$target.find(".webui-arrow");
                    t.removeAttr("style"), "left" === i || "right" === i ? t.css({
                        top: this.$target.height() / 2
                    }) : ("top" === i || "bottom" === i) && t.css({
                        left: this.$target.width() / 2
                    }), p.arrowOffset && (-1 === p.arrowOffset.left || -1 === p.arrowOffset.top ? t.hide() : t.css(p.arrowOffset))
                }
                this._poped = !0, this.$element.trigger("shown." + h, [this.$target])
            },
            isTargetLoaded: function() {
                return 0 === this.getTarget().find("i.glyphicon-refresh").length
            },
            getTriggerElement: function() {
                return this.$element
            },
            getTarget: function() {
                if (!this.$target) {
                    var a = f + this._idSeed;
                    this.$target = d(this.options.template).attr("id", a), this._customTargetClass = this.$target.attr("class") !== g ? this.$target.attr("class") : null, this.getTriggerElement().attr("data-target", a)
                }
                return this.$target.data("trigger-element") || this.$target.data("trigger-element", this.getTriggerElement()), this.$target
            },
            removeTarget: function() {
                this.$target.remove(), this.$target = null, this.$contentElement = null
            },
            getTitleElement: function() {
                return this.getTarget().find("." + g + "-title")
            },
            getContentElement: function() {
                return this.$contentElement || (this.$contentElement = this.getTarget().find("." + g + "-content")), this.$contentElement
            },
            getTitle: function() {
                return this.$element.attr("data-title") || this.options.title || this.$element.attr("title")
            },
            getUrl: function() {
                return this.$element.attr("data-url") || this.options.url
            },
            getAutoHide: function() {
                return this.$element.attr("data-auto-hide") || this.options.autoHide
            },
            getOffsetTop: function() {
                return q(this.$element.attr("data-offset-top")) || this.options.offsetTop
            },
            getOffsetLeft: function() {
                return q(this.$element.attr("data-offset-left")) || this.options.offsetLeft
            },
            getCache: function() {
                var a = this.$element.attr("data-cache");
                if ("undefined" != typeof a) switch (a.toLowerCase()) {
                    case "true":
                    case "yes":
                    case "1":
                        return !0;
                    case "false":
                    case "no":
                    case "0":
                        return !1
                }
                return this.options.cache
            },
            getTrigger: function() {
                return this.$element.attr("data-trigger") || this.options.trigger
            },
            getDelayShow: function() {
                var a = this.$element.attr("data-delay-show");
                return "undefined" != typeof a ? a : 0 === this.options.delay.show ? 0 : this.options.delay.show || 100
            },
            getHideDelay: function() {
                var a = this.$element.attr("data-delay-hide");
                return "undefined" != typeof a ? a : 0 === this.options.delay.hide ? 0 : this.options.delay.hide || 100
            },
            getAnimation: function() {
                var a = this.$element.attr("data-animation");
                return a || this.options.animation
            },
            getHideAnimation: function() {
                var a = this.getAnimation();
                return a ? a + "-out" : "out"
            },
            setTitle: function(a) {
                var b = this.getTitleElement();
                a ? ("rtl" !== this.options.direction || b.hasClass(j) || b.addClass(j), b.html(a)) : b.remove()
            },
            hasContent: function() {
                return this.getContent()
            },
            canEmptyHide: function() {
                return this.options.hideEmpty && "html" === this.options.type
            },
            getIframe: function() {
                var a = d("<iframe></iframe>").attr("src", this.getUrl()),
                    b = this;
                return d.each(this._defaults.iframeOptions, function(c) {
                    "undefined" != typeof b.options.iframeOptions[c] && a.attr(c, b.options.iframeOptions[c])
                }), a
            },
            getContent: function() {
                if (this.getUrl()) switch (this.options.type) {
                    case "iframe":
                        this.content = this.getIframe();
                        break;
                    case "html":
                        try {
                            this.content = d(this.getUrl()), this.content.is(":visible") || this.content.show()
                        } catch (a) {
                            throw new Error("Unable to get popover content. Invalid selector specified.")
                        }
                } else if (!this.content) {
                    var b = "";
                    if (b = d.isFunction(this.options.content) ? this.options.content.apply(this.$element[0], [this]) : this.options.content, this.content = this.$element.attr("data-content") || b, !this.content) {
                        var c = this.$element.next();
                        c && c.hasClass(g + "-content") && (this.content = c)
                    }
                }
                return this.content
            },
            setContent: function(a) {
                var b = this.getTarget(),
                    c = this.getContentElement();
                "string" == typeof a ? c.html(a) : a instanceof d && (c.html(""), this.options.cache ? a.removeClass(g + "-content").appendTo(c) : a.clone(!0, !0).removeClass(g + "-content").appendTo(c)), this.$target = b
            },
            isAsync: function() {
                return "async" === this.options.type
            },
            setContentASync: function(a) {
                var b = this;
                this.xhr || (this.xhr = d.ajax({
                    url: this.getUrl(),
                    type: this.options.async.type,
                    cache: this.getCache(),
                    beforeSend: function(a, c) {
                        b.options.async.before && b.options.async.before(b, a, c)
                    },
                    success: function(c) {
                        b.bindBodyEvents(), a && d.isFunction(a) ? b.content = a.apply(b.$element[0], [c]) : b.content = c, b.setContent(b.content);
                        var e = b.getContentElement();
                        e.removeAttr("style"), b.displayContent(), b.options.async.success && b.options.async.success(b, c)
                    },
                    complete: function() {
                        b.xhr = null
                    },
                    error: function(a, c) {
                        b.options.async.error && b.options.async.error(b, a, c)
                    }
                }))
            },
            bindBodyEvents: function() {
                n || (this.options.dismissible && "click" === this.getTrigger() ? u ? p.off("touchstart.webui-popover").on("touchstart.webui-popover", d.proxy(this.bodyTouchStartHandler, this)) : (p.off("keyup.webui-popover").on("keyup.webui-popover", d.proxy(this.escapeHandler, this)), p.off("click.webui-popover").on("click.webui-popover", d.proxy(this.bodyClickHandler, this))) : "hover" === this.getTrigger() && p.off("touchend.webui-popover").on("touchend.webui-popover", d.proxy(this.bodyClickHandler, this)))
            },
            mouseenterHandler: function(a) {
                var b = this;
                a && this.options.selector && (b = this.delegate(a.currentTarget)), b._timeout && clearTimeout(b._timeout), b._enterTimeout = setTimeout(function() {
                    b.getTarget().is(":visible") || b.show()
                }, this.getDelayShow())
            },
            mouseleaveHandler: function() {
                var a = this;
                clearTimeout(a._enterTimeout), a._timeout = setTimeout(function() {
                    a.hide()
                }, this.getHideDelay())
            },
            escapeHandler: function(a) {
                27 === a.keyCode && this.hideAll()
            },
            bodyTouchStartHandler: function(a) {
                var b = this,
                    c = d(a.currentTarget);
                c.on("touchend", function(a) {
                    b.bodyClickHandler(a), c.off("touchend")
                }), c.on("touchmove", function() {
                    c.off("touchend")
                })
            },
            bodyClickHandler: function(a) {
                n = !0;
                for (var b = !0, c = 0; c < k.length; c++) {
                    var d = r(k[c]);
                    if (d && d._opened) {
                        var e = d.getTarget().offset(),
                            f = e.left,
                            g = e.top,
                            h = e.left + d.getTarget().width(),
                            i = e.top + d.getTarget().height(),
                            j = v(a),
                            l = j.x >= f && j.x <= h && j.y >= g && j.y <= i;
                        if (l) {
                            b = !1;
                            break
                        }
                    }
                }
                b && s()
            },
            initTargetEvents: function() {
                "hover" === this.getTrigger() && this.$target.off("mouseenter mouseleave").on("mouseenter", d.proxy(this.mouseenterHandler, this)).on("mouseleave", d.proxy(this.mouseleaveHandler, this)), this.$target.find(".close").off("click").on("click", d.proxy(this.hide, this, !0))
            },
            getPlacement: function(a) {
                var b, c = this.options.container,
                    d = c.innerWidth(),
                    e = c.innerHeight(),
                    f = c.scrollTop(),
                    g = c.scrollLeft(),
                    h = Math.max(0, a.left - g),
                    i = Math.max(0, a.top - f);
                b = "function" == typeof this.options.placement ? this.options.placement.call(this, this.getTarget()[0], this.$element[0]) : this.$element.data("placement") || this.options.placement;
                var j = "horizontal" === b,
                    k = "vertical" === b,
                    l = "auto" === b || j || k;
                return l ? b = d / 3 > h ? e / 3 > i ? j ? "right-bottom" : "bottom-right" : 2 * e / 3 > i ? k ? e / 2 >= i ? "bottom-right" : "top-right" : "right" : j ? "right-top" : "top-right" : 2 * d / 3 > h ? e / 3 > i ? j ? d / 2 >= h ? "right-bottom" : "left-bottom" : "bottom" : 2 * e / 3 > i ? j ? d / 2 >= h ? "right" : "left" : e / 2 >= i ? "bottom" : "top" : j ? d / 2 >= h ? "right-top" : "left-top" : "top" : e / 3 > i ? j ? "left-bottom" : "bottom-left" : 2 * e / 3 > i ? k ? e / 2 >= i ? "bottom-left" : "top-left" : "left" : j ? "left-top" : "top-left" : "auto-top" === b ? b = d / 3 > h ? "top-right" : 2 * d / 3 > h ? "top" : "top-left" : "auto-bottom" === b ? b = d / 3 > h ? "bottom-right" : 2 * d / 3 > h ? "bottom" : "bottom-left" : "auto-left" === b ? b = e / 3 > i ? "left-top" : 2 * e / 3 > i ? "left" : "left-bottom" : "auto-right" === b && (b = e / 3 > i ? "right-bottom" : 2 * e / 3 > i ? "right" : "right-top"), b
            },
            getElementPosition: function() {
                var a = this.$element[0].getBoundingClientRect(),
                    c = this.options.container,
                    e = c.css("position");
                if (c.is(b.body) || "static" === e) return d.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth || a.width,
                    height: this.$element[0].offsetHeight || a.height
                });
                if ("fixed" === e) {
                    var f = c[0].getBoundingClientRect();
                    return {
                        top: a.top - f.top + c.scrollTop(),
                        left: a.left - f.left + c.scrollLeft(),
                        width: a.width,
                        height: a.height
                    }
                }
                return "relative" === e ? {
                    top: this.$element.offset().top - c.offset().top,
                    left: this.$element.offset().left - c.offset().left,
                    width: this.$element[0].offsetWidth || a.width,
                    height: this.$element[0].offsetHeight || a.height
                } : void 0
            },
            getTargetPositin: function(a, c, d, e) {
                var f = a,
                    g = this.options.container,
                    h = this.$element.outerWidth(),
                    i = this.$element.outerHeight(),
                    j = b.documentElement.scrollTop + g.scrollTop(),
                    k = b.documentElement.scrollLeft + g.scrollLeft(),
                    l = {},
                    m = null,
                    n = this.options.arrow ? 20 : 0,
                    p = 10,
                    q = n + p > h ? n : 0,
                    r = n + p > i ? n : 0,
                    s = 0,
                    t = b.documentElement.clientHeight + j,
                    u = b.documentElement.clientWidth + k,
                    v = f.left + f.width / 2 - q > 0,
                    w = f.left + f.width / 2 + q < u,
                    x = f.top + f.height / 2 - r > 0,
                    y = f.top + f.height / 2 + r < t;
                switch (c) {
                    case "bottom":
                        l = {
                            top: f.top + f.height,
                            left: f.left + f.width / 2 - d / 2
                        };
                        break;
                    case "top":
                        l = {
                            top: f.top - e,
                            left: f.left + f.width / 2 - d / 2
                        };
                        break;
                    case "left":
                        l = {
                            top: f.top + f.height / 2 - e / 2,
                            left: f.left - d
                        };
                        break;
                    case "right":
                        l = {
                            top: f.top + f.height / 2 - e / 2,
                            left: f.left + f.width
                        };
                        break;
                    case "top-right":
                        l = {
                            top: f.top - e,
                            left: v ? f.left - q : p
                        }, m = {
                            left: v ? Math.min(h, d) / 2 + q : o
                        };
                        break;
                    case "top-left":
                        s = w ? q : -p, l = {
                            top: f.top - e,
                            left: f.left - d + f.width + s
                        }, m = {
                            left: w ? d - Math.min(h, d) / 2 - q : o
                        };
                        break;
                    case "bottom-right":
                        l = {
                            top: f.top + f.height,
                            left: v ? f.left - q : p
                        }, m = {
                            left: v ? Math.min(h, d) / 2 + q : o
                        };
                        break;
                    case "bottom-left":
                        s = w ? q : -p, l = {
                            top: f.top + f.height,
                            left: f.left - d + f.width + s
                        }, m = {
                            left: w ? d - Math.min(h, d) / 2 - q : o
                        };
                        break;
                    case "right-top":
                        s = y ? r : -p, l = {
                            top: f.top - e + f.height + s,
                            left: f.left + f.width
                        }, m = {
                            top: y ? e - Math.min(i, e) / 2 - r : o
                        };
                        break;
                    case "right-bottom":
                        l = {
                            top: x ? f.top - r : p,
                            left: f.left + f.width
                        }, m = {
                            top: x ? Math.min(i, e) / 2 + r : o
                        };
                        break;
                    case "left-top":
                        s = y ? r : -p, l = {
                            top: f.top - e + f.height + s,
                            left: f.left - d
                        }, m = {
                            top: y ? e - Math.min(i, e) / 2 - r : o
                        };
                        break;
                    case "left-bottom":
                        l = {
                            top: x ? f.top - r : p,
                            left: f.left - d
                        }, m = {
                            top: x ? Math.min(i, e) / 2 + r : o
                        }
                }
                return l.top += this.getOffsetTop(), l.left += this.getOffsetLeft(), {
                    position: l,
                    arrowOffset: m
                }
            }
        }, d.fn[f] = function(a, b) {
            var c = [],
                g = this.each(function() {
                    var g = d.data(this, "plugin_" + f);
                    g ? "destroy" === a ? g.destroy() : "string" == typeof a && c.push(g[a]()) : (a ? "string" == typeof a ? "destroy" !== a && (b || (g = new e(this, null), c.push(g[a]()))) : "object" == typeof a && (g = new e(this, a)) : g = new e(this, null), d.data(this, "plugin_" + f, g))
                });
            return c.length ? c : g
        };
        var w = function() {
            var a = function() {
                    s()
                },
                b = function(a, b) {
                    b = b || {}, d(a).webuiPopover(b)
                },
                e = function(a) {
                    var b = !0;
                    return d(a).each(function(a, e) {
                        b = b && d(e).data("plugin_" + f) !== c
                    }), b
                },
                g = function(a, b) {
                    b ? d(a).webuiPopover(b).webuiPopover("show") : d(a).webuiPopover("show")
                },
                h = function(a) {
                    d(a).webuiPopover("hide")
                },
                j = function(a) {
                    i = d.extend({}, i, a)
                },
                k = function(a, b) {
                    var c = d(a).data("plugin_" + f);
                    if (c) {
                        var e = c.getCache();
                        c.options.cache = !1, c.options.content = b, c._opened ? (c._opened = !1, c.show()) : c.isAsync() ? c.setContentASync(b) : c.setContent(b), c.options.cache = e
                    }
                },
                l = function(a, b) {
                    var c = d(a).data("plugin_" + f);
                    if (c) {
                        var e = c.getCache(),
                            g = c.options.type;
                        c.options.cache = !1, c.options.url = b, c._opened ? (c._opened = !1, c.show()) : (c.options.type = "async", c.setContentASync(c.content)), c.options.cache = e, c.options.type = g
                    }
                };
            return {
                show: g,
                hide: h,
                create: b,
                isCreated: e,
                hideAll: a,
                updateContent: k,
                updateContentAsync: l,
                setDefaultOptions: j
            }
        }();
        a.WebuiPopovers = w
    })
}(window, document);

(function() {
    var t, e, n, r, o, i, s, a, u, l, f, h, p, c, m, d, g, y, v, b, w, x, M, S, k, T, C, H, R, q, I, X, Y, A, j, z, F, G, O, V, Z, E, L, D, P, W, N, U, $, B, K, J, Q, _, te, ee, ne, re, oe = function(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    };
    I = function() {
        return "visible" === document.visibilityState || null != H.tests
    }, z = function() {
        var t;
        return t = [], "undefined" != typeof document && null !== document && document.addEventListener("visibilitychange", function() {
                var e, n, r, o;
                for (o = [], n = 0, r = t.length; r > n; n++) e = t[n], o.push(e(I()));
                return o
            }),
            function(e) {
                return t.push(e)
            }
    }(), S = function(t) {
        var e, n, r;
        n = {};
        for (e in t) r = t[e], n[e] = r;
        return n
    }, x = function(t) {
        var e;
        return e = {},
            function() {
                var n, r, o, i, s;
                for (r = "", i = 0, s = arguments.length; s > i; i++) n = arguments[i], r += n.toString() + ",";
                return o = e[r], o || (e[r] = o = t.apply(this, arguments)), o
            }
    }, j = function(t) {
        return function(e) {
            var n, r, o;
            return e instanceof Array || e instanceof NodeList || e instanceof HTMLCollection ? o = function() {
                var o, i, s;
                for (s = [], r = o = 0, i = e.length; i >= 0 ? i > o : o > i; r = i >= 0 ? ++o : --o) n = Array.prototype.slice.call(arguments, 1), n.splice(0, 0, e[r]), s.push(t.apply(this, n));
                return s
            }.apply(this, arguments) : t.apply(this, arguments)
        }
    }, y = function(t, e) {
        var n, r, o;
        o = [];
        for (n in e) r = e[n], o.push(null != t[n] ? t[n] : t[n] = r);
        return o
    }, v = function(t, e) {
        var n, r, o;
        if (null != t.style) return b(t, e);
        o = [];
        for (n in e) r = e[n], o.push(t[n] = r.format());
        return o
    }, b = function(t, e) {
        var n, r, o, i, s;
        e = F(e), i = [], n = X(t);
        for (r in e) s = e[r], ee.contains(r) ? i.push([r, s]) : (null != s.format && (s = s.format()), "number" == typeof s && (s = "" + s + re(r, s)), null != t.hasAttribute && t.hasAttribute(r) ? t.setAttribute(r, s) : null != t.style && (t.style[O(r)] = s), r in t && (t[r] = s));
        return i.length > 0 ? n ? (o = new l, o.applyProperties(i), t.setAttribute("transform", o.decompose().format())) : (s = i.map(function(t) {
            return ne(t[0], t[1])
        }).join(" "), t.style[O("transform")] = s) : void 0
    }, X = function(t) {
        var e, n;
        return "undefined" != typeof SVGElement && null !== SVGElement && "undefined" != typeof SVGSVGElement && null !== SVGSVGElement ? t instanceof SVGElement && !(t instanceof SVGSVGElement) : null != (e = null != (n = H.tests) && "function" == typeof n.isSVG ? n.isSVG(t) : void 0) ? e : !1
    }, E = function(t, e) {
        var n;
        return n = Math.pow(10, e), Math.round(t * n) / n
    }, f = function() {
        function t(t) {
            var e, n, r;
            for (this.obj = {}, n = 0, r = t.length; r > n; n++) e = t[n], this.obj[e] = 1
        }
        return t.prototype.contains = function(t) {
            return 1 === this.obj[t]
        }, t
    }(), te = function(t) {
        return t.replace(/([A-Z])/g, function(t) {
            return "-" + t.toLowerCase()
        })
    }, V = new f("marginTop,marginLeft,marginBottom,marginRight,paddingTop,paddingLeft,paddingBottom,paddingRight,top,left,bottom,right,translateX,translateY,translateZ,perspectiveX,perspectiveY,perspectiveZ,width,height,maxWidth,maxHeight,minWidth,minHeight,borderRadius".split(",")), C = new f("rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY,skewZ".split(",")), ee = new f("translate,translateX,translateY,translateZ,scale,scaleX,scaleY,scaleZ,rotate,rotateX,rotateY,rotateZ,rotateC,rotateCX,rotateCY,skew,skewX,skewY,skewZ,perspective".split(",")), K = new f("accent-height,ascent,azimuth,baseFrequency,baseline-shift,bias,cx,cy,d,diffuseConstant,divisor,dx,dy,elevation,filterRes,fx,fy,gradientTransform,height,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,letter-spacing,limitingConeAngle,markerHeight,markerWidth,numOctaves,order,overline-position,overline-thickness,pathLength,points,pointsAtX,pointsAtY,pointsAtZ,r,radius,rx,ry,seed,specularConstant,specularExponent,stdDeviation,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,surfaceScale,target,targetX,targetY,transform,underline-position,underline-thickness,viewBox,width,x,x1,x2,y,y1,y2,z".split(",")), re = function(t, e) {
        return "number" != typeof e ? "" : V.contains(t) ? "px" : C.contains(t) ? "deg" : ""
    }, ne = function(t, e) {
        var n, r;
        return n = ("" + e).match(/^([0-9.-]*)([^0-9]*)$/), null != n ? (e = n[1], r = n[2]) : e = parseFloat(e), e = E(parseFloat(e), 10), (null == r || "" === r) && (r = re(t, e)), "" + t + "(" + e + r + ")"
    }, F = function(t) {
        var e, n, r, o, i, s, a, u;
        r = {};
        for (o in t)
            if (i = t[o], ee.contains(o))
                if (n = o.match(/(translate|rotateC|rotate|skew|scale|perspective)(X|Y|Z|)/), n && n[2].length > 0) r[o] = i;
                else
                    for (u = ["X", "Y", "Z"], s = 0, a = u.length; a > s; s++) e = u[s], r[n[1] + e] = i;
        else r[o] = i;
        return r
    }, T = function(t) {
        var e;
        return e = "opacity" === t ? 1 : 0, "" + e + re(t, e)
    }, R = function(t, e) {
        var n, r, o, i, s, a, f, h, p, m, d;
        if (i = {}, n = X(t), null != t.style)
            for (s = window.getComputedStyle(t, null), f = 0, p = e.length; p > f; f++) r = e[f], ee.contains(r) ? null == i.transform && (o = n ? new l(null != (d = t.transform.baseVal.consolidate()) ? d.matrix : void 0) : u.fromTransform(s[O("transform")]), i.transform = o.decompose()) : (a = null != t.hasAttribute && t.hasAttribute(r) ? t.getAttribute(r) : r in t ? t[r] : s[r], null != a && "d" !== r || !K.contains(r) || (a = t.getAttribute(r)), ("" === a || null == a) && (a = T(r)), i[r] = k(a));
        else
            for (h = 0, m = e.length; m > h; h++) r = e[h], i[r] = k(t[r]);
        return c(t, i), i
    }, c = function(t, e) {
        var n, r;
        for (r in e) n = e[r], n instanceof i && null != t.style && r in t.style && (n = new a([n, re(r, 0)])), e[r] = n;
        return e
    }, k = function(t) {
        var e, n, o, u, l;
        for (o = [r, s, i, a], u = 0, l = o.length; l > u; u++)
            if (n = o[u], e = n.create(t), null != e) return e;
        return null
    }, a = function() {
        function t(t) {
            this.parts = t, this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
        }
        return t.prototype.interpolate = function(e, n) {
            var r, o, i, s, a, u;
            for (s = this.parts, r = e.parts, i = [], o = a = 0, u = Math.min(s.length, r.length); u >= 0 ? u > a : a > u; o = u >= 0 ? ++a : --a) i.push(null != s[o].interpolate ? s[o].interpolate(r[o], n) : s[o]);
            return new t(i)
        }, t.prototype.format = function() {
            var t;
            return t = this.parts.map(function(t) {
                return null != t.format ? t.format() : t
            }), t.join("")
        }, t.create = function(e) {
            var n, r, s, a, u, l, f, h, p, c, m;
            for (e = "" + e, s = [], f = [{
                    re: /(#[a-f\d]{3,6})/gi,
                    klass: o,
                    parse: function(t) {
                        return t
                    }
                }, {
                    re: /(rgba?\([0-9.]*, ?[0-9.]*, ?[0-9.]*(?:, ?[0-9.]*)?\))/gi,
                    klass: o,
                    parse: function(t) {
                        return t
                    }
                }, {
                    re: /([-+]?[\d.]+)/gi,
                    klass: i,
                    parse: parseFloat
                }], h = 0, c = f.length; c > h; h++)
                for (l = f[h], u = l.re; r = u.exec(e);) s.push({
                    index: r.index,
                    length: r[1].length,
                    interpolable: l.klass.create(l.parse(r[1]))
                });
            for (s = s.sort(function(t, e) {
                    return t.index > e.index ? 1 : -1
                }), a = [], n = 0, p = 0, m = s.length; m > p; p++) r = s[p], r.index < n || (r.index > n && a.push(e.substring(n, r.index)), a.push(r.interpolable), n = r.index + r.length);
            return n < e.length && a.push(e.substring(n)), new t(a)
        }, t
    }(), s = function() {
        function t(t) {
            this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this), this.obj = t
        }
        return t.prototype.interpolate = function(e, n) {
            var r, o, i, s, a;
            s = this.obj, r = e.obj, i = {};
            for (o in s) a = s[o], i[o] = null != a.interpolate ? a.interpolate(r[o], n) : a;
            return new t(i)
        }, t.prototype.format = function() {
            return this.obj
        }, t.create = function(e) {
            var n, r, o;
            if (e instanceof Object) {
                r = {};
                for (n in e) o = e[n], r[n] = k(o);
                return new t(r)
            }
            return null
        }, t
    }(), i = function() {
        function t(t) {
            this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this), this.value = parseFloat(t)
        }
        return t.prototype.interpolate = function(e, n) {
            var r, o;
            return o = this.value, r = e.value, new t((r - o) * n + o)
        }, t.prototype.format = function() {
            return E(this.value, 5)
        }, t.create = function(e) {
            return "number" == typeof e ? new t(e) : null
        }, t
    }(), r = function() {
        function t(t) {
            this.values = t, this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
        }
        return t.prototype.interpolate = function(e, n) {
            var r, o, i, s, a, u;
            for (s = this.values, r = e.values, i = [], o = a = 0, u = Math.min(s.length, r.length); u >= 0 ? u > a : a > u; o = u >= 0 ? ++a : --a) i.push(null != s[o].interpolate ? s[o].interpolate(r[o], n) : s[o]);
            return new t(i)
        }, t.prototype.format = function() {
            return this.values.map(function(t) {
                return null != t.format ? t.format() : t
            })
        }, t.createFromArray = function(e) {
            var n;
            return n = e.map(function(t) {
                return k(t) || t
            }), n = n.filter(function(t) {
                return null != t
            }), new t(n)
        }, t.create = function(e) {
            return e instanceof Array ? t.createFromArray(e) : null
        }, t
    }(), t = function() {
        function t(t, e) {
            this.rgb = null != t ? t : {}, this.format = e, this.toRgba = oe(this.toRgba, this), this.toRgb = oe(this.toRgb, this), this.toHex = oe(this.toHex, this)
        }
        return t.fromHex = function(e) {
            var n, r;
            return n = e.match(/^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i), null != n && (e = "#" + n[1] + n[1] + n[2] + n[2] + n[3] + n[3]), r = e.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i), null != r ? new t({
                r: parseInt(r[1], 16),
                g: parseInt(r[2], 16),
                b: parseInt(r[3], 16),
                a: 1
            }, "hex") : null
        }, t.fromRgb = function(e) {
            var n, r;
            return n = e.match(/^rgba?\(([0-9.]*), ?([0-9.]*), ?([0-9.]*)(?:, ?([0-9.]*))?\)$/), null != n ? new t({
                r: parseFloat(n[1]),
                g: parseFloat(n[2]),
                b: parseFloat(n[3]),
                a: parseFloat(null != (r = n[4]) ? r : 1)
            }, null != n[4] ? "rgba" : "rgb") : null
        }, t.componentToHex = function(t) {
            var e;
            return e = t.toString(16), 1 === e.length ? "0" + e : e
        }, t.prototype.toHex = function() {
            return "#" + t.componentToHex(this.rgb.r) + t.componentToHex(this.rgb.g) + t.componentToHex(this.rgb.b)
        }, t.prototype.toRgb = function() {
            return "rgb(" + this.rgb.r + ", " + this.rgb.g + ", " + this.rgb.b + ")"
        }, t.prototype.toRgba = function() {
            return "rgba(" + this.rgb.r + ", " + this.rgb.g + ", " + this.rgb.b + ", " + this.rgb.a + ")"
        }, t
    }(), o = function() {
        function e(t) {
            this.color = t, this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
        }
        return e.prototype.interpolate = function(n, r) {
            var o, i, s, a, u, l, f, h;
            for (a = this.color, o = n.color, s = {}, h = ["r", "g", "b"], l = 0, f = h.length; f > l; l++) i = h[l], u = Math.round((o.rgb[i] - a.rgb[i]) * r + a.rgb[i]), s[i] = Math.min(255, Math.max(0, u));
            return i = "a", u = E((o.rgb[i] - a.rgb[i]) * r + a.rgb[i], 5), s[i] = Math.min(1, Math.max(0, u)), new e(new t(s, o.format))
        }, e.prototype.format = function() {
            return "hex" === this.color.format ? this.color.toHex() : "rgb" === this.color.format ? this.color.toRgb() : "rgba" === this.color.format ? this.color.toRgba() : void 0
        }, e.create = function(n) {
            var r;
            if ("string" == typeof n) return r = t.fromHex(n) || t.fromRgb(n), null != r ? new e(r) : null
        }, e
    }(), n = function() {
        function t(t) {
            this.props = t, this.applyRotateCenter = oe(this.applyRotateCenter, this), this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
        }
        return t.prototype.interpolate = function(e, n) {
            var r, o, i, s, a, u, l, f, h, p, c, m;
            for (i = {}, p = ["translate", "scale", "rotate"], s = 0, f = p.length; f > s; s++)
                for (o = p[s], i[o] = [], r = a = 0, c = this.props[o].length; c >= 0 ? c > a : a > c; r = c >= 0 ? ++a : --a) i[o][r] = (e.props[o][r] - this.props[o][r]) * n + this.props[o][r];
            for (r = u = 1; 2 >= u; r = ++u) i.rotate[r] = e.props.rotate[r];
            for (m = ["skew"], l = 0, h = m.length; h > l; l++) o = m[l], i[o] = (e.props[o] - this.props[o]) * n + this.props[o];
            return new t(i)
        }, t.prototype.format = function() {
            return "translate(" + this.props.translate.join(",") + ") rotate(" + this.props.rotate.join(",") + ") skewX(" + this.props.skew + ") scale(" + this.props.scale.join(",") + ")"
        }, t.prototype.applyRotateCenter = function(t) {
            var e, n, r, o, i, s;
            for (n = w.createSVGMatrix(), n = n.translate(t[0], t[1]), n = n.rotate(this.props.rotate[0]), n = n.translate(-t[0], -t[1]), r = new l(n), o = r.decompose().props.translate, s = [], e = i = 0; 1 >= i; e = ++i) s.push(this.props.translate[e] -= o[e]);
            return s
        }, t
    }(), w = "undefined" != typeof document && null !== document ? document.createElementNS("http://www.w3.org/2000/svg", "svg") : void 0, l = function() {
        function t(t) {
            this.m = t, this.applyProperties = oe(this.applyProperties, this), this.decompose = oe(this.decompose, this), this.m || (this.m = w.createSVGMatrix())
        }
        return t.prototype.decompose = function() {
            var t, e, r, o, i;
            return o = new h([this.m.a, this.m.b]), i = new h([this.m.c, this.m.d]), t = o.length(), r = o.dot(i), o = o.normalize(), e = i.combine(o, 1, -r).length(), new n({
                translate: [this.m.e, this.m.f],
                rotate: [180 * Math.atan2(this.m.b, this.m.a) / Math.PI, this.rotateCX, this.rotateCY],
                scale: [t, e],
                skew: r / e * 180 / Math.PI
            })
        }, t.prototype.applyProperties = function(t) {
            var e, n, r, o, i, s, a, u;
            for (e = {}, i = 0, s = t.length; s > i; i++) r = t[i], e[r[0]] = r[1];
            for (n in e) o = e[n], "translateX" === n ? this.m = this.m.translate(o, 0) : "translateY" === n ? this.m = this.m.translate(0, o) : "scaleX" === n ? this.m = this.m.scaleNonUniform(o, 1) : "scaleY" === n ? this.m = this.m.scaleNonUniform(1, o) : "rotateZ" === n ? this.m = this.m.rotate(o) : "skewX" === n ? this.m = this.m.skewX(o) : "skewY" === n && (this.m = this.m.skewY(o));
            return this.rotateCX = null != (a = e.rotateCX) ? a : 0, this.rotateCY = null != (u = e.rotateCY) ? u : 0
        }, t
    }(), h = function() {
        function t(t) {
            this.els = t, this.combine = oe(this.combine, this), this.normalize = oe(this.normalize, this), this.length = oe(this.length, this), this.cross = oe(this.cross, this), this.dot = oe(this.dot, this), this.e = oe(this.e, this)
        }
        return t.prototype.e = function(t) {
            return 1 > t || t > this.els.length ? null : this.els[t - 1]
        }, t.prototype.dot = function(t) {
            var e, n, r;
            if (e = t.els || t, r = 0, n = this.els.length, n !== e.length) return null;
            for (n += 1; --n;) r += this.els[n - 1] * e[n - 1];
            return r
        }, t.prototype.cross = function(e) {
            var n, r;
            return r = e.els || e, 3 !== this.els.length || 3 !== r.length ? null : (n = this.els, new t([n[1] * r[2] - n[2] * r[1], n[2] * r[0] - n[0] * r[2], n[0] * r[1] - n[1] * r[0]]))
        }, t.prototype.length = function() {
            var t, e, n, r, o;
            for (t = 0, o = this.els, n = 0, r = o.length; r > n; n++) e = o[n], t += Math.pow(e, 2);
            return Math.sqrt(t)
        }, t.prototype.normalize = function() {
            var e, n, r, o, i;
            r = this.length(), o = [], i = this.els;
            for (n in i) e = i[n], o[n] = e / r;
            return new t(o)
        }, t.prototype.combine = function(e, n, r) {
            var o, i, s, a;
            for (i = [], o = s = 0, a = this.els.length; a >= 0 ? a > s : s > a; o = a >= 0 ? ++s : --s) i[o] = n * this.els[o] + r * e.els[o];
            return new t(i)
        }, t
    }(), e = function() {
        function t() {
            this.toMatrix = oe(this.toMatrix, this), this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
        }
        return t.prototype.interpolate = function(e, n, r) {
            var o, i, s, a, u, l, f, h, p, c, m, d, g, y, v, b, w, x;
            for (null == r && (r = null), s = this, i = new t, w = ["translate", "scale", "skew", "perspective"], d = 0, b = w.length; b > d; d++)
                for (f = w[d], i[f] = [], a = g = 0, x = s[f].length - 1; x >= 0 ? x >= g : g >= x; a = x >= 0 ? ++g : --g) i[f][a] = null == r || r.indexOf(f) > -1 || r.indexOf("" + f + ["x", "y", "z"][a]) > -1 ? (e[f][a] - s[f][a]) * n + s[f][a] : s[f][a];
            if (null == r || -1 !== r.indexOf("rotate")) {
                if (h = s.quaternion, p = e.quaternion, o = h[0] * p[0] + h[1] * p[1] + h[2] * p[2] + h[3] * p[3], 0 > o) {
                    for (a = y = 0; 3 >= y; a = ++y) h[a] = -h[a];
                    o = -o
                }
                for (o + 1 > .05 ? 1 - o >= .05 ? (m = Math.acos(o), l = 1 / Math.sin(m), c = Math.sin(m * (1 - n)) * l, u = Math.sin(m * n) * l) : (c = 1 - n, u = n) : (p[0] = -h[1], p[1] = h[0], p[2] = -h[3], p[3] = h[2], c = Math.sin(piDouble * (.5 - n)), u = Math.sin(piDouble * n)), i.quaternion = [], a = v = 0; 3 >= v; a = ++v) i.quaternion[a] = h[a] * c + p[a] * u
            } else i.quaternion = s.quaternion;
            return i
        }, t.prototype.format = function() {
            return this.toMatrix().toString()
        }, t.prototype.toMatrix = function() {
            var t, e, n, r, o, i, s, a, l, f, h, p, c, m, d, g;
            for (t = this, o = u.I(4), e = c = 0; 3 >= c; e = ++c) o.els[e][3] = t.perspective[e];
            for (i = t.quaternion, f = i[0], h = i[1], p = i[2], l = i[3], s = t.skew, r = [
                    [1, 0],
                    [2, 0],
                    [2, 1]
                ], e = m = 2; m >= 0; e = --m) s[e] && (a = u.I(4), a.els[r[e][0]][r[e][1]] = s[e], o = o.multiply(a));
            for (o = o.multiply(new u([
                    [1 - 2 * (h * h + p * p), 2 * (f * h - p * l), 2 * (f * p + h * l), 0],
                    [2 * (f * h + p * l), 1 - 2 * (f * f + p * p), 2 * (h * p - f * l), 0],
                    [2 * (f * p - h * l), 2 * (h * p + f * l), 1 - 2 * (f * f + h * h), 0],
                    [0, 0, 0, 1]
                ])), e = d = 0; 2 >= d; e = ++d) {
                for (n = g = 0; 2 >= g; n = ++g) o.els[e][n] *= t.scale[e];
                o.els[3][e] = t.translate[e]
            }
            return o
        }, t
    }(), u = function() {
        function t(t) {
            this.els = t, this.toString = oe(this.toString, this), this.decompose = oe(this.decompose, this), this.inverse = oe(this.inverse, this), this.augment = oe(this.augment, this), this.toRightTriangular = oe(this.toRightTriangular, this), this.transpose = oe(this.transpose, this), this.multiply = oe(this.multiply, this), this.dup = oe(this.dup, this), this.e = oe(this.e, this)
        }
        return t.prototype.e = function(t, e) {
            return 1 > t || t > this.els.length || 1 > e || e > this.els[0].length ? null : this.els[t - 1][e - 1]
        }, t.prototype.dup = function() {
            return new t(this.els)
        }, t.prototype.multiply = function(e) {
            var n, r, o, i, s, a, u, l, f, h, p, c, m;
            for (c = e.modulus ? !0 : !1, n = e.els || e, "undefined" == typeof n[0][0] && (n = new t(n).els), h = this.els.length, u = h, l = n[0].length, o = this.els[0].length, i = [], h += 1; --h;)
                for (s = u - h, i[s] = [], p = l, p += 1; --p;) {
                    for (a = l - p, m = 0, f = o, f += 1; --f;) r = o - f, m += this.els[s][r] * n[r][a];
                    i[s][a] = m
                }
            return n = new t(i), c ? n.col(1) : n
        }, t.prototype.transpose = function() {
            var e, n, r, o, i, s, a;
            for (a = this.els.length, e = this.els[0].length, n = [], i = e, i += 1; --i;)
                for (r = e - i, n[r] = [], s = a, s += 1; --s;) o = a - s, n[r][o] = this.els[o][r];
            return new t(n)
        }, t.prototype.toRightTriangular = function() {
            var t, e, n, r, o, i, s, a, u, l, f, h, p, c;
            for (t = this.dup(), a = this.els.length, o = a, i = this.els[0].length; --a;) {
                if (n = o - a, 0 === t.els[n][n])
                    for (r = f = p = n + 1; o >= p ? o > f : f > o; r = o >= p ? ++f : --f)
                        if (0 !== t.els[r][n]) {
                            for (e = [], u = i, u += 1; --u;) l = i - u, e.push(t.els[n][l] + t.els[r][l]);
                            t.els[n] = e;
                            break
                        }
                if (0 !== t.els[n][n])
                    for (r = h = c = n + 1; o >= c ? o > h : h > o; r = o >= c ? ++h : --h) {
                        for (s = t.els[r][n] / t.els[n][n], e = [], u = i, u += 1; --u;) l = i - u, e.push(n >= l ? 0 : t.els[r][l] - t.els[n][l] * s);
                        t.els[r] = e
                    }
            }
            return t
        }, t.prototype.augment = function(e) {
            var n, r, o, i, s, a, u, l, f;
            if (n = e.els || e, "undefined" == typeof n[0][0] && (n = new t(n).els), r = this.dup(), o = r.els[0].length, l = r.els.length, a = l, u = n[0].length, l !== n.length) return null;
            for (l += 1; --l;)
                for (i = a - l, f = u, f += 1; --f;) s = u - f, r.els[i][o + s] = n[i][s];
            return r
        }, t.prototype.inverse = function() {
            var e, n, r, o, i, s, a, u, l, f, h, p, c;
            for (f = this.els.length, a = f, e = this.augment(t.I(f)).toRightTriangular(), u = e.els[0].length, i = [], f += 1; --f;) {
                for (o = f - 1, r = [], h = u, i[o] = [], n = e.els[o][o], h += 1; --h;) p = u - h, l = e.els[o][p] / n, r.push(l), p >= a && i[o].push(l);
                for (e.els[o] = r, s = c = 0; o >= 0 ? o > c : c > o; s = o >= 0 ? ++c : --c) {
                    for (r = [], h = u, h += 1; --h;) p = u - h, r.push(e.els[s][p] - e.els[o][p] * e.els[s][o]);
                    e.els[s] = r
                }
            }
            return new t(i)
        }, t.I = function(e) {
            var n, r, o, i, s;
            for (n = [], i = e, e += 1; --e;)
                for (r = i - e, n[r] = [], s = i, s += 1; --s;) o = i - s, n[r][o] = r === o ? 1 : 0;
            return new t(n)
        }, t.prototype.decompose = function() {
            var t, n, r, o, i, s, a, u, l, f, p, c, m, d, g, y, v, b, w, x, M, S, k, T, C, H, R, q, I, X, Y, A, j, z, F, G, O, V;
            for (s = this, x = [], v = [], b = [], f = [], u = [], t = [], n = I = 0; 3 >= I; n = ++I)
                for (t[n] = [], o = X = 0; 3 >= X; o = ++X) t[n][o] = s.els[n][o];
            if (0 === t[3][3]) return !1;
            for (n = Y = 0; 3 >= Y; n = ++Y)
                for (o = A = 0; 3 >= A; o = ++A) t[n][o] /= t[3][3];
            for (l = s.dup(), n = j = 0; 2 >= j; n = ++j) l.els[n][3] = 0;
            if (l.els[3][3] = 1, 0 !== t[0][3] || 0 !== t[1][3] || 0 !== t[2][3]) {
                for (c = new h(t.slice(0, 4)[3]), r = l.inverse(), M = r.transpose(), u = M.multiply(c).els, n = z = 0; 2 >= z; n = ++z) t[n][3] = 0;
                t[3][3] = 1
            } else u = [0, 0, 0, 1];
            for (n = F = 0; 2 >= F; n = ++F) x[n] = t[3][n], t[3][n] = 0;
            for (d = [], n = G = 0; 2 >= G; n = ++G) d[n] = new h(t[n].slice(0, 3));
            if (v[0] = d[0].length(), d[0] = d[0].normalize(), b[0] = d[0].dot(d[1]), d[1] = d[1].combine(d[0], 1, -b[0]), v[1] = d[1].length(), d[1] = d[1].normalize(), b[0] /= v[1], b[1] = d[0].dot(d[2]), d[2] = d[2].combine(d[0], 1, -b[1]), b[2] = d[1].dot(d[2]), d[2] = d[2].combine(d[1], 1, -b[2]), v[2] = d[2].length(), d[2] = d[2].normalize(), b[1] /= v[2], b[2] /= v[2], a = d[1].cross(d[2]), d[0].dot(a) < 0)
                for (n = O = 0; 2 >= O; n = ++O)
                    for (v[n] *= -1, o = V = 0; 2 >= V; o = ++V) d[n].els[o] *= -1;
            g = function(t, e) {
                return d[t].els[e]
            }, m = [], m[1] = Math.asin(-g(0, 2)), 0 !== Math.cos(m[1]) ? (m[0] = Math.atan2(g(1, 2), g(2, 2)), m[2] = Math.atan2(g(0, 1), g(0, 0))) : (m[0] = Math.atan2(-g(2, 0), g(1, 1)), m[1] = 0), w = g(0, 0) + g(1, 1) + g(2, 2) + 1, w > 1e-4 ? (y = .5 / Math.sqrt(w), C = .25 / y, H = (g(2, 1) - g(1, 2)) * y, R = (g(0, 2) - g(2, 0)) * y, q = (g(1, 0) - g(0, 1)) * y) : g(0, 0) > g(1, 1) && g(0, 0) > g(2, 2) ? (y = 2 * Math.sqrt(1 + g(0, 0) - g(1, 1) - g(2, 2)), H = .25 * y, R = (g(0, 1) + g(1, 0)) / y, q = (g(0, 2) + g(2, 0)) / y, C = (g(2, 1) - g(1, 2)) / y) : g(1, 1) > g(2, 2) ? (y = 2 * Math.sqrt(1 + g(1, 1) - g(0, 0) - g(2, 2)), H = (g(0, 1) + g(1, 0)) / y, R = .25 * y, q = (g(1, 2) + g(2, 1)) / y, C = (g(0, 2) - g(2, 0)) / y) : (y = 2 * Math.sqrt(1 + g(2, 2) - g(0, 0) - g(1, 1)), H = (g(0, 2) + g(2, 0)) / y, R = (g(1, 2) + g(2, 1)) / y, q = .25 * y, C = (g(1, 0) - g(0, 1)) / y), f = [H, R, q, C], p = new e, p.translate = x, p.scale = v, p.skew = b, p.quaternion = f, p.perspective = u, p.rotate = m;
            for (k in p) {
                S = p[k];
                for (i in S) T = S[i], isNaN(T) && (S[i] = 0)
            }
            return p
        }, t.prototype.toString = function() {
            var t, e, n, r, o;
            for (n = "matrix3d(", t = r = 0; 3 >= r; t = ++r)
                for (e = o = 0; 3 >= o; e = ++o) n += E(this.els[t][e], 10), (3 !== t || 3 !== e) && (n += ",");
            return n += ")"
        }, t.matrixForTransform = x(function(t) {
            var e, n, r, o, i, s;
            return e = document.createElement("div"), e.style.position = "absolute", e.style.visibility = "hidden", e.style[O("transform")] = t, document.body.appendChild(e), r = window.getComputedStyle(e, null), n = null != (o = null != (i = r.transform) ? i : r[O("transform")]) ? o : null != (s = H.tests) ? s.matrixForTransform(t) : void 0, document.body.removeChild(e), n
        }), t.fromTransform = function(e) {
            var n, r, o, i, s, a;
            for (i = null != e ? e.match(/matrix3?d?\(([-0-9,e \.]*)\)/) : void 0, i ? (n = i[1].split(","), n = n.map(parseFloat), r = 6 === n.length ? [n[0], n[1], 0, 0, n[2], n[3], 0, 0, 0, 0, 1, 0, n[4], n[5], 0, 1] : n) : r = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], s = [], o = a = 0; 3 >= a; o = ++a) s.push(r.slice(4 * o, 4 * o + 4));
            return new t(s)
        }, t
    }(), G = x(function(t) {
        var e, n, r, o, i, s, a, u, l, f;
        if (void 0 !== document.body.style[t]) return "";
        for (o = t.split("-"), i = "", s = 0, u = o.length; u > s; s++) r = o[s], i += r.substring(0, 1).toUpperCase() + r.substring(1);
        for (f = ["Webkit", "Moz", "ms"], a = 0, l = f.length; l > a; a++)
            if (n = f[a], e = n + i, void 0 !== document.body.style[e]) return n;
        return ""
    }), O = x(function(t) {
        var e;
        return e = G(t), "Moz" === e ? "" + e + (t.substring(0, 1).toUpperCase() + t.substring(1)) : "" !== e ? "-" + e.toLowerCase() + "-" + te(t) : te(t)
    }), Z = "undefined" != typeof window && null !== window ? window.requestAnimationFrame : void 0, d = [], g = [], N = !1, U = 1, "undefined" != typeof window && null !== window && window.addEventListener("keyup", function(t) {
        return 68 === t.keyCode && t.shiftKey && t.ctrlKey ? H.toggleSlow() : void 0
    }), null == Z && (Y = 0, Z = function(t) {
        var e, n, r;
        return e = Date.now(), r = Math.max(0, 16 - (e - Y)), n = window.setTimeout(function() {
            return t(e + r)
        }, r), Y = e + r, n
    }), D = !1, L = !1, B = function() {
        return D ? void 0 : (D = !0, Z(P))
    }, P = function(t) {
        var e, n, r, o;
        if (L) return void Z(P);
        for (n = [], r = 0, o = d.length; o > r; r++) e = d[r], m(t, e) || n.push(e);
        return d = d.filter(function(t) {
            return -1 === n.indexOf(t)
        }), 0 === d.length ? D = !1 : Z(P)
    }, m = function(t, e) {
        var n, r, o, i, s, a, u, l;
        if (null == e.tStart && (e.tStart = t), i = (t - e.tStart) / e.options.duration, s = e.curve(i), r = {}, i >= 1) r = e.curve.returnsToSelf ? e.properties.start : e.properties.end;
        else {
            l = e.properties.start;
            for (n in l) o = l[n], r[n] = q(o, e.properties.end[n], s)
        }
        return v(e.el, r), "function" == typeof(a = e.options).change && a.change(e.el, Math.min(1, i)), i >= 1 && "function" == typeof(u = e.options).complete && u.complete(e.el), 1 > i
    }, q = function(t, e, n) {
        return null != t && null != t.interpolate ? t.interpolate(e, n) : null
    }, $ = function(t, e, n, r) {
        var o, i, s, a, f, h, p;
        if (null != r && (g = g.filter(function(t) {
                return t.id !== r
            })), H.stop(t, {
                timeout: !1
            }), !n.animated) return H.css(t, e), void("function" == typeof n.complete && n.complete(this));
        f = R(t, Object.keys(e)), e = F(e), o = {}, h = [];
        for (s in e) p = e[s], null != t.style && ee.contains(s) ? h.push([s, p]) : o[s] = k(p);
        return h.length > 0 && (i = X(t), i ? (a = new l, a.applyProperties(h)) : (p = h.map(function(t) {
            return ne(t[0], t[1])
        }).join(" "), a = u.fromTransform(u.matrixForTransform(p))), o.transform = a.decompose(), i && f.transform.applyRotateCenter([o.transform.props.rotate[1], o.transform.props.rotate[2]])), c(t, o), d.push({
            el: t,
            properties: {
                start: f,
                end: o
            },
            options: n,
            curve: n.type.call(n.type, n)
        }), B()
    }, _ = [], Q = 0, W = function(t) {
        return I() ? Z(function() {
            return -1 !== _.indexOf(t) ? t.realTimeoutId = setTimeout(function() {
                return t.fn(), M(t.id)
            }, t.delay) : void 0
        }) : void 0
    }, p = function(t, e) {
        var n;
        return Q += 1, n = {
            id: Q,
            tStart: Date.now(),
            fn: t,
            delay: e,
            originalDelay: e
        }, W(n), _.push(n), Q
    }, M = function(t) {
        return _ = _.filter(function(e) {
            return e.id === t && e.realTimeoutId && clearTimeout(e.realTimeoutId), e.id !== t
        })
    }, A = function(t, e) {
        var n;
        return null != t ? (n = t - e.tStart, e.originalDelay - n) : e.originalDelay
    }, "undefined" != typeof window && null !== window && window.addEventListener("unload", function() {}), J = null, z(function(t) {
        var e, n, r, o, i, s, a, u, l, f;
        if (L = !t, t) {
            if (D)
                for (n = Date.now() - J, i = 0, u = d.length; u > i; i++) e = d[i], null != e.tStart && (e.tStart += n);
            for (s = 0, l = _.length; l > s; s++) r = _[s], r.delay = A(J, r), W(r);
            return J = null
        }
        for (J = Date.now(), f = [], o = 0, a = _.length; a > o; o++) r = _[o], f.push(clearTimeout(r.realTimeoutId));
        return f
    }), H = {}, H.linear = function() {
        return function(t) {
            return t
        }
    }, H.spring = function(t) {
        var e, n, r, o, i, s;
        return null == t && (t = {}), y(t, H.spring.defaults), o = Math.max(1, t.frequency / 20), i = Math.pow(20, t.friction / 100), s = t.anticipationSize / 1e3, r = Math.max(0, s), e = function(e) {
                var n, r, o, i, a;
                return n = .8, i = s / (1 - s), a = 0, o = (i - n * a) / (i - a), r = (n - o) / i, r * e * t.anticipationStrength / 100 + o
            }, n = function(t) {
                return Math.pow(i / 10, -t) * (1 - t)
            },
            function(t) {
                var r, i, a, u, l, f, h, p;
                return f = t / (1 - s) - s / (1 - s), s > t ? (p = s / (1 - s) - s / (1 - s), h = 0 / (1 - s) - s / (1 - s), l = Math.acos(1 / e(p)), a = (Math.acos(1 / e(h)) - l) / (o * -s), r = e) : (r = n, l = 0, a = 1), i = r(f), u = o * (t - s) * a + l, 1 - i * Math.cos(u)
            }
    }, H.bounce = function(t) {
        var e, n, r, o;
        return null == t && (t = {}), y(t, H.bounce.defaults), r = Math.max(1, t.frequency / 20), o = Math.pow(20, t.friction / 100), e = function(t) {
            return Math.pow(o / 10, -t) * (1 - t)
        }, n = function(t) {
            var n, o, i, s;
            return s = -1.57, o = 1, n = e(t), i = r * t * o + s, n * Math.cos(i)
        }, n.returnsToSelf = !0, n
    }, H.gravity = function(t) {
        var e, n, r, o, i, s, a;
        return null == t && (t = {}), y(t, H.gravity.defaults), n = Math.min(t.bounciness / 1250, .8), o = t.elasticity / 1e3, a = 100, r = [], e = function() {
                var r, o;
                for (r = Math.sqrt(2 / a), o = {
                        a: -r,
                        b: r,
                        H: 1
                    }, t.returnsToSelf && (o.a = 0, o.b = 2 * o.b); o.H > .001;) e = o.b - o.a, o = {
                    a: o.b,
                    b: o.b + e * n,
                    H: o.H * n * n
                };
                return o.b
            }(), s = function(n, r, o, i) {
                var s, a;
                return e = r - n, a = 2 / e * i - 1 - 2 * n / e, s = a * a * o - o + 1, t.returnsToSelf && (s = 1 - s), s
            },
            function() {
                var i, s, u, l;
                for (s = Math.sqrt(2 / (a * e * e)), u = {
                        a: -s,
                        b: s,
                        H: 1
                    }, t.returnsToSelf && (u.a = 0, u.b = 2 * u.b), r.push(u), i = e, l = []; u.b < 1 && u.H > .001;) i = u.b - u.a, u = {
                    a: u.b,
                    b: u.b + i * n,
                    H: u.H * o
                }, l.push(r.push(u));
                return l
            }(), i = function(e) {
                var n, o, i;
                for (o = 0, n = r[o]; !(e >= n.a && e <= n.b) && (o += 1, n = r[o]););
                return i = n ? s(n.a, n.b, n.H, e) : t.returnsToSelf ? 0 : 1
            }, i.returnsToSelf = t.returnsToSelf, i
    }, H.forceWithGravity = function(t) {
        return null == t && (t = {}), y(t, H.forceWithGravity.defaults), t.returnsToSelf = !0, H.gravity(t)
    }, H.bezier = function() {
        var t, e, n;
        return e = function(t, e, n, r, o) {
                return Math.pow(1 - t, 3) * e + 3 * Math.pow(1 - t, 2) * t * n + 3 * (1 - t) * Math.pow(t, 2) * r + Math.pow(t, 3) * o
            }, t = function(t, n, r, o, i) {
                return {
                    x: e(t, n.x, r.x, o.x, i.x),
                    y: e(t, n.y, r.y, o.y, i.y)
                }
            }, n = function(t, e, n) {
                var r, o, i, s, a, u, l, f, h, p;
                for (r = null, h = 0, p = e.length; p > h && (o = e[h], t >= o(0).x && t <= o(1).x && (r = o), null === r); h++);
                if (!r) return n ? 0 : 1;
                for (f = 1e-4, s = 0, u = 1, a = (u + s) / 2, l = r(a).x, i = 0; Math.abs(t - l) > f && 100 > i;) t > l ? s = a : u = a, a = (u + s) / 2, l = r(a).x, i += 1;
                return r(a).y
            },
            function(e) {
                var r, o, i;
                return null == e && (e = {}), i = e.points, r = function() {
                    var e, n, o;
                    r = [], o = function(e, n) {
                        var o;
                        return o = function(r) {
                            return t(r, e, e.cp[e.cp.length - 1], n.cp[0], n)
                        }, r.push(o)
                    };
                    for (e in i) {
                        if (n = parseInt(e), n >= i.length - 1) break;
                        o(i[n], i[n + 1])
                    }
                    return r
                }(), o = function(t) {
                    return 0 === t ? 0 : 1 === t ? 1 : n(t, r, this.returnsToSelf)
                }, o.returnsToSelf = 0 === i[i.length - 1].y, o
            }
    }(), H.easeInOut = function(t) {
        var e, n;
        return null == t && (t = {}), e = null != (n = t.friction) ? n : H.easeInOut.defaults.friction, H.bezier({
            points: [{
                x: 0,
                y: 0,
                cp: [{
                    x: .92 - e / 1e3,
                    y: 0
                }]
            }, {
                x: 1,
                y: 1,
                cp: [{
                    x: .08 + e / 1e3,
                    y: 1
                }]
            }]
        })
    }, H.easeIn = function(t) {
        var e, n;
        return null == t && (t = {}), e = null != (n = t.friction) ? n : H.easeIn.defaults.friction, H.bezier({
            points: [{
                x: 0,
                y: 0,
                cp: [{
                    x: .92 - e / 1e3,
                    y: 0
                }]
            }, {
                x: 1,
                y: 1,
                cp: [{
                    x: 1,
                    y: 1
                }]
            }]
        })
    }, H.easeOut = function(t) {
        var e, n;
        return null == t && (t = {}), e = null != (n = t.friction) ? n : H.easeOut.defaults.friction, H.bezier({
            points: [{
                x: 0,
                y: 0,
                cp: [{
                    x: 0,
                    y: 0
                }]
            }, {
                x: 1,
                y: 1,
                cp: [{
                    x: .08 + e / 1e3,
                    y: 1
                }]
            }]
        })
    }, H.spring.defaults = {
        frequency: 300,
        friction: 200,
        anticipationSize: 0,
        anticipationStrength: 0
    }, H.bounce.defaults = {
        frequency: 300,
        friction: 200
    }, H.forceWithGravity.defaults = H.gravity.defaults = {
        bounciness: 400,
        elasticity: 200
    }, H.easeInOut.defaults = H.easeIn.defaults = H.easeOut.defaults = {
        friction: 500
    }, H.css = j(function(t, e) {
        return b(t, e, !0)
    }), H.animate = j(function(t, e, n) {
        var r;
        return null == n && (n = {}), n = S(n), y(n, {
            type: H.easeInOut,
            duration: 1e3,
            delay: 0,
            animated: !0
        }), n.duration = Math.max(0, n.duration * U), n.delay = Math.max(0, n.delay), 0 === n.delay ? $(t, e, n) : (r = H.setTimeout(function() {
            return $(t, e, n, r)
        }, n.delay), g.push({
            id: r,
            el: t
        }))
    }), H.stop = j(function(t, e) {
        return null == e && (e = {}), null == e.timeout && (e.timeout = !0), e.timeout && (g = g.filter(function(n) {
            return n.el !== t || null != e.filter && !e.filter(n) ? !0 : (H.clearTimeout(n.id), !1)
        })), d = d.filter(function(e) {
            return e.el !== t
        })
    }), H.setTimeout = function(t, e) {
        return p(t, e * U)
    }, H.clearTimeout = function(t) {
        return M(t)
    }, H.toggleSlow = function() {
        return N = !N, U = N ? 3 : 1, "undefined" != typeof console && null !== console && "function" == typeof console.log ? console.log("dynamics.js: slow animations " + (N ? "enabled" : "disabled")) : void 0
    }, "object" == typeof module && "object" == typeof module.exports ? module.exports = H : "function" == typeof define ? define("dynamics", function() {
        return H
    }) : window.dynamics = H
}).call(this);



(function($) {

    var ElemInitLeft;
    var ElemInitTop;
    var CreatorName = "Manuel Maurer";
    var CreatorLocation = "AT";

    $.fn.RandPos = function(Optionen) {
        var FlowContainer = this;

        //DEFAULT-SETTINGS
        var Settings = $.extend({}, {
            ContainerHeight: 350,
            OverFlowAllowed: true,
            DefaultTargetsWidth: 55,
            DefaultTargetsHeight: 55,
            TargetsSizeRandomizePlus: 5,
            TargetsSizeRandomizeMinus: 15,
            InitiallyHideTargets: true,
            UseAnimation: true,
            AnimationDuration: 2500,
            AnimationFriction: 150,
            AnimationFrequency: 115,
            AnimationType: dynamics.spring,
            AnimationTimeBetween: 100,
            MinSpreadX: 20,
            MinSpreadY: 20,
            MaxTries: 1500,
            Scrollable: true,
            LeftOverflowAllowed: true,
            MinPaddingTop: 10,
            MinPaddingBottom: 10,
            CorrectionRuns: 10,
            SlightMovementAnimation: true,
            AutoscrollSpeed: 5,
            ScrollWait: 0,
        }, Optionen);

        //Alle Elemente verstecken
        if (Settings.InitiallyHideTargets) {
            // $(FlowContainer).children().css({ height: 0, width: 0, opacity: 0, position: "absolute" })
            $(FlowContainer).children().css({
                position: "absolute"
            })
        }

        //Initialisierung: Dimensionen etc
        if (CreatorName.toLowerCase().replace(/ /g, '') + CreatorLocation.toLowerCase() == "manuelmaurerat") {
            $(FlowContainer).css({
                "height": Settings.ContainerHeight,
                "position": "relative"
            }); //Container-Height
        }

        //Elemente mit zufälligen Dimensionen versehen
        if (CreatorName.toLowerCase().replace(/ /g, '') + CreatorLocation.toLowerCase() == "manuelmaurerat") {
            if (Settings.TargetsSizeRandomizeMinus != 0 || Settings.TargetsSizeRandomizePlus != 0) {
                var Counter1 = -1;
                var ElemNow;
                var NewWidth;
                var NewHeight;
                $(FlowContainer).children().each(function(elem) {
                    Counter1++;
                    ElemNow = $(FlowContainer).children().eq(Counter1);
                    NewWidth = randomIntFromInterval(Settings.DefaultTargetsWidth - Settings.TargetsSizeRandomizeMinus, Settings.DefaultTargetsWidth + Settings.TargetsSizeRandomizePlus);
                    NewHeight = (NewWidth * Settings.DefaultTargetsHeight / Settings.DefaultTargetsWidth)
                    $(ElemNow).data("animheight", NewHeight).data("animwidth", NewWidth)
                })
            } else {
                var Counter1 = -1;
                $(FlowContainer).children().each(function(elem) {
                    $(FlowContainer).children().eq(Counter1).data("animheight", Settings.DefaultTargetsHeight).data("animwidth", Settings.DefaultTargetsWidth)
                })
            }
        }

        //Erstes Element exakt mittig positionieren
        StartPositioning(FlowContainer, Settings);

        //Animiert einblenden
        if (CreatorName.toLowerCase().replace(/ /g, '') + CreatorLocation.toLowerCase() == "manuelmaurerat") {
            if (Settings.UseAnimation) {
                var Counter = -1;
                var ElemNow;
                $(FlowContainer).children().each(function(elem) {
                    Counter++;
                    ElemNow = $(FlowContainer).children().eq(Counter);
                    RandPosAnimate(ElemNow[0], Settings, Settings.AnimationTimeBetween * Counter)
                })

            } else {
                //TODO: Auch ohne Animation anzeigen
                var Counter = -1;
                var ElemNow;
                $(FlowContainer).children().each(function(elem) {
                    Counter++;
                    ElemNow = $(FlowContainer).children().eq(Counter);
                    ShowNoAnimate(ElemNow[0], Settings.AnimationTimeBetween * Counter, Settings)
                })
            }
        }

        //Scrolling ermöglichen
        if (Settings.Scrollable) {
            var MaxRight = 0;
            var ElemCounter = 0;
            $(FlowContainer).children().each(function() {
                if (parseInt($(FlowContainer).children().eq(ElemCounter).css("left")) > MaxRight) {
                    MaxRight = parseInt($(FlowContainer).children().eq(ElemCounter).css("left")) + parseInt($(FlowContainer).children().eq(ElemCounter).css("width"));
                }
                ElemCounter++;
            })

            $(FlowContainer).parent().css({
                height: Settings.ContainerHeight,
                "overflow": "hidden"
            });
            $(FlowContainer).css({
                "height": Settings.ContainerHeight + 17,
                "overflow": "scroll",
                "padding-right": "17px",
                "margin-right": "-17px"
            });


            if (Settings.AutoscrollSpeed > 0) {
                var CalcTime;
                if (Settings.UseAnimation) {
                    CalcTime = $(FlowContainer).children().length * Settings.AnimationTimeBetween + Settings.ScrollWait - (FlowContainer).children().length / 7;
                } else {
                    CalcTime = $(FlowContainer).children().length * Settings.ScrollWait - (FlowContainer).children().length / 7;
                }

                var ScrollSpeed = (MaxRight / Settings.AutoscrollSpeed) * 1000


                setTimeout(function() {
                    $(FlowContainer).animate({
                        scrollLeft: MaxRight
                    }, ScrollSpeed, "linear");
                    $(FlowContainer).on({
                        mouseenter: function() {
                            (FlowContainer).stop();
                        },
                        mouseleave: function() {
                            $(FlowContainer).animate({
                                scrollLeft: MaxRight
                            }, ScrollSpeed, "linear");
                        },
                        click: function() {
                            (FlowContainer).stop();
                        },
                        mouseover: function() {
                            (FlowContainer).stop();
                        },
                        hover: function() {
                            (FlowContainer).stop();
                        },
                        mousemove: function() {
                            (FlowContainer).stop();
                        }
                    });
                }, CalcTime)

            }
        }

        //PopOver
        $(FlowContainer).find('[data-popovertitle]').each(function(index, element) {
            var Title = $(this).data("popovertitle");
            var Content = $(this).data("popovercontent");
            $(this).webuiPopover({
                title: Title,
                content: Content,
                animation: "pop",
                width: 200,
                placement: "bottom-right"
            })
            $(this).hover(function() {
                $(this).webuiPopover('show');
            }, function() {
                $(this).webuiPopover('hide');
            })
        })

    };


    function MakePositive(Num) {
        if (Num < 0) {
            return Num * -1;
        } else {
            return Num;
        }
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function StartPositioning(FlowContainer, Settings) {
        var PositionsArray = [];
        PositionsArray.length = 0;
        PositionsArray = [];
        var ContainerCenterX = $(FlowContainer).width() / 2;
        var ContainerCenterY = $(FlowContainer).height() / 2;

        //Positionierung des 1. Elements (Mittig)
        var ElemNow = $(FlowContainer).children().eq(0);
        var ElemWidth = $(ElemNow).data("animwidth")
        var ElemHeight = $(ElemNow).data("animheight")
        var ElemNowTop = ContainerCenterY - (ElemHeight / 2);
        ElemInitTop = ElemNowTop;
        var ElemNowLeft = ContainerCenterX - (ElemWidth / 2);
        ElemInitLeft = ElemNowLeft;
        $(ElemNow).css({
            top: ElemNowTop,
            left: ElemNowLeft
        })
        PositionsArray[0] = [ElemNowTop, ElemNowLeft, ElemHeight, ElemWidth];

        //Nun sämtliche andere durchgehen und positionieren
        var Counter2 = 0;
        $(FlowContainer).children(':not(:last)').each(function(elem) {
            Counter2++;
            ElemNow = $(FlowContainer).children().eq(Counter2);
            ElemWidth = $(ElemNow).data("animwidth")
            ElemHeight = $(ElemNow).data("animheight")
            var Tries = 0;
            var TryNowX = ElemInitLeft;
            var TryNowY = ElemInitTop;
            do {
                if (TryNowY < (10 + Settings.MinPaddingTop)) {
                    TryNowY += randomIntFromInterval(0, 10);
                } else if (TryNowY > (FlowContainer.height() - ElemHeight - 10 - Settings.MinPaddingBottom)) {
                    TryNowY += randomIntFromInterval(-10, 0);
                } else {
                    TryNowY += randomIntFromInterval(-10, 10);
                }


                if (TryNowX < 10) {
                    TryNowX += randomIntFromInterval(0, 10);
                } else if (TryNowX > (FlowContainer.width() - ElemWidth - 10)) {
                    TryNowX += randomIntFromInterval(-10, 0);
                } else {
                    TryNowX += randomIntFromInterval(-10, 10);
                }


                Tries++;
                if (Tries > 200) {
                    if (Settings.LeftOverflowAllowed) {
                        if (TryNowX < (Tries / 5.5)) {
                            TryNowX += 150;
                        } else {
                            TryNowX += randomIntFromInterval((Tries / -4), (Tries / 4));
                        }
                    } else {
                        if (TryNowX < (Tries / 3.5)) {
                            TryNowX += 150;
                        } else {
                            TryNowX += randomIntFromInterval((Tries / -4), (Tries / 4));
                        }
                    }
                }
                if (Tries == Settings.MaxTries) {
                    $(ElemNow).css({
                        "height": "0!important",
                        "width": "0!important"
                    }).addClass("rpp-hide");
                }

            }
            while (!NoCollision(TryNowX, TryNowY, ElemWidth, ElemHeight, PositionsArray, Settings.MinSpreadX, Settings.MinSpreadY) && Tries <= Settings.MaxTries)
            $(ElemNow).css({
                top: TryNowY,
                left: TryNowX
            });
            PositionsArray[Counter2] = [TryNowY, TryNowX, ElemHeight, ElemWidth];
            TryNowX = ElemInitLeft;
            TryNowY = ElemInitTop;
        })

        PositionsArray.length = 0;
        PositionsArray = [];
        PositionsArray = undefined;
        PositionsArray = null;
    }

    function NoCollision(X, Y, W, H, PositionsArray, SpreadX, SpreadY) {

        var NoErrors = true;
        //Jedes Element im PositionsArray durchgehen und Prüfen
        $.each(PositionsArray, function(PositionArray) {
            var ArrY = PositionsArray[PositionArray][0];
            var ArrX = PositionsArray[PositionArray][1];
            var ArrW = PositionsArray[PositionArray][3];
            var ArrH = PositionsArray[PositionArray][2];
            if ((X < (ArrX - W - SpreadX) || X > (ArrX + ArrW + SpreadX)) || (Y < (ArrY - H - SpreadY) || Y > (ArrY + ArrH + SpreadY))) {
                //SHOULD BE OKAY HERE
            } else {
                NoErrors = false;
            }
        })
        return NoErrors;
    }

    function GetBigger(val1, val2) {
        if (val1 > val2) {
            return val1;
        } else {
            return val2;
        }
    }

    function ShowNoAnimate(el, CountTime, Settings) {
        if (CreatorName.toLowerCase().replace(/ /g, '') + CreatorLocation.toLowerCase() == "manuelmaurerat") {
            setTimeout(function() {
                $(el).show();
                if (Settings.SlightMovementAnimation) {
                    $(el).addClass("rpp-anim").css({
                        width: $(el).data("animwidth"),
                        height: $(el).data("animheight"),
                    });
                }
            }, CountTime)
        }
    }

    function RandPosAnimate(el, Settings, CountTime) {
        if (CreatorName.toLowerCase().replace(/ /g, '') + CreatorLocation.toLowerCase() == "manuelmaurerat") {
            setTimeout(function() {
                dynamics.animate(el, {
                    width: $(el).data("animwidth"),
                    height: $(el).data("animheight"),
                    opacity: 1
                }, {
                    type: Settings.AnimationType,
                    frequency: Settings.AnimationFrequency,
                    friction: Settings.AnimationFriction,
                    duration: Settings.AnimationDuration
                })
                if (Settings.SlightMovementAnimation) {
                    $(el).addClass("rpp-anim");
                }
            }, CountTime)
        }
    }
}(jQuery));                       
                    