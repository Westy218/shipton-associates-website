document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var closeBtn = document.querySelector('.nav-close');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (closeBtn && mobileNav) {
    closeBtn.addEventListener('click', function () {
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  // First-level accordion (Services, Our Team, Contact)
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.closest('li.has-dropdown');
      li.classList.toggle('is-open');
    });
  });

  // Second-level accordion (Conveyancing, Write a Will, Family Law, Estate Planning)
  document.querySelectorAll('.mobile-subdropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var li = btn.closest('li.has-subdropdown');
      li.classList.toggle('is-open');
    });
  });

  // Desktop split dropdowns (e.g. Services: column 1 = top-level categories,
  // column 2 = the hovered category's items, column 3 = a further nested
  // category's items if one of those is itself hovered). Columns are always
  // added to the right, never replaced in place, so context is never lost.
  document.querySelectorAll('.dropdown-split').forEach(function (panel) {
    var allSubpanels = panel.querySelectorAll('.dropdown-subpanel');

    function activatePanel(panelName, depth) {
      // Turn off every subpanel at this depth or deeper, then activate the
      // requested one. "Depth" is just the DOM order among all has-subdropdown
      // triggers, which is good enough since nesting here is shallow (max 3).
      allSubpanels.forEach(function (sp) { sp.classList.remove('is-active'); });
      panel.querySelectorAll('.has-subdropdown').forEach(function (li) {
        li.classList.remove('is-active');
      });
      var chain = [];
      var name = panelName;
      // Walk back up: find the trigger <li> for this panel, then its
      // ancestor panel's trigger, etc., so every level up the chain
      // re-activates together (keeps all parent columns visible).
      while (name) {
        var trigger = panel.querySelector('.has-subdropdown[data-cat="' + name + '"]');
        var target = panel.querySelector('.dropdown-subpanel[data-panel="' + name + '"]');
        if (trigger) trigger.classList.add('is-active');
        if (target) target.classList.add('is-active');
        chain.push(name);
        // is this panel itself nested inside another subpanel?
        var parentSubpanel = trigger ? trigger.closest('.dropdown-subpanel') : null;
        name = parentSubpanel ? parentSubpanel.getAttribute('data-panel') : null;
      }
    }

    panel.querySelectorAll('.has-subdropdown[data-cat]').forEach(function (li) {
      li.addEventListener('mouseenter', function (e) {
        e.stopPropagation();
        activatePanel(li.getAttribute('data-cat'));
      });
    });

    // Reset to the first top-level category whenever the dropdown re-opens.
    var hostLi = panel.closest('li.has-dropdown');
    var firstCat = panel.querySelector('.dropdown-categories > li.has-subdropdown[data-cat]');
    if (hostLi && firstCat) {
      hostLi.addEventListener('mouseenter', function () {
        activatePanel(firstCat.getAttribute('data-cat'));
      });
    }
  });
});
