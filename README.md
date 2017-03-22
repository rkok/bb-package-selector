Broadband package selector
===========================

A simple, generic package selector for broadband providers, written in JavaScript.

Usage
-----

1. `npm install`
2. `npm start`
3. Navigate your browser to http://localhost:10203

Overview
--------

Running this application gives you a bare-bones package selection screen.
Clicking on the coloured box in front of each product will select or deselect it.
 
The `products.json` file specifies which products should be displayed and how each product relates to another.
When a product is displayed initially, selected, or deselected, rules are applied based on what's specified
in `products.json`.

Rules
-----

What follows is a list of supported package selection rules. For each rule, an example is given
based on `products.json` included in this repository.

__Rule__: Only one product per `group` can be chosen simultaneously.  
__Example__: Selecting "internet-10-mb" will deselect "internet-20-mb" and "internet-30-mb".

__Rule__: A BASE GROUP consists of products which have an equal `group` and `supergroup`.  
__Example__: "internet-10-mb" is in the base group of "internet".

__Rule__: If no product from the BASE GROUP is selected, other products in the same `supergroup` are disabled.  
__Example__: "internet-bonus-pack" can only be selected if one of "internet-10-mb", "internet-20-mb" or "internet-30-mb"
 are selected.

__Rule__: If a product is selected, the first product in its `requires-group` is automatically selected as well.  
__Example__: "tv-regular" requires group "hardware-1", so selecting it automatically selects "decoder-1-no-recorder"
(the necessary TV decoder.) 

__Rule__: A product cannot be deselected if it is in another SELECTED product's `requires-group`.  
__Example__: "decoder-1-no-recorder" cannot be deselected while "tv-regular" is still selected.

__Rule__: A product with the `disabled` attribute can be enabled by a product which references it
in its `enables` attribute.  
__Example__: "decoder-3" is only enabled once "decoder-2-no-recorder" or "decoder-2-recorder" are selected.

__Rule__: A product with the `disabled` attribute can be enabled by a product
which references the disabled product's `group` in its `enables-group` attribute.  
__Example__: "decoder-2-no-recorder" and "decoder-2-recorder" are only enabled
once "decoder-1-no-recorder" or "decoder-1-recorder" are selected.