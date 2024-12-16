'use strict';

import './mapbox-gl-compare-enhanced.css';
import EventEmitter from 'eventemitter3';
import syncMove from '@mapbox/mapbox-gl-sync-move';

/**
 * Creates a comparison slider between two Mapbox GL maps.
 *
 * @class Compare
 * @param {Object} mapA The first Mapbox GL map instance.
 * @param {Object} mapB The second Mapbox GL map instance.
 * @param {string|HTMLElement} container The container for the compare slider. Can be a CSS selector string or an HTML element.
 * @param {Object} [options={}] Configuration options for the comparison slider.
 * @param {string} [options.orientation="vertical"] Orientation of the slider: `vertical` (default) for left/right comparison or `horizontal` for top/bottom comparison.
 * @param {boolean} [options.mousemove=false] If `true`, the slider moves with the cursor; otherwise, the slider is draggable.
 *
 * @example
 * const compare = new Compare(mapA, mapB, '#container', {
 *   orientation: 'horizontal',
 *   mousemove: true
 * });
 */
function Compare(mapA, mapB, container, options) {
  this.options = options || {};
  this._mapA = mapA;
  this._mapB = mapB;
  this._horizontal = this.options.orientation === 'horizontal';

  // Bind event handlers
  this._onDown = this._onDown.bind(this);
  this._onMove = this._onMove.bind(this);
  this._onMouseUp = this._onMouseUp.bind(this);
  this._onTouchEnd = this._onTouchEnd.bind(this);

  this._ev = new EventEmitter();

  // Create slider elements
  this._swiper = document.createElement('div');
  this._swiper.className = this._horizontal ? 'compare-swiper-horizontal' : 'compare-swiper-vertical';

  this._controlContainer = document.createElement('div');
  this._controlContainer.className = this._horizontal
    ? 'mapboxgl-compare mapboxgl-compare-horizontal'
    : 'mapboxgl-compare';
  this._controlContainer.appendChild(this._swiper);

  // Append slider container
  if (typeof container === 'string' && document.body.querySelectorAll) {
    const appendTarget = document.body.querySelectorAll(container)[0];
    if (!appendTarget) {
      throw new Error('Cannot find element with specified container selector.');
    }
    appendTarget.appendChild(this._controlContainer);
  } else if (container instanceof Element && container.appendChild) {
    container.appendChild(this._controlContainer);
  } else {
    throw new Error('Invalid container specified. Must be CSS selector or HTML element.');
  }

  // Initialize slider position and bounds
  this._bounds = mapB.getContainer().getBoundingClientRect();
  const initialPosition = (this._horizontal ? this._bounds.height : this._bounds.width) / 2;
  this._setPosition(initialPosition);

  // Synchronize map movements
  this._clearSync = syncMove(mapA, mapB);

  this._onResize = () => {
    this._bounds = mapB.getContainer().getBoundingClientRect();
    if (this.currentPosition) this._setPosition(this.currentPosition);
  };

  mapB.on('resize', this._onResize);

  // Enable mousemove interaction if configured
  if (this.options.mousemove) {
    mapA.getContainer().addEventListener('mousemove', this._onMove);
    mapB.getContainer().addEventListener('mousemove', this._onMove);
  }

  // Add event listeners
  this._swiper.addEventListener('mousedown', this._onDown);
  this._swiper.addEventListener('touchstart', this._onDown);
}

Compare.prototype = {
  /**
   * Set pointer events for the slider container and swiper.
   *
   * @private
   * @param {string} value The value for pointer events (e.g., 'none', 'auto').
   */
  _setPointerEvents(value) {
    this._controlContainer.style.pointerEvents = value;
    this._swiper.style.pointerEvents = value;
  },

  /**
   * Handle pointer down events.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer down event.
   */
  _onDown(event) {
    if (event.touches) {
      document.addEventListener('touchmove', this._onMove);
      document.addEventListener('touchend', this._onTouchEnd);
    } else {
      document.addEventListener('mousemove', this._onMove);
      document.addEventListener('mouseup', this._onMouseUp);
    }
  },

  /**
   * Set the slider position.
   *
   * @private
   * @param {number} position The slider position.
   */
  _setPosition(position) {
    position = Math.min(position, this._horizontal ? this._bounds.height : this._bounds.width);
    const transform = this._horizontal ? `translate(0, ${position}px)` : `translate(${position}px, 0)`;

    this._controlContainer.style.transform = transform;
    this._controlContainer.style.WebkitTransform = transform;

    const clipA = this._horizontal
      ? `rect(0, 999em, ${position}px, 0)`
      : `rect(0, ${position}px, ${this._bounds.height}px, 0)`;
    const clipB = this._horizontal
      ? `rect(${position}px, 999em, ${this._bounds.height}px,0)`
      : `rect(0, 999em, ${this._bounds.height}px, ${position}px)`;

    this._mapA.getContainer().style.clip = clipA;
    this._mapB.getContainer().style.clip = clipB;
    this.currentPosition = position;
  },

  /**
   * Handle pointer move events.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer move event.
   */
  _onMove(event) {
    if (this.options.mousemove) {
      this._setPointerEvents(event.touches ? 'auto' : 'none');
    }

    const position = this._horizontal ? this._getY(event) : this._getX(event);
    this._setPosition(position);
  },

  /**
   * Handle pointer up events.
   *
   * @private
   */
  _onMouseUp() {
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    this.fire('slideend', { currentPosition: this.currentPosition });
  },

  /**
   * Handle touch end events.
   *
   * @private
   */
  _onTouchEnd() {
    document.removeEventListener('touchmove', this._onMove);
    document.removeEventListener('touchend', this._onTouchEnd);
    this.fire('slideend', { currentPosition: this.currentPosition });
  },

  /**
   * Get the x-coordinate of a pointer event.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer event.
   * @returns {number} The x-coordinate relative to the container.
   */
  _getX(event) {
    event = event.touches ? event.touches[0] : event;
    let x = event.clientX - this._bounds.left;
    return Math.max(0, Math.min(x, this._bounds.width));
  },

  /**
   * Get the y-coordinate of a pointer event.
   *
   * @private
   * @param {MouseEvent|TouchEvent} event The pointer event.
   * @returns {number} The y-coordinate relative to the container.
   */
  _getY(event) {
    event = event.touches ? event.touches[0] : event;
    let y = event.clientY - this._bounds.top;
    return Math.max(0, Math.min(y, this._bounds.height));
  },

  /**
   * Set the slider to a specific position.
   *
   * @param {number} position The position to set the slider to.
   */
  setSlider(position) {
    this._setPosition(position);
  },

  /**
   * Add an event listener.
   *
   * @param {string} type The event type.
   * @param {Function} listener The event listener function.
   * @returns {Compare} The Compare instance.
   */
  on(type, listener) {
    this._ev.on(type, listener);
    return this;
  },

  /**
   * Trigger an event.
   *
   * @param {string} type The event type.
   * @param {Object} data The event data.
   * @returns {Compare} The Compare instance.
   */
  fire(type, data) {
    this._ev.emit(type, data);
    return this;
  },

  /**
   * Remove an event listener.
   *
   * @param {string} type The event type.
   * @param {Function} listener The event listener function.
   * @returns {Compare} The Compare instance.
   */
  off(type, listener) {
    this._ev.removeListener(type, listener);
    return this;
  },

  /**
   * Remove the comparison slider and cleanup resources.
   */
  remove() {
    this._clearSync();
    this._mapB.off('resize', this._onResize);

    const aContainer = this._mapA.getContainer();
    if (aContainer) {
      aContainer.style.clip = null;
      aContainer.removeEventListener('mousemove', this._onMove);
    }

    const bContainer = this._mapB.getContainer();
    if (bContainer) {
      bContainer.style.clip = null;
      bContainer.removeEventListener('mousemove', this._onMove);
    }

    this._swiper.removeEventListener('mousedown', this._onDown);
    this._swiper.removeEventListener('touchstart', this._onDown);
    this._controlContainer.remove();
  },
};

export default Compare;
