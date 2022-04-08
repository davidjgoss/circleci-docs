// https://app.optimizely.com/v2/projects/16812830475/experiments/21268663100/variations

function addNewBadgeToSidebar() {
  const isGettingStartedPage =
    window.location.pathname ==
    '/DD-456/finalize-getting-started-experiment-preview/2.0/getting-started/';

  const NEW_SIDEBAR_HTML = `
    <a class="${isGettingStartedPage ? 'active' : ''}"
       style="display: flex; align-items: center"
       href="/DD-456/finalize-getting-started-experiment-preview/2.0/getting-started/"
       data-section="getting-started" data-proofer-ignore="">
      <span>Quickstart Guide</span>
      <span class="getting-started-new-badge"> NEW </span>
    </a>
`;

  $(
    "li > a[href='/DD-456/finalize-getting-started-experiment-preview/2.0/getting-started/']",
  ).replaceWith(NEW_SIDEBAR_HTML);
}

function showHomePageBadges() {
  const isGettingStartedPage =
    window.location.pathname ==
    '/DD-456/finalize-getting-started-experiment-preview/' ||
    window.location.pathname ==
    '/DD-456/finalize-getting-started-experiment-preview/?force-all';

  if (isGettingStartedPage) {
    $('.getting-started-experiment-badges').show();
  }
}

window.OptimizelyClient.getVariationName({
  experimentKey: 'dd_getting_started_docs_test',
  groupExperimentName: 'q1_fy23_docs_disco_experiment_group_test',
  experimentContainer: 'body',
  guestExperiment: false,
}).then((variation) => {
  if (variation === 'treatment') {
    // Used to expand the container width for the content
    if (
      window.location.pathname === '/docs/2.0/getting-started/' ||
      window.location.pathname ===
      '/DD-456/finalize-getting-started-experiment-preview/2.0/getting-started/'
    ) {
      const articleContainer = $('.quickstart-guide');
      articleContainer.addClass('getting-started-full-width');
    }

    // Init new badge in sidebar and add tracking event
    addNewBadgeToSidebar();

    // Init new badge on landing page and add tracking events
    showHomePageBadges();
    const badges = Array.from($('.wrapper-link'));
    badges.forEach((badge) => {
      badge.addEventListener('click', () => {
        window.AnalyticsClient.trackAction('clicked-landing-page-badge', {
          badgeText: badge.innerText,
          badgeHref: badge.href,
        });
      });
    });

    // Display content on page if users in treatment
    const treatment = $('.treatment');
    treatment.css('display', 'block');

    // Add tracking to all links on page
    const links = Array.from($('.treatment').find($('a')));
    links.forEach((link, i) => {
      link.addEventListener('click', () => {
        window.AnalyticsClient.trackAction(
          'clicked-on-getting-started-guide-link',
          {
            linkText: link.innerText,
            linkHref: link.href,
            linkIndexOnPage: i + 1 + '/' + links.length,
            page: window.location.pathname,
          },
        );
      });
    });
  }
  if (variation === 'control') {
    const control = $('.control');
    control.css('display', 'block');
    // ToC is hidden due to using getting-started-guide-experimental for the layout, setting the css to ensure that the ToC is present in control variation
    const toc = $('#full-height');
    toc.css('visibility', 'visible');
  }
});