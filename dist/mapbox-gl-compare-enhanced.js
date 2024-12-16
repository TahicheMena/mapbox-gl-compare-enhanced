function w(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var b = { exports: {} };
(function(t) {
  var s = Object.prototype.hasOwnProperty, h = "~";
  function l() {
  }
  Object.create && (l.prototype = /* @__PURE__ */ Object.create(null), new l().__proto__ || (h = !1));
  function d(i, o, n) {
    this.fn = i, this.context = o, this.once = n || !1;
  }
  function p(i, o, n, r, _) {
    if (typeof n != "function")
      throw new TypeError("The listener must be a function");
    var f = new d(n, r || i, _), u = h ? h + o : o;
    return i._events[u] ? i._events[u].fn ? i._events[u] = [i._events[u], f] : i._events[u].push(f) : (i._events[u] = f, i._eventsCount++), i;
  }
  function m(i, o) {
    --i._eventsCount === 0 ? i._events = new l() : delete i._events[o];
  }
  function c() {
    this._events = new l(), this._eventsCount = 0;
  }
  c.prototype.eventNames = function() {
    var o = [], n, r;
    if (this._eventsCount === 0) return o;
    for (r in n = this._events)
      s.call(n, r) && o.push(h ? r.slice(1) : r);
    return Object.getOwnPropertySymbols ? o.concat(Object.getOwnPropertySymbols(n)) : o;
  }, c.prototype.listeners = function(o) {
    var n = h ? h + o : o, r = this._events[n];
    if (!r) return [];
    if (r.fn) return [r.fn];
    for (var _ = 0, f = r.length, u = new Array(f); _ < f; _++)
      u[_] = r[_].fn;
    return u;
  }, c.prototype.listenerCount = function(o) {
    var n = h ? h + o : o, r = this._events[n];
    return r ? r.fn ? 1 : r.length : 0;
  }, c.prototype.emit = function(o, n, r, _, f, u) {
    var v = h ? h + o : o;
    if (!this._events[v]) return !1;
    var e = this._events[v], g = arguments.length, y, a;
    if (e.fn) {
      switch (e.once && this.removeListener(o, e.fn, void 0, !0), g) {
        case 1:
          return e.fn.call(e.context), !0;
        case 2:
          return e.fn.call(e.context, n), !0;
        case 3:
          return e.fn.call(e.context, n, r), !0;
        case 4:
          return e.fn.call(e.context, n, r, _), !0;
        case 5:
          return e.fn.call(e.context, n, r, _, f), !0;
        case 6:
          return e.fn.call(e.context, n, r, _, f, u), !0;
      }
      for (a = 1, y = new Array(g - 1); a < g; a++)
        y[a - 1] = arguments[a];
      e.fn.apply(e.context, y);
    } else {
      var C = e.length, E;
      for (a = 0; a < C; a++)
        switch (e[a].once && this.removeListener(o, e[a].fn, void 0, !0), g) {
          case 1:
            e[a].fn.call(e[a].context);
            break;
          case 2:
            e[a].fn.call(e[a].context, n);
            break;
          case 3:
            e[a].fn.call(e[a].context, n, r);
            break;
          case 4:
            e[a].fn.call(e[a].context, n, r, _);
            break;
          default:
            if (!y) for (E = 1, y = new Array(g - 1); E < g; E++)
              y[E - 1] = arguments[E];
            e[a].fn.apply(e[a].context, y);
        }
    }
    return !0;
  }, c.prototype.on = function(o, n, r) {
    return p(this, o, n, r, !1);
  }, c.prototype.once = function(o, n, r) {
    return p(this, o, n, r, !0);
  }, c.prototype.removeListener = function(o, n, r, _) {
    var f = h ? h + o : o;
    if (!this._events[f]) return this;
    if (!n)
      return m(this, f), this;
    var u = this._events[f];
    if (u.fn)
      u.fn === n && (!_ || u.once) && (!r || u.context === r) && m(this, f);
    else {
      for (var v = 0, e = [], g = u.length; v < g; v++)
        (u[v].fn !== n || _ && !u[v].once || r && u[v].context !== r) && e.push(u[v]);
      e.length ? this._events[f] = e.length === 1 ? e[0] : e : m(this, f);
    }
    return this;
  }, c.prototype.removeAllListeners = function(o) {
    var n;
    return o ? (n = h ? h + o : o, this._events[n] && m(this, n)) : (this._events = new l(), this._eventsCount = 0), this;
  }, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = h, c.EventEmitter = c, t.exports = c;
})(b);
var x = b.exports;
const L = /* @__PURE__ */ w(x);
function M(t, s) {
  var h = t.getCenter(), l = t.getZoom(), d = t.getBearing(), p = t.getPitch();
  s.forEach(function(m) {
    m.jumpTo({
      center: h,
      zoom: l,
      bearing: d,
      pitch: p
    });
  });
}
function P() {
  var t, s = arguments.length;
  if (s === 1)
    t = arguments[0];
  else {
    t = [];
    for (var h = 0; h < s; h++)
      t.push(arguments[h]);
  }
  var l = [];
  t.forEach(function(c, i) {
    l[i] = m.bind(null, c, t.filter(function(o, n) {
      return n !== i;
    }));
  });
  function d() {
    t.forEach(function(c, i) {
      c.on("move", l[i]);
    });
  }
  function p() {
    t.forEach(function(c, i) {
      c.off("move", l[i]);
    });
  }
  function m(c, i) {
    p(), M(c, i), d();
  }
  return d(), function() {
    p(), l = [], t = [];
  };
}
var z = P;
const T = /* @__PURE__ */ w(z);
function O(t, s, h, l) {
  if (this.options = l || {}, this._mapA = t, this._mapB = s, this._horizontal = this.options.orientation === "horizontal", this._onDown = this._onDown.bind(this), this._onMove = this._onMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onTouchEnd = this._onTouchEnd.bind(this), this._ev = new L(), this._swiper = document.createElement("div"), this._swiper.className = this._horizontal ? "compare-swiper-horizontal" : "compare-swiper-vertical", this._controlContainer = document.createElement("div"), this._controlContainer.className = this._horizontal ? "mapboxgl-compare mapboxgl-compare-horizontal" : "mapboxgl-compare", this._controlContainer.appendChild(this._swiper), typeof h == "string" && document.body.querySelectorAll) {
    const p = document.body.querySelectorAll(h)[0];
    if (!p)
      throw new Error("Cannot find element with specified container selector.");
    p.appendChild(this._controlContainer);
  } else if (h instanceof Element && h.appendChild)
    h.appendChild(this._controlContainer);
  else
    throw new Error("Invalid container specified. Must be CSS selector or HTML element.");
  this._bounds = s.getContainer().getBoundingClientRect();
  const d = (this._horizontal ? this._bounds.height : this._bounds.width) / 2;
  this._setPosition(d), this._clearSync = T(t, s), this._onResize = () => {
    this._bounds = s.getContainer().getBoundingClientRect(), this.currentPosition && this._setPosition(this.currentPosition);
  }, s.on("resize", this._onResize), this.options.mousemove && (t.getContainer().addEventListener("mousemove", this._onMove), s.getContainer().addEventListener("mousemove", this._onMove)), this._swiper.addEventListener("mousedown", this._onDown), this._swiper.addEventListener("touchstart", this._onDown);
}
O.prototype = {
  /**
   * Set pointer events for the slider container and swiper.
   *
   * @private
   * @param {string} value The value for pointer events (e.g., 'none', 'auto').
   */
  _setPointerEvents(t) {
    this._controlContainer.style.pointerEvents = t, this._swiper.style.pointerEvents = t;
  },
  /**
   * Handle pointer down events.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer down event.
   */
  _onDown(t) {
    t.touches ? (document.addEventListener("touchmove", this._onMove), document.addEventListener("touchend", this._onTouchEnd)) : (document.addEventListener("mousemove", this._onMove), document.addEventListener("mouseup", this._onMouseUp));
  },
  /**
   * Set the slider position.
   *
   * @private
   * @param {number} position The slider position.
   */
  _setPosition(t) {
    t = Math.min(t, this._horizontal ? this._bounds.height : this._bounds.width);
    const s = this._horizontal ? `translate(0, ${t}px)` : `translate(${t}px, 0)`;
    this._controlContainer.style.transform = s, this._controlContainer.style.WebkitTransform = s;
    const h = this._horizontal ? `rect(0, 999em, ${t}px, 0)` : `rect(0, ${t}px, ${this._bounds.height}px, 0)`, l = this._horizontal ? `rect(${t}px, 999em, ${this._bounds.height}px,0)` : `rect(0, 999em, ${this._bounds.height}px, ${t}px)`;
    this._mapA.getContainer().style.clip = h, this._mapB.getContainer().style.clip = l, this.currentPosition = t;
  },
  /**
   * Handle pointer move events.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer move event.
   */
  _onMove(t) {
    this.options.mousemove && this._setPointerEvents(t.touches ? "auto" : "none");
    const s = this._horizontal ? this._getY(t) : this._getX(t);
    this._setPosition(s);
  },
  /**
   * Handle pointer up events.
   *
   * @private
   */
  _onMouseUp() {
    document.removeEventListener("mousemove", this._onMove), document.removeEventListener("mouseup", this._onMouseUp), this.fire("slideend", { currentPosition: this.currentPosition });
  },
  /**
   * Handle touch end events.
   *
   * @private
   */
  _onTouchEnd() {
    document.removeEventListener("touchmove", this._onMove), document.removeEventListener("touchend", this._onTouchEnd), this.fire("slideend", { currentPosition: this.currentPosition });
  },
  /**
   * Get the x-coordinate of a pointer event.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer event.
   * @returns {number} The x-coordinate relative to the container.
   */
  _getX(t) {
    t = t.touches ? t.touches[0] : t;
    let s = t.clientX - this._bounds.left;
    return Math.max(0, Math.min(s, this._bounds.width));
  },
  /**
   * Get the y-coordinate of a pointer event.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer event.
   * @returns {number} The y-coordinate relative to the container.
   */
  _getY(t) {
    t = t.touches ? t.touches[0] : t;
    let s = t.clientY - this._bounds.top;
    return Math.max(0, Math.min(s, this._bounds.height));
  },
  /**
   * Set the slider to a specific position.
   *
   * @param {number} position The position to set the slider to.
   */
  setSlider(t) {
    this._setPosition(t);
  },
  /**
   * Add an event listener.
   *
   * @param {string} type The event type.
   * @param {Function} listener The event listener function.
   * @returns {Compare} The Compare instance.
   */
  on(t, s) {
    return this._ev.on(t, s), this;
  },
  /**
   * Trigger an event.
   *
   * @param {string} type The event type.
   * @param {Object} data The event data.
   * @returns {Compare} The Compare instance.
   */
  fire(t, s) {
    return this._ev.emit(t, s), this;
  },
  /**
   * Remove an event listener.
   *
   * @param {string} type The event type.
   * @param {Function} listener The event listener function.
   * @returns {Compare} The Compare instance.
   */
  off(t, s) {
    return this._ev.removeListener(t, s), this;
  },
  /**
   * Remove the comparison slider and cleanup resources.
   */
  remove() {
    this._clearSync(), this._mapB.off("resize", this._onResize);
    const t = this._mapA.getContainer();
    t && (t.style.clip = null, t.removeEventListener("mousemove", this._onMove));
    const s = this._mapB.getContainer();
    s && (s.style.clip = null, s.removeEventListener("mousemove", this._onMove)), this._swiper.removeEventListener("mousedown", this._onDown), this._swiper.removeEventListener("touchstart", this._onDown), this._controlContainer.remove();
  }
};
export {
  O as default
};
