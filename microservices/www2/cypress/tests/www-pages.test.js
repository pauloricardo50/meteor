const burgerNavigate = (text, url) => {
  cy.get('header button[aria-label=Menu]').click();
  cy.contains(text).click({ force: true });
  cy.get('body').type('{esc}'); // Make popup disappear if it didn't
  cy.url().should('include', url);
};

describe('www-pages', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('a', 'Acquisition').should('exist'); // Wait for page load
  });

  it('Should redirect to accueil and navigate', () => {
    cy.url().should('include', '/fr/accueil');

    // Check interest rates
    cy.get('header').contains('Nos taux').click();
    cy.contains("Dernière mise à jour aujourd'hui.").should('exist');
    cy.contains('Libor').should('exist');
    cy.contains('10 ans').should('exist');

    // Check topnav CTAs
    cy.contains('button', 'Se connecter').click();
    cy.contains('Login Clients');
    cy.contains('Login Pro');
    cy.get('body').type('{esc}');

    cy.get('header')
      .contains('Obtenir un prêt')
      .should('have.attr', 'href')
      .and('include', '4000');

    cy.get('header .logo-home').click();
    cy.url().should('include', '/fr/accueil');
  });

  it('about page works', () => {
    burgerNavigate('À propos', '/a-propos');
    // Use image carousel
    cy.get('.image-carousel')
      .contains('e-Potek identifie en quelques')
      .should('exist');
    cy.get('.image-carousel').contains('Analyse hypothécaire').click();
    cy.get('.image-carousel')
      .contains('Les spécialistes en financement')
      .should('exist');

    cy.get('.team-member').its('length').should('be.above', 10);
  });

  it('pages with subpages work properly', () => {
    // Go to about page
    burgerNavigate('À propos', '/a-propos');

    // Check scroll is 0
    cy.scrollTo(0, 0);
    cy.window().then($window => {
      expect($window.scrollY).to.equal(0);
    });

    // Scroll to an element
    cy.get('.page-links').contains('La méthode e-Potek').click();
    cy.window().then($window => {
      expect($window.scrollY).to.not.equal(0);
    });
  });

  describe('Calculator', () => {
    it('calculates acquisitions correctly', () => {
      cy.get('header').contains('Calculateur').click();

      cy.contains('Complétez les champs que vous voulez');

      // Fill one input
      cy.get('input[id=property]').type('1000000');

      // Check other inputs
      cy.get('input[id=salary]').should('have.value', 'CHF 180 000');
      cy.get('input[id=fortune]').should('have.value', 'CHF 250 000');

      // Check math
      cy.contains('Financement total')
        .parent()
        .contains('1 050 000')
        .should('exist');
      cy.contains("Prêt / Prix d'achat")
        .parent()
        .contains('80,00')
        .should('exist');
      cy.contains('Charges / Revenus')
        .parent()
        .contains('33,33')
        .should('exist');

      // Check status
      cy.contains('Tout est bon').should('exist');
      cy.get('.www-calculator-status')
        .contains('Obtenir un prêt')
        .should('have.attr', 'href')
        .and('include', 'ACQUISITION');

      // Check chart
      cy.get('.highcharts-container')
        .contains('/mois')
        .should('exist')
        .then(item => {
          const monthly = Number.parseInt(item.text().replace(/\D/g, ''), 10);
          cy.wrap(monthly).as('monthly');
        });
      cy.get('.highcharts-container').contains('Intérêts').should('exist');
      cy.get('.highcharts-container').contains('Amortissement').should('exist');
      cy.get('.highcharts-container').contains('Entretien').should('exist');
      cy.get('.highcharts-container').contains('CHF 833').should('exist');
      cy.get('.highcharts-container').contains('CHF 417').should('exist');

      // Change interest rates from 10 years to libor
      cy.setSelect('interests', 0);
      cy.get('.highcharts-container')
        .contains('/mois')
        .should('exist')
        .then(item => {
          const monthly = Number.parseInt(item.text().replace(/\D/g, ''), 10);

          cy.get('@monthly').then(prevMonthly => {
            expect(prevMonthly).to.be.above(monthly);
            cy.wrap(monthly).as('monthly');
          });
        });

      // Exclude maintenance
      cy.get('#includeMaintenance').uncheck();
      cy.get('.highcharts-container')
        .contains('/mois')
        .should('exist')
        .then(item => {
          const monthly = Number.parseInt(item.text().replace(/\D/g, ''), 10);

          cy.get('@monthly').then(prevMonthly => {
            // Avoid rounding issues
            expect(prevMonthly - 417).to.be.within(monthly - 1, monthly + 1);
          });
        });
    });

    it('shows warnings', () => {
      cy.get('header').contains('Calculateur').click();

      // Reset calculator
      cy.contains('Remettre à zéro');
      cy.get('input[id=property]').should('have.value', 'CHF 0');

      // Fill it in wrong
      cy.get('input[id=property]').type('1000000');
      // Clear these inputs properly by first removing the auto mode, and then clearing it
      cy.get('input[id=salary]').type('1').clear().type('10000'); // Extra leading 0
      cy.get('input[id=fortune]').type('1').clear().type('25000'); // Extra leading 0

      cy.contains('Les revenus ne suffisent pas').should('exist');

      cy.get('input[id=salary]').clear().type('20000'); // Extra leading 0
      cy.get('input[id=fortune]').clear().type('15000'); // Extra leading 0

      cy.contains('Les fonds propres ne sont pas dans les normes').should(
        'exist',
      );
    });
  });
});
