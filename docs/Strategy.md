# Mijn strategie

Ik heb de testen gebaseerd op de 4 scenarios van de assignment:

## 1. Homepage en zoekfunctie

Mijn eerste uitdaging bij het schrijven van deze test was het vinden van een geschikte selector om na te gaan of er resultaten zijn. Initieel dacht ik vrij simpel `product-cards` te kunnen ophalen en vanuit die locator details te kunnen opvragen (zoals `product-title` en `product-price`), maar dit was niet mogelijk aangezien ieder product in meerdere `<div>`-elementen zat die dat geen attributen hadden en xpaths wou ik zoveel mogelijk vermijden.  

Ik besloot dan om de product-titels op te halen en op basis daarvan na te gaan of er resultaten zijn, dat moet wel lukken, want het zijn de enige `<h2>`-elementen op de pagina. Ik haalde deze op met de volgende selector:
```ts
page.getByRole('heading', { level: 2 });
```  
Dit gaf mij nog andere elementen en niet enkel de product-titels, vanwege het feit dat er in de html-code elementen zaten die er alsvolgt uitzien:
```html
<span role="heading" aria-level="2">...</span> 
``` 
Deze werden met de vorige selector ook inbegrepen en om dat te vermijden heb ik de volgende selector gebruikt:
```ts
page.locator('h2').all();
```
Dit geeft mij enkel de product-titels en zo ben ik zeker dat bij het slagen van de test er effectief producten zichtbaar waren.


## 2. Filteren en sorteren

Hier moest ik een test schrijven dat zou verifieren of we kunnen filteren en sorteren, ik begon met het ophalen van de categorie-links.
```ts
page.getByRole('link', {name: ... })
```
Het eerste probleem dat ik hierbij zag was het volgende, op de website van bol.com tonen ze niet enkel de categorie maar ook het aantal en dat is een dynamisch gegeven. Ik kon dit dus niet klakkeloos overnemen, want anders zou de test niet betrouwbaar zijn, de oplossing hier was om een regex mee te geven.

Het klikken op de knop lukte ook niet en zorgde voor een flaky test, daarom besloot ik hier te kiezen voor `dblclick()`.

De volgende uitdaging was om te verifieren dat de producten gefilterd zijn, dit kon ik doen a.d.h.v. de breadcrumb, maar de html-structuur maakte het bijzonder lastig om een robuuste selector te vinden. De beste optie die ik hier zag was een simpele xpath.

Daarna moest ik de producten sorteren op basis van de prijs en dit verifieren. Om te verifieren had ik de prijzen nodig en deze haalde ik op van een hidden field, de html-code zag er namelijk alsvolgt uit:
```html
<span>
    <span>De prijs van dit product is '19' euro en '99' cent</span>
    <span aria-hidden="true">19</span>
    <span aria-hidden="true">,</span>
    <span aria-hidden="true">99</span>
</span>
```
Het meest voor de hand-liggend leek voor mij om de eerste zin te nemen en die vervolgens te converteren naar een correct formaat met een helper-functie. Dus werd mijn selector hiervoor:
```ts
page.locator('span:has-text("De prijs van dit product")').allTextContents();
```
Na het converteren naar een correct formaat `19,99` had ik de prijzen en kon ik nagaan of de sortering heeft gewerkt. 

## 3. Productdetail-pagina (PDP)


## 4. Paginering 

