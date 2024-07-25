/** 
 *  Tests pour la page d'accueil
 */
describe('Tests de la page d\'accueil', () => {
    beforeEach(() => {
        // Visiter la page d'accueil avant chaque test
        cy.visit('/');
    });

    it('vérifie la présence du bouton Démo', () => {
        // Assurez-vous que le lien 'Démo' est visible et contient le texte correct
        cy.contains('a', 'Démo')
            .should('be.visible')
            .and('have.text', 'Démo');
    });

    it('vérifie le texte correct du titre H1', () => {
        // Assurez-vous que le titre H1 est visible et contient le texte correct
        cy.get('h1')
            .should('be.visible')
            .and('contain.text', 'Se souvenir de tout pour (quasiment) toujours');
    });
});
