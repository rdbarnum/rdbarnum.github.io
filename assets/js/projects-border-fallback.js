// jQuery-based fallback for browsers without `:has()` support.
// Listens for Bootstrap's jQuery collapse events and toggles `.no-top-border`
// on the next `.cv-entry` when a `.projects-list` is shown/hidden.
(function ($) {
  if (typeof window === 'undefined' || typeof $ === 'undefined') return; // require window + jQuery
  // If browser supports the CSS `:has()` selector, the styles in `_cv.scss`
  // already handle hiding the following parent's top-border when a
  // `.projects-list` is shown. In that case the JS fallback is unnecessary
  // and we should no-op to avoid extra DOM work. Feature-detect using
  // `CSS.supports('selector(:has(*))')` where available.
  try {
    if (window.CSS && typeof window.CSS.supports === 'function' && CSS.supports('selector(:has(*))')) {
      // Modern browser: no JS fallback needed
      return;
    }
  } catch (e) {
    // Ignore errors from CSS.supports in older browsers; fall back to running the script.
  }

  function setNoTop($list, add) {
    var $parent = $list.closest('.cv-entry');
    if (!$parent.length) return;
    var $next = $parent.next('.cv-entry');
    if ($next.length) {
      $next.toggleClass('no-top-border', !!add);
      // last-resort inline style in case CSS specificity still loses
      if (add) $next.css('border-top', '0px');
      else $next.css('border-top', '');
    }
  }

  $(function () {
    // bind to Bootstrap collapse events (jQuery events)
    $(document).on('show.bs.collapse', '.projects-list', function () {
      var $list = $(this);
      // remove bottom border coming from projects list so only parent's border remains
      $list.addClass('no-bottom-border');
      // also ensure following parent's top border is removed if present (older browsers)
      setNoTop($list, true);
    });

    $(document).on('hide.bs.collapse', '.projects-list', function () {
      var $list = $(this);
      $list.removeClass('no-bottom-border');
      setNoTop($list, false);
    });

    // initial state: any list that already has .show
    $('.projects-list.show').each(function () {
      var $list = $(this);
      $list.addClass('no-bottom-border');
      setNoTop($list, true);
    });
  });

})(jQuery);
