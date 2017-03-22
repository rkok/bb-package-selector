function PackageSelector (products) {
  this.products = new ProductList(products);
  this.hookOnDom();
}

PackageSelector.prototype = {
  hookOnDom: function() {
    const self = this;
    const nodes = document.querySelectorAll('.product');

    for(let i=0; i < nodes.length; i++) {
      let node = nodes[i];
      node.addEventListener('click', function() {
        const name = node.id,
          product = self.products.get(name);

        if(product.isDisabled) {
          return false;
        } else if(product.isSelected && ! self.products.checkCurrentlyRequired(product)) {
          self._remove(product);
        } else if( ! product.isSelected) {
          self._add(product);
        }
      });
    }
  },

  _add: function(product, transaction) {
    const isRootAction = ( ! transaction),
      isAutomatedAction = ( ! isRootAction),
      self = this;

    console.debug(
      isRootAction ? '[ROOT]' : '',
      '_add', product
    );

    if( ! transaction) {
      transaction = new TransactionHelper();
    }

    const action = new Action(Action.TYPE_ADD, product);
    transaction.append(action);

    // Remove other items from group (only one may be selected at a time)
    if(product.group) {
      const neighbours = this.products.getGroupNeighbours(product);
      neighbours.forEach(function(productNeighbour) {
        self._remove(productNeighbour, transaction);
      });
    }

    // Check if product requires one item from a certain list
    // If rule not satisfied, auto-add first item from list
    if(product.requiresOneOf.length) {
      const satisfied = product.requiresOneOf.some(function(productName) {
        return (self.products.get(productName).isSelected);
      });

      if( ! satisfied) {
        const requiredProduct = this.products.get(product.requiresOneOf[0]);
        this._add(requiredProduct, transaction);
      }
    }

    // If this item is a base item from the supergroup
    // Enable other items from supergroup (unless "explicitly disabled")
    if(product.isBaseGroup()) {
      this.products.getSupergroupNeighbours(product.supergroup).forEach(function(productToEnable) {
        // Only "enable" explicitly-disabled products if they are enabled already
        // so that any automatic DISABLE actions can be overridden
        if( ! productToEnable.disableExplicitly || ! productToEnable.isDisabled) {
          const enableAction = new Action(Action.TYPE_ENABLE, productToEnable, isAutomatedAction);
          transaction.append(enableAction);
        }
      });
    }

    // Enable other items that the product allows us to
    if(product.enables.length) {
      product.enables.forEach(function(productName) {
        const productToEnable = self.products.get(productName);
        const enableAction = new Action(Action.TYPE_ENABLE, productToEnable, isAutomatedAction);
        transaction.append(enableAction);
      });
    }

    if(isRootAction) {
      transaction.commit();
    }
  },

  _remove: function(product, transaction) {
    const isRootAction = ( ! transaction),
      isAutomatedAction = ( ! isRootAction),
      self = this;

    console.debug(
      isRootAction ? '[ROOT]' : '',
      '_remove', product
    );

    if( ! transaction) {
      transaction = new TransactionHelper();
    }

    const action = new Action(Action.TYPE_REMOVE, product);
    transaction.append(action);

    // If this item is a base item from the supergroup
    // Make sure no other items from the supergroup can be selected anymore
    if(product.isBaseGroup()) {
      this.products.getSupergroupNeighbours(product.supergroup).forEach(function(productToDisable) {
        const disableAction = new Action(Action.TYPE_DISABLE, productToDisable, isAutomatedAction);
        transaction.append(disableAction);
      });
    }

    // Disable products that were enabled by this product
    if(product.enables.length) {
      product.enables.forEach(function(productName) {
        const productToDisable = self.products.get(productName);
        const disableAction = new Action(Action.TYPE_DISABLE, productToDisable, isAutomatedAction);
        transaction.append(disableAction);
      });
    }

    if(isRootAction) {
      transaction.commit();
    }
  }
};