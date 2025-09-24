describe('Home Page Tests', () => {
  it('should visit the home page', () => {
    cy.visit('/');
    cy.contains('Shop Now', { timeout: 10000 });
  });
});
