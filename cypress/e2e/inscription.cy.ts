describe('Page d\'inscription', () => {
    beforeEach(() => {
        // Visite la page d'accueil
        cy.visit('/');
    });

    it('navigue à la page d\'inscription et remplit le formulaire', () => {
        // Ouvre le menu utilisateur
        cy.get('button[data-dropdown-toggle="dropdown-user"]').click();

        // Vérifie si le bouton Inscription est visible et clique dessus
        cy.contains('li', 'Inscription').should('be.visible').click();

        // Assure que la page d'inscription est chargée en vérifiant la présence du titre
        cy.url().should('include', '/inscription');
        cy.get('h1').contains('Inscription').should('be.visible');

        // Remplit le formulaire d'inscription
        cy.get('input[name="pseudo"]').type('NouvelUtilisateur');
        cy.get('input[name="email"]').type('utilisateur12@example.com');
        cy.get('input[name="niveauRevision"]').type('5');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="confirm_password"]').type('Password123!');
        cy.get('input[name="terms"]').check();

        // Soumet le formulaire
        cy.get('form').submit();

        // Attendre une redirection potentielle à la page de profil ou un message de succès
        cy.url().should('include', '/profil');
        // Vérifier le titre de la page de profil
        cy.get('h1').contains('PROFIL').should('be.visible');
    });
});
