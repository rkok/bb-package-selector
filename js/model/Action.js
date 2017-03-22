function Action (type, product, isAutomated) {
  this.type = type;
  this.product = product;
  this.isAutomated = !!isAutomated;
}

Action.prototype = {
  equals: function(otherAction) {
    return (
    this.type === otherAction.type
    && this.product === otherAction.product
    && this.isAutomated === otherAction.isAutomated
    );
  }
};

Action.TYPE_ADD = 'add';
Action.TYPE_REMOVE = 'remove';
Action.TYPE_ENABLE = 'enable';
Action.TYPE_DISABLE = 'disable';