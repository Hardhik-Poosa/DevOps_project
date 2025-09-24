describe('Admin Tests', () => {
  it('should visit the admin page after logging in as admin', () => {
    // Login as admin
    cy.visit('/login');
    cy.get('input[name="email"]').type('hardhikpoosa@gmail.com');
    cy.get('input[name="password"]').type('Hard2003');
    cy.get('button[type="submit"]').click();

    // Wait for redirection to home page and for user data to be loaded
    cy.url().should('include', '/');
    
    
    // Click the admin link in the header
    cy.get('header').contains('Admin').click();

    // Assert that the current page is the admin dashboard
    cy.url().should('include', '/admin');
    cy.contains('Admin Dashboard - Add Product');
  });
});
