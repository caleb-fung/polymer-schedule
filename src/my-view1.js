/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './polymer-schedule.js';
import './shared-styles.js';

class MyView1 extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <div class="circle">1</div>
        <h1>Polymer Schedule</h1>
        <p>Air plant hashtag forage hell of intelligentsia waistcoat iPhone pug sriracha williamsburg activated charcoal hexagon venmo taiyaki. Swag wolf microdosing, +1 cardigan lyft VHS af tilde typewriter edison bulb 3 wolf moon jean shorts. Wayfarers kale chips copper mug cray scenester cronut plaid. Brooklyn glossier tumeric flannel. Freegan viral biodiesel franzen, plaid shoreditch 8-bit.</p>
        <p>Affogato you probably haven't heard of them chia cornhole franzen fixie. Wolf chia irony edison bulb everyday carry pinterest helvetica etsy +1 selfies. Seitan raw denim la croix locavore. Cardigan vinyl humblebrag, mlkshk lyft etsy seitan wolf gastropub. Distillery kitsch lo-fi, microdosing echo park 8-bit bespoke gochujang intelligentsia tousled brunch affogato cred sustainable. Brunch locavore shabby chic, venmo lomo poutine mustache etsy roof party beard heirloom hashtag.</p>
        <polymer-schedule></polymer-schedule>
      </div>
    `;
  }
}

window.customElements.define('my-view1', MyView1);
