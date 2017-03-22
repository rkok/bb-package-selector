function TransactionHelper () {
  this.actions = [];
}

TransactionHelper.prototype = {
  append: function(action) {
    const self = this;

    this._findConflictingAutomatedActions(action).forEach(function(conflictingAction) {
      self.discard(conflictingAction);
    });

    if( ! this._checkApplicable(action)) {
      return false;
    }

    this.actions.push(action);
  },

  discard: function(action) {
    const index = this.actions.indexOf(action);
    this.actions.splice(index, 1);
  },

  commit: function() {
    console.debug('TransactionHelper.commit() stack:');
    this.actions.forEach(function(action) {
      console.debug(' - ' + action.type, action.product.name);
    });

    this.actions.forEach(function(action) {
      switch(action.type) {
        case Action.TYPE_ADD:
          action.product.select();
          break;
        case Action.TYPE_REMOVE:
          action.product.deselect();
          break;
        case Action.TYPE_ENABLE:
          action.product.enable();
          break;
        case Action.TYPE_DISABLE:
          action.product.disable();
          break;
        default:
          console.error('TransactionHelper.commit(): unsupported action type for ', action);
      }
    });
  },

  _findConflictingAutomatedActions: function(action) {
    if(action.isAutomated) {
      return [];
    }

    let conflictingActions = [],
      conflictingType = '';

    switch(action.type) {
      case Action.TYPE_ENABLE:
        conflictingType = Action.TYPE_DISABLE;
        break;
      case Action.TYPE_DISABLE:
        conflictingType = Action.TYPE_ENABLE;
        break;
      default:
        // Not yet implemented
        return [];
    }

    this.actions.forEach(function(existingAction) {
      const opposes = (
        existingAction.product.name === action.product.name
        && existingAction.type === conflictingType
        && existingAction.isAutomated
      );
      if(opposes || existingAction.equals(action)) {
        conflictingActions.push(existingAction);
      }
    });

    return conflictingActions;
  },

  _checkApplicable: function(action) {
    switch(action.type) {
      case Action.TYPE_ENABLE:
        return (action.product.isDisabled);
      case Action.TYPE_DISABLE:
        return ( ! action.product.isDisabled);
      case Action.TYPE_ADD:
        return ( ! action.product.isSelected);
      case Action.TYPE_REMOVE:
        return (action.product.isSelected);
      default:
        return true;
    }
  }
};
