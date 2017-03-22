function Product () {
  this.NODE = null;
  this.name = null;
  this.group = null;
  this.supergroup = null;
  this.isSelected = null;
  this.isDisabled = null;
  this.requiresOneOf = [];
  this.enables = [];

  /**
   * A product can be disabled for two reasons:
   * (1) It is in a supergroup of which no base item has been selected yet
   * (2) JSON output tells it to be disabled explicitly (until some specific product enables it)
   * In case (2), disableExplicitly will be true
   */
  this.disableExplicitly = null;
}

Product.prototype = {
  isBaseGroup: function() {
    return (this.group && this.group === this.supergroup);
  },
  select: function() {
    this._setState(Product.STATE_SELECTED);
    this.isSelected = true;
    this.isDisabled = false;
  },
  deselect: function() {
    this._setState(Product.STATE_NOT_SELECTED);
    this.isSelected = false;
    this.isDisabled = false;
  },
  enable: function() {
    if( ! this.isSelected) {
      this._setState(Product.STATE_NOT_SELECTED);
    }
    this.isDisabled = false;
  },
  disable: function() {
    this._setState(Product.STATE_DISABLED);
    this.isSelected = false;
    this.isDisabled = true;
  },
  _setState: function(newState) {
    const self = this;
    [Product.STATE_SELECTED,Product.STATE_NOT_SELECTED,Product.STATE_DISABLED].forEach(function(state) {
      self.NODE.classList.remove(state);
    });
    self.NODE.classList.add(newState);
  }
};

Product.STATE_SELECTED = 'on';
Product.STATE_NOT_SELECTED = 'off';
Product.STATE_DISABLED = 'disabled';