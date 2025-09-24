describe('Home Page Tests', () => {
  it('should visit the home page', () => {
    cy.visit('/');
    cy.contains('Welcome');
  });
});
