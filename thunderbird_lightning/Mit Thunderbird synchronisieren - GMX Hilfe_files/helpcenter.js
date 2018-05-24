(function() {
    var touch = false,
    clickHandler = function(ev) {
        ev = ev || window.event;
        ev.target || (ev.target = ev.srcElement);
        if (!ev || !ev.target || !ev.target.getAttribute) { return; }

        if (ev.type === 'keypress' && (ev.which || ev.keyCode) != 13) { return; }
        if (ev.type === 'click' && (ev.which || ev.keyCode) > 1) { return; }
        if (ev.type === 'touchstart') {
            touch = true;
            return;
        }
        if (ev.type === 'touchmove') {
            touch = false;
            return;
        }
        if (ev.type === 'touchend') {
            if (!touch) { return; }
            touch = false;
        }

        var items = ['hide', 'toggle', 'show', 'set', 'unset'],
            node,
            selector,
            any;

        for (var i = 0, item; item = items[i]; i++) {
            selector = false;
            node = ev.target;

            while (node && node.getAttribute && !selector) {
                (selector = node.getAttribute('data-' + item + '-nodes')) || (node = node.parentNode);
            }

            if (!selector || selector === '#empty') { continue; }

            var parquery = node.getAttribute('data-' + item + '-parent') || node.getAttribute('data-nodes-parent'),
                parent = document;
            if (parquery) {
                var parents = document.querySelectorAll(parquery),
                    parent = node;
                findparent: while (parent) {
                    for (var p = parents.length; p >= 0; p--) {
                        if (parents[p] === parent) { break findparent; }
                    }
                    parent = parent.parentNode;
                }
            }

            selector.replace(/([^,\{]+)(?:\{(.*?)\}|)/g, function(full, query, name) {
                query = parent.querySelectorAll(query);
                name = name || 'hidden';
                any = any || 'href' in node;
                var re = new RegExp('(^|\\s)' + name + '\\b', 'g');

                for (var q = 0, l = query.length; q < l; q++) {
                    var cls = query[q].className.replace(re, '');
                    query[q].className = cls + ((item === 'hide' || item === 'set' || (item === 'toggle' && query[q].className === cls)) ? ' ' + name : '');
                    if ((query[q].hasAttribute('data-load-always') || query[q].offsetHeight) && query[q].getAttribute('data-load-url')) {
                        if (typeof document.createEvent === 'function') {
                            var load = document.createEvent('CustomEvent');
                            load.initCustomEvent('lazyload', true, true, null);
                            query[q].dispatchEvent(load);
                        } else {
                            typeof document.onlazyload === 'function' && document.onlazyload({ target: query[q] });
                        }
                    }
                    // fix reflow/redraw problem in "noflex" clients by applied DOM force
                    if (/(^|\s)no-flex\b/.test(document.body.className) && !/input|select|textarea/i.test(ev.target)) {
                        var text = document.createTextNode('');
                        if (!/input|select|textarea/i.test(node)) {
                            node.parentNode.replaceChild(text, node);
                            text.parentNode.replaceChild(node, text);
                        }
                        if (!/input|select|textarea/i.test(query[q])) {
                            query[q].parentNode.replaceChild(text, query[q]);
                            text.parentNode.replaceChild(query[q], text);
                        }
                    }
                }
            });
        }

        if (any && (ev.type === 'touchend' || ev.type === 'click')) {
            ev.preventDefault && ev.preventDefault();
        }
    }
    if (!document.addEventListener) {
        document.attachEvent('onclick', clickHandler);
        document.attachEvent('onkeypress', clickHandler);
    } else {
        document.addEventListener('keypress', clickHandler);
        if (/ip[ao]d|iphone/i.test(navigator.userAgent)) {
            document.addEventListener('touchstart', clickHandler);
            document.addEventListener('touchmove', clickHandler);
            document.addEventListener('touchend', clickHandler);
        } else {
            document.addEventListener('click', clickHandler);
        }
    }
})();
(function(meta) {
    "use strict";
    if (/android 5\.0\.2/i.test(navigator.userAgent)) {
        var resizeHandler = function() {
            window.setTimeout(function() {
                document.body.style.display = 'none';
                document.body.offsetWidth;
                document.body.style.display = '';
            }, 350);
        };
        window.addEventListener('orientationchange', resizeHandler);
    }
    // test requirement and neccessary prerequisite
    if (!/\bno-flex\b/.test(document.body.className) || !('matchMedia' in window)) { return; }
    var regex = /width=[^,]+(,?\s*)/,
        breakpoints = "980, 660, 340".split(', '),
    setViewport = function(width) {
        width || (width = 'device-width');
        var content = meta.getAttribute('content');
        if (!regex.test(content)) {
            content = 'width=' + width + ', ' + content;
        } else {
            regex.lastIndex = 0;
            content = content.replace(regex, 'width=' + width + RegExp.$1);
        }
        meta.setAttribute('content', content);
    },
    // true = device-width is set, false/undefined = other width, 1 = other width, don't resize!
    viewportDefault = /width=device-width/.test(meta.getAttribute('content')),
    viewportTimeout,
    viewportHandler = function() {
        if (!viewportDefault) {
            setViewport();
            viewportDefault = true;
            window.clearTimeout(viewportTimeout);
            viewportTimeout = window.setTimeout(viewportHandler, 150);
        } else if (viewportDefault === 1) {
            return;
        }
        for (var width = document.body.offsetWidth, b = 0, l = breakpoints.length; b < l; b++) {
            // Fix for Samsung Galaxy Tab 3 with Android 4.4.2  - (/4\.4\.2.*?SM-T310\D/.test(navigator.userAgent) ? 60 : 0) - leads to zoomed effect
            if (width > breakpoints[b]) {
                setViewport(breakpoints[b]);
                // block resize for 150ms
                viewportDefault = 1;
                window.clearTimeout(viewportTimeout);
                viewportTimeout = window.setTimeout(function() { viewportDefault = false; }, 150);
                break;
            }
        }
    },
    resizeTimeout,
    resizeHandler = function() {
        if (viewportDefault) { return; }
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(viewportHandler, 150);
    },
    touchHandler = function(ev) {
        if (/input|textarea|select/i.test(ev.target.nodeName)) {
            viewportDefault = 1;
            viewportTimeout = window.setTimeout(function() { viewportDefault = false; }, 1500);
        }
    };
    viewportHandler();
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', resizeHandler);
    document.addEventListener('touchstart', touchHandler);
})(document.getElementsByName('viewport')[0]);

(function(undef){
    var nativeSupport = 'open' in document.createElement('details'),
    akkordeonToggle = function(akkordeon, status) {
        var autoToggle = (status === undef),
            initialStatus = !!(akkordeon.getAttribute('open') || /(^|\s)open\b/.test(akkordeon.className));

        if (autoToggle) {
            status = !initialStatus;
        }

        // android 4.1-3 touts native support that doesn't work correctly
        if (!/details/i.test(akkordeon.nodeName) || !nativeSupport || /android 4\.[1-3]/i.test(navigator.userAgent)) {
            akkordeon[status ? 'setAttribute' : 'removeAttribute']('open', true);
            akkordeon.className = akkordeon.className.replace(/(^|\s)open\b/g, '') + (status ? ' open' : '');
        } else {
            akkordeon.className = akkordeon.className.replace(/(^|\s)open\b/g, '');
        }

        if (status) {
            if (akkordeon.hasAttribute('data-load-url')) {
                var ev = document.createEvent('CustomEvent');
                ev.initCustomEvent('lazyload', true, true, null);
                akkordeon.dispatch(ev);
            }
        }

        if (!nativeSupport && status != initialStatus) {
            var ev = document.createEvent('CustomEvent');
            ev.initCustomEvent('toggle', true, true, {});
            akkordeon.dispatchEvent(ev);
        }
    }, akkordeonHandler = function(evt) {
        evt = evt || window.evt;
        var akkordeon = evt.target || evt.srcElement,
            summary;
        if (!akkordeon) { return; }

        while (akkordeon && (!akkordeon.className || !/\bakkordeon\b/.test(akkordeon.className))) {
            summary = akkordeon;
            akkordeon = akkordeon.parentNode;
        }
        if (!akkordeon) { return; }
        if (summary !== akkordeon.querySelector('*:first-child')) { return; }

        if (evt.type === 'keyup') {
            if (evt.keyCode === 13 || evt.keyCode === 32) { akkordeonToggle(akkordeon); }
            else if (evt.keyCode === 38) { akkordeonToggle(akkordeon, false); }
            else if (evt.keyCode === 40) { akkordeonToggle(akkordeon, true); }
        } else if ((evt.which || evt.keycode) <= 1) {
            akkordeonToggle(akkordeon);
        }
        return false;
    };

    if (!document.addEventListener) {
        document.attachEvent('onclick', akkordeonHandler);
        document.attachEvent('onkeyup', akkordeonHandler);
    } else {
        document.addEventListener('click', akkordeonHandler);
        document.addEventListener('keyup', akkordeonHandler);
    }
})();

Paging = {
    defaults: {
        start: 1,
        pos: 1,
        end: Infinity,
        l: 7,
        m: 5,
        s: 3,
        data: {}
    },
    getPages: function(pos, start, end, items) {
        var lim = Math.floor(items / 2),
            first = pos - lim,
            last = pos + lim - (1 - items & 1),
            fshift = last >= end ? end - last : 0,
            lshift = first < start ? start - first : 0;
        return {
            begin: Math.max(first + fshift, start),
            end: Math.min(last + lshift, end)
        };
    },
    getData: function(opts) {
        opts = opts || {};
        for (var key in this.defaults) {
            if (this.defaults.hasOwnProperty(key) && !opts.hasOwnProperty(key)) {
                opts[key] = this.defaults[key];
            }
        }
        var pages = {},
            sizes = ['l', 'm', 's'],
            data = { items: [], start: opts.pos === opts.start, end: opts.pos === opts.end, js: true };
        for (var size, s = sizes.length; s--;) {
            size = sizes[s];
            pages[size] = this.getPages(opts.pos, opts.start, opts.end, opts[size]);
        }
        for (var page = pages.l.begin; page <= pages.l.end; page++) {
            var pg = (opts.showStart && page === pages.l.begin)
                   ? opts.start
                   : (opts.showEnd && page === pages.l.end && opts.end < Infinity)
                   ? opts.end
                   : page,
                item = { page: pg },
                sizes = (page < pages.s.begin || page > pages.s.end ? 's-0' : '') +
                        (page < pages.m.begin || page > pages.m.end ? ' m-0' : '');
            opts.data.page = pg;
            var url = window.Mustache ? Mustache.render(opts.url, opts.data) : opts.url + pg;
            sizes && (item.sizes = sizes);
            url && (item.url = url);
            (pg === opts.pos) && (item.active = true);
            data.items.push(item);
        }
        return data;
    }
};

/* Default-Funktion von aria-disabled-Buttons verhindern (Fehler in Android) */
(function(){
	var buttonHandler = function(ev) {
		ev = ev || window.event;
		var button = ev.target || ev.srcElement;
		if (!button) { return; }
		if (ev.type === 'keyup' && ev.keyCode !== 13) { return; }
		if (button.getAttribute && button.getAttribute('aria-disabled')) {
			if (typeof ev.preventDefault === 'function') {
				ev.preventDefault();
			} else {
				return false;
			}
		}
	}
    if (!document.addEventListener) {
        document.attachEvent('onclick', buttonHandler);
        document.attachEvent('onkeyup', buttonHandler);
    } else {
        document.addEventListener('click', buttonHandler);
        document.addEventListener('keyup', buttonHandler);
    }
})();
(function(undef){
    var tabHandler = function(ev) {
        ev = ev || window.ev;
        var tab = ev.target || ev.srcElement;
        while (tab && !/\btab\b/.test(tab.className)) {
            tab = tab.parentNode;
        }
        if (!tab || !tab.getAttribute || !/\btab\b/.test(tab.className) || tab.getAttribute('role') !== 'button') { return; }
        if (/\bactive\b/.test(tab.className)) {
            typeof ev.preventDefault === 'function' && ev.preventDefault();
            return false;
        }
        if (ev.type === 'keyup') {
            if (ev.keyCode === 37) {
                tab = tab.parentNode.previousSibling;
                do {
                    tab = tab.previousSibling;
                } while (tab && (!tab.nodeName || !/li/i.test(tab.nodeName)));
                tab = tab && tab.getElementsByTagName('a')[0];
            } else if (ev.keyCode === 39) {
                tab = tab.parentNode.nextSibling;
                do {
                    tab = tab.nextSibling;
                } while (tab && (!tab.nodeName || !/li/i.test(tab.nodeName)));
                tab = tab && tab.getElementsByTagName('a')[0];
            } else if (ev.keyCode !== 13 && ev.keyCode !== 32) {
                return;
            }
            if (!tab) { return; }
        } else {
            if ((ev.keyCode || ev.which || 0) > 1) { return; }
            tab.blur();
        }
        var tabs = tab.parentNode.parentNode.querySelectorAll('.tab');
        for (var i = 0, l = tabs.length; i < l; i++) {
            tabs[i].className = tabs[i].className.replace(/(^|\s)active\b/g, '');
            var deactivate = tabs[i].getAttribute('data-tab-activate');
            if (!deactivate) { continue; }
            deactivate = document.querySelectorAll(deactivate) || [];
            for (var d = 0, m = deactivate.length; d < m; d++) {
                deactivate[d].className = deactivate[d].className.replace(/(^|\s)active\b/g, '');
                if (deactivate[d].dispatchEvent) {
                    var evd = document.createEvent('CustomEvent');
                    evd.initCustomEvent('tab.deactivated', true, true, {});
                    deactivate[d].dispatchEvent(evd);
                }
            }
        }
        tab.className = tab.className.replace(/(^|\s)active\b/g, '') + ' active';
        var activate = tab.getAttribute('data-tab-activate');
        activate = activate ? document.querySelectorAll(activate) : [];
        for (var a = 0, l = activate.length; a < l; a++) {
            activate[a].className += ' active';
            var url = activate[a].getAttribute && activate[a].getAttribute('data-load-url');
            if (url) {
                if (typeof document.onlazyload === 'function') {
                    document.onlazyload({ target: activate[a], type: 'lazyload' });
                } else if (typeof activate[a].dispatchEvent === 'function') {
                    var evl = document.createEvent('CustomEvent');
                    evl.initCustomEvent('lazyload', true, true, {});
                    activate[a].dispatchEvent(evl);
                }
            }
            var eva = document.createEvent('CustomEvent');
            eva.initCustomEvent('tab.activated', true, true, {});
            activate[a].dispatchEvent(eva);
        }
        typeof ev.preventDefault === 'function' && ev.preventDefault();
        if (!/touch/.test(document.body.className)) { return false; }
        // fix for mobile devices
        window.setTimeout(function() {
            ev.target.blur();
            var list = tab.parentNode.parentNode,
                fix = list.cloneNode(true);
            list.parentNode.replaceChild(fix, list);
        }, 65);
        // /fix
        return false;
    }
    if (!document.addEventListener) {
        document.attachEvent('onclick', tabHandler);
        document.attachEvent('onkeyup', tabHandler);
    } else {
        document.addEventListener('click', tabHandler);
        document.addEventListener('keyup', tabHandler);
    }
})();


(function(){
    var popupOptions = 'left top height width menubar toolbar location status dependent dialog minimizable resizable scrollbars',
    linkHandler = function(ev) {
        ev = ev || window.event;
        if (ev.type == 'keypress' && ev.keyCode !== 13) { return; }     
        var node = ev.target || ev.srcElement,
            data, opts = {};        
        if (!node) { return; }
        while (node && (!node.getAttribute || !(data = node.getAttribute('data-popup')))) {
            node = node.parentNode;
        }
        if (!data) { return; }
        data.replace(/([^=,]+)=?([^,]*),\s*/g, function(_, key, value) { 
            opts[key] = /^\d+$/.test(value) ? +value : value || true;
        });
        if (opts.center) {
            opts.top = (((window.innerHeight || document.documentElement.clientHeight || screen.height) - opts.height) >> 1) + (window.screenTop || screen.top);
            opts.left = (((window.innerWidth || document.documentElement.clientWidth || screen.width) - opts.width) >> 1) + (window.screenLeft || screen.left);
        }
        if (!window.open(opts.href || node.href, opts.target || 'popup'+0|Math.random()*1E6, popupOptions.replace(/(\w+) ?/g, function(_, key) {
            if (opts[key]) { return key + '=' + opts[key] + ','; }
            return '';
        }).replace(/,$/, ''))) { return; }
        typeof ev.preventDefault === 'function' && ev.preventDefault();
        return false;
    };
    if (!document.addEventListener) {
        document.attachEvent('onclick', linkHandler);
        window.attachEvent('onkeypress', linkHandler);
    } else {
        document.addEventListener('click', linkHandler);
        window.addEventListener('keypress', linkHandler);
    }
})();
(function() {
    var timer = (function timer() {
        var now = new Date();
        window.setTimeout(timer, 1000 - (now % 1000));
        var nodes = document.querySelectorAll('[data-countdown-time]');
        for (var n = 0, l = nodes.length; n < l; n++) {
            var time = nodes[n].getAttribute('data-countdown-time');
            time = new Date(/^\d+$/.test(time) ? +time : time);
            var timeDiff = (time - now) / 1000 | 0;
            nodes[n].innerHTML = '<span class="days">' + (timeDiff / 86400 | 0) + // 60sec * 60min * 24hrs
                '<\/span><span class="hours">' + ((timeDiff / 3600 | 0) % 24) + // 60sec * 60min % 24hrs
                '<\/span><span class="minutes">' + ((timeDiff / 60 | 0) % 60) + // 60sec % 60min
                '<\/span><span class="seconds">' + (timeDiff % 60) + '<\/span>';
        }
    })();
})();


(function() {
    if (!document.addEventListener) { return; }
    var runEvent = function(name, target, opts) {
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent(name, true, true, opts);
        return target.dispatchEvent(ev);
    },
    markSuggest = function(suggest, query) {
        if (!query) { return suggest; }
        var queryparts = [];
        (query || '').replace(/\S+/g, function(part) { part && queryparts.push(part); });
        var queryre = new RegExp('(' + queryparts.join('|') + ')', 'g');
        return suggest.replace(queryre, '<em>$1<\/em>');
    },
    fillSuggest = function(list, query, data) {
        if (!data) {
            list.innerHTML = '';
            return;
        }
        var template = /datalist/i.test(list.nodeName)
            ? '<option value="{value}"/>'
            : '<li data-suggest-value="{value}">{html}</li>',
            context = list.getAttribute('data-suggest-context') || '',
            endpoint = list.getAttribute('data-suggest-endpoint') || '',
            html = [],
            subline = list;
        while (subline && !/\bsuggest-subline\b/.test(subline.className || '')) {
            subline = subline.nextSibling;
        }
        context.replace(/[^\.]+/g, function(point) { data = data[point] || data; });
        for (var i = 0, l = data.length; i < l; i++) {
            var value = data[i];
            endpoint.replace(/[^\.]+/g, function(end) { value = value[end] || value || ''; });
            html.push(template.replace(/\{value\}/g, value).replace(/\{html\}/g, markSuggest(value, query || '').replace(/\"/g, '&quot;')));
        }
        list.innerHTML = html.join('\n');
        subline && list.appendChild(subline.cloneNode(true));
    },
    suggestTimeout,
    getSuggest = function(list, input) {
        if (typeof list.getAttribute !== 'function') { return; }
        var url = (list.getAttribute('data-suggest-url') || '').replace(/\{query\}/g, encodeURIComponent(input.value)),
            method = list.getAttribute('data-suggest-method') || 'jsonp',
            debounce = list.getAttribute('data-suggest-debounce') || 150,
            pattern = list.getAttribute('data-suggest-pattern') || '..';
        if (!url) { return; }
        if (/^controller:\/\/(.*)$/i.test(url)) {
            return runEvent(RegExp.$1, input, { list: list, input: input });
        }
        if (pattern && !(new RegExp(pattern)).test(input.value)) { return; }
        window.clearTimeout(suggestTimeout);
        suggestTimeout = window.setTimeout(function() {
            if (method === 'jsonp') {
                var script = document.createElement('script'),
                    callname = list.getAttribute('data-suggest-callback') || 'sg' + (1E8 * Math.random() | 0).toString(32);
                    script.src = url.replace(/\?$|\{callback\}/, callname);
                window[callname] = function(callname, list, script) { return function(data) {
                    if (runEvent('suggest.fill', list, { list: list, input: input, data: data })) {
                        fillSuggest(list, input.value, data);
                    }
                    script.parentNode && script.parentNode.removeChild(script);
                    window.setTimeout(function() { delete window[callname]; }, 0);
                }}(callname, list, script);
                document.body.appendChild(script);
            } else {
                var xhr = window.XDomainRequest ? new XDomainRequest() : new XMLHttpRequest(),
                    post = /post/i.test(method);
                xhr.open(post ? 'post' : 'get', url, true);
                xhr.onreadystatechange = function(xhr, list, input, method) { return function() {
                    if (xhr.readyState !== 4) { return; }
                    if (xhr.status != 200) {
                        if (runEvent('suggest.error', input, { list: list, input: input })) {
                            fillSuggest(list);
                        }
                    } else {
                        try {
                            var data = JSON.parse(xhr.responseText);
                        } catch (e) {
                            return runEvent('suggest.error', input, { list: list, input: input }), fillSuggest(list);
                        }
                        if (runEvent('suggest.fill', list, { list: list, input: input, data: data })) {
                            fillSuggest(list, input.value, data);
                        }
                    }
                }}(xhr, list, input, method);
                xhr.send();
            }
        }, debounce);
    },
    activateItem = function(item, input) {
        input.value = item.getAttribute('data-suggest-value') || item.value;
        input.form.submit();
    },
    fieldHandler = function(ev) {
        var target = ev.target || ev.srcElement,
            key = ev.which || ev.keyCode || ev.key,
            reset = target;
        if (!ev || !target || !target.getAttribute) { return; }
        while (reset && reset.type !== 'reset') {
            reset = reset.parentNode;
        }
        if (reset) {
            if (ev.type === 'keyup' && key !== 13 && key !== 32) { return; }
            // find out if there's a suggest in this form and reset its content
            var input = reset.parentNode.querySelector('input[list]'),
                list = document.getElementById(input.getAttribute('list'));
            if (!list) { return; }
            // fix for IE's lazy ass form validation
            input.value = null;
            window.setTimeout(function() { input.click && input.click(); }, 50);
            if (input && list && runEvent('suggest.reset', input, { list: list, input: input })) {
                list.innerHTML = '';
            }
        } else if (ev.type === 'click' && key <= 1) {
            var list = target,
                item = target;
            while (list && (!list.className || !/\bsuggest\b/.test(list.className))) {
                list = list.parentNode;
            }
            while (item && !/option|li/i.test(item.nodeName)) {
                item = item.parentNode;
            }
            if (list && item) {
                // click on suggest item
                var input = document.querySelector('input[list="' + list.id + '"]');
                if (input && runEvent('suggest.activate', item, { list: list, input: input, origin: target })) {
                    activateItem(item, input);
                }
            }
        } else if (ev.type === 'keyup' && target.form) {
            var list = target.hasAttribute('list') && document.getElementById(target.getAttribute('list')),
                active = list && list.querySelector && list.querySelector('.active') || target,
                current = 0;
            if (list) {
                if (key === 38 || key === 40) { // 38 - up, 40 - down
                    var pos,
                        items = [target];
                    for (var i = 0, l = list.childNodes.length; i < l; i++) {
                        list.childNodes[i].nodeType === 1 && items.push(list.childNodes[i]);
                        if (list.childNodes[i] === active) {
                            var current = items.length - 1;
                        }
                    }
                    // find current position
                    current = items[(current + items.length - 39 + key) % items.length];
                    if (runEvent('suggest.select', current, { list: list, input: target, active: active, current: current })) {
                        active.className = active.className.replace(/(^|\s)active\b/g, '');
                        if (current === target) {
                            target.value = target.getAttribute('data-original-value');
                        } else {
                            current.className += ' active';
                            target.value = current.value || current.getAttribute('data-suggest-value');
                        }
                    }
                } else if (key === 27) { // esc: remove active
                    active = list.querySelector('.active');
                    active && (active.className = active.className.replace(/(^|\s)active\b/g, ''));
                    target.value = target.originalValue || target.value;
                    target.blur();
                } else if (/\S+/.test(target.value)) {
                    if (runEvent('suggest.get', target, { list: list, input: target })) {
                        getSuggest(list, target);
                    }
                    target.setAttribute('data-original-value', target.value);
                } else {
                    if (runEvent('suggest.reset', target, { list: list, input: target })) {
                        list && (list.innerHTML = '');
                    }
                }
                var reset = target;
                while (reset && reset.type !== 'reset') {
                    reset = reset.nextSibling;
                }
                // fix for IE's stupid CSS cinderella sleep on :valid
                if (reset) {
                    window.setTimeout(function() {
                        var x = document.createTextNode('');
                        reset.parentNode.replaceChild(x, reset);
                        x.parentNode.replaceChild(reset, x);
                    }, 17);
                }
            }
        }
    };
    // set up events
    document.addEventListener('click', fieldHandler);
    document.addEventListener('keyup', fieldHandler);
})();

(function() {
    var width = document.body.offsetWidth,
        height = window.innerHeight || document.documentElement.clientHeight,
        lastFocus = false;
    resizeHandler = function() {
        var currentWidth = document.body.offsetWidth;
        if (width < 980 && currentWidth > 980) {
            for (var nodes = document.querySelectorAll('.toggle-nav, .toggle-settings'), n = nodes.length - 1; n >= 0; n--) {
                nodes[n].className = nodes[n].className.replace(/(^|\s)toggle-(nav|settings)\b/g, '');
            }
        }
        width = currentWidth;
        height = window.innerHeight || document.documentElement.clientHeight;
    },
    focusHandler = function(ev) {
        if (ev.target !== lastFocus) {
            lastFocus = ev.target;
            document.body.className = document.body.className.replace(/(^|\s)form-focus\b/g, '') + (ev.target.form ? ' form-focus' : '');
        }
    };
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('click', focusHandler);
    window.addEventListener('keyup', focusHandler);
})();


(function() {
    var touch = false,
    clickHandler = function(ev) {
        var node = ev.target,
            cookie;

        if (ev.type === 'touchstart') {
            touch = true;
            return;
        } else if (ev.type === 'touchmove') {
            touch = false;
            return;
        } else if (ev.type === 'touchend') {
            if (!touch) { return; }
            touch = false;
        }

        if (!node) { return; }
        while (node && (!node.getAttribute || !(cookie = node.getAttribute('data-set-cookie')))) {
            node = node.parentNode;
        }
        if (!cookie) { return; }
        // calculate expire date like 2y 6m 2d 1h 4i 15s
        var date = new Date(),
            items = { y: "FullYear", m: "Month", d: "Date", h: "Hours", i: "Minutes", s: "Seconds" };
        document.cookie = cookie.replace(/;\s*expires=([^;]+)/, function(expires) {
            expires.replace(/(-?\d+)([ymdhis])/g, function(_, num, item) {
                date['set' + items[item]](date['get' + items[item]]() + parseInt(num, 10));
            });
            return '; expires=' + date.toGMTString();
        });
    };
    // mobile click detection
    if (/like mac os|android/i.test(navigator.userAgent)) {
        document.addEventListener('touchstart', clickHandler);
        document.addEventListener('touchmove', clickHandler);
        document.addEventListener('touchend', clickHandler);
    } else {
        document.addEventListener('click', clickHandler);
    }
})();

/* Suggest Erweiterung - 20160708 */
document.addEventListener('suggest.activate', function(ev) {
    ev.detail.input.value = ev.target.getAttribute('data-suggest-value');
    var submit = document.createEvent('Event');
    submit.initEvent('submit', true, true, {});
    ev.preventDefault();
    ev.detail.input.form.dispatchEvent(submit);
});
