Cypress.Commands.add('login', () => {
  const email = 'user-1@epotek.ch';
  const password = '12345';

  cy
    .visit('/login')
    .get('form input[name="email"]')
    .clear()
    .type(email)
    .get('form input[name="password"]')
    .clear()
    .type(password)
    .get('form [type="submit"]')
    .click();
});
