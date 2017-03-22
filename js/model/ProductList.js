function ProductList (products) {
  this.products = {};
  this.groups = {};

  this.init(products);
}

ProductList.prototype = {
  init: function(productsRaw) {
    const self = this;

    // Index product groups first
    productsRaw.forEach(product => {
      if(product.group) {
        let groupName = product.group;
        self.groups[groupName] = self.groups[groupName] || [];
        self.groups[groupName].push(product.name);
      }
    });

    // After indexing, import products
    productsRaw.forEach(function(productRaw) {
      const product = self._mapToProduct(productRaw);
      self.products[product.name] = product;
    });
  },

  get: function(productName) {
    if( ! this.products[productName]) {
      console.error(`Attempted ProductList.get() on undefined product '${productName}'`);
      return false;
    }
    return this.products[productName];
  },

  getGroupNeighbours: function(product) {
    const self = this;
    let neighbours = [];
    let groupItems = this.groups[product.group].slice();
    const homeItem = groupItems.indexOf(product.name);

    groupItems.splice(homeItem, 1);

    groupItems.forEach(function(productName) {
      neighbours.push(self.get(productName));
    });

    return neighbours;
  },

  getSupergroupNeighbours: function(supergroup) {
    const self = this;
    let neighbours = [];

    Object.keys(self.products).forEach(function(productName) {
      const product = self.products[productName];
      if(product.supergroup === supergroup && ! product.isBaseGroup()) {
        neighbours.push(product);
      }
    });

    return neighbours;
  },

  checkCurrentlyRequired: function(productToCheck) {
    const self = this;

    return Object.keys(self.products).some(function(productName) {
      const product = self.products[productName];
      const requirements = product.requiresOneOf || [];
      return (requirements.indexOf(productToCheck.name) !== -1);
    });
  },

  _mapToProduct: function(obj) {
    const NODE = document.getElementById(obj.name);

    if( ! NODE) {
      console.error(`_mapToProduct: unable to find DOM node #${obj.name}`);
      return false;
    }

    let product = new Product();
    product.NODE = NODE;
    product.name = obj.name;
    product.group = obj.group;
    product.supergroup = obj.supergroup;
    product.isSelected = false;
    product.isDisabled = (obj.disabled || ! product.isBaseGroup());
    product.disableExplicitly = (obj.disabled);
    product.requiresOneOf = obj['requires-group'] ? this.groups[obj['requires-group']] : [];
    product.enables = obj['enables-group'] ? this.groups[obj['enables-group']] : [];
    product.enables = obj['enables'] ? product.enables.concat(obj['enables']) : product.enables;
    return product;
  }
};
