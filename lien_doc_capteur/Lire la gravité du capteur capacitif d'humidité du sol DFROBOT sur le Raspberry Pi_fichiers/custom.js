jQuery(document).ready(function() {
  'use strict';
  // CUSTOM
  if (document.domain=="tutorials-raspberrypi.de") {
      jQuery('#subscribe_blog').prop('checked', true);
      jQuery('input[name="_mc4wp_subscribe_wp-comment-form"]').prop('checked', false);
      jQuery('p.mc4wp-checkbox-wp-comment-form').remove();
  } else {		
      jQuery('#subscribe_blog').prop('checked', false);
      jQuery('#subscribe_blog').parent('p.comment-subscription-form').remove();
  }
});