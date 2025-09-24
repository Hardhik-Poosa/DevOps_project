describe('Admin Tests', () => {
  it('should visit the admin page', () => {
    cy.visit('/admin');
    cy.contains('Admin Dashboard');
  });
});
