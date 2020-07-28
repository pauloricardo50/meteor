context('www-pages', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should redirect to accueil', () => {
    cy.url().should('include', '/fr/accueil');
  });
});
