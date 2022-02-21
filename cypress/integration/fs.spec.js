/// <reference types="cypress" />


context('The Fruit Shoppe recordings', () => {
    beforeEach(() => {
        cy.intercept("POST", "https://rs.fullstory.com/rec/bundle**").as("@rec1");
        cy.visit("https://fruitshoppe.firebaseapp.com/#/");
    })

    it.only('record happy path user journey purchasing fruits', () => {
        cy.wait('@rec1').then((interception) => {
            // Validate recording request logs navigation event
            expect(interception.request).body.to.include({Args: ["https://fruitshoppe.firebaseapp.com/#/", "navigate"]});
            expect(interception.response).body.to.contain("BundleTime");
          })
        
        // Navigate to a fruit page and check recording for the event
        cy.get(".featured-fruit-name").contains("Dragon Fruit").click();
        cy.intercept("POST", "https://rs.fullstory.com/rec/bundle**").as("@rec2");
        cy.wait('@rec2').then((interception) => {
            // Validate recording request logs navigation event
            expect(interception.request).body.to.include({Args: ["console", "log", "Dragon Fruit embiggen user cart."]});
            // alternative way to check request body object attributes
            // expect(interception.request.body).to.have.property('Args', ["console", "log", "Dragon Fruit embiggen user cart."]);
            expect(interception.response).body.to.contain("BundleTime");
          })

        // add more fruits to cart and record price and weight
        cy.get(".fruit-eggplantain").find(".cta-add-to-cart").click();
        cy.intercept("POST", "https://rs.fullstory.com/rec/bundle**").as("@rec3");
        cy.wait('@rec3').then((interception) => {
            // Validate recording request logs navigation event
            expect(interception.request).body.to.include({Args: ["Product Added", "{\"description_str\":\"Aubernanagine in the UK.\",\"displayName_str\":\"EggPlantain\",\"imgName_str\":\"eggplantain\",\"price_str\":\"3.99\",\"unit_str\":\"lb\",\"id_str\":\"eggplantain\",\"$priority\":null,\"hashKey_str\":\"object:297\",\"product_id_str\":\"rlmji92u9\"}"]});
            expect(interception.response).body.to.contain("BundleTime");
          })  
          
    })
  })
  